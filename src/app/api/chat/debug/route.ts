import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function GET(request: NextRequest) {
  try {
    // Return debug information
    return NextResponse.json({
      sdkVersion: require('@anthropic-ai/sdk/package.json').version,
      availableModels: [
        'claude-3-5-sonnet-20241022',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-sonnet-4-20250514' // Beta model
      ],
      message: 'SDK loaded successfully'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to load SDK',
      details: error.message
    })
  }
}