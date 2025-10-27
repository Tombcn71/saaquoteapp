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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget Beheer</h1>
          <p className="text-muted-foreground">
            Plaats de AI quote widget op je website en ontvang automatisch leads
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{widget.name}</CardTitle>
                  <CardDescription>
                    {widget.is_active ? (
                      <span className="text-green-600">● Actief</span>
                    ) : (
                      <span className="text-gray-400">● Inactief</span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Views</p>
                <p className="text-2xl font-bold">{widget.views || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Conversies</p>
                <p className="text-2xl font-bold">{widget.conversions || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Conversie ratio</p>
                <p className="text-2xl font-bold">
                  {widget.views > 0 
                    ? Math.round((widget.conversions / widget.views) * 100) 
                    : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>Test je widget voordat je hem plaatst</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full"
              >
                <Button className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Widget Preview
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kies je embed stijl</h2>
          <p className="text-muted-foreground mb-6">
            Selecteer de optie die het beste werkt voor jouw website
          </p>
        </div>

        <div className="space-y-6">
          {/* OPTION 1: INLINE EMBED */}
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#4285f4] text-white flex items-center justify-center font-bold">1</div>
                    Inline Embed
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <strong>✅ Aanbevolen</strong> - Formulier verschijnt direct op je pagina. Werkt op WordPress, Wix, Squarespace, etc.
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
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#4285f4] text-white flex items-center justify-center font-bold">2</div>
                    Popup Text Link
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Een klikbare link die het formulier in een popup opent. Perfect voor in je tekst of menu.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Voorbeeld:</strong> "Wil je een offerte? <span className="text-blue-600 underline cursor-pointer">Klik hier</span>"
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
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#4285f4] text-white flex items-center justify-center font-bold">3</div>
                    Floating Widget Button
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Een zwevende button rechtsonder die altijd zichtbaar blijft (zoals een chat widget). Maximale zichtbaarheid!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Voorbeeld:</strong> <span className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-semibold">💬 Offerte aanvragen</span> (rechtsonder op je pagina)
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

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">📋 Snelle Installatie</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-blue-900">
              <div>
                <strong className="text-lg">Voor alle platforms (WordPress, Wix, etc.)</strong>
                <ol className="list-decimal ml-5 mt-2 space-y-1.5">
                  <li>Kies een embed stijl hierboven</li>
                  <li>Klik op <strong>"Kopieer"</strong></li>
                  <li>Ga naar je website editor</li>
                  <li>Voeg een <strong>"Custom HTML"</strong> block toe</li>
                  <li>Plak de code</li>
                  <li>Publiceer - KLAAR! 🎉</li>
                </ol>
              </div>

              <div className="bg-white p-4 rounded border border-blue-300 space-y-2">
                <div>
                  <strong>💡 Welke kiezen?</strong>
                </div>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Inline:</strong> Voor een contactpagina of offertepagina</li>
                  <li>• <strong>Popup Link:</strong> Voor in je menu of tekst</li>
                  <li>• <strong>Floating Button:</strong> Voor maximale zichtbaarheid op elke pagina</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

