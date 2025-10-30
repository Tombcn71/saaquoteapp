import { HairSalonWidget } from '@/components/hair-salon-widget'
import { neon } from '@neondatabase/serverless'
import { Sparkles } from 'lucide-react'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function EmbedPage({ params }: { params: { widgetId: string } }) {
  // Fetch widget to get company info
  const sql = getDatabase()
  let companyId = undefined
  let companyName = undefined
  let primaryColor = undefined
  
  try {
    const widgets = await sql`
      SELECT w.*, c.name as company_name, c.widget_primary_color
      FROM widgets w
      LEFT JOIN companies c ON w.company_id = c.id
      WHERE w.id = ${params.widgetId}
    `
    if (widgets.length > 0) {
      companyId = widgets[0].company_id
      companyName = widgets[0].company_name
      primaryColor = widgets[0].primary_color || widgets[0].widget_primary_color
      
      // Update view count
      await sql`
        UPDATE widgets 
        SET views = views + 1, updated_at = NOW()
        WHERE id = ${params.widgetId}
      `
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
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NanoBanana
            </span>
          </div>
          <p className="text-gray-400 text-sm">Powered by AI · On-Device Processing</p>
        </div>

        <HairSalonWidget 
          widgetId={params.widgetId}
          companyId={companyId}
          companyName={companyName}
          primaryColor={primaryColor}
        />

        {/* Powered by footer */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          AI-powered widget by <span className="text-purple-400">NanoBanana</span>
        </div>
      </div>
    </div>
  )
}
