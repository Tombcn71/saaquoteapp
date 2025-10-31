import { neon } from '@neondatabase/serverless'
import { ChatWidget } from '@/components/chat-widget'
import { notFound } from 'next/navigation'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function WidgetPage({ params }: { params: { widgetId: string } }) {
  const sql = getDatabase()
  
  // Get widget info
  const widgets = await sql`
    SELECT w.*, c.name as company_name, c.widget_primary_color 
    FROM widgets w
    JOIN companies c ON w.company_id = c.id
    WHERE w.id = ${params.widgetId}
  `

  if (widgets.length === 0) {
    notFound()
  }

  const widget = widgets[0]

  if (!widget.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Widget niet beschikbaar</h1>
          <p className="text-gray-600">Deze widget is momenteel niet actief.</p>
        </div>
      </div>
    )
  }

  // Update view count
  await sql`
    UPDATE widgets 
    SET views = views + 1, updated_at = NOW()
    WHERE id = ${params.widgetId}
  `

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8"
      style={{
        '--primary': widget.primary_color || widget.widget_primary_color || '#3b82f6'
      } as any}
    >
      <div className="max-w-4xl mx-auto">
        {widget.company_name && (
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {widget.company_name}
            </h1>
            <p className="text-gray-600">
              Chat met onze AI assistent voor een direct advies en offerte
            </p>
          </div>
        )}
        
        <ChatWidget companyId={widget.company_id} widgetId={params.widgetId} />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by LeadBot</p>
        </div>
      </div>
    </div>
  )
}

