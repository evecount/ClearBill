
"use client"

import { useParams } from "next/navigation"
import { MOCK_ORG, MOCK_INVOICES } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail, ShieldCheck, CreditCard, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PublicOrgPage() {
  const { orgId } = useParams()
  
  // In a real app, we'd fetch the org by orgId
  const org = MOCK_ORG

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 border-b bg-white flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 font-bold text-primary">
          <CreditCard className="size-5" />
          <span>InvoiceSync</span>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center pb-8 border-b">
              <div className="flex justify-center mb-4">
                <Avatar className="size-24 border-4 border-white shadow-lg">
                  <AvatarImage src={org.logoUrl} alt={org.name} />
                  <AvatarFallback>{org.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-3xl font-bold">{org.name}</CardTitle>
              <CardDescription className="text-lg mt-2">Client Billing & Support Portal</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-500" /> Secure Payments
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Welcome to the {org.name} billing portal. All transactions are securely processed via industry-standard encryption.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Looking for a specific invoice?</span>
                    <Button variant="link" size="sm" className="text-accent">
                      Help me find it <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 h-12 text-lg">
                    Pay Outstanding Balance
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{org.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="size-4" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground">
              Are you a client? You can access all your invoices by entering your email.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-10 px-3 rounded-md border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
              <Button variant="outline">View My Invoices</Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t bg-white">
        <p>© 2024 {org.name}. Powered by InvoiceSync.</p>
      </footer>
    </div>
  )
}
