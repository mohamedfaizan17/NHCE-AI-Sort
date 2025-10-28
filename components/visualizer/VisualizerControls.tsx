'use client'

import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store/useAppStore'
import { generateRandomArray } from '@/lib/utils'
import { SortingAlgorithm } from '@/lib/types'

export function VisualizerControls() {
  const {
    isAnimating,
    setIsAnimating,
    animationSpeed,
    setAnimationSpeed,
    visualizerState,
    setVisualizerState,
    resetVisualizerState,
  } = useAppStore()

  const handlePlayPause = () => {
    setIsAnimating(!isAnimating)
  }

  const handleReset = () => {
    setIsAnimating(false)
    resetVisualizerState()
  }

  const handleShuffle = () => {
    setIsAnimating(false)
    const newData = generateRandomArray(visualizerState.data.length, 10, 100)
    setVisualizerState({
      data: newData,
      focusIndices: [],
      state: 'idle',
    })
  }

  const handleArraySizeChange = (value: string) => {
    const size = parseInt(value)
    const newData = generateRandomArray(size, 10, 100)
    setVisualizerState({
      data: newData,
      focusIndices: [],
      state: 'idle',
    })
  }

  const handleSpeedChange = (value: number[]) => {
    // Invert the slider: higher value = faster = lower duration
    const speed = 1100 - value[0]
    setAnimationSpeed(speed)
  }

  return (
    <div className="space-y-4">
      {/* Playback Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={handlePlayPause}
          disabled={visualizerState.state === 'sorted'}
        >
          {isAnimating ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleShuffle}>
          <Shuffle className="mr-2 h-4 w-4" />
          Shuffle
        </Button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Array Size */}
        <div className="space-y-2">
          <Label className="text-xs">Array Size</Label>
          <Select
            value={visualizerState.data.length.toString()}
            onValueChange={handleArraySizeChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 elements</SelectItem>
              <SelectItem value="10">10 elements</SelectItem>
              <SelectItem value="15">15 elements</SelectItem>
              <SelectItem value="20">20 elements</SelectItem>
              <SelectItem value="30">30 elements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animation Speed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Animation Speed</Label>
            <span className="text-xs text-muted-foreground">
              {animationSpeed < 300
                ? 'Very Fast'
                : animationSpeed < 500
                ? 'Fast'
                : animationSpeed < 800
                ? 'Medium'
                : 'Slow'}
            </span>
          </div>
          <Slider
            value={[1100 - animationSpeed]}
            onValueChange={handleSpeedChange}
            min={100}
            max={1000}
            step={50}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
