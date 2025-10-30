import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Users, BarChart3, Bot, ArrowRight, MessageSquare, Calculator, Calendar, Euro, TrendingUp, Shield, Palette, Home as HomeIcon, Hammer, Frame } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  const niches = [
    {
      icon: <Palette className="w-12 h-12 text-orange-600" />,
      name: "Schilders",
      description: "AI chatbot voor schilderwerk offertes",
      features: ["m² berekening", "Binnen/buiten", "Spuitwerk"],
      gradient: "from-orange-500/10 to-red-500/10",
      demo: "/demo/chat?niche=schilders"
    },
    {
      icon: <HomeIcon className="w-12 h-12 text-blue-600" />,
      name: "Vloerenleggers",
      description: "Automatische vloer offertes met AI",
      features: ["Type vloer", "Vloerverwarming", "Plinten"],
      gradient: "from-blue-500/10 to-cyan-500/10",
      demo: "/demo/chat?niche=vloeren"
    },
    {
      icon: <Hammer className="w-12 h-12 text-gray-700" />,
      name: "Metselaars",
      description: "Chat assistent voor metselwerk",
      features: ["Type project", "m² schatting", "Materiaal"],
      gradient: "from-gray-500/10 to-stone-500/10",
      demo: "/demo/chat?niche=metselaars"
    },
    {
      icon: <Frame className="w-12 h-12 text-green-600" />,
      name: "Kozijnen",
      description: "AI preview voor nieuwe ramen",
      features: ["Foto analyse", "AI preview", "Prijs calc"],
      gradient: "from-green-500/10 to-emerald-500/10",
      demo: "/demo/chat?niche=kozijnen"
    }
  ]

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Chatbot",
      description: "OpenAI GPT-4 powered conversaties die leads kwalificeren"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Auto Prijsberekening",
      description: "Jouw eigen prijslijst, automatisch berekend tijdens chat"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Afspraak Planning",
      description: "Direct afspraken inplannen vanuit de chat"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Lead Dashboard",
      description: "Alle leads en afspraken in één overzicht"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Foto Analyse",
      description: "AI analyseert klant foto's en schat het werk"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "5min Setup",
      description: "Kopieer widget code, plak op je site - klaar!"
    }
  ]

  const plans = [
    {
      name: "Starter",
      price: "79",
      period: "maand",
      description: "Perfect voor kleine bedrijven",
      features: [
        "1 niche chatbot",
        "50 leads per maand",
        "Standaard prijsberekening",
        "Email support",
        "Lead dashboard"
      ],
      cta: "Start Gratis Trial",
      highlighted: false
    },
    {
      name: "Professional",
      price: "199",
      period: "maand",
      description: "Voor groeiende bedrijven",
      features: [
        "2 niche chatbots",
        "200 leads per maand",
        "Custom prijsberekening",
        "AI foto analyse",
        "Priority support",
        "WhatsApp notificaties"
      ],
      cta: "Start Gratis Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "499",
      period: "maand",
      description: "Voor grote organisaties",
      features: [
        "Onbeperkt chatbots",
        "Onbeperkt leads",
        "White-label branding",
        "API toegang",
        "Dedicated account manager",
        "Custom integraties"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285f4] to-[#3367d6] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4285f4] to-[#3367d6] bg-clip-text text-transparent">
                LeadBot
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="#niches" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Niches
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Prijzen
              </Link>
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-[#4285f4] hover:bg-[#3367d6]">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-gray-700">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-[#4285f4] to-[#3367d6] hover:opacity-90">
                      Gratis Proberen
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by OpenAI GPT-4
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI Chatbots die<br />
              <span className="bg-gradient-to-r from-[#4285f4] to-[#9333ea] bg-clip-text text-transparent">
                Leads Automatisch
              </span>{" "}
              Kwalificeren
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Conversationele AI assistenten voor ambachtelijke bedrijven.
              Vraagt specs, berekent prijs, plant afspraak - volledig automatisch.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-[#4285f4] to-[#3367d6] hover:opacity-90 text-white text-lg px-8 h-14">
                  <Bot className="w-5 h-5 mr-2" />
                  Start Gratis 14-Dagen Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/demo/chat">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Bekijk Live Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              ✅ Geen creditcard nodig • ✅ 5 minuten setup • ✅ Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">300%</div>
              <div className="text-sm text-gray-600">Meer gekwalificeerde leads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Altijd beschikbaar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">5min</div>
              <div className="text-sm text-gray-600">Setup tijd</div>
            </div>
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section id="niches" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Voor Elk Ambacht een Bot
            </h2>
            <p className="text-xl text-gray-600">
              Gespecialiseerde chatbots voor jouw sector
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {niches.map((niche, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
                <CardHeader>
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${niche.gradient} flex items-center justify-center mb-4`}>
                    {niche.icon}
                  </div>
                  <CardTitle className="text-2xl">{niche.name}</CardTitle>
                  <CardDescription className="text-base">{niche.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {niche.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Link href={niche.demo}>
                    <Button variant="outline" className="w-full">
                      Probeer Live Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alles Wat Je Nodig Hebt
            </h2>
            <p className="text-xl text-gray-600">
              Van eerste contact tot geboekte afspraak
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simpele, Transparante Prijzen
            </h2>
            <p className="text-xl text-gray-600">
              14 dagen gratis proberen. Daarna kies je een plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'border-2 border-blue-500 shadow-xl' : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-gradient-to-r from-[#4285f4] to-[#3367d6] text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button 
                      className={`w-full ${
                        plan.highlighted 
                          ? 'bg-gradient-to-r from-[#4285f4] to-[#3367d6]' 
                          : ''
                      }`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Alle plannen inclusief: SSL, hosting, updates & Nederlandse support
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-[#4285f4] to-[#9333ea] text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Klaar om te Starten?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                14 dagen gratis proberen. Geen creditcard nodig.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
                    Start Gratis Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/demo/chat">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                    Bekijk Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285f4] to-[#3367d6] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">LeadBot</span>
              </div>
              <p className="text-sm text-gray-600">
                AI chatbots voor ambachtelijke bedrijven
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#niches">Niches</Link></li>
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Prijzen</Link></li>
                <li><Link href="/demo/chat">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Bedrijf</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">Over ons</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Voorwaarden</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/docs">Documentatie</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 LeadBot. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
