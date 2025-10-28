import { create } from 'zustand'
import { SortingAlgorithm, VisualizerState } from '@/lib/types'

interface AppState {
  // Algorithm selection
  currentAlgorithm: SortingAlgorithm
  setCurrentAlgorithm: (algorithm: SortingAlgorithm) => void

  // Visualizer state
  visualizerState: VisualizerState
  setVisualizerState: (state: Partial<VisualizerState>) => void
  resetVisualizerState: () => void

  // Animation controls
  animationSpeed: number
  setAnimationSpeed: (speed: number) => void
  isAnimating: boolean
  setIsAnimating: (isAnimating: boolean) => void

  // Audio controls
  isMuted: boolean
  toggleMute: () => void
  selectedVoice: string
  setSelectedVoice: (voice: string) => void

  // UI state
  isLoadingAIResponse: boolean
  setIsLoadingAIResponse: (isLoading: boolean) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  activeTab: 'visualizer' | 'chat' // For mobile
  setActiveTab: (tab: 'visualizer' | 'chat') => void

  // Hint system
  hintLevel: number
  incrementHintLevel: () => void
  resetHintLevel: () => void
}

const initialVisualizerState: VisualizerState = {
  data: Array.from({ length: 10 }, (_, i) => (i + 1) * 10),
  focusIndices: [],
  state: 'idle',
}

export const useAppStore = create<AppState>((set) => ({
  // Algorithm selection
  currentAlgorithm: 'bubbleSort',
  setCurrentAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),

  // Visualizer state
  visualizerState: initialVisualizerState,
  setVisualizerState: (newState) =>
    set((state) => ({
      visualizerState: { ...state.visualizerState, ...newState },
    })),
  resetVisualizerState: () =>
    set({
      visualizerState: {
        ...initialVisualizerState,
        data: Array.from(
          { length: 10 },
          () => Math.floor(Math.random() * 90) + 10
        ),
      },
    }),

  // Animation controls
  animationSpeed: 500, // milliseconds
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  isAnimating: false,
  setIsAnimating: (isAnimating) => set({ isAnimating }),

  // Audio controls
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  selectedVoice: 'Puck',
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),

  // UI state
  isLoadingAIResponse: false,
  setIsLoadingAIResponse: (isLoading) => set({ isLoadingAIResponse: isLoading }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  activeTab: 'visualizer',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Hint system
  hintLevel: 0,
  incrementHintLevel: () => set((state) => ({ hintLevel: state.hintLevel + 1 })),
  resetHintLevel: () => set({ hintLevel: 0 }),
}))
