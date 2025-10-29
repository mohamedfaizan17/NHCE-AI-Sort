'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { MainLayout } from '@/components/layout/MainLayout'
import { LandingPage } from '@/components/landing/LandingPage'
import { useLearnerStore } from '@/store/useLearnerStore'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const { user, setUser, fetchProfile } = useLearnerStore()

  // DEVELOPMENT MODE: Bypass Firebase auth for testing (DISABLED - using real auth)
  const DEV_MODE = false // process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (DEV_MODE) {
      // Skip Firebase auth in development mode
      console.log('DEV MODE: Skipping Firebase authentication')
      setIsAuthLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user has completed onboarding
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (!userDoc.exists() || !userDoc.data()?.skillLevel) {
            // No skill level - redirect to onboarding
            router.replace('/onboarding')
            return
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error)
        }

        // User is signed in and has completed onboarding
        const userData = {
          id: '',
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date(),
        }
        setUser(userData)
        
        // Fetch user profile from database
        await fetchProfile(firebaseUser.uid)
      } else {
        setUser(null)
      }
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, fetchProfile, DEV_MODE, router])


  // Loading state
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Socratic Sort...</p>
        </div>
      </div>
    )
  }

  // Development mode bypass
  const handleDevModeSkip = () => {
    console.log('Dev Mode: Bypassing authentication')
    const devUser = {
      id: 'dev-user',
      firebaseUid: 'dev-test-uid',
      email: 'dev@test.com',
      displayName: 'Dev User',
      photoURL: null,
      createdAt: new Date(),
    }
    setUser(devUser)
    console.log('Dev Mode: User set:', devUser)
    toast.success('Dev Mode', {
      description: 'Logged in as test user',
    })
  }

  // Not authenticated - show landing page
  if (!user) {
    return <LandingPage />
  }

  // Authenticated - show main app
  return <MainLayout />
}
