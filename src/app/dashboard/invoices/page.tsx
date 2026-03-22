
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ExternalLink, MoreVertical, Copy, Trash2, Filter, Share2, Sparkles, Loader2, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { generateInvoiceEmail, type InvoiceEmailOutput } from "@/ai/flows/invoice-email-generator"
import { Separator } from "@/components/ui/separator"
import { useUser, useFirestore, useCollection } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { query, collection, orderBy, doc } from "firebase/firestore"
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function InvoicesPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  const [search, setSearch] = useState("")
  const [shareInvoice, setShareInvoice] = useState<any>(null)
  const [aiEmail, setAiEmail] = useState<InvoiceEmailOutput | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const invoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return query(
      collection(firestore, 'organizations', user.uid, 'invoices'),
      orderBy('createdAt', 'desc')
    )
  }, [user, firestore])

  const { data: invoices, isLoading } = useCollection(invoicesQuery)

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return collection(firestore, 'organizations', user.uid, 'clients')
  }, [user, firestore])
  const { data: clients } = useCollection(clientsQuery)

  const filteredInvoices = invoices?.filter(inv => {
    const client = clients?.find(c => c.id === inv.clientId)
    return (
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase())
    )
  }) || []

  const copyLink = (id: string) => {
    const url = `${origin || window.location.origin}/p/${id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Professional payment portal URL copied to clipboard." })
  }

  const handleDelete = (id: string) => {
    if (!user || !firestore) return
    const docRef = doc(firestore, 'organizations', user.uid, 'invoices', id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Invoice Deleted", description: "The invoice has been removed." })
  }

  const handleGenerateAiEmail = async () => {
    if (!shareInvoice || !user) return
    setLoadingEmail(true)
    const client = clients?.find(c => c.id === shareInvoice.clientId)
    
    // Get org name for the AI
    const orgRef = doc(firestore!, 'organizations', user.uid)
    try {
      const result = await generateInvoiceEmail({
        businessName: "Your Business",
        clientName: client?.name || "Client",
        invoiceNumber: shareInvoice.number,
        amount: `$${shareInvoice.totalAmount.toLocaleString()}`,
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

      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">Fetching professional ledger...</div>
      ) : filteredInvoices.length > 0 ? (
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
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
                {filteredInvoices.map((invoice) => {
                  const client = clients?.find(c => c.id === invoice.clientId)
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm font-bold">{invoice.number}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{client?.name || "Unknown Client"}</span>
                          <span className="text-xs text-muted-foreground">{client?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                      <TableCell className="font-bold text-accent">${invoice.totalAmount.toLocaleString()}</TableCell>
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
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <FileText className="size-12 mx-auto mb-4 text-slate-200" />
          <h3 className="text-lg font-bold">No Invoices Yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Invoices are the bridge to your strategic revenue. Create one to get started.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/dashboard/invoices/new">
              <Plus className="size-4 mr-2" /> Create First Invoice
            </Link>
          </Button>
        </div>
      )}

      <Dialog open={!!shareInvoice} onOpenChange={(open) => !open && setShareInvoice(null)}>
        <DialogContent className="sm:max-w-md rounded-t-3xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>Share Branded Portal</DialogTitle>
            <DialogDescription>Deliver your unique identity ecosystem to your client.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Link</p>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border">
                <code className="text-xs truncate flex-1 font-mono">
                  {origin}/p/{shareInvoice?.id}
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
                <div className="space-y-3">
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 text-sm space-y-2">
                    <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Subject</p>
                    <p className="font-medium">{aiEmail.subject}</p>
                    <Separator className="my-2" />
                    <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Body</p>
                    <div className="whitespace-pre-wrap text-slate-600 leading-relaxed italic">
                      {aiEmail.body.replace('[PAYMENT_LINK]', `${origin}/p/${shareInvoice?.id}`)}
                    </div>
                  </div>
                  <Button className="w-full text-xs h-10 bg-accent hover:bg-accent/90" onClick={() => {
                    const text = `Subject: ${aiEmail.subject}\n\n${aiEmail.body.replace('[PAYMENT_LINK]', `${origin}/p/${shareInvoice?.id}`)}`;
                    navigator.clipboard.writeText(text);
                    toast({ title: "Email Copied", description: "Subject and body copied to clipboard." });
                  }}>
                    <Copy className="size-3 mr-2" /> Copy Full Message
                  </Button>
                </div>
              ) : (
                <div className="p-8 bg-slate-50/50 border border-dashed rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground italic">Click "Generate" to architect a professional message.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800" onClick={() => { copyLink(shareInvoice?.id); setShareInvoice(null); }}>
              Copy Link & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
