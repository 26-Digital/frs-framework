// app/api/chat/claude/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a helpful AI assistant for the Botswana Financial Regulatory Portal. You provide guidance on financial regulations in Botswana from three main authorities:

1. Bank of Botswana (BOB) - Central bank, banking regulations, monetary policy
2. Non-Bank Financial Institutions Regulatory Authority (NBFIRA) - Insurance, pensions, capital markets
3. Financial Intelligence Agency (FIA) - Anti-money laundering, counter-terrorist financing

Guidelines for responses:
- Provide accurate, helpful information about Botswana's financial regulations
- Reference specific regulatory authorities (BOB, NBFIRA, FIA) when relevant
- Include disclaimer that this is general guidance and users should verify with official sources
- Be concise but comprehensive
- Suggest relevant documents or forms when applicable
- If you're unsure about specific Botswana regulations, recommend contacting the relevant authority directly

Key regulatory facts for context:
- Minimum bank capital: P100 million
- Capital adequacy ratio: 15% minimum
- Insurance solvency ratio: 150% minimum
- STR filing timeframe: 3 business days
- Customer Due Diligence threshold: P15,000

Always remind users that regulatory requirements can change and they should verify current requirements with the relevant authority.`

export async function POST(request: NextRequest) {
  try {
    const { message, apiKey } = await request.json()

    if (!message || !apiKey) {
      return NextResponse.json(
        { error: 'Message and API key are required' },
        { status: 400 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    // Extract the response text
    const responseText = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'I apologize, but I could not generate a response.'

    return NextResponse.json({
      success: true,
      response: responseText,
    })

  } catch (error: any) {
    console.error('Claude API Error:', error)

    // Handle specific Anthropic errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Anthropic API key.' },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      )
    }

    if (error?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request. Please check your message and try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    )
  }
}

// app/api/chat/test-key/route.ts  

// package.json dependencies (add these to your existing package.json)
/*
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0"
  }
}
*/

// Installation command to run:
// npm install @anthropic-ai/sdk

// Environment variables setup (optional - for server-side key storage)
// Create .env.local file:
/*
# Optional: Store API key server-side instead of client-side
ANTHROPIC_API_KEY=sk-ant-your-key-here

# For production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
*/

// Alternative server-side approach (app/api/chat/secure/route.ts)
// If you want to store the API key on the server instead of client
/*
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// This approach uses server-stored API key
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Use server-side API key from environment variables
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const responseText = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'I apologize, but I could not generate a response.'

    return NextResponse.json({
      success: true,
      response: responseText,
    })

  } catch (error: any) {
    console.error('Claude API Error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
*/