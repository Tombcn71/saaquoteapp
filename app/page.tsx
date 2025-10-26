import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Zap, Users, BarChart3, Code, ArrowRight } from "lucide-react"
import { AIQuoteForm } from "@/components/ai-quote-form"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#4285f4] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">KozijnSaaS</span>
            </Link>
            
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/widgets">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      Widgets
                    </Button>
                  </Link>
                  <Link href="/dashboard/leads">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      Leads
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="#pricing">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      Prijzen
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-[#4285f4] hover:bg-[#3367d6] text-white">
                      Gratis Starten
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Demo */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Hero Text */}
            <div className="pt-8 pl-8">
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-none tracking-tight">
                Meer Leads met<br />
                <span>Slimme AI Quotes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Plaats onze widget op je website. Klanten uploaden foto's, AI genereert previews 
                van nieuwe kozijnen en berekent direct de prijs. Jij ontvangt kwalitatieve leads.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Preview Generatie</h3>
                    <p className="text-gray-600">Google Gemini toont klanten hoe nieuwe kozijnen eruit zien</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Prijsberekening</h3>
                    <p className="text-gray-600">Automatische offerte op basis van materiaal en specificaties</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Copy-Paste Widget</h3>
                    <p className="text-gray-600">60 seconden implementatie, geen developer nodig</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    className="bg-[#4285f4] hover:bg-[#3367d6] text-white text-lg px-8 h-14 w-full sm:w-auto"
                  >
                    Start Gratis Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-gray-700 border-gray-300 text-lg px-8 h-14 w-full sm:w-auto"
                  >
                    Bekijk Prijzen
                  </Button>
                </Link>
              </div>

              {/* Platform Compatibility */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Werkt op alle platforms</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900">WordPress</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900">Wix</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900">Squarespace</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900">Webflow</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900">Shopify</div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center hover:border-blue-400 transition-colors">
                    <div className="font-bold text-gray-900 text-sm">+ Meer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Demo Form */}
            <div className="lg:sticky lg:top-24 max-w-lg mx-auto lg:mx-0">
              <div className="mb-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Live Demo - Probeer het nu!
                </span>
              </div>
              <AIQuoteForm />
              <p className="text-center text-sm text-gray-500 mt-4">
                👆 Test het formulier - geen account nodig voor de demo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-xl text-gray-600">
              Een complete oplossing voor kozijnbedrijven
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">AI Preview Generator</CardTitle>
                <CardDescription>
                  Google Gemini AI genereert realistische previews van nieuwe kozijnen 
                  op basis van klantfoto's
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">Instant Prijsberekening</CardTitle>
                <CardDescription>
                  Automatische berekening op basis van materiaal, type, glas en oppervlakte. 
                  Klant ziet direct de prijs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">Easy Embed</CardTitle>
                <CardDescription>
                  Copy-paste één regel code op je website. Geen developer nodig. 
                  Widget werkt direct
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">Lead Management</CardTitle>
                <CardDescription>
                  Alle offerteaanvragen overzichtelijk in je dashboard. Filter, exporteer 
                  en beheer je leads
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">Real-time Analytics</CardTitle>
                <CardDescription>
                  Track views, conversies en ROI. Zie direct welke leads de meeste waarde 
                  hebben
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#4285f4] transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-[#4285f4]" />
                </div>
                <CardTitle className="text-xl">Multi-tenant</CardTitle>
                <CardDescription>
                  Veilige scheiding tussen bedrijven. Jouw data blijft van jou. 
                  Enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simpele, eerlijke prijzen
            </h2>
            <p className="text-xl text-gray-600">
              Start gratis, upgrade wanneer je groeit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€0</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <CardDescription>Perfect om te testen</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>10 leads per maand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>1 widget</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>AI previews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Basis analytics</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full border-gray-300">
                    Start Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-[#4285f4] hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#4285f4] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Populair
                </span>
              </div>
              <CardHeader className="pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">Professional</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€99</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <CardDescription>Voor groeiende bedrijven</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span className="font-medium">200 leads per maand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Onbeperkt widgets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>AI previews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Geavanceerde analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white">
                    Start 14 Dagen Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€299</span>
                  <span className="text-gray-600">/maand</span>
                </div>
                <CardDescription>Voor grote organisaties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span className="font-medium">Onbeperkt leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Onbeperkt widgets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>AI previews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>White-label</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#4285f4]" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full border-gray-300">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#4285f4] to-[#3367d6]">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Klaar om te starten?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 100+ kozijnbedrijven die al meer leads genereren met onze AI widget
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="bg-white text-[#4285f4] hover:bg-gray-100 text-lg px-8 h-14"
              >
                Start Gratis Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14"
              >
                Bekijk Prijzen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4285f4] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">KozijnSaaS</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <Link href="#" className="hover:text-[#4285f4]">Privacy</Link>
              <Link href="#" className="hover:text-[#4285f4]">Voorwaarden</Link>
              <Link href="#" className="hover:text-[#4285f4]">Contact</Link>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 KozijnSaaS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
