'use client'

import { useState, KeyboardEvent } from 'react'
import { Send, Mic, MicOff, Lightbulb, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSpeech } from '@/hooks/useSpeech'
import { toast } from 'sonner'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onRequestHint: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  onRequestHint,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    isSupported,
  } = useSpeech()

  const handleSend = () => {
    const textToSend = message.trim() || transcript.trim()
    if (!textToSend || isLoading) return

    onSendMessage(textToSend)
    setMessage('')
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported', {
        description: 'Your browser does not support speech recognition.',
      })
      return
    }

    if (isListening) {
      stopListening()
      if (transcript) {
        setMessage(transcript)
      }
    } else {
      startListening()
    }
  }

  const displayValue = isListening ? transcript : message

  return (
    <div className="flex items-center gap-2 p-4 border-t bg-background">
      {/* Hint Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRequestHint}
              disabled={disabled || isLoading}
              className="shrink-0"
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Get a hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Voice Input Button */}
      {isSupported && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                onClick={handleVoiceToggle}
                disabled={disabled || isLoading}
                className="shrink-0"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isListening ? 'Stop listening' : 'Voice input'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Text Input */}
      <div className="relative flex-1">
        <Input
          value={displayValue}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isListening
              ? 'Listening...'
              : 'Ask a question or describe your understanding...'
          }
          disabled={disabled || isLoading || isListening}
          className="pr-10"
        />
        {isListening && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="flex gap-1">
              <span className="h-2 w-1 animate-pulse rounded-full bg-red-500" />
              <span
                className="h-2 w-1 animate-pulse rounded-full bg-red-500"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="h-2 w-1 animate-pulse rounded-full bg-red-500"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={
          (!message.trim() && !transcript.trim()) || disabled || isLoading
        }
        size="icon"
        className="shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
