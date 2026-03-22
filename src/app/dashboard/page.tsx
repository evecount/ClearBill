"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, FileText, Users, TrendingUp, ArrowUpRight, Plus, Sparkles, Copy, ExternalLink, Lightbulb, ArrowRight, Zap, Target, Star, ShieldCheck } from "lucide-react"
import { MOCK_INVOICES, MOCK_CLIENTS } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useDoc, useUser } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc } from "firebase/firestore"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const orgRef = useMemoFirebase(() => {
    if (!user) return null
    return doc(user.auth.firestore, 'organizations', user.uid)
  }, [user])

  const { data: org, isLoading: isOrgLoading } = useDoc(orgRef)

  const pendingAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.total, 0)

  const paidAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const copyPublicLink = () => {
    if (!org?.slug) return
    const url = `${origin}/u/${org.slug}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Your public profile link is ready to share." })
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Command center for your professional sovereignty.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/onboarding">
              <Sparkles className="size-4 mr-2" /> Strategic Re-Pivot
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/dashboard/invoices/new">
              <Plus className="size-4 mr-2" /> New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3" /> +12%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outcome Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
               Across {MOCK_INVOICES.filter(i => i.status === 'Pending').length} strategic wins
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sovereign Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_CLIENTS.length}</div>
            <p className="text-xs text-muted-foreground">
              High-trust partnerships
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Identity Strength</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Verified Ecosystem Active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content Area */}
        <div className="col-span-4 space-y-6">
          {/* Tier-0 Agentic Insights */}
          <Card className="border-accent/20 bg-slate-900 text-white overflow-hidden border-2">
            <div className="bg-accent h-1.5 w-full" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-accent p-1.5 rounded-lg text-white">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Tier-0 Strategic Partner</CardTitle>
                    <CardDescription className="text-slate-400">Deep Water logic derived from your Strategic DNA.</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-accent border-accent text-[10px] font-black uppercase tracking-widest">Autonomous Mode</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {org?.growthStrategy ? (
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
                      <Target className="size-4 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">The Outcome Pivot</p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {org.growthStrategy.initialFocus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="bg-purple-500/20 p-2 rounded-full shrink-0">
                      <Star className="size-4 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">High-Stakes Proposal (AMO Logic)</p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {org.growthStrategy.premiumTierSuggestion}
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-accent text-[10px] font-bold uppercase tracking-widest">
                        Architect Proposal <ArrowRight className="size-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  {org.growthStrategy.agenticInsight && (
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Strategic Co-Founder Directive</p>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{org.growthStrategy.agenticInsight}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                  <p className="text-sm text-slate-400">Initialize the Tier-0 Orchestrator to architect your growth roadmap.</p>
                  <Button asChild variant="link" className="text-accent mt-2">
                    <Link href="/onboarding">Activate Strategic DNA <ArrowRight className="size-3 ml-1" /></Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Sovereign Activity</CardTitle>
              <CardDescription>Tracking recent strategic wins and pending outcomes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outcome ID</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_INVOICES.slice(0, 5).map((invoice) => {
                    const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-xs font-bold">{invoice.number}</TableCell>
                        <TableCell className="text-xs">{client?.name}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} className={invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : ''}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs">${invoice.total.toLocaleString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="col-span-3 space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Public Identity</CardTitle>
              <CardDescription className="text-primary-foreground/70">The URL of your Professional Identity Ecosystem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs truncate font-mono opacity-80">clearbill.com/u/{org?.slug || org?.id || '...'}</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="size-8 hover:bg-white/20" onClick={copyPublicLink}>
                    <Copy className="size-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 hover:bg-white/20" asChild>
                    <Link href={`/u/${org?.slug || org?.id}`} target="_blank">
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Strategic Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/onboarding" className="flex items-center gap-4 rounded-xl border p-4 bg-accent/5 hover:bg-accent/10 transition-all border-accent/20 group">
                <div className="bg-accent/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-accent">Strategic DNA Update</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pivot business model</p>
                </div>
              </Link>
              <Link href="/dashboard/invoices/new" className="flex items-center gap-4 rounded-xl border p-4 hover:bg-slate-50 transition-all group">
                <div className="bg-slate-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Plus className="size-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Draft Outcome Invoice</p>
                  <p className="text-xs text-muted-foreground">Bill for a strategic win.</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
