import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Euro, Image as ImageIcon, Sparkles } from "lucide-react"

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function SalesLeadsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  const sql = getDatabase()

  // Get HOMEPAGE DEMO leads (sales leads)
  const leads = await sql`
    SELECT * FROM leads 
    WHERE widget_id = 'homepage-demo'
    ORDER BY created_at DESC
    LIMIT 100
  `

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Leads (Homepage Demo)</h1>
            <p className="text-muted-foreground">
              Potentiële klanten die het formulier op de homepage hebben getest
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totaal Demo Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{leads.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deze Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {leads.filter((l: any) => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(l.created_at) > weekAgo
                }).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vandaag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {leads.filter((l: any) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return new Date(l.created_at) > today
                }).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {leads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nog geen demo leads. Ze verschijnen hier zodra iemand het homepage formulier invult.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{lead.naam}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </span>
                        {lead.telefoon && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {lead.telefoon}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                        🎯 Sales Lead
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Type:</span> {lead.form_type || 'kozijnen'}</p>
                        {lead.materiaal && <p><span className="font-medium">Materiaal:</span> {lead.materiaal}</p>}
                        {lead.kleur && <p><span className="font-medium">Kleur/Stijl:</span> {lead.kleur}</p>}
                        {lead.aantal_ramen && <p><span className="font-medium">Aantal:</span> {lead.aantal_ramen}</p>}
                        {lead.vierkante_meter_ramen && <p><span className="font-medium">m²:</span> {lead.vierkante_meter_ramen}</p>}
                      </div>
                    </div>
                    <div>
                      {lead.quote_total && (
                        <div className="mb-3">
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Geschatte Prijs</h4>
                          <div className="flex items-center gap-2">
                            <Euro className="w-5 h-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">
                              €{parseFloat(lead.quote_total).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      )}
                      {lead.photo_urls && lead.photo_urls.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            Foto's ({lead.photo_urls.length})
                          </h4>
                          <div className="flex gap-2">
                            {lead.photo_urls.slice(0, 3).map((url: string, idx: number) => (
                              <img 
                                key={idx}
                                src={url} 
                                alt={`Foto ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

