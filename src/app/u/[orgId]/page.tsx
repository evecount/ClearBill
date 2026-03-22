"use client"

import { useParams } from "next/navigation"
import { MOCK_INVOICES } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail, ShieldCheck, CreditCard, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCollection, useUser } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { collection, query, where } from "firebase/firestore"

export default function PublicOrgPage() {
  const { orgId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  
  const { user } = useUser()

  // For MVP, we're assuming orgId is the slug or uid. 
  // In a real app, you'd fetch the org by slug first.
  const orgsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(user.auth.firestore, 'organizations'), where('slug', '==', orgId))
  }, [user, orgId])

  const { data: orgs } = useCollection(orgsQuery)
  const org = orgs?.[0] || { name: "ClearBill Merchant", logoUrl: "", email: "" }

  const handlePayBalance = () => {
    toast({ title: "Secure Checkout", description: "Redirecting to your combined outstanding balance..." })
  }

  const handleLookup = () => {
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsLookupOpen(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 border-b bg-white flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 font-bold text-primary">
          <CreditCard className="size-5" />
          <span>ClearBill</span>
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
                    <span className="text-sm font-medium">Have an account with us?</span>
                    <Button variant="link" size="sm" className="text-accent" onClick={() => toast({ title: "Help", description: "Please contact support for account issues." })}>
                      Support Center <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 h-12 text-lg"
                    onClick={handlePayBalance}
                  >
                    Pay Outstanding Balance
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{org.contactEmail || org.email}</span>
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
              Are you a client? Enter your email to see your active invoices.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-10 px-3 rounded-md border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="outline" onClick={handleLookup} disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : "View My Invoices"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isLookupOpen} onOpenChange={setIsLookupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recent Invoices</DialogTitle>
            <DialogDescription>Invoices associated with {email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {MOCK_INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-bold">{inv.number}</p>
                  <p className="text-xs text-muted-foreground">Due: {inv.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${inv.total.toLocaleString()}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-accent">View & Pay</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t bg-white">
        <p>© 2024 {org.name}. Powered by ClearBill.</p>
      </footer>
    </div>
  )
}
