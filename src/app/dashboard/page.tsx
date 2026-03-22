
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, FileText, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Settings } from "lucide-react"
import { MOCK_INVOICES, MOCK_CLIENTS } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const pendingAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.total, 0)

  const paidAmount = MOCK_INVOICES
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)

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
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="bg-primary/10 p-2 rounded-full">
                <Plus className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Create New Invoice</p>
                <p className="text-xs text-muted-foreground">Quickly bill a client for services.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="bg-accent/10 p-2 rounded-full">
                <Users className="size-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Add Client</p>
                <p className="text-xs text-muted-foreground">Expand your customer base.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="bg-blue-500/10 p-2 rounded-full">
                <Settings className="size-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Payment Settings</p>
                <p className="text-xs text-muted-foreground">Connect Stripe or your bank.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
