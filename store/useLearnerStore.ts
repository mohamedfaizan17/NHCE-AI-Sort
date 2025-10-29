import { create } from 'zustand'
import { User, Profile } from '@/lib/types'

interface LearnerState {
  // User data
  user: User | null
  setUser: (user: User | null) => void

  // Profile data
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  // Profile actions
  updateXP: (xp: number) => void
  updateLevel: (level: number) => void
  updateStreak: (streak: number) => void
  updateMastery: (algorithm: string, mastery: number) => void
  addBadge: (badgeId: string) => void

  // Data fetching
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void

  // Actions
  fetchProfile: (firebaseUid: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useLearnerStore = create<LearnerState>((set, get) => ({
  // User data
  user: null,
  setUser: (user) => set({ user }),

  // Profile data
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Profile actions
  updateXP: (xp) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, xp } } : state
    ),
  updateLevel: (level) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, level } } : state
    ),
  updateStreak: (streak) =>
    set((state) =>
      state.profile ? { profile: { ...state.profile, streak } } : state
    ),
  updateMastery: (algorithm, mastery) =>
    set((state) => {
      if (!state.profile) return state
      const currentMastery =
        typeof state.profile.mastery === 'string'
          ? JSON.parse(state.profile.mastery)
          : state.profile.mastery
      return {
        profile: {
          ...state.profile,
          mastery: { ...currentMastery, [algorithm]: mastery },
        },
      }
    }),
  addBadge: (badgeId) =>
    set((state) => {
      if (!state.profile) return state
      const currentBadges =
        typeof state.profile.badges === 'string'
          ? JSON.parse(state.profile.badges)
          : state.profile.badges
      if (currentBadges.includes(badgeId)) return state
      return {
        profile: {
          ...state.profile,
          badges: [...currentBadges, badgeId],
        },
      }
    }),

  // Data fetching
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),

  // Actions
  fetchProfile: async (firebaseUid: string) => {
    set({ isLoading: true, error: null })
    try {
      console.log('📊 Fetching profile for UID:', firebaseUid)
      const response = await fetch(`/api/user/profile?uid=${firebaseUid}`)
      if (!response.ok) throw new Error('Failed to fetch profile')
      
      const data = await response.json()
      console.log('📊 Profile data received:', data.profile)
      
      // Parse JSON strings
      const profile: Profile = {
        ...data.profile,
        badges: typeof data.profile.badges === 'string' 
          ? JSON.parse(data.profile.badges) 
          : data.profile.badges,
        mastery: typeof data.profile.mastery === 'string'
          ? JSON.parse(data.profile.mastery)
          : data.profile.mastery,
      }

      console.log('📊 Parsed profile - XP:', profile.xp, 'Level:', profile.level, 'Badges:', profile.badges)

      set({
        user: data.user,
        profile,
        isLoading: false,
      })
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      })
    }
  },

  refreshProfile: async () => {
    const { user } = get()
    if (user?.firebaseUid) {
      await get().fetchProfile(user.firebaseUid)
    }
  },
}))
