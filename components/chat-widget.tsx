'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Loader2, Upload, X } from 'lucide-react'
import { AppointmentPicker } from '@/components/appointment-picker'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  photoUrl?: string
  showAppointmentPicker?: boolean
  priceInfo?: {
    price: number
    breakdown: any
  }
}

interface ChatWidgetProps {
  companyId?: string
  widgetId?: string
  companyName?: string
}

export function ChatWidget({ companyId, widgetId, companyName = "Demo Bedrijf" }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hoi! Ik ben je persoonlijke assistent voor ${companyName}. Ik help je graag met een offerte voor nieuwe kozijnen!\n\nUpload een foto van je huidige ramen (optioneel) of vertel me direct wat je zoekt!`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const [context, setContext] = useState<any>({})
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handlePhotoUpload = async (file: File) => {
    setSelectedPhoto(file)
    
    // Upload photo
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()
      
      if (uploadData.url) {
        setUploadedPhotoUrl(uploadData.url)
        
        // Add user message with photo
        const userMessage: Message = {
          role: 'user',
          content: 'Ik heb een foto geüpload',
          timestamp: new Date(),
          photoUrl: uploadData.url
        }
        
        setMessages(prev => [...prev, userMessage])
        
        // Automatically analyze photo
        await sendMessage('Analyseer deze foto', uploadData.url)
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const sendMessage = async (messageText: string = input, photoUrl?: string) => {
    if (!messageText.trim() && !photoUrl) return

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      photoUrl: photoUrl
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          chatHistory: messages,
          context: {
            ...context,
            companyId,
            widgetId,
            photoUrl: photoUrl || uploadedPhotoUrl
          }
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Update context if provided
      if (data.context) {
        setContext(prev => ({ ...prev, ...data.context }))
      }

      // Add bot response
      const botMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        showAppointmentPicker: data.showAppointmentPicker,
        priceInfo: data.priceInfo
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error: any) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, er ging iets mis. Probeer het opnieuw.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppointmentSelected = async (datetime: string) => {
    setContext(prev => ({ ...prev, appointmentDatetime: datetime }))
    
    // Send to bot
    await sendMessage(`Ik kies ${datetime} als afspraak`)
  }

  return (
    <Card className="flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4285f4] to-[#3367d6] text-white p-4 rounded-t-lg">
        <h3 className="font-bold text-lg">💬 Chat Assistent</h3>
        <p className="text-sm text-blue-100">{companyName}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#4285f4] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.photoUrl && (
                <img
                  src={message.photoUrl}
                  alt="Uploaded"
                  className="w-full rounded mb-2 max-h-48 object-cover"
                />
              )}
              
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.priceInfo && (
                <div className="mt-3 p-3 bg-white rounded border-2 border-green-500">
                  <p className="font-bold text-green-600 text-xl">
                    €{message.priceInfo.price.toLocaleString('nl-NL')}
                  </p>
                  <p className="text-xs text-gray-600">Indicatie excl. BTW</p>
                </div>
              )}
              
              {message.showAppointmentPicker && (
                <div className="mt-3">
                  <AppointmentPicker
                    onAppointmentSelected={handleAppointmentSelected}
                    customerName="Klant"
                  />
                </div>
              )}
              
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {selectedPhoto && (
          <div className="mb-2 flex items-center gap-2 bg-blue-50 p-2 rounded">
            <Upload className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900 flex-1">{selectedPhoto.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPhoto(null)
                setUploadedPhotoUrl(null)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handlePhotoUpload(file)
            }}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type je bericht..."
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || (!input.trim() && !uploadedPhotoUrl)}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

