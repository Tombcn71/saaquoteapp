'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, Scissors, Loader2, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function HairSalonDemo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('modern professional short haircut')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

      if (data.success && data.output) {
        // Replicate returns an array of URLs
        const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output
        setResult(imageUrl)
      } else {
        setError(data.error || 'Failed to transform image')
      }
    } catch (err: any) {
      console.error('Transform error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NanoBanana
              </span>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 text-pink-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scissors className="w-4 h-4" />
              Hair Salon Demo
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Try This Hairstyle - AI Preview
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Upload a photo and see yourself with a new hairstyle instantly. 
              Powered by AI, running completely on-device for maximum privacy.
            </p>
          </div>

          {/* Main Demo Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/50 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">AI Haircut Preview</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your photo and describe your desired hairstyle
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Upload Section */}
              {!selectedImage ? (
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-12 text-center hover:border-purple-500/50 transition-colors">
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Click to upload your photo</p>
                        <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
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
                  {/* Prompt Input */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-white">Describe your desired hairstyle</Label>
                    <Input
                      id="prompt"
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., modern professional short haircut"
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                    <p className="text-gray-400 text-sm">
                      Examples: "long wavy hair", "short pixie cut", "professional business haircut", "curly afro style"
                    </p>
                  </div>

                  {/* Image Preview Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                      <h3 className="text-white font-semibold mb-3">Original Photo</h3>
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
                      <h3 className="text-white font-semibold mb-3">AI Preview</h3>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950/50 border border-purple-500/20">
                        {loading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                              <p className="text-gray-400">Creating your AI preview...</p>
                              <p className="text-gray-500 text-sm mt-2">This may take 30-60 seconds</p>
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
                            <p className="text-gray-400">Click "Transform" to see the result</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleTransform}
                      disabled={loading || !selectedImage}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 text-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Transforming...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Transform Hair
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setSelectedImage(null)
                        setResult(null)
                        setError(null)
                      }}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      Upload New Photo
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* For Salon Owners Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/50">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl text-white mb-4">
                  💈 For Hair Salon Owners
                </CardTitle>
                <CardDescription className="text-gray-100 text-lg">
                  Offer an extra service to your customers and boost bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-950/50 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-white font-semibold text-xl mb-4">
                    🎯 Why Add This Widget to Your Website?
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span><strong className="text-white">Increase bookings by 40%:</strong> Customers can "try before they cut" and book with confidence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span><strong className="text-white">Stand out from competitors:</strong> Offer a premium digital experience no other salon has</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span><strong className="text-white">Reduce consultation time:</strong> Customers arrive knowing exactly what they want</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span><strong className="text-white">100% customizable:</strong> Match your salon's colors, branding, and style</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span><strong className="text-white">Works on any website:</strong> Copy-paste 3 lines of code. No developer needed</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950/50 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-white font-semibold text-xl mb-4">
                    🎨 Fully Customizable
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Adapt the widget to match your salon's unique brand:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-white font-semibold mb-2">Colors & Branding</p>
                      <p className="text-gray-400 text-sm">Match your salon's color scheme, logo, and fonts perfectly</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-white font-semibold mb-2">Hairstyle Options</p>
                      <p className="text-gray-400 text-sm">Pre-set your signature cuts and styles for quick selection</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-white font-semibold mb-2">Booking Integration</p>
                      <p className="text-gray-400 text-sm">Connect directly to your scheduling system</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-white font-semibold mb-2">Language & Text</p>
                      <p className="text-gray-400 text-sm">Customize all text to your language and tone of voice</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-12 h-14 shadow-lg shadow-purple-500/50"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Add This Widget to My Salon
                    </Button>
                  </Link>
                  <p className="text-gray-400 text-sm mt-4">
                    Start free • No credit card required • Live in 60 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">1. Upload Photo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload a clear photo of yourself
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Scissors className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">2. Describe Style</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tell us what hairstyle you want to try
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg text-white">3. See Preview</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI generates realistic preview instantly
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

