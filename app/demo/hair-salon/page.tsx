'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Sparkles, Upload, Scissors } from 'lucide-react'
import { HairSalonWidget } from '@/components/hair-salon-widget'

export default function HairSalonDemo() {
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
              Powered by AI for maximum privacy.
            </p>
          </div>

          {/* Main Widget */}
          <div className="max-w-4xl mx-auto mb-16">
            <HairSalonWidget companyName="Demo Hair Salon" />
          </div>

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
                  <CardTitle className="text-lg text-white">2. Choose Style</CardTitle>
                  <CardDescription className="text-gray-400">
                    Select from 15+ popular hairstyles
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
