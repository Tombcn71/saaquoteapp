'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Scissors, Loader2, Sparkles, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface HairSalonWidgetProps {
  widgetId?: string
  companyId?: string
  companyName?: string
  primaryColor?: string
}

export function HairSalonWidget({ 
  widgetId, 
  companyId, 
  companyName,
  primaryColor = '#8b5cf6' 
}: HairSalonWidgetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('Pixie Cut')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTransform = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Start the prediction
      const response = await fetch('/api/replicate/haircut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: prompt
        }),
      })

      const data = await response.json()

      if (!data.success || !data.predictionId) {
        setError(data.error || 'Failed to start transformation')
        setLoading(false)
        return
      }

      // Poll for result
      const predictionId = data.predictionId
      console.log('Polling for prediction:', predictionId)

      let attempts = 0
      const maxAttempts = 60 // 60 * 2 seconds = 2 minutes max

      const pollStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/replicate/status/${predictionId}`)
          const statusData = await statusResponse.json()

          console.log('Status:', statusData.status)

          if (statusData.status === 'succeeded' && statusData.output) {
            setResult(statusData.output)
            setLoading(false)
            return
          }

          if (statusData.status === 'failed') {
            setError(statusData.error || 'Generation failed')
            setLoading(false)
            return
          }

          // Still processing, poll again
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(pollStatus, 2000) // Poll every 2 seconds
          } else {
            setError('Timeout - please try again')
            setLoading(false)
          }
        } catch (err) {
          console.error('Polling error:', err)
          setError('Failed to check status')
          setLoading(false)
        }
      }

      // Start polling
      setTimeout(pollStatus, 2000)

    } catch (err: any) {
      console.error('Transform error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    if (!name || !email) {
      setError('Please fill in your name and email')
      return
    }

    try {
      // Save lead to database
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId: widgetId,
          companyId: companyId,
          name,
          email,
          phone,
          formType: 'hair-salon',
          formData: {
            hairstyleRequest: prompt,
            originalImage: selectedImage ? 'uploaded' : null,
            transformedImage: result ? 'generated' : null
          }
        }),
      })

      if (response.ok) {
        setLeadSubmitted(true)
      } else {
        setError('Failed to submit. Please try again.')
      }
    } catch (err) {
      console.error('Lead submission error:', err)
      setError('Failed to submit. Please try again.')
    }
  }

  if (leadSubmitted) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/50">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
          <p className="text-gray-300 mb-2">
            We've received your appointment request.
          </p>
          <p className="text-gray-400 text-sm">
            {companyName || 'The salon'} will contact you shortly to confirm your appointment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/50"
      style={{ '--primary-color': primaryColor } as any}
    >
      <CardHeader>
        <div className="text-center mb-4">
          {companyName && (
            <h2 className="text-3xl font-bold text-white mb-2">{companyName}</h2>
          )}
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <Scissors className="w-6 h-6 text-purple-400" />
            Try Your New Hairstyle
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            See yourself with a new look before booking your appointment
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Hairstyle Selection - ALWAYS VISIBLE */}
        <div className="space-y-2">
          <Label htmlFor="hairstyle" className="text-white">Choose your desired hairstyle</Label>
          <Select value={prompt} onValueChange={setPrompt}>
            <SelectTrigger className="bg-slate-950/50 border-purple-500/20 text-white">
              <SelectValue placeholder="Select a hairstyle" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/20 text-white">
              <SelectItem value="Pixie Cut">Pixie Cut</SelectItem>
              <SelectItem value="Bob">Bob</SelectItem>
              <SelectItem value="Lob">Lob (Long Bob)</SelectItem>
              <SelectItem value="Layered">Layered</SelectItem>
              <SelectItem value="Shag">Shag</SelectItem>
              <SelectItem value="Wavy">Wavy</SelectItem>
              <SelectItem value="Curly">Curly</SelectItem>
              <SelectItem value="Straight">Straight</SelectItem>
              <SelectItem value="Undercut">Undercut</SelectItem>
              <SelectItem value="Mohawk">Mohawk</SelectItem>
              <SelectItem value="Crew Cut">Crew Cut</SelectItem>
              <SelectItem value="Slicked Back">Slicked Back</SelectItem>
              <SelectItem value="Side-Parted">Side-Parted</SelectItem>
              <SelectItem value="Messy Bun">Messy Bun</SelectItem>
              <SelectItem value="High Ponytail">High Ponytail</SelectItem>
              <SelectItem value="French Braid">French Braid</SelectItem>
              <SelectItem value="Dreadlocks">Dreadlocks</SelectItem>
              <SelectItem value="Cornrows">Cornrows</SelectItem>
              <SelectItem value="Box Braids">Box Braids</SelectItem>
              <SelectItem value="Updo">Updo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Section */}
        {!selectedImage ? (
          <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-12 text-center hover:border-purple-500/50 transition-colors">
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Upload your photo</p>
                  <p className="text-gray-400 text-sm">PNG or JPG up to 10MB</p>
                </div>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <>
            {/* Image Preview Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm">Your Photo</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950/50 border border-purple-500/20">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Result */}
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm">AI Preview</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950/50 border border-purple-500/20">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm">Creating preview...</p>
                        <p className="text-gray-500 text-xs mt-2">This takes 30-60 seconds</p>
                      </div>
                    </div>
                  ) : result ? (
                    <img
                      src={result}
                      alt="AI Result"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-sm">Click "Generate Preview"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            {!result && (
              <Button
                onClick={handleTransform}
                disabled={loading || !selectedImage}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Preview
                  </>
                )}
              </Button>
            )}

            {/* Share & Download buttons */}
            {result && (
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = result
                    a.download = 'my-new-hairstyle.jpg'
                    a.click()
                  }}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  Download Photo
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'My New Hairstyle!',
                        text: 'Check out my new hairstyle preview!',
                        url: result
                      })
                    } else {
                      // Fallback: WhatsApp direct
                      window.open(`https://wa.me/?text=${encodeURIComponent('Check out my new hairstyle! ' + result)}`, '_blank')
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Share on WhatsApp
                </Button>
              </div>
            )}

            {/* Booking Form - Only show after result */}
            {result && (
              <div className="border-t border-purple-500/20 pt-6 space-y-4 mt-6">
                <h3 className="text-xl font-bold text-white">Love this look? Book your appointment!</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-white">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+31 6 12345678"
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 text-lg"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <Button
              onClick={() => {
                setSelectedImage(null)
                setResult(null)
                setError(null)
                setName('')
                setEmail('')
                setPhone('')
              }}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              Try Another Photo
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

