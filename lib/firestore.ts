import { db } from './firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export interface UserSkillData {
  skillLevel: 'basic' | 'intermediate' | 'advanced'
  quizScore: number
  quizResults?: any
  unlockedAlgorithms?: string[]
  updatedAt: string
}

export async function getUserSkillLevel(uid: string): Promise<UserSkillData | null> {
  try {
    const userDocRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      return userDoc.data() as UserSkillData
    }
    return null
  } catch (error) {
    console.error('Error getting user skill level:', error)
    return null
  }
}

export async function updateUserSkillLevel(uid: string, data: Partial<UserSkillData>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid)
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating user skill level:', error)
    throw error
  }
}

export async function setUserSkillLevel(uid: string, data: UserSkillData): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid)
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
  } catch (error) {
    console.error('Error setting user skill level:', error)
    throw error
  }
}

export function getUnlockedAlgorithms(skillLevel: 'basic' | 'intermediate' | 'advanced'): string[] {
  const algorithmsByLevel = {
    basic: ['bubbleSort', 'selectionSort', 'insertionSort'],
    intermediate: ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort', 'quickSort'],
    advanced: ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort', 'quickSort', 'heapSort'],
  }
  
  return algorithmsByLevel[skillLevel] || algorithmsByLevel.basic
}

export function isAlgorithmUnlocked(algorithm: string, skillLevel: 'basic' | 'intermediate' | 'advanced'): boolean {
  const unlockedAlgorithms = getUnlockedAlgorithms(skillLevel)
  return unlockedAlgorithms.includes(algorithm)
}
