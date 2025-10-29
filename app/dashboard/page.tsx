import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp, Code, DollarSign, CreditCard, Zap, Eye, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

  // Mock subscription data (in production, fetch from Stripe)
  const subscription = {
    plan: "Professional",
    status: "active",
    aiPreviewsUsed: totalConversions,
    aiPreviewsLimit: 5000,
    billingPeriod: "monthly",
    nextBillingDate: "2025-11-29",
    amount: 49
  }

  const usagePercentage = (subscription.aiPreviewsUsed / subscription.aiPreviewsLimit) * 100

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      description: `${newLeads} new this month`,
      icon: Users,
      trend: totalLeads > 0 ? `+${totalLeads}%` : "0%",
      color: "text-blue-400"
    },
    {
      title: "AI Previews",
      value: subscription.aiPreviewsUsed.toString(),
      description: `of ${subscription.aiPreviewsLimit} limit`,
      icon: Zap,
      trend: `${usagePercentage.toFixed(0)}% used`,
      color: "text-purple-400"
    },
    {
      title: "Widget Views",
      value: totalViews.toString(),
      description: `${widgets.length} active widgets`,
      icon: Eye,
      trend: `${conversionRate.toFixed(1)}% conversion`,
      color: "text-cyan-400"
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      description: "Views → Leads",
      icon: Target,
      trend: totalViews > 0 ? "Tracking" : "No data",
      color: "text-green-400"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-400">
            {company?.name} - Your NanoBanana AI Widget Dashboard
          </p>
        </div>

        {/* Subscription Status Card */}
        <Card className="mb-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">{subscription.plan} Plan</CardTitle>
                  <CardDescription className="text-gray-400">
                    ${subscription.amount}/month · Next billing: {subscription.nextBillingDate}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Preview Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">AI Preview Usage</span>
                  <span className="text-sm font-semibold text-purple-400">
                    {subscription.aiPreviewsUsed} / {subscription.aiPreviewsLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.max(subscription.aiPreviewsLimit - subscription.aiPreviewsUsed, 0)} previews remaining
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  disabled
                >
                  Manage Subscription
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  disabled
                >
                  View Invoices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  <p className="text-xs text-purple-400 mt-2">{stat.trend}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Start Guide */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Quick Start Guide
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get your AI widget live in 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Get your widget code</h3>
                  <p className="text-sm text-gray-400">Go to Widgets and copy the embed code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Paste on your website</h3>
                  <p className="text-sm text-gray-400">Add the code where you want the widget to appear</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Collect leads</h3>
                  <p className="text-sm text-gray-400">
                    AI-powered previews generate qualified leads automatically
                  </p>
                </div>
              </div>
              
              <Link href="/dashboard/widgets">
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30">
                  <Code className="w-4 h-4 mr-2" />
                  View Widget Code
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Recent Leads
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalLeads === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <p className="text-sm mb-3">No leads yet</p>
                    <Link href="/dashboard/widgets">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                      >
                        Set up your widget
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.slice(0, 3).map((lead: any) => (
                    <div key={lead.id} className="flex justify-between items-start border-b border-purple-500/10 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-white">{lead.naam}</p>
                        <p className="text-sm text-gray-400">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          ${Number(lead.quote_total).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/leads">
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      View all leads →
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
