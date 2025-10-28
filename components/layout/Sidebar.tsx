'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { useLearnerStore } from '@/store/useLearnerStore'
import { ALGORITHMS, BADGES } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle2, Lock, Trophy } from 'lucide-react'

export function Sidebar() {
  const { currentAlgorithm, setCurrentAlgorithm, isSidebarOpen } = useAppStore()
  const { profile } = useLearnerStore()

  const mastery = profile?.mastery || {}
  const badges = profile?.badges || []

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
              {/* Algorithm Selection */}
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Algorithms
                </h2>
                <div className="space-y-2">
                  {ALGORITHMS.map((algo) => {
                    const masteryLevel = mastery[algo.id] || 0
                    const isSelected = currentAlgorithm === algo.id
                    const isUnlocked = algo.difficulty === 'beginner' || masteryLevel > 0

                    return (
                      <Button
                        key={algo.id}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3 px-3 py-2 h-auto',
                          !isUnlocked && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => isUnlocked && setCurrentAlgorithm(algo.id as any)}
                        disabled={!isUnlocked}
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{algo.name}</span>
                            {masteryLevel >= 0.8 && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {!isUnlocked && <Lock className="h-4 w-4" />}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1 w-full rounded-full bg-secondary">
                              <div
                                className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
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
                                ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20'
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
