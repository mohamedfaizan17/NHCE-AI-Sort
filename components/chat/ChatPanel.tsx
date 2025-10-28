'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { SandboxVisualizer } from '@/components/visualizer/SandboxVisualizer'
import { useSocraticTutor } from '@/hooks/useSocraticTutor'
import { useSpeech } from '@/hooks/useSpeech'
import { useAppStore } from '@/store/useAppStore'
import { useLearnerStore } from '@/store/useLearnerStore'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp: Date
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content:
        "Hello! I'm Sort-crates, your Socratic tutor. I'm here to help you deeply understand sorting algorithms through guided questions. Let's explore together!\n\nTell me: What do you think is the first step in understanding how Bubble Sort works?",
      timestamp: new Date(),
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)
  const { sendMessage, getHint, isLoading } = useSocraticTutor()
  const { speak, isSpeaking } = useSpeech()
  const { visualizerState, isMuted } = useAppStore()
  const { user } = useLearnerStore()

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Speak AI messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'ai' && !isMuted) {
      speak(lastMessage.content)
    }
  }, [messages, isMuted, speak])

  const handleSendMessage = async (content: string) => {
    if (!user) {
      toast.error('Please log in to chat')
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Send to AI and get response
    try {
      const response = await sendMessage(content)
      
      // Add AI response to messages
      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: response.socraticQuestion,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to get AI response')
    }
  }

  const handleRequestHint = () => {
    const hint = getHint()
    const hintMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `💡 Hint: ${hint}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, hintMessage])
    toast.info('Hint provided', {
      description: 'Use this to guide your thinking!',
    })
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold">Sort-crates</h2>
          <p className="text-xs text-muted-foreground">
            {isSpeaking ? 'Speaking...' : 'Your AI Socratic Tutor'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="py-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {/* Error Case Sandbox */}
          <AnimatePresence>
            {visualizerState.state === 'error' && visualizerState.errorCase && (
              <div className="px-4 py-2">
                <SandboxVisualizer
                  data={visualizerState.errorCase}
                  title="Test Case That Fails"
                  description="This input reveals the flaw in your current understanding."
                />
              </div>
            )}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onRequestHint={handleRequestHint}
        isLoading={isLoading}
        disabled={!user}
      />
    </div>
  )
}
