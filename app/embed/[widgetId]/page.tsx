import { AIQuoteForm } from '@/components/ai-quote-form'
import { neon } from '@neondatabase/serverless'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
  }
  return neon(connectionString)
}

export default async function EmbedPage({ params }: { params: { widgetId: string } }) {
  const sql = getDatabase()
  
  // Verify widget exists and is active
  const widgets = await sql`
    SELECT id, company_id, is_active 
    FROM widgets 
    WHERE id = ${params.widgetId}
  `
  
  const widget = widgets[0]
  
  if (!widget || !widget.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Widget niet beschikbaar</h1>
          <p className="text-gray-600">Deze widget is niet actief of bestaat niet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-start justify-center">
      <div className="w-full max-w-2xl pt-8">
        <AIQuoteForm widgetId={params.widgetId} />
      </div>
    </div>
  )
}

