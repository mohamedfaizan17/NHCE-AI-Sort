import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { pcmToWav } from '@/lib/utils'

interface UseSpeechReturn {
  // Speech-to-Text
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  transcript: string
  
  // Text-to-Speech
  isSpeaking: boolean
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
  
  // Support
  isSupported: boolean
  error: string | null
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null)

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)
      }

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize Audio Context for TTS
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError('Speech recognition is not supported')
      return
    }

    setTranscript('')
    setError(null)
    setIsListening(true)

    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('Failed to start speech recognition')
      setIsListening(false)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const speak = useCallback(
    async (text: string) => {
      // Get fresh muted state from store
      const currentMuted = useAppStore.getState().isMuted
      
      if (currentMuted) {
        console.log('TTS muted, skipping speech')
        return
      }

      // Use browser's built-in Web Speech API
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.log('TTS not supported')
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      setIsSpeaking(true)
      setError(null)

      try {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configure voice
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          // Try to find a good English voice
          const preferredVoice = voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft'))
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0]
          
          utterance.voice = preferredVoice
        }

        utterance.rate = 0.9 // Slightly slower for clarity
        utterance.pitch = 1.0
        utterance.volume = 1.0

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
          console.error('TTS error:', event)
          setError('Failed to generate speech')
          setIsSpeaking(false)
        }

        window.speechSynthesis.speak(utterance)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate speech'
        )
        setIsSpeaking(false)
      }
    },
    []
  )

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported,
    error,
  }
}
