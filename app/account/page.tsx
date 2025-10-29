'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useLearnerStore } from '@/store/useLearnerStore'
import { auth } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { toast } from 'sonner'
import { ArrowLeft, Save, User, Mail, Award, Zap, Calendar } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { user, profile } = useLearnerStore()
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    setDisplayName(user.displayName || '')
  }, [user, router])

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return

    setIsLoading(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl py-8 px-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Details</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and display name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Managed through your authentication provider
                  </p>
                </div>
              </div>

              <Separator />

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isLoading || displayName === user.displayName}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your achievements and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* XP */}
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.xp}</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Award className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Level {profile.level}</p>
                    <p className="text-xs text-muted-foreground">Current Level</p>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profile.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card>
            <CardHeader>
              <CardTitle>Badges Earned</CardTitle>
              <CardDescription>
                Your collection of achievement badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.badges && profile.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badgeId: string) => {
                    const badgeNames: Record<string, string> = {
                      'xp-100': '🎯 First Steps',
                      'xp-200': '🥉 Bronze Achiever',
                      'xp-400': '🥈 Silver Champion',
                      'xp-600': '🥇 Gold Legend',
                      'xp-800': '🫧 Bubble Master',
                      'xp-1000': '⚡ Quick Sorter',
                      'xp-1500': '🔥 Week Warrior',
                      'xp-2000': '⭐ Rising Star',
                    }
                    return (
                      <Badge key={badgeId} variant="secondary" className="text-sm py-1.5 px-3">
                        {badgeNames[badgeId] || badgeId}
                      </Badge>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No badges earned yet. Keep learning to unlock achievements!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
