"use client"

import { useParams } from "next/navigation"
import { MOCK_INVOICES, MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, CheckCircle2, ShieldCheck, Lock, Globe } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function ClientPortalPage() {
  const { invoiceId } = useParams()
  const { toast } = useToast()
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const invoice = MOCK_INVOICES.find(i => i.id === invoiceId) || MOCK_INVOICES[0]
  const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId)
  const org = MOCK_ORG

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

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border">
              <Image 
                src={org.logoUrl} 
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
                <span>Verified Payment Merchant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="size-4 mr-2" /> Download PDF
            </Button>
            <Badge 
              variant={isPaid || invoice.status === 'Paid' ? 'default' : 'outline'} 
              className={isPaid || invoice.status === 'Paid' ? 'bg-emerald-500 text-white border-none px-4 py-1' : 'bg-orange-50 text-orange-600 border-orange-200 px-4 py-1'}
            >
              {isPaid || invoice.status === 'Paid' ? 'PAID' : 'PAYMENT DUE'}
            </Badge>
          </div>
        </div>

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
                </div>
                <div className="grid grid-cols-2 md:text-right gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Invoice No.</p>
                    <p className="font-mono text-sm font-bold text-slate-900">{invoice.number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Amount Due</p>
                    <p className="text-sm font-bold text-slate-900">${total.toLocaleString()}</p>
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
                    <TableHead className="font-bold text-slate-900">Description</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Qty</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-transparent">
                      <TableCell className="py-6">
                        <p className="font-semibold text-slate-900">{item.description}</p>
                      </TableCell>
                      <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">${(item.quantity * item.price).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="w-full sm:w-[320px] space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-slate-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium text-slate-900">${tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Amount</span>
                  <span className="text-3xl font-extrabold" style={{ color: `hsl(${brandColor})` }}>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 md:p-12 flex flex-col items-center gap-8 border-t mt-8">
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="size-3" />
                <span>Major Cards Supported</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="size-3" />
                <span>Global Processing</span>
              </div>
            </div>

            {isPaid ? (
              <div className="flex flex-col items-center gap-4 text-center">
                 <div className="bg-emerald-100 p-4 rounded-full">
                    <CheckCircle2 className="size-12 text-emerald-600" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Payment Received</h3>
                    <p className="text-sm text-muted-foreground">A confirmation receipt has been sent to {client?.email}</p>
                 </div>
              </div>
            ) : (
              <Button 
                onClick={handlePay} 
                disabled={loading}
                className="w-full sm:w-auto h-16 px-16 text-xl text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                style={{ 
                  backgroundColor: `hsl(${brandColor})`,
                  boxShadow: `0 20px 25px -5px hsla(${brandColor}, 0.2)`
                }}
              >
                {loading ? "Processing Securely..." : "Pay with Card / Bank"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center gap-4 py-8">
           <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Securely Powered By</p>
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <CreditCard className="size-5" />
             <span className="text-lg font-bold">InvoiceSync</span>
           </div>
        </div>
      </div>
    </div>
  )
}
