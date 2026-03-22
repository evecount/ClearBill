
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_INVOICES as INITIAL_INVOICES, MOCK_CLIENTS } from "@/lib/mock-data"
import { Plus, Search, ExternalLink, MoreVertical, Copy, Trash2, Filter, Download, Send, Share2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function InvoicesPage() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [search, setSearch] = useState("")
  const [shareInvoice, setShareInvoice] = useState<any>(null)

  const filteredInvoices = invoices.filter(inv => {
    const client = MOCK_CLIENTS.find(c => c.id === inv.clientId)
    return (
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase())
    )
  })

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/p/${id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Professional payment portal URL copied to clipboard." })
  }

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id))
    toast({ title: "Invoice Deleted", description: "The invoice has been removed." })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your branded client billing.</p>
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
              <Input 
                placeholder="Search invoices by number or client..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="size-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
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
                      <TableCell className="text-sm">{invoice.dueDate}</TableCell>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-accent hover:text-accent hover:bg-accent/10"
                            onClick={() => setShareInvoice(invoice)}
                            title="Share Link"
                          >
                            <Share2 className="size-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => copyLink(invoice.id)}>
                                <Copy className="size-4 mr-2" /> Copy Payment Link
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/p/${invoice.id}`} target="_blank">
                                  <ExternalLink className="size-4 mr-2" /> Open Branded Portal
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(invoice.id)}
                              >
                                <Trash2 className="size-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!shareInvoice} onOpenChange={(open) => !open && setShareInvoice(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Branded Portal</DialogTitle>
            <DialogDescription>
              Copy the unique payment link for this invoice to send to your client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Link</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
                <code className="text-xs truncate flex-1">
                  {window.location.origin}/p/{shareInvoice?.id}
                </code>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => copyLink(shareInvoice?.id)}>
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email Template</p>
              <div className="p-3 bg-muted/30 rounded-lg border text-sm italic text-muted-foreground">
                "Hello, please find your invoice {shareInvoice?.number} ready for review and secure payment at the link below..."
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
              className="bg-accent hover:bg-accent/90"
              onClick={() => {
                copyLink(shareInvoice?.id)
                setShareInvoice(null)
              }}
            >
              <Copy className="size-4 mr-2" /> Copy & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
