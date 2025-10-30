import { neon } from '@neondatabase/serverless'
import { HairSalonWidget } from '@/components/hair-salon-widget'
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Widget Not Available</h1>
          <p className="text-gray-400">This widget is currently inactive.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <HairSalonWidget 
          widgetId={params.widgetId}
          companyId={widget.company_id}
          companyName={widget.company_name}
          primaryColor={widget.primary_color || widget.widget_primary_color}
        />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by NanoBanana</p>
        </div>
      </div>
    </div>
  )
}
