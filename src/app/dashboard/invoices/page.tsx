"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_INVOICES as INITIAL_INVOICES, MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { Plus, Search, ExternalLink, MoreVertical, Copy, Trash2, Filter, Download, Send, Share2, Sparkles, Loader2, Calendar, DollarSign, User, FileText } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { generateInvoiceEmail, type InvoiceEmailOutput } from "@/ai/flows/invoice-email-generator"
import { Separator } from "@/components/ui/separator"

export default function InvoicesPage() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [search, setSearch] = useState("")
  const [shareInvoice, setShareInvoice] = useState<any>(null)
  const [aiEmail, setAiEmail] = useState<InvoiceEmailOutput | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(false)

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

  const handleGenerateAiEmail = async () => {
    if (!shareInvoice) return
    setLoadingEmail(true)
    const client = MOCK_CLIENTS.find(c => c.id === shareInvoice.clientId)
    try {
      const result = await generateInvoiceEmail({
        businessName: MOCK_ORG.name,
        clientName: client?.name || "Client",
        invoiceNumber: shareInvoice.number,
        amount: `$${shareInvoice.total.toLocaleString()}`,
        brandingTone: "Professional and encouraging"
      })
      setAiEmail(result)
    } catch (error) {
      toast({ title: "AI Error", description: "Could not generate email snippet.", variant: "destructive" })
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and track your professional billing.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 hidden md:flex">
          <Link href="/dashboard/invoices/new">
            <Plus className="size-4 mr-2" /> New Invoice
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-10 border-none shadow-none focus-visible:ring-0" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="size-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="grid gap-4 md:hidden pb-12">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => {
            const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)
            return (
              <Card key={invoice.id} className="overflow-hidden border-none shadow-md">
                <CardHeader className="p-4 bg-slate-50 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                      <FileText className="size-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold">{invoice.number}</p>
                      <Badge 
                        variant={invoice.status === 'Paid' ? 'default' : 'secondary'} 
                        className={invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-none h-5 px-1.5' : 'h-5 px-1.5'}
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Invoice Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => copyLink(invoice.id)}>
                        <Copy className="size-4 mr-2" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/p/${invoice.id}`} target="_blank">
                          <ExternalLink className="size-4 mr-2" /> Open Portal
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(invoice.id)}>
                        <Trash2 className="size-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Client</p>
                      <p className="font-bold text-sm">{client?.name}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total</p>
                      <p className="font-black text-lg text-accent">${invoice.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="size-3" /> Due {invoice.dueDate}
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-accent font-bold"
                        onClick={() => {
                          setShareInvoice(invoice)
                          setAiEmail(null)
                        }}
                      >
                        <Share2 className="size-3 mr-1" /> Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-white rounded-2xl border border-dashed">
            No invoices found.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden border-none shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold">Invoice</TableHead>
                <TableHead className="font-bold">Client</TableHead>
                <TableHead className="font-bold">Due Date</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
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
                      <TableCell className="font-bold text-accent">${invoice.total.toLocaleString()}</TableCell>
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
                            onClick={() => {
                              setShareInvoice(invoice)
                              setAiEmail(null)
                            }}
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
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="size-8 opacity-20" />
                      <p>No invoices found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!shareInvoice} onOpenChange={(open) => !open && setShareInvoice(null)}>
        <DialogContent className="sm:max-w-md rounded-t-3xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>Share Branded Portal</DialogTitle>
            <DialogDescription>
              Deliver your unique identity ecosystem to your client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Link</p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border">
                <code className="text-xs truncate flex-1 font-mono">
                  {window.location.origin}/p/{shareInvoice?.id}
                </code>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => copyLink(shareInvoice?.id)}>
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">AI Delivery Snippet</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-accent hover:text-accent"
                  onClick={handleGenerateAiEmail}
                  disabled={loadingEmail}
                >
                  {loadingEmail ? <Loader2 className="size-3 animate-spin mr-2" /> : <Sparkles className="size-3 mr-2" />}
                  {aiEmail ? "Refine" : "Generate"}
                </Button>
              </div>
              
              {aiEmail ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-sm space-y-2">
                    <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Subject</p>
                    <p className="font-medium">{aiEmail.subject}</p>
                    <Separator className="my-2" />
                    <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Body</p>
                    <div className="whitespace-pre-wrap text-slate-600 leading-relaxed italic">
                      {aiEmail.body.replace('[PAYMENT_LINK]', `${window.location.origin}/p/${shareInvoice?.id}`)}
                    </div>
                  </div>
                  <Button className="w-full text-xs h-10 bg-accent hover:bg-accent/90" onClick={() => {
                    const text = `Subject: ${aiEmail.subject}\n\n${aiEmail.body.replace('[PAYMENT_LINK]', `${window.location.origin}/p/${shareInvoice?.id}`)}`;
                    navigator.clipboard.writeText(text);
                    toast({ title: "Email Copied", description: "Subject and body copied to clipboard." });
                  }}>
                    <Copy className="size-3 mr-2" /> Copy Full Message
                  </Button>
                </div>
              ) : (
                <div className="p-8 bg-slate-50/50 border border-dashed rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground italic">Click "Generate" to architect a professional message for this link.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
              className="w-full h-12 bg-slate-900 hover:bg-slate-800"
              onClick={() => {
                copyLink(shareInvoice?.id)
                setShareInvoice(null)
              }}
            >
              <Copy className="size-4 mr-2" /> Copy Link & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
