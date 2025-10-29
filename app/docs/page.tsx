'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Code2, Lightbulb, Zap, Users, MessageSquare } from 'lucide-react'

export default function DocumentationPage() {
  const router = useRouter()

  const sections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of Socratic Sort and start your learning journey',
      topics: [
        'What is Socratic Learning?',
        'How to use the platform',
        'Understanding the AI tutor',
        'Navigating the interface'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Code2,
      title: 'Sorting Algorithms',
      description: 'Deep dive into each sorting algorithm with examples',
      topics: [
        'Bubble Sort - O(n²)',
        'Selection Sort - O(n²)',
        'Insertion Sort - O(n²)',
        'Merge Sort - O(n log n)',
        'Quick Sort - O(n log n)',
        'Heap Sort - O(n log n)'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: 'Learning Strategies',
      description: 'Tips and techniques to maximize your learning',
      topics: [
        'How to answer Socratic questions',
        'Understanding visualizations',
        'Using hints effectively',
        'Building mastery progressively'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Gamification Guide',
      description: 'Master the XP, badges, and progression system',
      topics: [
        'Earning XP and leveling up',
        'Unlocking badges',
        'Maintaining streaks',
        'Climbing the leaderboard'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const faqs = [
    {
      question: 'How does the AI tutor work?',
      answer: 'Our AI tutor uses Google Gemini 2.5 to engage you in Socratic dialogue, asking questions that guide you to discover concepts yourself rather than just telling you the answers.'
    },
    {
      question: 'Why does my chat history reset on login?',
      answer: 'Each session starts fresh to ensure focused learning. However, your progress (XP, mastery, badges) is always preserved.'
    },
    {
      question: 'How is mastery calculated?',
      answer: 'Mastery is calculated based on the correctness and depth of your answers. It ranges from 0-100% for each algorithm.'
    },
    {
      question: 'When do I unlock LeetCode questions?',
      answer: 'LeetCode practice problems are available immediately for all algorithms. Click the orange button next to Shuffle to access them.'
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
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            Documentation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Master Sorting Algorithms
          </h1>
          <p className="text-xl text-slate-400">
            Everything you need to know about learning through Socratic dialogue and interactive visualizations
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="container px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="bg-[#0f1629] border-slate-800/50 hover:border-slate-700/50 transition-all">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${section.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-slate-600 mt-1">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="container px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="bg-[#0f1629] border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container px-4 pb-16">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-blue-100 mb-6">
              Jump into the platform and start your journey with Socratic learning
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Launch App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
