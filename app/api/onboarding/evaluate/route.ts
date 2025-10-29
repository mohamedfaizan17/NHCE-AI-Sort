import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firebaseUid, questions } = body

    console.log('📥 Received request:', { firebaseUid, questionCount: questions?.length })

    if (!firebaseUid || !questions || !Array.isArray(questions)) {
      console.error('❌ Missing fields:', { firebaseUid: !!firebaseUid, questions: !!questions, isArray: Array.isArray(questions) })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call Python backend for Gemini evaluation
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8001'
    
    console.log('🎓 Evaluating quiz with Gemini...')
    console.log('📤 Sending to backend:', `${pythonBackendUrl}/api/v1/evaluate-quiz`)
    console.log('📋 Questions:', JSON.stringify(questions, null, 2))
    
    const evaluationResponse = await fetch(`${pythonBackendUrl}/api/v1/evaluate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions }),
    })

    if (!evaluationResponse.ok) {
      const errorText = await evaluationResponse.text()
      console.error('❌ Backend evaluation failed:', errorText)
      throw new Error(`Gemini evaluation failed: ${errorText}`)
    }

    const evaluation = await evaluationResponse.json()
    console.log('✅ Evaluation complete:', evaluation)

    // Return evaluation result - Firestore saving will be done client-side
    return NextResponse.json({
      ...evaluation,
      firebaseUid,
    })
  } catch (error: any) {
    console.error('❌ Error evaluating quiz:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
