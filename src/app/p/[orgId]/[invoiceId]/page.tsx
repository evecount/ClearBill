
"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Download, CheckCircle2, ShieldCheck, Lock, Scale, Landmark, ExternalLink, Loader2, CreditCard } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useDoc, useFirestore, useCollection } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, collection } from "firebase/firestore"

export default function ClientPortalPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const invoiceId = params.invoiceId as string
  
  const { toast } = useToast()
  const [loadingPay, setLoadingPay] = useState(false)
  const firestore = useFirestore()

  const orgRef = useMemoFirebase(() => {
    if (!firestore || !orgId) return null
    return doc(firestore, 'organizations', orgId)
  }, [firestore, orgId])
  const { data: org, isLoading: isOrgLoading } = useDoc(orgRef)

  const invoiceRef = useMemoFirebase(() => {
    if (!firestore || !orgId || !invoiceId) return null
    return doc(firestore, 'organizations', orgId, 'invoices', invoiceId)
  }, [firestore, orgId, invoiceId])
  const { data: invoice, isLoading: isInvoiceLoading } = useDoc(invoiceRef)

  const lineItemsQuery = useMemoFirebase(() => {
    if (!firestore || !orgId || !invoiceId) return null
    return collection(firestore, 'organizations', orgId, 'invoices', invoiceId, 'lineItems')
  }, [firestore, orgId, invoiceId])
  const { data: lineItems, isLoading: isItemsLoading } = useCollection(lineItemsQuery)

  const clientRef = useMemoFirebase(() => {
    if (!firestore || !orgId || !invoice?.clientId) return null
    return doc(firestore, 'organizations', orgId, 'clients', invoice.clientId)
  }, [firestore, orgId, invoice?.clientId])
  const { data: client } = useDoc(clientRef)

  const handlePay = () => {
    if (org?.paymentLink) {
      toast({ title: "Secure Checkout", description: "Redirecting to your professional payment gateway..." })
      window.location.href = org.paymentLink
      return
    }

    setLoadingPay(true)
    setTimeout(() => {
      setLoadingPay(false)
      toast({ 
        title: "Simulation Mode", 
        description: "The merchant hasn't linked a payment gateway yet. In a live environment, you'd be redirected now.",
        variant: "destructive"
      })
    }, 1500)
  }

  if (isOrgLoading || isInvoiceLoading || isItemsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="size-8 animate-spin text-accent" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Architecting Portal...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center">
        <div className="space-y-4 max-w-sm">
          <CreditCard className="size-12 text-slate-200 mx-auto" />
          <h1 className="text-2xl font-bold">Portal Unavailable</h1>
          <p className="text-sm text-muted-foreground">The requested invoice ecosystem could not be found or has been archived.</p>
          <Button variant="outline" asChild className="mt-4"><a href="/">Return Home</a></Button>
        </div>
      </div>
    )
  }

  const subtotal = lineItems?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0
  const tax = (subtotal * (invoice.taxRate || 0)) / 100
  const total = subtotal + tax

  const brandColor = org?.brandColor || '256 60% 55%'
  const currencySymbol = org?.currency === 'GBP' ? '£' : org?.currency === 'EUR' ? '€' : '$'

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-8 font-body">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border">
              {org?.logoUrl ? (
                <Image 
                  src={org.logoUrl} 
                  alt={org.name} 
                  width={56} 
                  height={56} 
                  className="rounded-xl object-contain"
                />
              ) : (
                <div className="size-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                  {org?.name?.[0] || '?' }
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{org?.name || 'Professional Partner'}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span>Verified Professional Identity</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="size-4 mr-2" /> Download Bundle
            </Button>
            <Badge 
              variant={invoice.status === 'Paid' ? 'default' : 'outline'} 
              className={invoice.status === 'Paid' ? 'bg-emerald-500 text-white border-none px-4 py-1' : 'bg-orange-50 text-orange-600 border-orange-200 px-4 py-1'}
            >
              {invoice.status === 'Paid' ? 'PAID' : 'PAYMENT DUE'}
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
              <div className="h-2" style={{ backgroundColor: `hsl(${brandColor})` }} />
              <CardHeader className="p-8 md:p-12">
                 <div className="flex flex-col md:flex-row justify-between gap-12">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Billed To</p>
                        <h2 className="text-2xl font-bold text-slate-900">{client?.name || 'Our Valued Client'}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{client?.address}</p>
                        <p className="text-sm font-medium" style={{ color: `hsl(${brandColor})` }}>{client?.email}</p>
                      </div>
                      
                      {org?.taxId && (
                        <div className="pt-2 border-t border-dashed">
                          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Merchant Tax ID</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Landmark className="size-3 text-slate-400" />
                            <p className="text-xs font-mono font-bold text-slate-700">{org.taxId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:text-right gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Invoice No.</p>
                        <p className="font-mono text-sm font-bold text-slate-900">{invoice.number}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Strategic Total</p>
                        <p className="text-sm font-bold text-slate-900">{currencySymbol}{total.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Issued</p>
                        <p className="text-sm text-slate-900">{invoice.issueDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Due By</p>
                        <p className="text-sm font-bold text-destructive">{invoice.dueDate}</p>
                      </div>
                    </div>
                 </div>
              </CardHeader>

              <CardContent className="px-8 md:px-12">
                <div className="rounded-2xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900">Professional Outcome</TableHead>
                        <TableHead className="text-center font-bold text-slate-900">Qty</TableHead>
                        <TableHead className="text-right font-bold text-slate-900">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems?.map((item) => (
                        <TableRow key={item.id} className="hover:bg-transparent">
                          <TableCell className="py-6">
                            <p className="font-semibold text-slate-900">{item.description}</p>
                          </TableCell>
                          <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                          <TableCell className="text-right font-semibold text-slate-900">{currencySymbol}{(item.amount || 0).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {(!lineItems || lineItems.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">No outcomes defined.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="w-full sm:w-[320px] space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-slate-900">{currencySymbol}{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                      <span className="font-medium text-slate-900">{currencySymbol}{tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Outcome Fee</span>
                      <span className="text-3xl font-extrabold" style={{ color: `hsl(${brandColor})` }}>{currencySymbol}{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 md:p-12 border-t mt-8 bg-slate-50/50">
                {invoice.status !== 'Paid' && (
                  <Button 
                    onClick={handlePay} 
                    disabled={loadingPay}
                    className="w-full h-16 text-xl text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                    style={{ 
                      backgroundColor: `hsl(${brandColor})`,
                      boxShadow: `0 20px 25px -5px hsla(${brandColor}, 0.2)`
                    }}
                  >
                    {loadingPay ? "Processing Securely..." : (
                      <>
                        Pay Outcome Fee Securely <ExternalLink className="size-5" />
                      </>
                    )}
                  </Button>
                )}
                {invoice.status === 'Paid' && (
                  <div className="flex flex-col items-center gap-4 text-center w-full">
                     <div className="bg-emerald-100 p-4 rounded-full">
                        <CheckCircle2 className="size-8 text-emerald-600" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900">Strategic Win Confirmed</h3>
                     <p className="text-sm text-muted-foreground italic">Payment has been cleared and the outcome is archived.</p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
               <CardHeader className="bg-slate-900 text-white">
                 <div className="flex items-center gap-2">
                   <Scale className="size-4 text-accent" />
                   <CardTitle className="text-sm uppercase tracking-widest font-black">Outcome Agreement</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="p-6">
                 <div className="text-xs text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                    {invoice.contractContent || "A professional strategic outcome agreement is associated with this billing. Both parties acknowledge the fulfillment of the defined high-value work."}
                 </div>
               </CardContent>
            </Card>

            <div className="p-6 bg-white rounded-3xl shadow-lg border-2 border-slate-50 space-y-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Verified Ecosystem</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span className="text-[8px] font-bold text-center uppercase tracking-tight">Identity Verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Lock className="size-4 text-slate-400" />
                    <span className="text-[8px] font-bold text-center uppercase tracking-tight">Secure Vault</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-12">
           <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Securely Powered By</p>
           <div className="flex items-center gap-2 opacity-30">
             <CreditCard className="size-5" />
             <span className="text-xl font-headline tracking-tighter">ClearBill</span>
           </div>
        </div>
      </div>
    </div>
  )
}
