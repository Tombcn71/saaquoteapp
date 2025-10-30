import { ChatWidget } from '@/components/chat-widget'

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💬 AI Chatbot Demo
          </h1>
          <p className="text-lg text-gray-600">
            Conversationele offerte assistent met OpenAI GPT-4
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-blue-900 font-medium">Live AI Assistent</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">OpenAI GPT-4</h3>
            <p className="text-sm text-gray-600">Slimme conversaties met function calling</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl mb-2">📸</div>
            <h3 className="font-semibold text-gray-900 mb-1">Foto Analyse</h3>
            <p className="text-sm text-gray-600">Gemini AI analyseert je ramen</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Live Prijs</h3>
            <p className="text-sm text-gray-600">Directe offerte berekening</p>
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget 
          companyId={process.env.NEXT_PUBLIC_DEMO_COMPANY_ID}
          widgetId="chat-demo"
          companyName="QuoteForm Demo"
        />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-bold text-gray-900 mb-4">🎯 Probeer dit:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Upload een foto van je ramen (optioneel) - AI analyseert automatisch</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Vertel wat je zoekt: bijv. "Ik wil 5 kunststof ramen, ongeveer 12m²"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Bot berekent direct de prijs en stelt voor om een afspraak te maken</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Kies datum/tijd en geef je contactgegevens - klaar!</span>
            </li>
          </ul>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> De bot gebruikt OpenAI Function Calling - hij kan alleen prijzen 
              berekenen via onze functies (kan niet zelf prijzen verzinnen!)
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by: OpenAI GPT-4 • Google Gemini • Next.js • Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

