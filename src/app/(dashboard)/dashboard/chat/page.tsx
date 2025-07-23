'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw, 
  FileText, 
  Building, 
  Shield, 
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Settings,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

// Types
interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isError?: boolean
}

interface SuggestedQuestion {
  id: string
  question: string
  category: string
  icon: any
}

// Suggested questions for the regulatory portal
const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: '1',
    question: 'What are the minimum capital requirements for starting a bank in Botswana?',
    category: 'Banking',
    icon: Building
  },
  {
    id: '2',
    question: 'How do I file a suspicious transaction report with FIA?',
    category: 'AML/CFT',
    icon: Shield
  },
  {
    id: '3',
    question: 'What documents do I need for insurance company licensing?',
    category: 'Insurance',
    icon: FileText
  },
  {
    id: '4',
    question: 'What are the customer due diligence requirements in Botswana?',
    category: 'AML/CFT',
    icon: Shield
  },
  {
    id: '5',
    question: 'How often should banks report their capital adequacy ratios?',
    category: 'Banking',
    icon: Building
  },
  {
    id: '6',
    question: 'What is the solvency ratio requirement for insurance companies?',
    category: 'Insurance',
    icon: FileText
  }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(true)
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  // Initialize with welcome message when API key is valid
  useEffect(() => {
    if (isApiKeyValid && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: `Welcome to the Financial Regulatory Portal AI Assistant! 🏛️

I'm here to help you with questions about Botswana's financial regulations from:
• **Bank of Botswana (BOB)** - Banking regulations and monetary policy
• **NBFIRA** - Insurance, pensions, and capital markets
• **Financial Intelligence Agency (FIA)** - AML/CFT compliance

You can ask me about:
- Licensing requirements and procedures
- Capital and solvency requirements
- Compliance obligations and reporting
- Document requirements and forms
- General regulatory guidance

**Important:** This is general guidance only. Always verify current requirements with the relevant regulatory authority.

How can I help you today?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isApiKeyValid, messages.length])

  // Test API key validity
  const testApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/chat/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key })
      })
      
      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('API key test failed:', error)
      return false
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) return
    
    setIsLoading(true)
    const isValid = await testApiKey(apiKey)
    
    if (isValid) {
      setIsApiKeyValid(true)
      setShowApiKeyInput(false)
      // Store API key securely (in production, consider more secure storage)
      localStorage.setItem('anthropic_api_key', apiKey)
    } else {
      alert('Invalid API key. Please check your key and try again.')
    }
    setIsLoading(false)
  }

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('anthropic_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      testApiKey(storedKey).then(isValid => {
        if (isValid) {
          setIsApiKeyValid(true)
          setShowApiKeyInput(false)
        }
      })
    }
  }, [])

  const callClaudeAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          apiKey: apiKey
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Claude API Error:', error)
      throw error
    }
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend || !isApiKeyValid) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const assistantResponse = await callClaudeAPI(textToSend)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}

You can still get help by:
- Browsing our FAQ section
- Contacting the relevant regulatory authority directly
- Checking the document library for official guidance

Please try again in a moment, or contact support if the issue persists.`,
        timestamp: new Date(),
        isError: true
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    // Re-add welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: `Chat cleared! I'm ready to help you with questions about Botswana's financial regulations.

Feel free to ask about banking, insurance, AML/CFT compliance, or any other regulatory topics. How can I assist you?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• (.*?)(?=\n|$)/g, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
      .join('')
  }

  const resetApiKey = () => {
    setApiKey('')
    setIsApiKeyValid(false)
    setShowApiKeyInput(true)
    setMessages([])
    localStorage.removeItem('anthropic_api_key')
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">AI Regulatory Assistant</h1>
        </div>
        <p className="text-gray-600">
          Get instant answers about Botswana's financial regulations powered by Claude AI
        </p>
      </div>

      {/* API Key Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle className="text-lg">Configuration</CardTitle>
              {isApiKeyValid && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {isApiKeyValid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetApiKey}
                  className="text-red-600 hover:text-red-700"
                >
                  Reset Key
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              >
                {showApiKeyInput ? 'Hide' : 'Setup'}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showApiKeyInput && (
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Setup Required:</strong> You need an Anthropic API key to use this chat. 
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    Get your API key here <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Anthropic API key (sk-ant-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
                />
                <Button
                  onClick={saveApiKey}
                  disabled={!apiKey || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your API key is stored securely and used only for your chat sessions.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isApiKeyValid ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-sm text-gray-600">
            {isApiKeyValid ? 'Ready to chat with Claude' : 'API key required'}
          </span>
        </div>
        {isApiKeyValid && (
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Container */}
      {isApiKeyValid ? (
        <Card className="mb-6">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className={`bg-blue-100 p-2 rounded-full flex-shrink-0 ${message.isError ? 'bg-red-100' : ''}`}>
                      <Bot className={`h-5 w-5 ${message.isError ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : message.isError
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <div className={`text-xs mt-2 opacity-70 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Claude is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about Botswana's financial regulations..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[40px] max-h-32 resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">API Key Required</h3>
            <p className="text-gray-600 mb-4">
              Please configure your Anthropic API key above to start chatting with Claude.
            </p>
            <Button onClick={() => setShowApiKeyInput(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Setup API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <CardTitle className="text-lg">Suggested Questions</CardTitle>
          </div>
          <CardDescription>
            Click on any question to get started with common regulatory topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((suggestion) => {
              const Icon = suggestion.icon
              return (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  className="h-auto text-left justify-start p-4"
                  onClick={() => sendMessage(suggestion.question)}
                  disabled={isLoading || !isApiKeyValid}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm mb-1">{suggestion.question}</div>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Disclaimer:</strong> This AI assistant provides general guidance only. 
          Regulatory requirements can change, and this information should not be considered official legal advice. 
          Always verify current requirements with the relevant regulatory authority (BOB, NBFIRA, or FIA) 
          and consult qualified professionals for specific compliance matters.
        </AlertDescription>
      </Alert>
    </div>
  )
}