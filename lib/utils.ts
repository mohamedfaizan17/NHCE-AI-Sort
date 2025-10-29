import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts PCM audio data to WAV format
 * @param pcmData Base64 encoded PCM data from Gemini TTS
 * @param sampleRate Sample rate (default: 24000 for Gemini TTS)
 * @returns ArrayBuffer containing WAV file data
 */
export function pcmToWav(pcmData: string, sampleRate: number = 24000): ArrayBuffer {
  // Decode base64 to binary
  const binaryString = atob(pcmData)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // Convert to Int16Array (PCM is 16-bit)
  const pcmSamples = new Int16Array(bytes.buffer)
  
  // Calculate sizes
  const numChannels = 1 // Mono
  const bitsPerSample = 16
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8)
  const blockAlign = numChannels * (bitsPerSample / 8)
  const dataSize = pcmSamples.length * 2 // 2 bytes per sample
  const fileSize = 44 + dataSize

  // Create WAV file buffer
  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF')
  view.setUint32(4, fileSize - 8, true) // File size - 8
  writeString(view, 8, 'WAVE')

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true) // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true) // NumChannels
  view.setUint32(24, sampleRate, true) // SampleRate
  view.setUint32(28, byteRate, true) // ByteRate
  view.setUint16(32, blockAlign, true) // BlockAlign
  view.setUint16(34, bitsPerSample, true) // BitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true) // Subchunk2Size

  // Write PCM samples
  const offset = 44
  for (let i = 0; i < pcmSamples.length; i++) {
    view.setInt16(offset + i * 2, pcmSamples[i], true)
  }

  return buffer
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

/**
 * Calculates XP required for a given level
 */
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

/**
 * Calculates level from total XP
 */
export function getLevelFromXP(xp: number): number {
  let level = 1
  let totalXP = 0
  
  while (totalXP + getXPForLevel(level) <= xp) {
    totalXP += getXPForLevel(level)
    level++
  }
  
  return level
}

/**
 * Gets progress to next level as a percentage
 */
export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp)
  const xpForCurrentLevel = getXPForLevel(currentLevel)
  
  let totalXPForPreviousLevels = 0
  for (let i = 1; i < currentLevel; i++) {
    totalXPForPreviousLevels += getXPForLevel(i)
  }
  
  const xpInCurrentLevel = xp - totalXPForPreviousLevels
  return (xpInCurrentLevel / xpForCurrentLevel) * 100
}

/**
 * Formats a timestamp into a relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

/**
 * Generates a random array for sorting visualizations
 */
export function generateRandomArray(size: number, min: number = 10, max: number = 100): number[] {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

/**
 * Algorithm metadata for the visualizer
 */
export interface AlgorithmInfo {
  id: string
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    difficulty: 'beginner',
  },
  {
    id: 'selectionSort',
    name: 'Selection Sort',
    description: 'Divides the input list into two parts: sorted and unsorted, and repeatedly selects the smallest element from the unsorted portion.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    difficulty: 'beginner',
  },
  {
    id: 'insertionSort',
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time by inserting each element into its correct position.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    difficulty: 'beginner',
  },
  {
    id: 'mergeSort',
    name: 'Merge Sort',
    description: 'Divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    difficulty: 'intermediate',
  },
  {
    id: 'quickSort',
    name: 'Quick Sort',
    description: 'Picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    difficulty: 'intermediate',
  },
  {
    id: 'heapSort',
    name: 'Heap Sort',
    description: 'Converts the array into a max heap and repeatedly extracts the maximum element.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    difficulty: 'advanced',
  },
]

/**
 * Badge definitions
 */
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: (profile: any) => boolean
}

export const BADGES: Badge[] = [
  {
    id: 'xp-100',
    name: 'First',
    description: 'Earn 100 XP',
    icon: '🎯',
    condition: (profile) => profile.xp >= 100,
  },
  {
    id: 'xp-200',
    name: 'Achiever',
    description: 'Earn 200 XP',
    icon: '🥉',
    condition: (profile) => profile.xp >= 200,
  },
  {
    id: 'xp-400',
    name: 'Champion',
    description: 'Earn 400 XP',
    icon: '🥈',
    condition: (profile) => profile.xp >= 400,
  },
  {
    id: 'xp-600',
    name: 'Legend',
    description: 'Earn 600 XP',
    icon: '🥇',
    condition: (profile) => profile.xp >= 600,
  },
  {
    id: 'xp-800',
    name: 'Bubble',
    description: 'Earn 800 XP',
    icon: '🫧',
    condition: (profile) => profile.xp >= 800,
  },
  {
    id: 'xp-1000',
    name: 'Quick',
    description: 'Earn 1000 XP',
    icon: '⚡',
    condition: (profile) => profile.xp >= 1000,
  },
  {
    id: 'xp-1500',
    name: 'Week',
    description: 'Earn 1500 XP',
    icon: '🔥',
    condition: (profile) => profile.xp >= 1500,
  },
  {
    id: 'xp-2000',
    name: 'Rising',
    description: 'Earn 2000 XP',
    icon: '⭐',
    condition: (profile) => profile.xp >= 2000,
  },
]
