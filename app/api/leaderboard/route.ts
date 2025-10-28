import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch top users from leaderboard
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { totalXP: 'desc' },
      take: limit,
    })

    // Update ranks
    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    return NextResponse.json({ leaderboard: leaderboardWithRanks })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
