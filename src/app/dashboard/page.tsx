
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, FileText, Users, TrendingUp, ArrowUpRight, Plus, Settings, Sparkles, Copy, ExternalLink, Link as LinkIcon } from "lucide-react"
import { MOCK_INVOICES, MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { toast } = useToast()
  const pendingAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.total, 0)

  const paidAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const copyPublicLink = () => {
    const url = `${window.location.origin}/u/${MOCK_ORG.id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Your public profile link is ready to share." })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
               Across {MOCK_INVOICES.filter(i => i.status === 'Pending').length} invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_CLIENTS.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              Instant digital payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>A list of your most recent billing activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_INVOICES.slice(0, 5).map((invoice) => {
                  const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{client?.name}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} className={invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${invoice.total.toLocaleString()}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="col-span-3 space-y-4">
          <Card className="bg-primary text-white border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Public Link</CardTitle>
              <CardDescription className="text-primary-foreground/70">Share this link with clients or add it to your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs truncate font-mono opacity-80">invoicesync.com/u/{MOCK_ORG.id}</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="size-8 hover:bg-white/20" onClick={copyPublicLink}>
                    <Copy className="size-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 hover:bg-white/20" asChild>
                    <Link href={`/u/${MOCK_ORG.id}`} target="_blank">
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/onboarding" className="flex items-center gap-4 rounded-lg border p-4 bg-accent/5 hover:bg-accent/10 transition-colors border-accent/20">
                <div className="bg-accent/20 p-2 rounded-full">
                  <Sparkles className="size-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-accent">Activate AI Consultant</p>
                  <p className="text-xs text-muted-foreground">Refine your business brand & mission.</p>
                </div>
              </Link>
              <Link href="/dashboard/invoices/new" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Plus className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Create New Invoice</p>
                  <p className="text-xs text-muted-foreground">Quickly bill a client for services.</p>
                </div>
              </Link>
              <Link href="/dashboard/clients" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="bg-emerald-500/10 p-2 rounded-full">
                  <Users className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add Client</p>
                  <p className="text-xs text-muted-foreground">Expand your customer base.</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
