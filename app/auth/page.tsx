'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignInForm } from '@/components/auth/SignInForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

export default function AuthPage() {
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    console.log('Auth page mounted')
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user')
      if (user) {
        // Check if user has completed onboarding in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists() && userDoc.data()?.skillLevel) {
            console.log('User has skill level, redirecting to /')
            router.replace('/')
          } else {
            console.log('User has no skill level, redirecting to /onboarding')
            router.replace('/onboarding')
          }
        } catch (error) {
          console.error('Error checking user data:', error)
          router.replace('/onboarding')
        }
      } else {
        console.log('No user, showing auth page')
        setIsAuthLoading(false)
      }
    })
    return () => unsub()
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        // Create/update user profile
        const token = await result.user.getIdToken()
        const params = new URLSearchParams({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Anonymous',
          photoURL: result.user.photoURL || '',
        })
        await fetch(`/api/user/profile?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        toast.success('Welcome!', {
          description: 'Successfully signed in with Google',
        })
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      toast.error('Sign-in failed', {
        description: error.message || 'Please try again',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-4"
      >
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sort-crates
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Master sorting algorithms through AI-powered learning
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'signin' ? 'Sign in to continue your learning journey' : 'Join thousands of learners mastering algorithms'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isGoogleLoading ? (
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email/Password Forms */}
            {mode === 'signin' ? (
              <SignInForm
                onToggleMode={() => setMode('signup')}
                onSuccess={() => {}} // Handled by onAuthStateChanged
              />
            ) : (
              <SignUpForm
                onToggleMode={() => setMode('signin')}
                onSuccess={() => {}} // Handled by onAuthStateChanged
              />
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" onClick={() => router.push('/')}>Back to home</Button>
        </div>
      </motion.div>
    </div>
  )
}


