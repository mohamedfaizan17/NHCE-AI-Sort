import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { getSortingAlgorithm, SortStep } from '@/lib/sortingAlgorithms'

export function useSortingAnimation() {
  const {
    isAnimating,
    setIsAnimating,
    animationSpeed,
    currentAlgorithm,
    visualizerState,
    setVisualizerState,
  } = useAppStore()

  const generatorRef = useRef<Generator<SortStep> | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialDataRef = useRef<number[]>([])

  // Effect to handle animation start/stop
  useEffect(() => {
    if (!isAnimating) {
      // Clear any pending animation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      // Reset generator when stopped
      generatorRef.current = null
      return
    }

    // Initialize generator when animation starts
    if (!generatorRef.current) {
      const sortFn = getSortingAlgorithm(currentAlgorithm)
      initialDataRef.current = [...visualizerState.data]
      generatorRef.current = sortFn(initialDataRef.current)
      
      // Start the animation loop
      const animate = () => {
        if (!generatorRef.current) return

        const { value, done } = generatorRef.current.next()

        if (done || !value) {
          setIsAnimating(false)
          generatorRef.current = null
          return
        }

        // Update visualizer state
        setVisualizerState({
          data: value.data,
          focusIndices: value.focusIndices,
          state: value.state,
        })

        // Schedule next step
        timeoutRef.current = setTimeout(animate, animationSpeed)
      }

      animate()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isAnimating, currentAlgorithm]) // Removed visualizerState.data from dependencies

  return null
}
