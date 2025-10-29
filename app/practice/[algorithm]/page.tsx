'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Code2 } from 'lucide-react'
import { SORTING_QUESTIONS } from '@/lib/leetcode-questions'
import { ALGORITHMS } from '@/lib/utils'

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const algorithm = params.algorithm as string

  const questions = SORTING_QUESTIONS[algorithm] || []
  const algoInfo = ALGORITHMS.find(a => a.id === algorithm)

  if (!algoInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Algorithm not found</p>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'Hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Code2 className="h-8 w-8" />
              {algoInfo.name} Practice Problems
            </h1>
            <p className="text-muted-foreground mt-2">
              Master {algoInfo.name} by solving these curated coding problems from LeetCode, GeeksforGeeks, and HackerRank.
            </p>
          </div>

          {/* Questions Grid */}
          <div className="grid gap-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Problem {index + 1}
                        </span>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {question.difficultyScore}/10
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{question.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {question.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {question.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {/* LeetCode Link */}
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a href={question.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Solve on LeetCode
                      </a>
                    </Button>

                    {/* GeeksforGeeks Link */}
                    {question.geeksforgeeksUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a href={question.geeksforgeeksUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          GeeksforGeeks
                        </a>
                      </Button>
                    )}

                    {/* HackerRank Link */}
                    {question.hackerrankUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a href={question.hackerrankUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          HackerRank
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {questions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No practice problems available for this algorithm yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
