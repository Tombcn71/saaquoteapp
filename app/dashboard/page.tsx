import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp, Code, Euro } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const companyId = (session.user as any).companyId

  if (!companyId) {
    return <div className="p-8">No company found. Please contact support.</div>
  }

  const sql = getDatabase()

  // Get company info
  const companies = await sql`
    SELECT * FROM companies WHERE id = ${companyId}
  `
  const company = companies[0]

  // Get leads stats
  const leads = await sql`
    SELECT * FROM leads WHERE company_id = ${companyId}
  `
  
  const totalLeads = leads.length
  const newLeads = leads.filter((l: any) => l.status === 'new').length
  const totalRevenue = leads.reduce((sum: number, l: any) => sum + (Number(l.quote_total) || 0), 0)
  const avgQuote = totalLeads > 0 ? totalRevenue / totalLeads : 0

  // Get widgets stats
  const widgets = await sql`
    SELECT * FROM widgets WHERE company_id = ${companyId}
  `
  
  const totalViews = widgets.reduce((sum: number, w: any) => sum + (w.views || 0), 0)
  const totalConversions = widgets.reduce((sum: number, w: any) => sum + (w.conversions || 0), 0)
  const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0

  const stats = [
    {
      title: "Totaal Leads",
      value: totalLeads.toString(),
      description: `${newLeads} nieuwe`,
      icon: Users,
      trend: totalLeads > 0 ? `+${totalLeads}` : "0",
    },
    {
      title: "Totale Waarde",
      value: `€${totalRevenue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}`,
      description: "Alle offertes samen",
      icon: Euro,
      trend: `Ø €${avgQuote.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}`,
    },
    {
      title: "Widget Views",
      value: totalViews.toString(),
      description: `${totalConversions} conversies`,
      icon: BarChart3,
      trend: `${widgets.length} actieve widget${widgets.length !== 1 ? 's' : ''}`,
    },
    {
      title: "Conversie Ratio",
      value: `${conversionRate.toFixed(1)}%`,
      description: "Views → Leads",
      icon: TrendingUp,
      trend: totalViews > 0 ? `${totalViews} views` : "Nog geen views",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Welkom terug, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-muted-foreground">
            {company?.name} - Overzicht van je kozijn SaaS platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🚀 Quick Start Guide</CardTitle>
              <CardDescription>Plaats je widget in 3 simpele stappen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Pak je widget code</h3>
                  <p className="text-sm text-muted-foreground">Ga naar Widgets en kopieer de embed code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Plaats op je website</h3>
                  <p className="text-sm text-muted-foreground">Plak de code waar je de widget wilt tonen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Ontvang Leads</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered quotes verschijnen direct in je Leads overzicht
                  </p>
                </div>
              </div>
              
              <Link href="/dashboard/widgets">
                <Button className="w-full mt-4">
                  <Code className="w-4 h-4 mr-2" />
                  Bekijk Widget Code
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Recente Leads</CardTitle>
              <CardDescription>Je laatste offerteaanvragen</CardDescription>
            </CardHeader>
            <CardContent>
              {totalLeads === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm mb-2">Nog geen leads</p>
                    <Link href="/dashboard/widgets">
                      <Button variant="outline" size="sm">
                        Plaats je widget
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.slice(0, 3).map((lead: any) => (
                    <div key={lead.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{lead.naam}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          €{Number(lead.quote_total).toLocaleString('nl-NL')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/leads">
                    <Button variant="outline" className="w-full mt-3">
                      Bekijk alle leads →
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
