import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...')
    
    // Try to count users
    const userCount = await prisma.user.count()
    console.log('✅ User count:', userCount)
    
    // Try to get all users
    const users = await prisma.user.findMany({
      take: 5,
      include: { profile: true }
    })
    
    return NextResponse.json({
      success: true,
      userCount,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        firebaseUid: u.firebaseUid,
        hasProfile: !!u.profile
      }))
    })
  } catch (error: any) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
