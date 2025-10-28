import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// In-memory chat history for dev mode (persists across requests)
const devChatHistory: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, algorithm, firebaseUid, currentArray } = body

    if (!message || !algorithm || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Development mode: Handle dev user - still call AI backend
    const isDev = firebaseUid === 'dev-test-uid'
    
    let user: any
    let recentMessages: any[] = []
    let mastery: any

    if (isDev) {
      // Dev mode: Use in-memory chat history
      user = { id: 'dev-user', profile: { mastery: {}, xp: 100, level: 2 } }
      recentMessages = devChatHistory.slice(-10) // Last 10 messages
      mastery = {}
    } else {
      // Find user
      user = await prisma.user.findUnique({
        where: { firebaseUid },
        include: { profile: true },
      })

      if (!user || !user.profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Save user message to database
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          algorithm,
          role: 'user',
          content: message,
        },
      })

      // Get recent messages for context (last 10 for better context)
      recentMessages = await prisma.chatMessage.findMany({
        where: { userId: user.id, algorithm },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          role: true,
          content: true,
        },
      })

      // Parse mastery
      mastery =
        typeof user.profile.mastery === 'string'
          ? JSON.parse(user.profile.mastery)
          : user.profile.mastery
    }

    // Call Python AI backend
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
    
    // Prepare chat history
    const chatHistory = recentMessages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))
    
    // Add current user message to history
    chatHistory.push({
      role: 'user',
      content: message,
    })
    
    console.log('Calling AI backend:', pythonBackendUrl)
    console.log('Chat history:', chatHistory)
    console.log('Algorithm:', algorithm)
    console.log('Current array:', currentArray)
    
    let aiResponse
    try {
      const aiBackendResponse = await fetch(`${pythonBackendUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory,
          algorithm,
          learnerMastery: mastery,
          currentArray: currentArray || [],
        }),
      })

      console.log('AI backend response status:', aiBackendResponse.status)

      if (!aiBackendResponse.ok) {
        const errorText = await aiBackendResponse.text()
        console.error('AI backend error response:', errorText)
        throw new Error(`AI backend request failed: ${aiBackendResponse.status}`)
      }

      aiResponse = await aiBackendResponse.json()
      console.log('AI backend response:', aiResponse)
    } catch (aiError) {
      console.error('AI Backend Error:', aiError)
      // Fallback response if AI backend is unavailable
      aiResponse = {
        socraticQuestion:
          "Great observation! Let me guide you further with another question...",
        analysisOfUserAnswer: 'continuing',
        learnerMasteryUpdate: mastery,
        visualizerStateUpdate: {
          focusIndices: [0, 1],
          state: 'comparing',
        },
        xpAwarded: 5,
      }
    }

    // Save chat history
    if (isDev) {
      // Save to in-memory history for dev mode
      devChatHistory.push({ role: 'user', content: message })
      devChatHistory.push({ role: 'ai', content: aiResponse.socraticQuestion })
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

      // Update user profile with new mastery and XP
      const currentMastery =
        typeof user.profile.mastery === 'string'
          ? JSON.parse(user.profile.mastery)
          : user.profile.mastery

      const updatedMastery = {
        ...currentMastery,
        ...aiResponse.learnerMasteryUpdate,
      }

      const newXP = user.profile.xp + aiResponse.xpAwarded
      const newLevel = Math.floor(1 + Math.log2(newXP / 100 + 1))

      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          xp: newXP,
          level: newLevel,
          mastery: JSON.stringify(updatedMastery),
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
    }

    // Return AI response to client
    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
