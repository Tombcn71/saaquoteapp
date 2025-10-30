import { AIQuoteForm } from '@/components/ai-quote-form'
import { VloerenQuoteForm } from '@/components/vloeren-quote-form'
import { SchilderwerkQuoteForm } from '@/components/schilderwerk-quote-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formConfigs } from '@/lib/form-configs'
import { neon } from '@neondatabase/serverless'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function EmbedPage({ params }: { params: { widgetId: string } }) {
  // Fetch widget to get company_id
  const sql = getDatabase()
  let companyId = undefined
  
  try {
    const widgets = await sql`
      SELECT company_id FROM widgets WHERE id = ${params.widgetId}
    `
    if (widgets.length > 0) {
      companyId = widgets[0].company_id
    }
  } catch (error) {
    console.error('Error fetching widget:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 flex items-start justify-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-2xl pt-8 relative z-10">
        {/* NanoBanana Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NanoBanana
            </span>
          </div>
          <p className="text-gray-400 text-sm">Powered by Google Gemini Nano</p>
        </div>

        <Tabs defaultValue="kozijnen" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-900/50 border border-purple-500/20">
            <TabsTrigger 
              value="kozijnen" 
              className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
            >
              {formConfigs.kozijnen.icon} Kozijnen
            </TabsTrigger>
            <TabsTrigger 
              value="vloeren" 
              className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
            >
              {formConfigs.vloeren.icon} Vloeren
            </TabsTrigger>
            <TabsTrigger 
              value="schilderwerk" 
              className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
            >
              {formConfigs.schilderwerk.icon} Schilderwerk
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="kozijnen">
            <AIQuoteForm widgetId={params.widgetId} companyId={companyId} />
          </TabsContent>
          
          <TabsContent value="vloeren">
            <VloerenQuoteForm widgetId={params.widgetId} companyId={companyId} />
          </TabsContent>
          
          <TabsContent value="schilderwerk">
            <SchilderwerkQuoteForm widgetId={params.widgetId} companyId={companyId} />
          </TabsContent>
        </Tabs>

        {/* Powered by footer */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          AI-powered widget by <span className="text-purple-400">NanoBanana</span>
        </div>
      </div>
    </div>
  )
}

