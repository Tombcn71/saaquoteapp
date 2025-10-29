import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { Code, ExternalLink, Eye } from "lucide-react"

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function WidgetsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  const companyId = (session.user as any).companyId

  if (!companyId) {
    return <div>No company found. Please contact support.</div>
  }

  const sql = getDatabase()

  // Get widgets for this company
  const widgets = await sql`
    SELECT * FROM widgets 
    WHERE company_id = ${companyId}
    ORDER BY created_at DESC
  `

  const widget = widgets[0] // Use first widget

  if (!widget) {
    return <div>No widget found. Please contact support.</div>
  }

  const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
  const embedUrl = `${baseUrl}/embed/${widget.id}`
  
  // 1. INLINE EMBED - Direct op de pagina
  const inlineCode = `<!-- QuoteForm Widget - Inline -->
<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="900" 
  frameborder="0"
  style="border: none; border-radius: 8px; max-width: 800px; margin: 0 auto; display: block;"
></iframe>`

  // 2. POPUP TEXT LINK - Link die popup opent
  const popupTextCode = `<!-- QuoteForm Widget - Popup Link -->
<a href="#" id="quoteform-popup-link" style="color: #4285f4; text-decoration: underline; cursor: pointer;">
  Vraag een offerte aan
</a>

<script>
(function() {
  document.getElementById('quoteform-popup-link').addEventListener('click', function(e) {
    e.preventDefault();
    var modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.innerHTML = '<div style="background: white; border-radius: 12px; width: 100%; max-width: 900px; max-height: 90vh; overflow: auto; position: relative;"><button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 16px; right: 16px; background: white; border: none; font-size: 28px; cursor: pointer; z-index: 10; width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">&times;</button><iframe src="${embedUrl}" style="width: 100%; height: 90vh; border: none;"></iframe></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if(e.target === modal) modal.remove(); });
  });
})();
</script>`

  // 3. FLOATING WIDGET BUTTON - Altijd zichtbare button
  const floatingWidgetCode = `<!-- QuoteForm Widget - Floating Button -->
<div id="quoteform-floating-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998;">
  <button style="background: #4285f4; color: white; border: none; padding: 16px 24px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4); display: flex; align-items: center; gap: 8px;">
    <span>💬</span> Offerte aanvragen
  </button>
</div>

<script>
(function() {
  document.getElementById('quoteform-floating-btn').addEventListener('click', function() {
    var modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.innerHTML = '<div style="background: white; border-radius: 12px; width: 100%; max-width: 900px; max-height: 90vh; overflow: auto; position: relative;"><button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 16px; right: 16px; background: white; border: none; font-size: 28px; cursor: pointer; z-index: 10; width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">&times;</button><iframe src="${embedUrl}" style="width: 100%; height: 90vh; border: none;"></iframe></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) { if(e.target === modal) modal.remove(); });
  });
})();
</script>`

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Widget Management
          </h1>
          <p className="text-gray-400">
            Place the AI quote widget on your website and receive leads automatically
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{widget.name}</CardTitle>
                  <CardDescription>
                    {widget.is_active ? (
                      <span className="text-green-400">● Active</span>
                    ) : (
                      <span className="text-gray-500">● Inactive</span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Views</p>
                <p className="text-2xl font-bold text-white">{widget.views || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Conversions</p>
                <p className="text-2xl font-bold text-white">{widget.conversions || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {widget.views > 0 
                    ? Math.round((widget.conversions / widget.views) * 100) 
                    : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription className="text-gray-400">Test your widget before placing it</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full"
              >
                <Button variant="default" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Widget Preview
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Embed Style</h2>
          <p className="text-gray-400 mb-6">
            Select the option that works best for your website
          </p>
        </div>

        <div className="space-y-6">
          {/* OPTION 1: INLINE EMBED */}
          <Card className="border-2 border-purple-500/30 bg-purple-500/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">1</div>
                    Inline Embed
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-300">
                    <strong className="text-green-400">✅ Recommended</strong> - Form appears directly on your page. Works on WordPress, Wix, Squarespace, etc.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {inlineCode}
                </pre>
                <CopyButton text={inlineCode} />
              </div>
            </CardContent>
          </Card>

          {/* OPTION 2: POPUP TEXT LINK */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">2</div>
                    Popup Text Link
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-400">
                    A clickable link that opens the form in a popup. Perfect for text or menu.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm text-gray-300">
                  <strong>Example:</strong> "Want a quote? <span className="text-purple-400 underline cursor-pointer">Click here</span>"
                </p>
              </div>
              <div className="relative">
                <pre className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {popupTextCode}
                </pre>
                <CopyButton text={popupTextCode} />
              </div>
            </CardContent>
          </Card>

          {/* OPTION 3: FLOATING WIDGET BUTTON */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">3</div>
                    Floating Widget Button
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-400">
                    A floating button at the bottom right that stays always visible (like a chat widget). Maximum visibility!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm text-gray-300">
                  <strong>Example:</strong> <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-semibold">💬 Request Quote</span> (bottom right of your page)
                </p>
              </div>
              <div className="relative">
                <pre className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {floatingWidgetCode}
                </pre>
                <CopyButton text={floatingWidgetCode} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">📋 Quick Installation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-gray-300">
              <div>
                <strong className="text-lg text-white">For all platforms (WordPress, Wix, etc.)</strong>
                <ol className="list-decimal ml-5 mt-2 space-y-1.5">
                  <li>Choose an embed style above</li>
                  <li>Click <strong className="text-purple-400">"Copy"</strong></li>
                  <li>Go to your website editor</li>
                  <li>Add a <strong className="text-purple-400">"Custom HTML"</strong> block</li>
                  <li>Paste the code</li>
                  <li>Publish - DONE! 🎉</li>
                </ol>
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-purple-500/20 space-y-2">
                <div>
                  <strong className="text-white">💡 Which to choose?</strong>
                </div>
                <ul className="space-y-1 ml-4">
                  <li>• <strong className="text-purple-400">Inline:</strong> For a contact or quote page</li>
                  <li>• <strong className="text-purple-400">Popup Link:</strong> For your menu or text</li>
                  <li>• <strong className="text-purple-400">Floating Button:</strong> For maximum visibility on every page</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

