'use client'

import { Moon, Sun, Volume2, VolumeX, Menu, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAppStore } from '@/store/useAppStore'
import { useLearnerStore } from '@/store/useLearnerStore'
import { VOICE_OPTIONS } from '@/lib/types'
import { getProgressToNextLevel } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { isMuted, toggleMute, selectedVoice, setSelectedVoice, toggleSidebar } = useAppStore()
  const { user, profile } = useLearnerStore()

  const progressToNextLevel = profile ? getProgressToNextLevel(profile.xp) : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Socratic Sort</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
            </div>
          </div>
        </div>

        {/* Center: User Profile (Desktop) */}
        {profile && (
          <div className="hidden md:flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{profile.xp} XP</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-semibold">Level {profile.level}</p>
                    <p className="text-muted-foreground">
                      {progressToNextLevel.toFixed(0)}% to next level
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <span className="text-orange-500">🔥</span>
              <span className="font-semibold">{profile.streak} day streak</span>
            </Badge>
          </div>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Selection */}
          <div className="hidden lg:block">
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Voice" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{voice.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mute Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-9 w-9"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isMuted ? 'Unmute' : 'Mute'} voice
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Toggle {theme === 'dark' ? 'light' : 'dark'} mode
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Avatar */}
          {user && (
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>
                {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}
