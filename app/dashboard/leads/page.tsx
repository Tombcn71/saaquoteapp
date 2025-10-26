import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Euro, Image as ImageIcon } from "lucide-react"

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function LeadsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  const companyId = (session.user as any).companyId

  if (!companyId) {
    return <div>No company found. Please contact support.</div>
  }

  const sql = getDatabase()

  // Get leads for this company
  const leads = await sql`
    SELECT * FROM leads 
    WHERE company_id = ${companyId}
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    }
    return variants[status] || variants.new
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Leads</h1>
          <p className="text-muted-foreground">
            Alle quote aanvragen van je klanten
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totaal Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{leads.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nieuwe Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {leads.filter((l: any) => l.status === 'new').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totale Waarde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                €{leads.reduce((sum: number, l: any) => sum + (Number(l.quote_total) || 0), 0).toLocaleString('nl-NL')}
              </p>
            </CardContent>
          </Card>
        </div>

        {leads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2">Nog geen leads</p>
                <p className="text-sm">
                  Plaats je widget op je website om leads te ontvangen
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{lead.naam}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                        {lead.telefoon && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.telefoon}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(lead.created_at)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(lead.status)}>
                        {lead.status}
                      </Badge>
                      {lead.quote_total && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            €{Number(lead.quote_total).toLocaleString('nl-NL')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Specificaties</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Materiaal:</dt>
                          <dd className="font-medium">{lead.materiaal}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Kleur:</dt>
                          <dd className="font-medium">{lead.kleur}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type:</dt>
                          <dd className="font-medium">{lead.kozijn_type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Glas:</dt>
                          <dd className="font-medium">{lead.glas_type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Aantal ramen:</dt>
                          <dd className="font-medium">{lead.aantal_ramen}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Oppervlakte:</dt>
                          <dd className="font-medium">{lead.vierkante_meter_ramen} m²</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Extra opties</h4>
                      <ul className="space-y-2 text-sm">
                        {lead.montage && (
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Montage</span>
                          </li>
                        )}
                        {lead.afvoer_oude_kozijnen && (
                          <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Afvoer oude kozijnen</span>
                          </li>
                        )}
                      </ul>

                      {lead.photo_urls && lead.photo_urls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Foto's ({lead.photo_urls.length})
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {lead.photo_urls.map((url: string, idx: number) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={url}
                                  alt={`Foto ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded border hover:opacity-75 transition"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.quote_breakdown && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Prijsopbouw</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {Object.entries(lead.quote_breakdown).map(([key, value]: [string, any]) => (
                          <div key={key} className="bg-muted p-2 rounded">
                            <p className="text-muted-foreground capitalize">{key}</p>
                            <p className="font-bold">€{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

