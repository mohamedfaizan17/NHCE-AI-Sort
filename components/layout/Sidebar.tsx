'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { useLearnerStore } from '@/store/useLearnerStore'
import { ALGORITHMS, BADGES } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle2, Trophy, Lock, LogOut, User, Settings } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { getUserSkillLevel, isAlgorithmUnlocked } from '@/lib/firestore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ALGORITHM_GRADIENTS: Record<string, string> = {
  bubbleSort: 'from-blue-500 to-purple-500',
  selectionSort: 'from-emerald-400 to-green-500',
  insertionSort: 'from-orange-400 to-pink-500',
  mergeSort: 'from-sky-400 to-blue-500',
  quickSort: 'from-rose-500 to-red-500',
  heapSort: 'from-amber-400 to-yellow-500',
}

export function Sidebar() {
  const router = useRouter()
  const { currentAlgorithm, setCurrentAlgorithm, isSidebarOpen } = useAppStore()
  const { profile } = useLearnerStore()
  const [skillLevel, setSkillLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic')
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const mastery = profile?.mastery || {}
  const badges = profile?.badges || []
  const user = auth.currentUser

  useEffect(() => {
    const loadSkillLevel = async () => {
      const user = auth.currentUser
      if (user) {
        const userData = await getUserSkillLevel(user.uid)
        if (userData?.skillLevel) {
          setSkillLevel(userData.skillLevel)
        }
      }
    }
    loadSkillLevel()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-[280px] border-r bg-background lg:translate-x-0"
        >
          <ScrollArea className="h-full px-4 py-6">
            <div className="space-y-6">
              {/* Account Section */}
              <Card className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Skill Level</span>
                    <Badge variant="outline" className="capitalize">
                      {skillLevel}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Selection */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Algorithms
                </h2>
                <div className="space-y-2">
                  {ALGORITHMS.map((algo) => {
                    const masteryLevel = mastery[algo.id] || 0
                    const isSelected = currentAlgorithm === algo.id
                    const isUnlocked = isAlgorithmUnlocked(algo.id, skillLevel)

                    const handleClick = () => {
                      if (!isUnlocked) {
                        toast.error('Algorithm Locked', {
                          description: 'Achieve 100% mastery in any algorithm or improve your skill level to unlock this!',
                        })
                        return
                      }
                      setCurrentAlgorithm(algo.id as any)
                    }

                    return (
                      <Button
                        key={algo.id}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 px-3 py-2 h-auto',
                          !isUnlocked && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={handleClick}
                        disabled={!isUnlocked}
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{algo.name}</span>
                            {!isUnlocked && (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            {isUnlocked && masteryLevel >= 0.8 && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1 w-full rounded-full bg-secondary">
                              <div
                                className={cn(
                                  'h-1 rounded-full bg-gradient-to-r transition-all',
                                  ALGORITHM_GRADIENTS[algo.id] || 'from-blue-500 to-purple-600'
                                )}
                                style={{ width: `${masteryLevel * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(masteryLevel * 100)}%
                            </span>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Badges
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {BADGES.slice(0, 8).map((badge) => {
                        const isEarned = badges.includes(badge.id)
                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              'flex flex-col items-center gap-1 rounded-lg p-2 transition-all',
                              isEarned
                                ? 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30 text-yellow-100 shadow-[0_0_18px_rgba(251,191,36,0.45)] ring-2 ring-yellow-400/40 animate-pulse'
                                : 'opacity-30 grayscale'
                            )}
                          >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-[10px] text-center leading-tight">
                              {badge.name.split(' ')[0]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {badges.length > 0 && (
                      <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Trophy className="h-3 w-3" />
                        <span>{badges.length} / {BADGES.length} earned</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Current Algorithm Info */}
              {currentAlgorithm && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    About
                  </h2>
                  <Card>
                    <CardHeader className="p-4 pb-3">
                      <CardTitle className="text-sm">
                        {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.description}
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Case:</span>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                            {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.timeComplexity.best}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Average:</span>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                            {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.timeComplexity.average}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Worst Case:</span>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                            {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.timeComplexity.worst}
                          </code>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          ALGORITHMS.find((a) => a.id === currentAlgorithm)?.difficulty === 'beginner' &&
                            'border-green-500 text-green-500',
                          ALGORITHMS.find((a) => a.id === currentAlgorithm)?.difficulty === 'intermediate' &&
                            'border-yellow-500 text-yellow-500',
                          ALGORITHMS.find((a) => a.id === currentAlgorithm)?.difficulty === 'advanced' &&
                            'border-red-500 text-red-500'
                        )}
                      >
                        {ALGORITHMS.find((a) => a.id === currentAlgorithm)?.difficulty}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
