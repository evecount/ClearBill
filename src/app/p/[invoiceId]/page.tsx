
"use client"

import { useParams } from "next/navigation"
import { MOCK_INVOICES, MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Download, CheckCircle2 } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-[#EAEFF5] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Image 
              src={MOCK_ORG.logoUrl} 
              alt={MOCK_ORG.name} 
              width={64} 
              height={64} 
              className="rounded-xl shadow-sm"
              data-ai-hint="corporate logo"
            />
            <div>
              <h1 className="text-2xl font-bold font-headline">{MOCK_ORG.name}</h1>
              <p className="text-sm text-muted-foreground">{MOCK_ORG.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-2" /> PDF
            </Button>
            <Badge variant={isPaid || invoice.status === 'Paid' ? 'default' : 'outline'} className={isPaid || invoice.status === 'Paid' ? 'bg-emerald-500 text-white' : 'text-orange-500 border-orange-200'}>
              {isPaid || invoice.status === 'Paid' ? 'PAID' : 'PENDING PAYMENT'}
            </Badge>
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-accent" />
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-6 p-8">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Invoice To</p>
              <h2 className="text-xl font-bold">{client?.name}</h2>
              <p className="text-sm text-muted-foreground max-w-[200px]">{client?.address}</p>
              <p className="text-sm text-muted-foreground">{client?.email}</p>
            </div>
            <div className="text-right space-y-2">
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Invoice Number</p>
                <p className="font-mono text-sm font-bold">{invoice.number}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Issued Date</p>
                <p className="text-sm">{invoice.issueDate}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Due Date</p>
                <p className="text-sm font-bold text-destructive">{invoice.dueDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Description</TableHead>
                  <TableHead className="text-center font-bold">Qty</TableHead>
                  <TableHead className="text-right font-bold">Unit Price</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-4 font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">${(item.quantity * item.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8 flex justify-end">
              <div className="w-full sm:w-[300px] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Due</span>
                  <span className="text-accent">${(subtotal + tax).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CreditCard className="size-5" />
              <p className="text-sm">Securely processed by {MOCK_ORG.name}</p>
            </div>
            {isPaid ? (
              <Button disabled className="bg-emerald-500 h-12 px-8 text-lg hover:bg-emerald-500 cursor-default opacity-100">
                <CheckCircle2 className="size-5 mr-2" /> Paid
              </Button>
            ) : (
              <Button 
                onClick={handlePay} 
                disabled={loading}
                className="bg-accent hover:bg-accent/90 text-white h-12 px-12 text-lg shadow-lg shadow-accent/20 transition-all active:scale-95"
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Powered by InvoiceSync. All rights reserved.
        </p>
      </div>
    </div>
  )
}
