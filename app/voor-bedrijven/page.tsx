import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function VoorBedrijvenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285f4] to-[#3367d6] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4285f4] to-[#3367d6] bg-clip-text text-transparent">
                LeadBot
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">💼</span>
            <span className="text-sm font-semibold text-blue-900">Voor Bedrijven</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wil je LeadBot gebruiken voor<br />
            <span className="bg-gradient-to-r from-[#4285f4] to-[#9333ea] bg-clip-text text-transparent">
              jouw bedrijf?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Vul het formulier in en ontdek hoe LeadBot jouw bedrijf kan helpen meer leads te genereren met AI-chatbots.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Beschikbaar</h3>
              <p className="text-sm text-gray-600">Chatbot werkt dag en nacht</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Meer Conversies</h3>
              <p className="text-sm text-gray-600">30-50% meer leads gemiddeld</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">5min Setup</h3>
              <p className="text-sm text-gray-600">Direct aan de slag</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typeform Embed */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#4285f4] to-[#3367d6] text-white">
              <h2 className="text-2xl font-bold mb-2">📋 Vertel ons over je bedrijf</h2>
              <p className="text-blue-100">We nemen binnen 24 uur contact met je op</p>
            </div>
            
            {/* Typeform Embed Container */}
            <div className="relative w-full" style={{ height: '600px' }}>
              <iframe
                id="typeform-full"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="camera; microphone; autoplay; encrypted-media;"
                src="https://form.typeform.com/to/URUImQIp"
                style={{ border: 0 }}
              />
            </div>

            <div className="p-6 bg-gray-50 border-t text-center text-sm text-gray-600">
              <p>🔒 Je gegevens worden veilig verwerkt volgens onze <Link href="/privacy" className="text-[#4285f4] hover:underline">privacyverklaring</Link></p>
            </div>
          </div>

          {/* Alternative CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Of bekijk eerst de demo:</p>
            <Link href="/demo/chat">
              <Button size="lg" variant="outline" className="border-2">
                💬 Probeer de Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-4">Vertrouwd door ambachtelijke bedrijven in Nederland</p>
            <div className="flex flex-wrap justify-center gap-8 items-center text-gray-400">
              <span className="text-lg">🎨 Schilders</span>
              <span className="text-lg">🏠 Vloerenleggers</span>
              <span className="text-lg">🧱 Metselaars</span>
              <span className="text-lg">🪟 Kozijnen</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

