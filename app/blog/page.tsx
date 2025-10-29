'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const router = useRouter()

  const posts = [
    {
      title: 'Why Socratic Learning Works Better Than Traditional Tutorials',
      excerpt: 'Discover how asking questions instead of giving answers leads to deeper understanding and better retention of sorting algorithms.',
      author: 'Dr. Sarah Chen',
      date: 'Oct 25, 2025',
      readTime: '5 min read',
      category: 'Learning Science',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Mastering Quick Sort: A Step-by-Step Journey',
      excerpt: 'Follow along as we break down Quick Sort through Socratic dialogue, exploring partitioning, pivot selection, and time complexity.',
      author: 'Michael Rodriguez',
      date: 'Oct 22, 2025',
      readTime: '8 min read',
      category: 'Algorithms',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      title: 'From Zero to Hero: One Student\'s Journey to 2000 XP',
      excerpt: 'How Emma went from struggling with Bubble Sort to mastering all six algorithms in just 3 weeks using Socratic Sort.',
      author: 'Emma Thompson',
      date: 'Oct 20, 2025',
      readTime: '6 min read',
      category: 'Success Story',
      color: 'bg-green-500/10 text-green-400 border-green-500/20'
    },
    {
      title: 'The Science Behind Our AI Tutor',
      excerpt: 'A deep dive into how we use Google Gemini 2.5 and LangChain to create adaptive, personalized learning experiences.',
      author: 'Dev Team',
      date: 'Oct 18, 2025',
      readTime: '10 min read',
      category: 'Technology',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    {
      title: 'Merge Sort vs Quick Sort: When to Use Which',
      excerpt: 'Understanding the trade-offs between stability, space complexity, and performance in real-world scenarios.',
      author: 'Prof. James Liu',
      date: 'Oct 15, 2025',
      readTime: '7 min read',
      category: 'Algorithms',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      title: 'Building Mastery: The 50% Rule',
      excerpt: 'Why we unlock practice problems at 50% mastery and how progressive learning leads to better outcomes.',
      author: 'Dr. Sarah Chen',
      date: 'Oct 12, 2025',
      readTime: '5 min read',
      category: 'Learning Science',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Visualizing Algorithms: The Power of D3.js',
      excerpt: 'How real-time visualizations synchronized with AI dialogue create an immersive learning experience.',
      author: 'Alex Kim',
      date: 'Oct 10, 2025',
      readTime: '6 min read',
      category: 'Technology',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    {
      title: 'Interview Success: How Sorting Algorithms Helped Me Land FAANG',
      excerpt: 'Real interview questions and how understanding sorting fundamentals gave me the edge in technical interviews.',
      author: 'David Park',
      date: 'Oct 8, 2025',
      readTime: '9 min read',
      category: 'Success Story',
      color: 'bg-green-500/10 text-green-400 border-green-500/20'
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
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
            Blog
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Insights & Stories
          </h1>
          <p className="text-xl text-slate-400">
            Learn from experts, discover success stories, and explore the science behind Socratic learning
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {posts.map((post) => (
            <Card key={post.title} className="bg-[#0f1629] border-slate-800/50 hover:border-slate-700/50 transition-all group cursor-pointer">
              <CardHeader>
                <Badge className={`w-fit mb-3 ${post.color}`}>
                  {post.category}
                </Badge>
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-slate-400 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-blue-400 hover:text-blue-300 p-0 h-auto"
                >
                  Read more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="container px-4 pb-16">
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-purple-100 mb-6">
              Get the latest articles, learning tips, and algorithm insights delivered to your inbox
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
