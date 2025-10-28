import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const uid = searchParams.get('uid')
    const algorithm = searchParams.get('algorithm')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!uid) {
      return NextResponse.json(
        { error: 'Firebase UID is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch chat history
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
        ...(algorithm && { algorithm }),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
    })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
