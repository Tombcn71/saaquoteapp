import { AIQuoteForm } from '@/components/ai-quote-form'
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
        <AIQuoteForm widgetId={params.widgetId} companyId={companyId} />
      </div>
    </div>
  )
}

