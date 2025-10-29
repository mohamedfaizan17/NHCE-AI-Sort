'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sparkles, 
  Brain, 
  Trophy, 
  Zap, 
  Target, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Mail,
  Play,
  Pause
} from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  const router = useRouter()
  const [demoArray, setDemoArray] = useState([40, 90, 10, 80, 70])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightIndices, setHighlightIndices] = useState<number[]>([])
  const [demoText, setDemoText] = useState("Great! Now, in your array [40, 90, 10, 80, 70], what happens when we compare 40 and 90?")

  const handleGetStarted = async () => {
    console.log('Navigating to /auth...')
    // Sign out first to ensure clean auth flow
    try {
      const { signOut } = await import('firebase/auth')
      const { auth } = await import('@/lib/firebase')
      await signOut(auth)
      console.log('Signed out successfully')
    } catch (error) {
      console.log('No active session or sign out error:', error)
    }
    window.location.href = '/auth'
  }

  const runDemo = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const arr = [40, 90, 10, 80, 70]
    setDemoArray([...arr])
    
    // Simulate bubble sort animation
    const steps = [
      { text: "Let's start! What are the first two elements?", indices: [0, 1], array: [40, 90, 10, 80, 70] },
      { text: "40 < 90, so no swap needed. Moving to next pair...", indices: [1, 2], array: [40, 90, 10, 80, 70] },
      { text: "90 > 10! We need to swap them.", indices: [1, 2], array: [40, 10, 90, 80, 70] },
      { text: "Great! Now comparing 90 and 80...", indices: [2, 3], array: [40, 10, 90, 80, 70] },
      { text: "90 > 80, swap them!", indices: [2, 3], array: [40, 10, 80, 90, 70] },
      { text: "Finally, 90 and 70...", indices: [3, 4], array: [40, 10, 80, 90, 70] },
      { text: "90 > 70, swap! First pass complete! 🎉", indices: [3, 4], array: [40, 10, 80, 70, 90] },
      { text: "The largest element (90) is now in place!", indices: [], array: [40, 10, 80, 70, 90] },
    ]
    
    for (const step of steps) {
      setDemoText(step.text)
      setHighlightIndices(step.indices)
      setDemoArray([...step.array])
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    setHighlightIndices([])
    setIsAnimating(false)
    setDemoText("Great! Now, in your array [40, 90, 10, 80, 70], what happens when we compare 40 and 90?")
    setDemoArray([40, 90, 10, 80, 70])
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Sort-crates
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>AI-Powered Socratic Learning</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          >
            Master Sorting Algorithms
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Through Conversation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Learn sorting algorithms the Socratic way with an AI tutor that asks the right questions,
            visualizes your progress, and makes learning fun with gamification.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={runDemo}
              disabled={isAnimating}
            >
              {isAnimating ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Playing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </>
              )}
            </Button>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative rounded-2xl border bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl" />
              <div className="relative grid gap-4 md:grid-cols-2">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">AI Tutor</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={demoText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-muted-foreground"
                      >
                        "{demoText}"
                      </motion.p>
                    </AnimatePresence>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold">Live Visualization</span>
                    </div>
                    <div className="flex gap-2">
                      {demoArray.map((val, i) => (
                        <motion.div
                          key={`${i}-${val}`}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: highlightIndices.includes(i) ? -8 : 0
                          }}
                          transition={{ 
                            layout: { duration: 0.5 },
                            y: { duration: 0.3 }
                          }}
                          className={`flex h-16 flex-1 items-end justify-center rounded transition-all ${
                            highlightIndices.includes(i)
                              ? 'bg-gradient-to-t from-yellow-500 to-orange-500 ring-2 ring-yellow-400 shadow-lg'
                              : 'bg-gradient-to-t from-blue-500 to-purple-500'
                          }`}
                          style={{ height: `${val}px` }}
                        >
                          <span className="text-xs font-semibold text-white pb-1">{val}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold">Why Sort-crates?</h2>
          <p className="text-lg text-muted-foreground">
            The most effective way to truly understand sorting algorithms
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Brain,
              title: 'Socratic Method',
              description: 'Learn through guided questions that help you discover concepts yourself, leading to deeper understanding.',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Target,
              title: 'Interactive Visualizations',
              description: 'See algorithms come to life with real-time visualizations that respond to your learning journey.',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: Trophy,
              title: 'Gamification',
              description: 'Earn XP, unlock badges, and compete on leaderboards while mastering complex algorithms.',
              gradient: 'from-yellow-500 to-orange-500',
            },
            {
              icon: Zap,
              title: 'Adaptive Learning',
              description: 'AI adjusts difficulty based on your mastery level, ensuring optimal challenge and growth.',
              gradient: 'from-green-500 to-emerald-500',
            },
            {
              icon: Users,
              title: 'Community Driven',
              description: 'Join thousands of learners, share insights, and grow together in our vibrant community.',
              gradient: 'from-red-500 to-rose-500',
            },
            {
              icon: CheckCircle2,
              title: 'Progress Tracking',
              description: 'Monitor your mastery across all algorithms with detailed analytics and personalized feedback.',
              gradient: 'from-indigo-500 to-blue-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-2 transition-all hover:shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold">Master All Major Algorithms</h2>
          <p className="text-lg text-muted-foreground">
            From beginner-friendly to advanced sorting techniques
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Bubble Sort', difficulty: 'Beginner', color: 'blue' },
            { name: 'Selection Sort', difficulty: 'Beginner', color: 'green' },
            { name: 'Insertion Sort', difficulty: 'Beginner', color: 'orange' },
            { name: 'Merge Sort', difficulty: 'Intermediate', color: 'purple' },
            { name: 'Quick Sort', difficulty: 'Intermediate', color: 'red' },
            { name: 'Heap Sort', difficulty: 'Advanced', color: 'yellow' },
          ].map((algo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{algo.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium bg-${algo.color}-500/20 text-${algo.color}-700 dark:text-${algo.color}-300`}>
                      {algo.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-4xl font-bold">Ready to Master Sorting?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of learners who are transforming the way they understand algorithms
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">Sort-crates</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Master sorting algorithms through AI-powered Socratic learning.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Algorithms</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/auth" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Connect</h3>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="mailto:hello@sortcrates.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Sort-crates. Built with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
