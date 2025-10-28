import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, algorithm, firebaseUid } = body

    if (!message || !algorithm || !firebaseUid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
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

    // Fetch recent chat history for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        algorithm,
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
    })

    // Parse mastery
    const mastery =
      typeof user.profile.mastery === 'string'
        ? JSON.parse(user.profile.mastery)
        : user.profile.mastery

    // Call Python AI backend
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'
    
    let aiResponse
    try {
      const aiBackendResponse = await fetch(`${pythonBackendUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory: recentMessages.reverse().map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          algorithm,
          learnerMastery: mastery,
        }),
      })

      if (!aiBackendResponse.ok) {
        throw new Error('AI backend request failed')
      }

      aiResponse = await aiBackendResponse.json()
    } catch (aiError) {
      console.error('AI Backend Error:', aiError)
      // Fallback response if AI backend is unavailable
      aiResponse = {
        socraticQuestion:
          "Great question! Let me guide you: What do you think happens when we compare two adjacent elements in the array?",
        analysisOfUserAnswer: 'continuing',
        learnerMasteryUpdate: mastery,
        visualizerStateUpdate: {
          focusIndices: [0, 1],
          state: 'comparing',
        },
        xpAwarded: 5,
      }
    }

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
