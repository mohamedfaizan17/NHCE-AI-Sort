// Core types for the application

export interface User {
  id: string
  firebaseUid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Date
}

export interface Profile {
  id: string
  userId: string
  xp: number
  level: number
  streak: number
  lastActive: Date
  badges: string[] // JSON parsed
  mastery: Record<string, number> // JSON parsed
}

export interface ChatMessage {
  id: string
  userId: string
  algorithm: string
  role: 'user' | 'ai' | 'system'
  content: string
  metadata?: any
  timestamp: Date
}

export interface AIResponse {
  socraticQuestion: string
  analysisOfUserAnswer: string
  learnerMasteryUpdate: Record<string, number>
  visualizerStateUpdate: {
    focusIndices: number[]
    state: 'idle' | 'comparing' | 'swapping' | 'sorted' | 'error'
    errorCase?: number[]
    data?: number[]  // Optional: only provided when AI performs a swap
  }
  xpAwarded: number
  newBadges?: string[]  // Optional: newly earned badge IDs
}

export interface VisualizerState {
  data: number[]
  focusIndices: number[]
  state: 'idle' | 'comparing' | 'swapping' | 'sorted' | 'error'
  errorCase?: number[]
}

export type SortingAlgorithm = 
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'mergeSort'
  | 'quickSort'
  | 'heapSort'

export interface VoiceOption {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'neutral'
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Puck', name: 'Puck', description: 'Energetic and enthusiastic', gender: 'male' },
  { id: 'Charon', name: 'Charon', description: 'Calm and methodical', gender: 'neutral' },
  { id: 'Kore', name: 'Kore', description: 'Warm and encouraging', gender: 'female' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Deep and authoritative', gender: 'male' },
  { id: 'Aoede', name: 'Aoede', description: 'Melodic and soothing', gender: 'female' },
]
