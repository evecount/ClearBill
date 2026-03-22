
"use client"

import { useParams } from "next/navigation"
import { MOCK_INVOICES, MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, CheckCircle2, ShieldCheck, Lock, Globe, Scale, FileText, Landmark } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useDoc, useUser } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc } from "firebase/firestore"

export default function ClientPortalPage() {
  const { invoiceId } = useParams()
  const { toast } = useToast()
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  // In a real app, we'd fetch the specific invoice and organization from Firestore.
  // For MVP, we'll try to get the org data if a user is logged in (likely the merchant testing).
  const orgRef = useMemoFirebase(() => {
    if (!user) return null
    return doc(user.auth.firestore, 'organizations', user.uid)
  }, [user])

  const { data: orgData } = useDoc(orgRef)
  const org = orgData || MOCK_ORG

  const invoice = MOCK_INVOICES.find(i => i.id === invoiceId) || MOCK_INVOICES[0]
  const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsPaid(true)
      toast({ title: "Payment Successful", description: "Your payment has been processed. Thank you!" })
    }, 2000)
  }

  const subtotal = invoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
  const tax = (subtotal * invoice.taxRate) / 100
  const total = subtotal + tax

  const brandColor = org.brandColor || '256 60% 55%'
  const currencySymbol = org.currency === 'GBP' ? '£' : org.currency === 'EUR' ? '€' : '$'

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border">
              <Image 
                src={org.logoUrl || 'https://picsum.photos/seed/org1/200/200'} 
                alt={org.name} 
                width={56} 
                height={56} 
                className="rounded-xl"
                data-ai-hint="corporate logo"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
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
              variant={isPaid || invoice.status === 'Paid' ? 'default' : 'outline'} 
              className={isPaid || invoice.status === 'Paid' ? 'bg-emerald-500 text-white border-none px-4 py-1' : 'bg-orange-50 text-orange-600 border-orange-200 px-4 py-1'}
            >
              {isPaid || invoice.status === 'Paid' ? 'PAID' : 'PAYMENT DUE'}
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
                        <h2 className="text-2xl font-bold text-slate-900">{client?.name}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{client?.address}</p>
                        <p className="text-sm font-medium" style={{ color: `hsl(${brandColor})` }}>{client?.email}</p>
                      </div>
                      
                      {org.taxId && (
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
                      {invoice.items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-transparent">
                          <TableCell className="py-6">
                            <p className="font-semibold text-slate-900">{item.description}</p>
                          </TableCell>
                          <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                          <TableCell className="text-right font-semibold text-slate-900">{currencySymbol}{(item.quantity * item.price).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
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
                {!isPaid && invoice.status !== 'Paid' && (
                  <Button 
                    onClick={handlePay} 
                    disabled={loading}
                    className="w-full h-16 text-xl text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: `hsl(${brandColor})`,
                      boxShadow: `0 20px 25px -5px hsla(${brandColor}, 0.2)`
                    }}
                  >
                    {loading ? "Processing Securely..." : "Pay Outcome Fee Securely"}
                  </Button>
                )}
                {isPaid || invoice.status === 'Paid' ? (
                  <div className="flex flex-col items-center gap-4 text-center w-full">
                     <div className="bg-emerald-100 p-4 rounded-full">
                        <CheckCircle2 className="size-8 text-emerald-600" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900">Strategic Win Confirmed</h3>
                  </div>
                ) : null}
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
                    <span className="text-[8px] font-bold text-center">Identity Verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Lock className="size-4 text-slate-400" />
                    <span className="text-[8px] font-bold text-center">Secure Vault</span>
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
