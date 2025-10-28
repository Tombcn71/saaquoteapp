import Link from 'next/link'
import { ArrowRight, Users, Sparkles, CheckCircle2, TrendingUp, Mail, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function FunnelPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="relative">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="#4285f4" strokeWidth="2" fill="none"/>
                  <line x1="7" y1="9" x2="17" y2="9" stroke="#4285f4" strokeWidth="2"/>
                  <line x1="7" y1="13" x2="14" y2="13" stroke="#4285f4" strokeWidth="2"/>
                  <line x1="7" y1="17" x2="12" y2="17" stroke="#4285f4" strokeWidth="2"/>
                </svg>
                <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1" fill="white" />
              </div>
              <span className="text-xl text-gray-900">QuoteForm</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Inloggen
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#4285f4] hover:bg-[#3367d6] text-white">
                  Gratis Proberen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            3x Hogere Conversie
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            De QuoteForm Funnel
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Zo transformeer je website bezoekers in betalende klanten<br />
            met AI-powered instant quotes
          </p>
        </div>
      </section>

      {/* Main Funnel Visualization */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            
            {/* Stage 1: Traffic */}
            <div className="relative">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#4285f4]" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#4285f4] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">1. Website Bezoekers</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">1,000</div>
                        <div className="text-sm text-gray-500">bezoekers/maand</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Klanten zoeken online naar kozijnen, vloeren, of schilderwerk. Ze landen op je website via Google, social media, of advertenties.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="px-3 py-1 bg-gray-100 rounded-full">Google Ads</div>
                      <div className="px-3 py-1 bg-gray-100 rounded-full">SEO</div>
                      <div className="px-3 py-1 bg-gray-100 rounded-full">Social Media</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowRight className="w-8 h-8 text-gray-300 rotate-90" />
              </div>
            </div>

            {/* Stage 2: Engagement */}
            <div className="relative pl-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#4285f4]" />
                </div>
                <div className="flex-1">
                  <div className="bg-blue-50 border-2 border-[#4285f4] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">2. AI Quote Formulier</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#4285f4]">400</div>
                        <div className="text-sm text-gray-600">starten formulier</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      <strong>40% start het formulier</strong> - veel hoger dan traditionele contactformulieren (5-10%)! Waarom?
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Direct een prijsindicatie</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">AI preview van resultaat</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Leuk en interactief</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Neemt 60 seconden</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowRight className="w-8 h-8 text-[#4285f4] rotate-90" />
              </div>
            </div>

            {/* Stage 3: AI Preview + Offerte */}
            <div className="relative pl-16">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border-2 border-green-500 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">3. AI Preview + Offerte ✨</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">300</div>
                        <div className="text-sm text-gray-600">offertes gegenereerd</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      <strong>Direct na uploaden:</strong> AI toont een preview én berekent de prijs. Klant ziet nu al het resultaat!
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">AI preview van eindresultaat</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Automatische prijsberekening</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Alle specificaties overzichtelijk</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Klant is nu warm & geïnteresseerd</span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800 font-medium">
                        🎯 Klant heeft nu VISUEEL bewijs en is overtuigd - klaar voor de volgende stap!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowRight className="w-8 h-8 text-green-500 rotate-90" />
              </div>
            </div>

            {/* Stage 4: Gratis Adviesgesprek */}
            <div className="relative pl-24">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#4285f4]" />
                </div>
                <div className="flex-1">
                  <div className="bg-blue-50 border-2 border-[#4285f4] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">4. Gratis Adviesgesprek 🎯</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#4285f4]">300</div>
                        <div className="text-sm text-gray-600">afspraken ingepland</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      <strong>Lead plant zelf een adviesgesprek in!</strong> Het systeem biedt automatisch een gratis adviesgesprek aan. Geen hard sales nodig:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Lead kiest zelf datum/tijd</p>
                          <p className="text-sm text-gray-600">Simpele kalender picker, direct na offerte</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Email bevestiging + kalender invite</p>
                          <p className="text-sm text-gray-600">Lead krijgt ICS file voor Google/Apple/Outlook</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#4285f4] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Jij krijgt notificatie</p>
                          <p className="text-sm text-gray-600">Afspraak staat in dashboard met reminder</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-white border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-900 font-medium">
                        💡 Vrijblijvend advies = <strong>zachte sales aanpak</strong> = hogere conversie!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowRight className="w-8 h-8 text-[#4285f4] rotate-90" />
              </div>
            </div>

            {/* Stage 5: Het Gesprek */}
            <div className="relative pl-32">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">5. Het Adviesgesprek</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600">15 min</div>
                        <div className="text-sm text-gray-600">gemiddelde duur</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Op de afgesproken tijd bel jij de lead. Geen cold calling, ze verwachten je!
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Bespreek AI preview samen</p>
                          <p className="text-sm text-gray-600">Lead heeft visueel beeld van resultaat</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Beantwoord vragen</p>
                          <p className="text-sm text-gray-600">Lead is geïnteresseerd, wil meer weten</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Plan opname/offerte in</p>
                          <p className="text-sm text-gray-600">Soft close naar volgende stap</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <ArrowRight className="w-8 h-8 text-gray-300 rotate-90" />
              </div>
            </div>

            {/* Stage 6: Customers */}
            <div className="relative pl-40">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">6. Betalende Klanten</h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-600">75</div>
                        <div className="text-sm text-gray-600">nieuwe klanten/maand</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      <strong>25% converteert naar klant</strong> - veel hoger dan de 5-10% van traditionele leads!
                    </p>
                    <div className="bg-white border border-yellow-300 rounded p-4">
                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">75</div>
                          <div className="text-sm text-gray-600">Nieuwe klanten</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">€4,500</div>
                          <div className="text-sm text-gray-600">Gem. order waarde</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">€337,500</div>
                          <div className="text-sm text-gray-600">Maandelijkse omzet</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            QuoteForm vs Traditioneel Contactformulier
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <Card className="p-6 bg-white">
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold mb-2">
                  Traditioneel
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contactformulier</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Start formulier</span>
                  <span className="font-bold text-gray-900">5-10%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Voltooiing rate</span>
                  <span className="font-bold text-gray-900">30-40%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Leads/1000 bezoekers</span>
                  <span className="font-bold text-gray-900">20-30</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Lead kwaliteit</span>
                  <span className="font-bold text-gray-900">Gemengd</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Conversie naar klant</span>
                  <span className="font-bold text-gray-900">5-10%</span>
                </div>
                <div className="pt-4 border-t-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Klanten/maand</span>
                    <span className="text-2xl font-bold text-gray-900">2-3</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* QuoteForm */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-[#4285f4]">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4285f4] text-white rounded-full text-sm font-semibold mb-2">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered
                </div>
                <h3 className="text-xl font-bold text-gray-900">QuoteForm</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-blue-200">
                  <span className="text-gray-700">Start formulier</span>
                  <span className="font-bold text-[#4285f4]">40%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-blue-200">
                  <span className="text-gray-700">Voltooiing rate</span>
                  <span className="font-bold text-[#4285f4]">75%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-blue-200">
                  <span className="text-gray-700">Leads/1000 bezoekers</span>
                  <span className="font-bold text-[#4285f4]">300</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-blue-200">
                  <span className="text-gray-700">Lead kwaliteit</span>
                  <span className="font-bold text-[#4285f4]">Hoog</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-700">Conversie naar klant</span>
                  <span className="font-bold text-[#4285f4]">25%</span>
                </div>
                <div className="pt-4 border-t-2 border-[#4285f4]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Klanten/maand</span>
                    <span className="text-2xl font-bold text-[#4285f4]">75</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-green-100 border-2 border-green-500 rounded-lg p-6">
              <p className="text-2xl font-bold text-green-700 mb-2">
                25x Meer Klanten per Maand
              </p>
              <p className="text-gray-700">
                Met dezelfde marketing budget en traffic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#4285f4] to-[#3367d6] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Klaar om je Conversie te Verdrievoudigen?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start vandaag nog met QuoteForm en transformeer je website bezoekers in betalende klanten
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-[#4285f4] hover:bg-gray-100 font-bold text-lg px-8">
                Gratis Proberen - 14 dagen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8">
                Bekijk Live Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            Geen creditcard nodig • Setup in 60 seconden • Cancel elk moment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 QuoteForm. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  )
}

