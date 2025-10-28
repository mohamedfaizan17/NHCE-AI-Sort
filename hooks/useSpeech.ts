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

  const { isMuted, selectedVoice } = useAppStore()

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
      if (isMuted) return

      // Silently skip TTS in development mode if API is not configured
      console.log('TTS requested (disabled in dev mode):', text.substring(0, 50))
      setIsSpeaking(false)
      return

      // Original TTS code (disabled for now)
      /*
      setIsSpeaking(true)
      setError(null)

      try {
        // Call Gemini TTS API via Next.js endpoint
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice: selectedVoice,
          }),
        })

        if (!response.ok) {
          throw new Error('TTS request failed')
        }

        const data = await response.json()
        const { audioContent } = data

        // Convert PCM to WAV
        const wavBuffer = pcmToWav(audioContent)

        // Play audio
        if (audioContextRef.current) {
          const audioBuffer = await audioContextRef.current.decodeAudioData(
            wavBuffer
          )

          // Stop any currently playing audio
          if (audioSourceRef.current) {
            audioSourceRef.current.stop()
          }

          const source = audioContextRef.current.createBufferSource()
          source.buffer = audioBuffer
          source.connect(audioContextRef.current.destination)

          source.onended = () => {
            setIsSpeaking(false)
            audioSourceRef.current = null
          }

          audioSourceRef.current = source
          source.start()
        } else {
          throw new Error('AudioContext not initialized')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate speech'
        )
        setIsSpeaking(false)
      }
      */
    },
    [isMuted, selectedVoice]
  )

  const stopSpeaking = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop()
      audioSourceRef.current = null
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
