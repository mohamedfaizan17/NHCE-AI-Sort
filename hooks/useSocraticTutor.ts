import { useState, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useLearnerStore } from '@/store/useLearnerStore'
import { AIResponse, ChatMessage } from '@/lib/types'
import { toast } from 'sonner'

interface UseSocraticTutorReturn {
  sendMessage: (message: string) => Promise<AIResponse | null>
  getHint: () => string
  isLoading: boolean
  error: string | null
}

const HINTS = {
  level1: [
    "Think about what happens when you compare two adjacent elements.",
    "Consider the loop structure - what does the outer loop represent?",
    "What condition determines if elements should be swapped?",
  ],
  level2: [
    "In Bubble Sort, each pass moves the largest unsorted element to its final position.",
    "The inner loop performs comparisons, while the outer loop counts passes.",
    "After each complete pass, one more element is in its sorted position.",
  ],
  level3: [
    "Here's a key insight: You need two nested loops. The outer loop runs n-1 times, and the inner loop compares adjacent pairs.",
    "The swap condition is: if arr[j] > arr[j+1], then swap them.",
    "You can optimize by reducing the inner loop range after each pass, since the last elements are already sorted.",
  ],
}

export function useSocraticTutor(): UseSocraticTutorReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { 
    currentAlgorithm, 
    setIsLoadingAIResponse, 
    setVisualizerState,
    hintLevel,
    incrementHintLevel,
  } = useAppStore()
  
  const { user, profile, refreshProfile } = useLearnerStore()

  const sendMessage = useCallback(
    async (message: string): Promise<AIResponse | null> => {
      if (!user) {
        setError('User not authenticated')
        toast.error('Please log in to continue')
        return null
      }

      setIsLoading(true)
      setIsLoadingAIResponse(true)
      setError(null)

      try {
        // Get current visualizer state to send array data
        const currentState = useAppStore.getState()
        const visualizerState = currentState.visualizerState
        const isAnimating = currentState.isAnimating
        
        // Call the Next.js orchestration endpoint
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            algorithm: currentAlgorithm,
            firebaseUid: user.firebaseUid,
            currentArray: visualizerState.data,
            isAnimating: isAnimating,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const data: AIResponse = await response.json()

        // Update visualizer state based on AI response
        // Only update if not currently animating to avoid interrupting the animation
        if (data.visualizerStateUpdate && !isAnimating) {
          // If AI provided new data (after a swap), update it
          if (data.visualizerStateUpdate.data) {
            setVisualizerState({
              data: data.visualizerStateUpdate.data,
              focusIndices: data.visualizerStateUpdate.focusIndices || [],
              state: data.visualizerStateUpdate.state || 'idle',
            })
          } else {
            // Otherwise just update focus and state without changing data
            setVisualizerState({
              focusIndices: data.visualizerStateUpdate.focusIndices || [],
              state: data.visualizerStateUpdate.state || 'idle',
            })
          }
        }

        // Refresh user profile to get updated XP and mastery
        console.log('🔄 Refreshing profile after chat response...')
        await refreshProfile()
        console.log('✅ Profile refreshed')

        // Show XP notification
        if (data.xpAwarded > 0) {
          toast.success(`+${data.xpAwarded} XP earned!`, {
            description: 'Great progress!',
          })
        } else if (data.xpAwarded < 0) {
          toast.error(`${data.xpAwarded} XP`, {
            description: 'Review the concept and try again',
          })
        } else if (data.xpAwarded === 0) {
          console.log('No XP awarded for this response')
        }
        
        // Show badge earned notification
        if (data.newBadges && data.newBadges.length > 0) {
          data.newBadges.forEach((badgeId: string) => {
            const badgeNames: Record<string, string> = {
              'xp-100': '🎯 First',
              'xp-200': '🥉 Achiever',
              'xp-400': '🥈 Champion',
              'xp-600': '🥇 Legend',
              'xp-800': '🫧 Bubble',
              'xp-1000': '⚡ Quick',
              'xp-1500': '🔥 Week',
              'xp-2000': '⭐ Rising',
            }
            const badgeName = badgeNames[badgeId] || 'New Badge'
            
            toast.success(`🎉 Badge Earned: ${badgeName}!`, {
              description: 'Congratulations on your achievement!',
              duration: 5000,
            })
          })
        }

        // Check if error state and show sandbox visualization
        if (data.visualizerStateUpdate?.state === 'error') {
          toast.error('Let\'s examine this case more closely', {
            description: 'Check the sandbox visualizer below',
          })
        }

        return data

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        toast.error('Failed to send message', {
          description: errorMessage,
        })
        return null
      } finally {
        setIsLoading(false)
        setIsLoadingAIResponse(false)
      }
    },
    [user, currentAlgorithm, setIsLoadingAIResponse, setVisualizerState, refreshProfile]
  )

  const getHint = useCallback((): string => {
    const hints = HINTS.level1.concat(HINTS.level2).concat(HINTS.level3)
    const currentHint = hints[Math.min(hintLevel, hints.length - 1)]
    incrementHintLevel()
    
    return currentHint
  }, [hintLevel, incrementHintLevel])

  return {
    sendMessage,
    getHint,
    isLoading,
    error,
  }
}
