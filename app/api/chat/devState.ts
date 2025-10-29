export type DevChatMessage = {
  role: 'user' | 'ai'
  content: string
}

export interface DevProfileState {
  xp: number
  level: number
  streak: number
  badges: string[]
  mastery: Record<string, number>
  newBadges: string[]
}

export const devChatHistoryByAlgo: Record<string, DevChatMessage[]> = {}

export const devProfile: DevProfileState = {
  xp: 100,
  level: 2,
  streak: 0,
  badges: [],
  mastery: {},
  newBadges: [],
}
