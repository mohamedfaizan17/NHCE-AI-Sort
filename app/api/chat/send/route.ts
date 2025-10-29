import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { devChatHistoryByAlgo, devProfile } from '../devState'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, algorithm, firebaseUid, currentArray, chatHistory: clientChatHistory } = body

    console.log('📨 Chat message received:', { message, algorithm, firebaseUid, chatHistoryLength: clientChatHistory?.length || 0 })

    if (!message || !algorithm || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if dev mode
    const isDev = firebaseUid === 'dev-test-uid'
    
    let user: any
    let recentMessages: any[] = []
    let mastery: any = {}

    if (isDev) {
      console.log('🔧 Dev mode: Using in-memory storage')
      // Initialize algorithm-specific history if not exists
      if (!devChatHistoryByAlgo[algorithm]) {
        devChatHistoryByAlgo[algorithm] = []
      }
      
      user = { id: 'dev-user', profile: devProfile }
      // Use chat history from client (current session)
      recentMessages = clientChatHistory || []
      mastery = devProfile.mastery
    } else {
      console.log('🔍 Looking up user in database...')
      // Find user in database
      user = await prisma.user.findUnique({
        where: { firebaseUid },
        include: { profile: true },
      })

      if (!user) {
        console.log('❌ User not found, creating new user...')
        // Create user if doesn't exist
        user = await prisma.user.create({
          data: {
            firebaseUid,
            email: `${firebaseUid}@temp.com`, // Temporary email
            profile: {
              create: {
                xp: 0,
                level: 1,
                streak: 0,
                badges: '[]',
                mastery: '{}',
              },
            },
          },
          include: { profile: true },
        })
      }

      if (!user.profile) {
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
      }

      console.log('✅ User found:', user.id)

      // Save user message to database (for analytics/history, but not used for context)
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          algorithm,
          role: 'user',
          content: message,
        },
      })

      // Use chat history from client (current session)
      // Progress (XP, mastery, badges) is still preserved in the profile
      recentMessages = clientChatHistory || []

      // Parse mastery
      mastery =
        typeof user.profile.mastery === 'string'
          ? JSON.parse(user.profile.mastery)
          : user.profile.mastery
    }

    // Call Python AI backend
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8001'
    
    // Prepare chat history for AI
    const chatHistory = recentMessages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))
    
    console.log('🔥 Calling AI backend:', pythonBackendUrl)
    console.log('📊 Chat history length:', chatHistory.length)

    // Call Python AI backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const aiBackendResponse = await fetch(`${pythonBackendUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          chatHistory,
          algorithm,
          learnerMastery: mastery,
          currentArray: currentArray || [],
        }),
      })

      clearTimeout(timeoutId)

      if (!aiBackendResponse.ok) {
        const errorText = await aiBackendResponse.text()
        console.error('❌ AI backend error:', errorText)
        throw new Error(`AI backend failed: ${aiBackendResponse.status}`)
      }

      const aiResponse = await aiBackendResponse.json()
      console.log('✅ AI response received')

      // Save AI response and update profile
      if (isDev) {
        // Dev mode: Update in-memory state
        // Don't save to chat history - we want fresh sessions
        // devChatHistoryByAlgo[algorithm].push({ role: 'user', content: message })
        // devChatHistoryByAlgo[algorithm].push({ role: 'ai', content: aiResponse.socraticQuestion })
        
        // Track new badges per response
        devProfile.newBadges = []
        const oldBadgeCount = (devProfile.badges || []).length

        devProfile.xp += aiResponse.xpAwarded || 0
        devProfile.level = Math.floor(1 + Math.log2(devProfile.xp / 100 + 1))
        devProfile.mastery = {
          ...devProfile.mastery,
          ...aiResponse.learnerMasteryUpdate,
        }

        // Check and award badges based on XP milestones
        const badges: string[] = devProfile.badges || []
        const xpMilestones = [
          { xp: 100, id: 'xp-100' },
          { xp: 200, id: 'xp-200' },
          { xp: 400, id: 'xp-400' },
          { xp: 600, id: 'xp-600' },
          { xp: 800, id: 'xp-800' },
          { xp: 1000, id: 'xp-1000' },
          { xp: 1500, id: 'xp-1500' },
          { xp: 2000, id: 'xp-2000' },
        ]
        
        xpMilestones.forEach(milestone => {
          if (devProfile.xp >= milestone.xp && !badges.includes(milestone.id)) {
            badges.push(milestone.id)
          }
        })
        
        devProfile.badges = badges
        devProfile.newBadges = badges.slice(oldBadgeCount)
      } else {
        // Save AI response to database
        await prisma.chatMessage.create({
          data: {
            userId: user.id,
            algorithm,
            role: 'ai',
            content: aiResponse.socraticQuestion,
            metadata: JSON.stringify({
              analysis: aiResponse.analysisOfUserAnswer,
              xpAwarded: aiResponse.xpAwarded,
            }),
          },
        })

        // Update user profile
        const currentMastery =
          typeof user.profile.mastery === 'string'
            ? JSON.parse(user.profile.mastery)
            : user.profile.mastery

        const updatedMastery = {
          ...currentMastery,
          ...aiResponse.learnerMasteryUpdate,
        }

        const newXP = user.profile.xp + (aiResponse.xpAwarded || 0)
        const newLevel = Math.floor(1 + Math.log2(newXP / 100 + 1))

        // Check for new badges
        const currentBadges: string[] = 
          typeof user.profile.badges === 'string'
            ? JSON.parse(user.profile.badges)
            : (user.profile.badges || [])

        const newBadges: string[] = []
        const xpMilestones = [
          { xp: 100, id: 'xp-100' },
          { xp: 200, id: 'xp-200' },
          { xp: 400, id: 'xp-400' },
          { xp: 600, id: 'xp-600' },
          { xp: 800, id: 'xp-800' },
          { xp: 1000, id: 'xp-1000' },
          { xp: 1500, id: 'xp-1500' },
          { xp: 2000, id: 'xp-2000' },
        ]

        xpMilestones.forEach(milestone => {
          if (newXP >= milestone.xp && !currentBadges.includes(milestone.id)) {
            currentBadges.push(milestone.id)
            newBadges.push(milestone.id)
          }
        })

        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            xp: newXP,
            level: newLevel,
            mastery: JSON.stringify(updatedMastery),
            badges: JSON.stringify(currentBadges),
            lastActive: new Date(),
          },
        })

        // Update leaderboard
        await prisma.leaderboard.upsert({
          where: { userId: user.id },
          update: {
            totalXP: newXP,
            level: newLevel,
          },
          create: {
            userId: user.id,
            displayName: user.displayName || 'Anonymous',
            photoURL: user.photoURL,
            totalXP: newXP,
            level: newLevel,
          },
        })

        // Add new badges to response
        aiResponse.newBadges = newBadges
      }

      // Return response with badge notifications
      return NextResponse.json({
        ...aiResponse,
        newBadges: isDev ? devProfile.newBadges : aiResponse.newBadges,
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      console.error('🚨 AI backend fetch error:', fetchError.message)
      
      // Return fallback response
      return NextResponse.json({
        socraticQuestion: "I'm having trouble connecting to the AI. Can you try again?",
        analysisOfUserAnswer: 'error',
        learnerMasteryUpdate: mastery,
        visualizerStateUpdate: { focusIndices: [], state: 'idle' },
        xpAwarded: 0,
      })
    }
  } catch (error: any) {
    console.error('🚨 Error processing chat message:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
