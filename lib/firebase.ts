import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Basic validation to surface misconfiguration early
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const
const missing = requiredKeys.filter((k) => !firebaseConfig[k])
if (missing.length > 0) {
  // Throwing here helps catch the common "auth/configuration-not-found" at source
  throw new Error(
    `Firebase config missing: ${missing.join(', ')}. Ensure NEXT_PUBLIC_* env vars are set in .env.local and restart dev server.`
  )
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase Auth
export const auth = getAuth(app)

export default app
