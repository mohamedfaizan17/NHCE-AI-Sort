'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, XCircle, Sparkles, Trophy, Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the time complexity of Bubble Sort in the worst case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    category: "basic"
  },
  {
    id: 2,
    question: "Which sorting algorithm works by repeatedly finding the minimum element?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"],
    correctAnswer: 1,
    category: "basic"
  },
  {
    id: 3,
    question: "What is the best-case time complexity of Insertion Sort?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
    correctAnswer: 2,
    category: "basic"
  },
  {
    id: 4,
    question: "Which sorting algorithm uses the divide-and-conquer strategy?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: 2,
    category: "intermediate"
  },
  {
    id: 5,
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    category: "intermediate"
  },
  {
    id: 6,
    question: "Which sorting algorithm is NOT stable?",
    options: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"],
    correctAnswer: 2,
    category: "intermediate"
  },
  {
    id: 7,
    question: "In Quick Sort, what is the purpose of the pivot element?",
    options: ["To find the minimum", "To partition the array", "To merge subarrays", "To swap elements"],
    correctAnswer: 1,
    category: "intermediate"
  },
  {
    id: 8,
    question: "What data structure does Heap Sort use?",
    options: ["Stack", "Queue", "Binary Heap", "Linked List"],
    correctAnswer: 2,
    category: "advanced"
  },
  {
    id: 9,
    question: "Which algorithm has the best average-case time complexity?",
    options: ["Bubble Sort O(n²)", "Quick Sort O(n log n)", "Selection Sort O(n²)", "Insertion Sort O(n²)"],
    correctAnswer: 1,
    category: "advanced"
  },
  {
    id: 10,
    question: "What makes an algorithm 'stable'?",
    options: ["It uses less memory", "It preserves relative order of equal elements", "It runs faster", "It uses recursion"],
    correctAnswer: 1,
    category: "advanced"
  },
  {
    id: 11,
    question: "Which sorting algorithm is best for nearly sorted data?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2,
    category: "basic"
  },
  {
    id: 12,
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    category: "advanced"
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'evaluating' | 'results'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<typeof QUIZ_QUESTIONS>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    const user = auth.currentUser
    if (!user) {
      router.replace('/auth')
    }

    // Select 8 random questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random())
    setSelectedQuestions(shuffled.slice(0, 8))
  }, [router])

  const handleStartQuiz = () => {
    setCurrentStep('quiz')
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer')
      return
    }

    setAnswers([...answers, selectedAnswer])
    setSelectedAnswer(null)

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmitQuiz([...answers, selectedAnswer])
    }
  }

  const handleSubmitQuiz = async (finalAnswers: number[]) => {
    setCurrentStep('evaluating')
    setIsSubmitting(true)

    try {
      const user = auth.currentUser
      if (!user) throw new Error('Not authenticated')

      // Call backend to evaluate with Gemini
      const response = await fetch('/api/onboarding/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          questions: selectedQuestions.map((q, i) => ({
            question: q.question,
            answer: q.options[finalAnswers[i]],
            correctAnswer: q.options[q.correctAnswer],
            isCorrect: finalAnswers[i] === q.correctAnswer,
            category: q.category,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Evaluation error:', errorData)
        throw new Error(errorData.error || 'Evaluation failed')
      }

      const result = await response.json()
      
      // Save to Firestore
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        skillLevel: result.skillLevel,
        quizScore: result.score,
        quizResults: {
          questions: selectedQuestions.map((q, i) => ({
            question: q.question,
            selectedAnswer: q.options[finalAnswers[i]],
            correctAnswer: q.options[q.correctAnswer],
            isCorrect: finalAnswers[i] === q.correctAnswer,
            category: q.category,
          })),
          evaluation: result,
          completedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      }, { merge: true })
      
      setEvaluationResult(result)
      setCurrentStep('results')

      toast.success('Quiz evaluated!', {
        description: `You've been assessed as ${result.skillLevel}`,
      })
    } catch (error: any) {
      console.error('Quiz submission error:', error)
      toast.error('Failed to evaluate quiz', {
        description: error.message || 'Please check console for details',
      })
      setCurrentStep('quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    router.replace('/')
  }

  if (currentStep === 'intro') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Welcome to Sort-crates!</CardTitle>
              <CardDescription className="text-base mt-2">
                Let's assess your current knowledge to personalize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Answer 8 multiple-choice questions about sorting algorithms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Evaluation</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI will assess your understanding level
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Personalized Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Get access to features based on your skill level
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">What to expect:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Basic:</strong> Access to Bubble, Selection, and Insertion Sort</li>
                  <li>• <strong>Intermediate:</strong> + Merge and Quick Sort</li>
                  <li>• <strong>Advanced:</strong> Full access to all algorithms including Heap Sort</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Don't worry! You can unlock more algorithms by achieving 100% mastery in any algorithm.
                </p>
              </div>

              <Button onClick={handleStartQuiz} className="w-full" size="lg">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (currentStep === 'quiz') {
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">
                  Question {currentQuestionIndex + 1} of {selectedQuestions.length}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-lg font-medium">
                      {selectedQuestions[currentQuestionIndex]?.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select your answer:</label>
                    <div className="space-y-2">
                      {selectedQuestions[currentQuestionIndex]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedAnswer === index
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                              selectedAnswer === index
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted-foreground/30'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    className="w-full"
                    size="lg"
                    disabled={selectedAnswer === null}
                  >
                    {currentQuestionIndex < selectedQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (currentStep === 'evaluating') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-xl">
            <CardContent className="py-12 text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Evaluating Your Answers...</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your responses to determine your skill level
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (currentStep === 'results' && evaluationResult) {
    const skillLevelConfig = {
      basic: {
        color: 'green',
        icon: CheckCircle2,
        title: 'Basic Level',
        description: 'You have a foundational understanding of sorting algorithms',
        unlocked: ['Bubble Sort', 'Selection Sort', 'Insertion Sort'],
        locked: ['Merge Sort', 'Quick Sort', 'Heap Sort'],
      },
      intermediate: {
        color: 'blue',
        icon: Trophy,
        title: 'Intermediate Level',
        description: 'You have a solid grasp of sorting concepts and techniques',
        unlocked: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
        locked: ['Heap Sort'],
      },
      advanced: {
        color: 'purple',
        icon: Sparkles,
        title: 'Advanced Level',
        description: 'You have mastered sorting algorithms! All features unlocked',
        unlocked: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
        locked: [],
      },
    }

    const config = skillLevelConfig[evaluationResult.skillLevel as keyof typeof skillLevelConfig] || skillLevelConfig.basic
    const Icon = config.icon

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-${config.color}-500 to-${config.color}-600`}>
                <Icon className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl">{config.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score */}
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                <p className="text-4xl font-bold">{evaluationResult.score}/{evaluationResult.totalQuestions || 8}</p>
              </div>

              {/* Unlocked Algorithms */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Unlock className="h-5 w-5 text-green-600" />
                  Unlocked Algorithms
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {config.unlocked.map((algo) => (
                    <div key={algo} className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{algo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Algorithms */}
              {config.locked.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    Locked Algorithms
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {config.locked.map((algo) => (
                      <div key={algo} className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>{algo}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Achieve 100% mastery in any algorithm to unlock all features!
                  </p>
                </div>
              )}

              {/* AI Feedback */}
              {evaluationResult.feedback && (
                <div className="bg-blue-500/10 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm">AI Feedback</h4>
                  <p className="text-sm text-muted-foreground">{evaluationResult.feedback}</p>
                </div>
              )}

              <Button onClick={handleContinue} className="w-full" size="lg">
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return null
}
