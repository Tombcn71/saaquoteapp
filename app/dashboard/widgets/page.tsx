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

  const embedUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/embed/${widget.id}`
  
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="900" 
  frameborder="0"
  style="border: none; border-radius: 8px; max-width: 800px; margin: 0 auto; display: block;"
></iframe>`

  const scriptCode = `<!-- Kozijn Widget - Simpele Embed -->
<div id="kozijn-widget-${widget.id}"></div>
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${embedUrl}';
  iframe.style.width = '100%';
  iframe.style.height = '900px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.maxWidth = '800px';
  iframe.style.margin = '0 auto';
  iframe.style.display = 'block';
  iframe.frameBorder = '0';
  document.getElementById('kozijn-widget-${widget.id}').appendChild(iframe);
})();
</script>`

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Widget Beheer</h1>
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
                <Button className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Widget Preview
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Embed Code (JavaScript)
              </CardTitle>
              <CardDescription>
                Aanbevolen: Automatisch responsive iframe met JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {scriptCode}
                </pre>
                <CopyButton text={scriptCode} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                iFrame Code
              </CardTitle>
              <CardDescription>
                Alternatief: Gebruik een iframe om de widget in te sluiten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {iframeCode}
                </pre>
                <CopyButton text={iframeCode} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">📋 Hoe te installeren?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-blue-900">
              <div>
                <strong className="text-lg">🔹 WordPress</strong>
                <ol className="list-decimal ml-5 mt-2 space-y-1.5">
                  <li>Klik op <strong>"Kopieer"</strong> bij de embed code hierboven</li>
                  <li>Ga naar WordPress → Pagina bewerken</li>
                  <li>Klik op <strong>"+"</strong> → Zoek naar <strong>"Custom HTML"</strong></li>
                  <li>Plak de code erin (Ctrl+V of Cmd+V)</li>
                  <li>Klik <strong>"Publiceren"</strong></li>
                </ol>
              </div>
              
              <div className="border-t border-blue-300 pt-4">
                <strong className="text-lg">🔹 Next.js / React</strong>
                <ol className="list-decimal ml-5 mt-2 space-y-1.5">
                  <li>Klik op <strong>"Kopieer"</strong> bij de <strong>iFrame Code</strong></li>
                  <li>Open je page.tsx of component</li>
                  <li>Plak de iframe code in je JSX:</li>
                </ol>
                <pre className="bg-slate-900 text-green-400 p-3 rounded mt-2 text-xs overflow-x-auto">
{`export default function ContactPage() {
  return (
    <div>
      <h1>Vraag een offerte aan</h1>
      
      {/* Plak hier je iframe code */}
      <iframe src="https://jouw-app.vercel.app/embed/..." 
              width="100%" 
              height="900" 
              style={{border: 'none'}}
      />
    </div>
  )
}`}
                </pre>
              </div>

              <div className="border-t border-blue-300 pt-4">
                <strong className="text-lg">🔹 Normale HTML website</strong>
                <ol className="list-decimal ml-5 mt-2 space-y-1.5">
                  <li>Klik op <strong>"Kopieer"</strong> bij de embed code</li>
                  <li>Open je <code>index.html</code> of <code>contact.html</code></li>
                  <li>Plak de code waar je de widget wilt hebben</li>
                  <li>Upload naar je server - KLAAR!</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded border border-blue-300 mt-4">
                <strong>✅ Dat is alles!</strong> De widget werkt direct - geen extra installatie nodig.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

