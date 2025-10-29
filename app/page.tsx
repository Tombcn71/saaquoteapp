import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Check, Sparkles, Zap, ArrowRight, Code2, Smartphone, Eye,
  Palette, Users, Smile, HandMetal, Camera, UtensilsCrossed,
  Sofa, Home, Leaf, Scissors
} from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  const industries = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Hair Salons & Stylists",
      subtitle: "Try This Hairstyle - AI Preview",
      description: "Quick, on-device face and hairline analysis to realistically project new cuts and colors instantly.",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Artists & Galleries",
      subtitle: "My Art on the Wall",
      description: "On-device wall analysis (size, color, lighting) to place artwork at the correct scale and lighting.",
      gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
      icon: <Smile className="w-8 h-8" />,
      title: "Dentists & Orthodontists",
      subtitle: "My Smile AI View",
      description: "Fast processing of dental photos to instantly project veneers or teeth whitening results.",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <HandMetal className="w-8 h-8" />,
      title: "Nail Studios",
      subtitle: "My Nails Preview",
      description: "Real-time hand and nail tracking to instantly visualize different colors, shapes, and nail art designs.",
      gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Restaurants & Chefs",
      subtitle: "Meal on Table Visualization",
      description: "3D dish model projection on the customer's own table to show portion size and presentation.",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: <Sofa className="w-8 h-8" />,
      title: "Furniture Stores",
      subtitle: "Furniture in My Room",
      description: "Place 3D furniture models in customer's room (AR functionality) with realistic shadows and lighting.",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "House Painters",
      subtitle: "Color Tester Widget",
      description: "Project colors or patterns directly on wall sections seen through the camera. Quick existing wall color recognition.",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Florists & Garden Centers",
      subtitle: "Plant in Pot Matcher",
      description: "Scan a plant and pot to visualize how the combination looks in the customer's space.",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Tattoo & Piercing Shops",
      subtitle: "Tattoo on Skin Preview",
      description: "Place tattoo designs at the correct scale on arm, leg, or torso, accounting for skin contours.",
      gradient: "from-violet-500/20 to-purple-500/20"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NanoBanana
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/widgets">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                      Widgets
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="#how-it-works">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                      How It Works
                    </Button>
                  </Link>
                  <Link href="#pricing">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                      Pricing
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50">
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini Nano
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Turn Your Website Into an AI-Driven App
              </span>
              <br />
              <span className="text-gray-300 text-4xl md:text-5xl">
                with just a few lines of code
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              You don't need to build an expensive AI app to join the AI era. 
              Our Nano-powered widgets run <span className="text-purple-400 font-semibold">on-device</span>, 
              giving your customers instant, personalized previews—right on your website.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-10 h-14 shadow-lg shadow-purple-500/50"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-lg px-10 h-14"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">On-Device AI</p>
                  <p className="text-gray-400 text-sm">Blazing fast, private</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">60-Second Setup</p>
                  <p className="text-gray-400 text-sm">Copy-paste widget code</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Any Platform</p>
                  <p className="text-gray-400 text-sm">WordPress, Wix, Shopify, etc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get your AI widget live in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <div className="text-sm text-purple-400 font-semibold mb-2">STEP 1</div>
                <CardTitle className="text-2xl text-white">Choose Your Industry</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Select from 10+ pre-built AI widgets tailored to your business—hair salons, tattoo shops, furniture stores, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                  <Code2 className="w-7 h-7 text-purple-400" />
                </div>
                <div className="text-sm text-purple-400 font-semibold mb-2">STEP 2</div>
                <CardTitle className="text-2xl text-white">Copy & Paste</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Get your unique embed code. Drop it on your website—works with WordPress, Wix, Squarespace, Shopify, and custom sites.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                  <Zap className="w-7 h-7 text-purple-400" />
                </div>
                <div className="text-sm text-purple-400 font-semibold mb-2">STEP 3</div>
                <CardTitle className="text-2xl text-white">Watch Conversions Grow</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Customers get instant AI previews on-device. You get qualified leads with engagement analytics in your dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built For Your Industry
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Each widget is powered by Gemini Nano for lightning-fast, on-device AI. 
              No cloud delays. Complete privacy. Instant results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 cursor-pointer group relative overflow-hidden"
              >
                {/* Colored accent overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <CardHeader className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${industry.gradient} rounded-xl flex items-center justify-center mb-4 text-white transition-all`}>
                    {industry.icon}
                  </div>
                  <CardTitle className="text-xl text-white mb-2">
                    {industry.title}
                  </CardTitle>
                  <div className="text-sm text-purple-300 font-semibold mb-3">
                    "{industry.subtitle}"
                  </div>
                  <CardDescription className="text-white/90">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why NanoBanana Section */}
      <section className="py-20 px-4 bg-gray-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why NanoBanana?
            </h2>
            <p className="text-xl text-gray-400">
              The smartest way to add AI to your website
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">On-Device Processing</CardTitle>
                <CardDescription className="text-gray-300">
                  Powered by Google Gemini Nano, all AI runs locally on your customer's device. 
                  Blazing fast, completely private, and no cloud API costs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Instant Visual Previews</CardTitle>
                <CardDescription className="text-gray-300">
                  Let customers see the result before buying. Hair color, tattoo placement, 
                  furniture in their room—all visualized in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">No Developer Needed</CardTitle>
                <CardDescription className="text-gray-300">
                  Copy-paste a single snippet. Works on any website. 
                  No technical knowledge required. Live in under 60 seconds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Convert More Visitors</CardTitle>
                <CardDescription className="text-gray-300">
                  Interactive AI experiences keep visitors engaged 5x longer. 
                  Turn browsers into buyers with personalized visualizations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-white mb-2">Starter</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">Perfect to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>100 AI previews/month</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>1 widget</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 hover:border-purple-500/70 transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg shadow-purple-500/50">
                  Most Popular
                </span>
              </div>
              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl text-white mb-2">Professional</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$49</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-300">For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">5,000 AI previews/month</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Unlimited widgets</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50">
                    Start 14-Day Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-white mb-2">Enterprise</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$199</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-400">For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Unlimited AI previews</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Unlimited widgets</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>White-label</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-blue-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Website?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 500+ businesses already using AI widgets to boost conversions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-10 h-14 shadow-lg shadow-purple-500/50"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-lg px-10 h-14"
              >
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-purple-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NanoBanana
              </span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <Link href="#" className="hover:text-purple-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 NanoBanana. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
