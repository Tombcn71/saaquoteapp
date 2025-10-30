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
    <div className="min-h-screen bg-gray-50 p-4 flex items-start justify-center">
      <div className="w-full max-w-2xl pt-8">
        <Tabs defaultValue="kozijnen" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="kozijnen" className="text-sm">
              {formConfigs.kozijnen.icon} Kozijnen
            </TabsTrigger>
            <TabsTrigger value="vloeren" className="text-sm">
              {formConfigs.vloeren.icon} Vloeren
            </TabsTrigger>
            <TabsTrigger value="schilderwerk" className="text-sm">
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
      </div>
    </div>
  )
}

