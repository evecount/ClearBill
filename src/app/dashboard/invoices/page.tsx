
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_INVOICES, MOCK_CLIENTS } from "@/lib/mock-data"
import { Plus, Search, ExternalLink, MoreVertical, Copy, Trash2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function InvoicesPage() {
  const { toast } = useToast()

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/p/${id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Payment portal URL copied to clipboard." })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your client billing.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/dashboard/invoices/new">
            <Plus className="size-4 mr-2" /> New Invoice
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search invoices by number or client..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVOICES.map((invoice) => {
                const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm font-bold">{invoice.number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{client?.name}</span>
                        <span className="text-xs text-muted-foreground">{client?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="font-bold">${invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={invoice.status === 'Paid' ? 'default' : 'secondary'} 
                        className={invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : ''}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => copyLink(invoice.id)}>
                            <Copy className="size-4 mr-2" /> Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/p/${invoice.id}`} target="_blank">
                              <ExternalLink className="size-4 mr-2" /> View Portal
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="size-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
