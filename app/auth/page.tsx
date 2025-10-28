'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignInForm } from '@/components/auth/SignInForm'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function AuthPage() {
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/')
      } else {
        setIsAuthLoading(false)
      }
    })
    return () => unsub()
  }, [router])

  if (isAuthLoading) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center">
              {mode === 'signin' ? 'Sign in to Socratic Sort' : 'Create your account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'signin' ? (
              <SignInForm
                onToggleMode={() => setMode('signup')}
                onSuccess={() => router.replace('/')}
              />
            ) : (
              <SignUpForm
                onToggleMode={() => setMode('signin')}
                onSuccess={() => router.replace('/')}
              />
            )}
          </CardContent>
        </Card>
        <div className="text-center">
          <Button variant="link" onClick={() => router.push('/')}>Back to home</Button>
        </div>
      </div>
    </div>
  )
}


