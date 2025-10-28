'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, Medal, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  displayName: string
  photoURL: string | null
  totalXP: number
  level: number
  rank: number
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />
    return null
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/50'
    if (rank === 3) return 'from-orange-500/20 to-red-500/20 border-orange-500/50'
    return ''
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No entries yet. Be the first!
                  </p>
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                      entry.rank <= 3 &&
                        `bg-gradient-to-r ${getRankColor(entry.rank)} border`
                    )}
                  >
                    {/* Rank */}
                    <div className="flex w-10 items-center justify-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-sm font-semibold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.photoURL || undefined} alt={entry.displayName} />
                      <AvatarFallback>
                        {entry.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{entry.displayName}</p>
                      <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                    </div>

                    {/* XP Badge */}
                    <Badge variant="secondary" className="shrink-0">
                      {entry.totalXP.toLocaleString()} XP
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
