import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key format. Should start with sk-ant-',
      })
    }

    // Initialize Anthropic client with the provided key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Test the API key with a simple request
    const testResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Updated model name
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    })

    // If we get here, the API key is valid
    return NextResponse.json({
      success: true,
      message: 'API key is valid',
    })

  } catch (error: any) {
    console.error('API key test error:', error)

    // More detailed error logging
    console.error('Error details:', {
      status: error?.status,
      message: error?.message,
      type: error?.type,
      error: error?.error
    })

    // Handle authentication errors
    if (error?.status === 401) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key - authentication failed',
      })
    }

    // Handle rate limiting
    if (error?.status === 429) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded - please try again later',
      })
    }

    // Handle other specific errors
    if (error?.status === 400) {
      return NextResponse.json({
        success: false,
        error: 'Bad request - please check your API key',
      })
    }

    // Generic error handling
    return NextResponse.json({
      success: false,
      error: `Failed to validate API key: ${error?.message || 'Unknown error'}`,
    })
  }
}
