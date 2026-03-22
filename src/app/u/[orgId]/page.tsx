"use client"

import { useParams } from "next/navigation"
import { MOCK_INVOICES } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail, ShieldCheck, CreditCard, ArrowRight, Loader2, Globe } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCollection, useUser, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { collection, query, where } from "firebase/firestore"

export default function PublicOrgPage() {
  const { orgId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  
  const { user } = useUser()
  const firestore = useFirestore()

  // For MVP, we're assuming orgId is the slug or uid. 
  // In a real app, you'd fetch the org by slug first.
  const orgsQuery = useMemoFirebase(() => {
    if (!firestore || !orgId) return null
    return query(collection(firestore, 'organizations'), where('slug', '==', orgId))
  }, [firestore, orgId])

  const { data: orgs, isLoading } = useCollection(orgsQuery)
  const org = orgs?.[0]

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!org && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center">
        <div className="space-y-4">
          <Globe className="size-12 text-slate-200 mx-auto" />
          <h1 className="text-2xl font-bold">Identity Not Found</h1>
          <p className="text-muted-foreground">This professional portal has not been launched yet.</p>
          <Button variant="outline" asChild><a href="/">Return Home</a></Button>
        </div>
      </div>
    )
  }

  const brandOrg = org || { name: "ClearBill Merchant", logoUrl: "", contactEmail: "" }

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
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <div className="h-3 w-full bg-accent opacity-20" />
            <CardHeader className="text-center pb-8 border-b">
              <div className="flex justify-center mb-4">
                <Avatar className="size-28 border-4 border-white shadow-lg rounded-3xl overflow-hidden">
                  <AvatarImage src={brandOrg.logoUrl} alt={brandOrg.name} className="object-contain p-2" />
                  <AvatarFallback className="bg-slate-900 text-white text-3xl font-bold rounded-3xl">{brandOrg.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-3xl font-black text-slate-900">{brandOrg.name}</CardTitle>
              <CardDescription className="text-lg mt-2 font-medium">Professional Client Portal</CardDescription>
              {brandOrg.industry && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mt-4">
                  {brandOrg.industry}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid gap-8">
                <div className="space-y-4">
                  <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <ShieldCheck className="size-4 text-emerald-500" /> Secure Payments & Outcomes
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {brandOrg.missionStatement || `Welcome to the ${brandOrg.name} billing portal. All transactions are securely processed and anchored in outcome certainty.`}
                  </p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Registered Client?</span>
                    <Button variant="link" size="sm" className="text-accent h-auto p-0 font-bold" onClick={() => toast({ title: "Help", description: `Please contact ${brandOrg.contactEmail} for support.` })}>
                      Support Center <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 h-14 text-lg font-black rounded-2xl shadow-xl shadow-accent/10"
                    onClick={handlePayBalance}
                  >
                    Pay Outstanding Balance
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6 border-t border-dashed">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Mail className="size-4 text-accent" />
                  <span>{brandOrg.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span className="uppercase tracking-widest">SSL Encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-6">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Existing Client Lookup
            </p>
            <div className="flex max-w-sm mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your registered email" 
                className="flex-1 h-12 px-5 rounded-xl border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800" onClick={handleLookup} disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : "View Invoices"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isLookupOpen} onOpenChange={setIsLookupOpen}>
        <DialogContent className="max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Recent Invoices</DialogTitle>
            <DialogDescription>Showing secure billing associated with {email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            {MOCK_INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-5 border rounded-2xl bg-slate-50 hover:bg-white transition-colors cursor-pointer group">
                <div>
                  <p className="text-sm font-black text-slate-900">{inv.number}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Due: {inv.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-accent">${inv.total.toLocaleString()}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-accent font-bold text-xs">View & Pay <ArrowRight className="size-3 ml-1 group-hover:translate-x-1 transition-transform" /></Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-t bg-white">
        <p>© 2024 {brandOrg.name}. Securely Powered by ClearBill.</p>
      </footer>
    </div>
  )
}
