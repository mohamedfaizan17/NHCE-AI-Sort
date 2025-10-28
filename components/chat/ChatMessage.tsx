'use client'

import { motion } from 'framer-motion'
import { Bot, User, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp?: Date
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'
  const isSystem = role === 'system'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 px-4 py-3',
        isUser && 'flex-row-reverse',
        isSystem && 'justify-center'
      )}
    >
      {!isSystem && (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : 'bg-gradient-to-br from-green-500 to-emerald-600'
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1',
          isUser && 'items-end',
          isSystem && 'max-w-full items-center'
        )}
      >
        {!isSystem && (
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? 'You' : 'Sort-crates'}
          </span>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser &&
              'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
            !isUser &&
              !isSystem &&
              'bg-muted text-foreground',
            isSystem &&
              'flex items-center gap-2 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 px-3 py-2'
          )}
        >
          {isSystem && <Lightbulb className="h-4 w-4" />}
          <span className="whitespace-pre-wrap">{content}</span>
        </div>

        {timestamp && !isSystem && (
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  )
}
