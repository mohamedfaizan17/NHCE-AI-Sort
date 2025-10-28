import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voice = 'Puck' } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Call Gemini TTS API (using text-to-speech model)
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: `en-US-Neural2-${voice === 'Puck' ? 'D' : 'A'}`,
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini TTS Error:', errorText)
      return NextResponse.json(
        { error: 'TTS generation failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract audio content from response
    const audioContent = data.audioContent

    if (!audioContent) {
      return NextResponse.json(
        { error: 'No audio content in response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ audioContent })
  } catch (error) {
    console.error('Error generating TTS:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
