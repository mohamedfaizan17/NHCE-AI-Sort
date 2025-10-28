'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { MainLayout } from '@/components/layout/MainLayout'
import { useLearnerStore } from '@/store/useLearnerStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { user, setUser, fetchProfile } = useLearnerStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
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
  }, [setUser, fetchProfile])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        toast.success('Welcome!', {
          description: 'Successfully signed in with Google',
        })
      }
    } catch (error: any) {
      console.error('Sign-in error:', error)
      toast.error('Sign-in failed', {
        description: error.message || 'Please try again',
      })
    } finally {
      setIsSigningIn(false)
    }
  }

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

  // Not authenticated - show landing page
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Socratic Sort
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Master sorting algorithms through AI-powered Socratic dialogue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    ✓
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Real-time AI tutor</span> that
                    guides you with Socratic questions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    ✓
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Dynamic visualizations</span>{' '}
                    synchronized with your learning
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400">
                    ✓
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Gamification</span> with XP,
                    badges, and global leaderboards
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Authenticated - show main app
  return <MainLayout />
}
