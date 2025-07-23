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

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Try Claude Sonnet 4 if available
    try {
      const testResponse = await anthropic.beta.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hello" }],
        betas: ["beta-feature-name"] // Replace with actual beta feature name if needed
      })

      return NextResponse.json({
        success: true,
        message: 'API key is valid (Claude Sonnet 4)',
        model: 'claude-sonnet-4-20250514'
      })
    } catch (betaError) {
      // Fall back to regular Claude 3.5 Sonnet
      const testResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
      })

      return NextResponse.json({
        success: true,
        message: 'API key is valid (Claude 3.5 Sonnet)',
        model: 'claude-3-5-sonnet-20241022'
      })
    }

  } catch (error: any) {
    console.error('API key test error:', error)

    return NextResponse.json({
      success: false,
      error: `Failed to validate API key: ${error?.message || 'Unknown error'}`,
    })
  }
}