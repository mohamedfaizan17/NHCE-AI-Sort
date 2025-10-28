'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useLearnerStore } from '@/store/useLearnerStore'
import { getProgressToNextLevel, BADGES } from '@/lib/utils'
import { Zap, Flame, Trophy } from 'lucide-react'

export function UserProfileCard() {
  const { user, profile } = useLearnerStore()

  if (!user || !profile) {
    return null
  }

  const progressToNextLevel = getProgressToNextLevel(profile.xp)
  const badges = typeof profile.badges === 'string' 
    ? JSON.parse(profile.badges) 
    : profile.badges

  const earnedBadges = BADGES.filter((badge) => badges.includes(badge.id))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-lg">
                {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.displayName || 'Anonymous'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Level & XP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">Level {profile.level}</span>
              </div>
              <span className="text-sm text-muted-foreground">{profile.xp} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progressToNextLevel.toFixed(0)}% to Level {profile.level + 1}
            </p>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{profile.streak}</div>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Recent Badges</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {badges.length} / {BADGES.length}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {earnedBadges.slice(0, 6).map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-1 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-3 transition-transform"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] text-center font-medium leading-tight">
                      {badge.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
