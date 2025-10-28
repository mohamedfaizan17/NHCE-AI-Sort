import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json(
        { error: 'Firebase UID is required' },
        { status: 400 }
      )
    }

    // Development mode: Handle dev user
    if (uid === 'dev-test-uid') {
      return NextResponse.json({
        user: {
          id: 'dev-user',
          firebaseUid: 'dev-test-uid',
          email: 'dev@test.com',
          displayName: 'Dev User',
          photoURL: null,
        },
        profile: {
          id: 'dev-profile',
          userId: 'dev-user',
          xp: 100, // Start with 100 XP
          level: 1,
          streak: 0,
          lastActive: new Date(),
          badges: [],
          mastery: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: { profile: true },
    })

    // If user doesn't exist, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email: searchParams.get('email') || `user_${uid}@socraticsort.com`,
          displayName: searchParams.get('displayName') || 'Anonymous',
          photoURL: searchParams.get('photoURL'),
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

    // If profile doesn't exist, create it
    if (!user.profile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          xp: 0,
          level: 1,
          streak: 0,
          badges: '[]',
          mastery: '{}',
        },
      })

      // Re-fetch user with profile
      user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
        include: { profile: true },
      })
    }

    return NextResponse.json({
      user: {
        id: user!.id,
        firebaseUid: user!.firebaseUid,
        email: user!.email,
        displayName: user!.displayName,
        photoURL: user!.photoURL,
      },
      profile: user!.profile,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firebaseUid, xp, level, streak, badges, mastery } = body

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Firebase UID is required' },
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

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(xp !== undefined && { xp }),
        ...(level !== undefined && { level }),
        ...(streak !== undefined && { streak }),
        ...(badges !== undefined && { badges: JSON.stringify(badges) }),
        ...(mastery !== undefined && { mastery: JSON.stringify(mastery) }),
        lastActive: new Date(),
      },
    })

    // Update leaderboard
    await prisma.leaderboard.upsert({
      where: { userId: user.id },
      update: {
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL,
        totalXP: updatedProfile.xp,
        level: updatedProfile.level,
      },
      create: {
        userId: user.id,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL,
        totalXP: updatedProfile.xp,
        level: updatedProfile.level,
      },
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
