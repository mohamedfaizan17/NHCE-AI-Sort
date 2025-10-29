'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Users, MessageSquare, Trophy, Github, Twitter, Mail, ExternalLink } from 'lucide-react'

export default function CommunityPage() {
  const router = useRouter()

  const topLearners = [
    { name: 'Alex Chen', xp: 2450, level: 12, badge: '⭐', color: 'from-yellow-500 to-orange-500' },
    { name: 'Sarah Kim', xp: 2200, level: 11, badge: '🔥', color: 'from-orange-500 to-red-500' },
    { name: 'Michael Rodriguez', xp: 2100, level: 11, badge: '⚡', color: 'from-blue-500 to-purple-500' },
    { name: 'Emma Thompson', xp: 1950, level: 10, badge: '🥇', color: 'from-green-500 to-emerald-500' },
    { name: 'David Park', xp: 1800, level: 10, badge: '🥈', color: 'from-slate-500 to-slate-600' },
  ]

  const discussions = [
    {
      title: 'Best strategy for mastering Quick Sort?',
      author: 'John Doe',
      replies: 24,
      likes: 45,
      time: '2 hours ago',
      category: 'Algorithms'
    },
    {
      title: 'How I reached 2000 XP in 3 weeks',
      author: 'Emma Thompson',
      replies: 67,
      likes: 132,
      time: '5 hours ago',
      category: 'Success Stories'
    },
    {
      title: 'Merge Sort vs Quick Sort - Real world use cases',
      author: 'Prof. James Liu',
      replies: 38,
      likes: 89,
      time: '1 day ago',
      category: 'Discussion'
    },
    {
      title: 'Tips for maintaining your learning streak',
      author: 'Sarah Kim',
      replies: 52,
      likes: 98,
      time: '2 days ago',
      category: 'Tips & Tricks'
    },
    {
      title: 'Understanding time complexity intuitively',
      author: 'Alex Chen',
      replies: 41,
      likes: 76,
      time: '3 days ago',
      category: 'Learning'
    }
  ]

  const events = [
    {
      title: 'Weekly Algorithm Challenge',
      description: 'Solve this week\'s sorting problem and compete for bonus XP',
      date: 'Every Monday',
      participants: 234,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Live Q&A with Sort-crates',
      description: 'Ask anything about algorithms and learning strategies',
      date: 'Every Friday 5PM',
      participants: 156,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Monthly Leaderboard Reset',
      description: 'New month, new chances to top the leaderboard',
      date: '1st of every month',
      participants: 489,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-[#0f1629]/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="container px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
            Community
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Learn Together, Grow Together
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of learners mastering sorting algorithms through collaboration and shared knowledge
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <Card className="bg-[#0f1629] border-slate-800/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">12,450</div>
              <div className="text-slate-400">Active Learners</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f1629] border-slate-800/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">3,892</div>
              <div className="text-slate-400">Discussions</div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f1629] border-slate-800/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-slate-400">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Top Learners */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0f1629] border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Learners
                </CardTitle>
                <CardDescription className="text-slate-400">
                  This month's leaderboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLearners.map((learner, index) => (
                    <div key={learner.name} className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-slate-600 w-6">
                        {index + 1}
                      </div>
                      <Avatar className={`h-10 w-10 bg-gradient-to-br ${learner.color}`}>
                        <AvatarFallback className="text-white font-semibold">
                          {learner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{learner.name}</div>
                        <div className="text-xs text-slate-500">Level {learner.level} • {learner.xp} XP</div>
                      </div>
                      <div className="text-xl">{learner.badge}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Discussions */}
          <div className="lg:col-span-2">
            <Card className="bg-[#0f1629] border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Recent Discussions
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Join the conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.title} className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                              {discussion.category}
                            </Badge>
                            <span className="text-xs text-slate-500">{discussion.time}</span>
                          </div>
                          <h4 className="text-white font-medium mb-1">{discussion.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>by {discussion.author}</span>
                            <span>💬 {discussion.replies} replies</span>
                            <span>❤️ {discussion.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-800">
                  View All Discussions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="container px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <Card key={event.title} className="bg-[#0f1629] border-slate-800/50 hover:border-slate-700/50 transition-all">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${event.color} mb-4`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{event.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{event.date}</span>
                    <span className="text-slate-400">{event.participants} joined</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Connect */}
      <div className="container px-4 pb-16">
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Connect With Us
            </h3>
            <p className="text-green-100 mb-6">
              Follow us on social media and stay connected with the community
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
