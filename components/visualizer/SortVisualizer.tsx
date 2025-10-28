'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useD3Sort } from '@/hooks/useD3Sort'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/store/useAppStore'
import { Loader2 } from 'lucide-react'

export function SortVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { visualizerState, isLoadingAIResponse } = useAppStore()
  
  useD3Sort(containerRef)

  return (
    <Card className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={containerRef}
          className="h-full w-full"
          style={{ minHeight: '300px' }}
        />
      </div>

      {/* Loading Overlay */}
      {isLoadingAIResponse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sort-crates is thinking...</p>
          </div>
        </motion.div>
      )}

      {/* State Indicator */}
      <div className="absolute top-4 right-4">
        {visualizerState.state === 'comparing' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-300"
          >
            Comparing
          </motion.div>
        )}
        {visualizerState.state === 'swapping' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300"
          >
            Swapping
          </motion.div>
        )}
        {visualizerState.state === 'sorted' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300"
          >
            Sorted!
          </motion.div>
        )}
        {visualizerState.state === 'error' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300"
          >
            Error Case
          </motion.div>
        )}
      </div>

      {/* Array Size Indicator */}
      <div className="absolute bottom-4 left-4">
        <div className="rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Array Size: {visualizerState.data.length}
        </div>
      </div>
    </Card>
  )
}
