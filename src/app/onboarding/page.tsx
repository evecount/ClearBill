"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Loader2, ShieldCheck, Scissors, Music, HeartPulse, Code, Utensils, Hammer, Shield, Sparkles, Zap, Target, Star, Palette, PenTool, Home, TrendingUp, Briefcase, Landmark, CreditCard, Send, Camera, Upload, Globe, Link as LinkIcon } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useAuth, useUser, useFirestore } from "@/firebase"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { doc, collection, serverTimestamp } from "firebase/firestore"

const QUICK_STARTS = [
  { label: "Artist", icon: Palette, text: "I am an artist creating a proposal for a museum to showcase a series of Mekong Delta inspired storytelling installations." },
  { label: "Graphic Designer", icon: PenTool, text: "I am a graphic designer creating a brand logo and visual identity system for a new sustainable fashion startup." },
  { label: "Personal Chef", icon: Utensils, text: "I am a private personal chef providing boutique catering for small dinner parties and customized weekly meal prep for busy families." },
  { label: "Real Estate", icon: Home, text: "I am a luxury real estate agent providing high-trust property acquisition and portfolio management for high-net-worth individuals." },
  { label: "Handyman", icon: Hammer, text: "I provide high-quality home repair and maintenance services, specializing in property asset protection and longevity." },
  { label: "Software Expert", icon: Code, text: "I provide high-end software architectural consulting and delivery management for scale-up startups." },
  { label: "Marketing", icon: TrendingUp, text: "I am a marketing freelancer producing outcome-based campaign strategies that prioritize ROI and brand authority." },
  { label: "Security", icon: Shield, text: "I provide private security and executive protection for high-profile events and corporate leadership." },
  { label: "Wellness", icon: HeartPulse, text: "I provide personalized health and longevity coaching for high-performance executives and founders." },
  { label: "Trainer", icon: Briefcase, text: "I provide corporate training and leadership development workshops focused on organizational culture and outcomes." },
  { label: "Music/Sound", icon: Music, text: "I provide world-class music production and sound engineering for cinematic projects and recording artists." },
  { label: "Beauty/Aesthetics", icon: Scissors, text: "I am a luxury aesthetic artist providing high-trust beauty transformations and personalized skin health regimens." }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const firestore = useFirestore()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [basicFacts, setBasicFacts] = useState({
    businessName: "",
    location: "",
    industry: "",
    website: "",
    logoUrl: ""
  })

  const [description, setDescription] = useState("")
  const [proposal, setProposal] = useState<OnboardingConsultantOutput | null>(null)

  const handleNextToDescription = () => {
    if (!basicFacts.businessName || !basicFacts.location) {
      toast({ title: "Facts Required", description: "Please enter your business name and location.", variant: "destructive" })
      return
    }
    setStep(2)
  }

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Description Required", description: "Please describe your expertise.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      if (!user) {
        initiateAnonymousSignIn(auth)
      }

      const result = await consultBusinessOnboarding({ 
        userDescription: description,
        businessName: basicFacts.businessName,
        location: basicFacts.location,
        industry: basicFacts.industry,
        website: basicFacts.website
      })
      
      setProposal(result)
      setStep(3)
    } catch (error) {
      toast({ title: "Consultant Busy", description: "Please try again in a moment.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    if (!proposal || !user || !firestore) return

    const orgId = user.uid
    const slug = proposal.suggestedName.toLowerCase().replace(/[^a-z0-9]/g, '-')

    // Save Organization
    const orgData = {
      id: orgId,
      name: proposal.suggestedName,
      logoUrl: basicFacts.logoUrl || `https://picsum.photos/seed/${orgId}/200/200`,
      contactEmail: proposal.suggestedEmail,
      addressLine1: proposal.suggestedAddress,
      city: "",
      state: "",
      postalCode: "",
      country: proposal.suggestedAddress.split(',').pop()?.trim() || "USA",
      taxId: "",
      currency: "USD",
      brandColor: proposal.brandColor,
      missionStatement: proposal.missionStatement,
      industry: proposal.industry,
      slug: slug,
      website: basicFacts.website,
      growthStrategy: proposal.growthStrategy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    setDocumentNonBlocking(doc(firestore, 'organizations', orgId), orgData, { merge: true })

    // Save Draft Invoice
    const invoiceData = {
      organizationId: orgId,
      clientId: "first_client",
      number: `INV-${new Date().getFullYear()}-001`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Draft',
      totalAmount: proposal.suggestedLineItems.reduce((sum, item) => sum + item.price, 0),
      taxRate: 0,
      contractContent: `Strategic Outcome Agreement: ${proposal.missionStatement}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    addDocumentNonBlocking(collection(firestore, 'organizations', orgId, 'invoices'), invoiceData)
      .then(docRef => {
        proposal.suggestedLineItems.forEach(item => {
           addDocumentNonBlocking(collection(firestore, 'organizations', orgId, 'invoices', docRef?.id as string, 'lineItems'), {
             description: item.description,
             quantity: 1,
             unitPrice: item.price,
             amount: item.price,
             organizationId: orgId,
             invoiceId: docRef?.id
           })
        })
      })

    toast({ 
      title: "Identity & Invoice Saved", 
      description: "Your professional ecosystem is live. You can edit everything in Settings." 
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        
        {step === 1 && (
          <div className="max-w-xl mx-auto w-full">
             <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-10">
                  <CardTitle className="text-3xl font-black">The Foundation</CardTitle>
                  <CardDescription className="text-slate-400">Let's start with the non-negotiable facts of your craft.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground self-start">Business Identity</Label>
                    <div className="relative group cursor-pointer" onClick={() => {
                      const seed = Math.floor(Math.random() * 1000);
                      setBasicFacts({...basicFacts, logoUrl: `https://picsum.photos/seed/${seed}/200/200`})
                    }}>
                      <Avatar className="size-24 border-2 border-slate-200 shadow-sm transition-all group-hover:scale-105">
                        <AvatarImage src={basicFacts.logoUrl || `https://picsum.photos/seed/default/200/200`} />
                        <AvatarFallback><Camera className="size-8 text-slate-300" /></AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="size-6 text-white" />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Click to Shuffle Logo</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="biz-name" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Business Name</Label>
                      <Input 
                        id="biz-name" 
                        placeholder="e.g. Silver Oak Restoration" 
                        className="h-14 rounded-2xl text-lg border-slate-200"
                        value={basicFacts.businessName}
                        onChange={(e) => setBasicFacts({...basicFacts, businessName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="website" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Professional Website (Optional)</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="website" 
                          placeholder="https://yourwebsite.com" 
                          className="h-14 pl-12 rounded-2xl text-lg border-slate-200"
                          value={basicFacts.website}
                          onChange={(e) => setBasicFacts({...basicFacts, website: e.target.value})}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">We'll extract context and identity from your digital home.</p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Primary Location</Label>
                      <Input 
                        id="location" 
                        placeholder="e.g. Berlin, Germany" 
                        className="h-14 rounded-2xl text-lg border-slate-200"
                        value={basicFacts.location}
                        onChange={(e) => setBasicFacts({...basicFacts, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="industry" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Industry (Optional)</Label>
                      <Input 
                        id="industry" 
                        placeholder="e.g. Muralist & Fine Art" 
                        className="h-14 rounded-2xl text-lg border-slate-200"
                        value={basicFacts.industry}
                        onChange={(e) => setBasicFacts({...basicFacts, industry: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                  <Button className="w-full h-16 bg-accent hover:bg-accent/90 rounded-2xl text-xl font-bold shadow-xl shadow-accent/20" onClick={handleNextToDescription}>
                    Next: Strategic Context <ArrowRight className="ml-2 size-6" />
                  </Button>
                </CardFooter>
             </Card>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto w-full">
            <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-10 text-center">
                <CardTitle className="text-3xl font-black">Strategic Intent</CardTitle>
                <CardDescription className="text-slate-400">Describe your project or expertise, {basicFacts.businessName}.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Choose Your Professional Path</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {QUICK_STARTS.map((qs) => (
                      <button
                        key={qs.label}
                        onClick={() => setDescription(qs.text)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-3xl text-xs border-2 transition-all hover:scale-[1.02] text-center group",
                          description === qs.text ? "bg-accent border-accent text-white shadow-xl" : "bg-white border-slate-100 text-slate-600"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-2xl transition-transform group-hover:rotate-6",
                          description === qs.text ? "bg-white/20" : "bg-slate-50"
                        )}>
                          <qs.icon className="size-6 shrink-0" />
                        </div>
                        <span className="font-bold leading-tight">{qs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="desc" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Or Describe Your Own Craft</Label>
                    {description && <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setDescription("")}>Clear</Button>}
                  </div>
                  <Textarea 
                    id="desc"
                    placeholder="e.g. I am a landscape architect focused on sustainable urban ecosystems..."
                    className="min-h-[180px] text-xl p-6 rounded-3xl focus:ring-accent/20 border-slate-200 shadow-inner bg-slate-50/50 leading-relaxed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="p-10 pt-0 gap-4">
                <Button variant="ghost" className="h-16 px-8 rounded-2xl font-bold" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  className="flex-1 h-16 text-xl bg-accent hover:bg-accent/90 shadow-2xl rounded-2xl group font-black" 
                  onClick={handleConsult}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Architecting...
                    </>
                  ) : (
                    <>
                      Architect My First Invoice <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 3 && proposal && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="mb-12 text-center space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                 <ShieldCheck className="size-4" /> Identity & Invoice Architected
               </div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">The Visual First-Look</h1>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                 Based on your expertise, we've drafted your first high-value invoice. This is how the client sees your worth.
               </p>
             </div>

             <div className="grid gap-8 lg:grid-cols-5 items-start">
               <Card className="lg:col-span-3 border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                 <div className="h-4 w-full" style={{ backgroundColor: `hsl(${proposal.brandColor})` }} />
                 <CardContent className="p-10 md:p-14 space-y-10">
                   {/* Invoice Header Preview */}
                   <div className="flex justify-between items-start gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-4">
                           <Avatar className="size-16 border rounded-xl">
                             <AvatarImage src={basicFacts.logoUrl || `https://picsum.photos/seed/default/200/200`} />
                             <AvatarFallback>{proposal.suggestedName[0]}</AvatarFallback>
                           </Avatar>
                           <div className="space-y-1">
                             <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">From</p>
                             <h2 className="text-2xl font-black text-slate-900">{proposal.suggestedName}</h2>
                             <p className="text-sm text-muted-foreground leading-relaxed">{proposal.suggestedAddress}</p>
                           </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Amount Due</p>
                        <p className="text-4xl font-black tracking-tighter" style={{ color: `hsl(${proposal.brandColor})` }}>
                          ${proposal.suggestedLineItems.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                        </p>
                      </div>
                   </div>

                   <Separator className="bg-slate-100" />

                   {/* Line Items Preview */}
                   <div className="space-y-6">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-9"><p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Professional Outcome</p></div>
                        <div className="col-span-3 text-right"><p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Value</p></div>
                      </div>
                      <div className="space-y-4">
                        {proposal.suggestedLineItems.map((item, i) => (
                          <div key={i} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-9">
                              <p className="text-sm font-bold text-slate-800 leading-relaxed">{item.description}</p>
                            </div>
                            <div className="col-span-3 text-right font-black text-slate-900">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <Separator className="bg-slate-100" />

                   {/* Agreement Preview */}
                   <div className="p-6 bg-slate-50/50 rounded-2xl border border-dashed space-y-3">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Strategic Win Agreement</p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{proposal.missionStatement}"
                      </p>
                   </div>

                   <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02]" 
                     style={{ backgroundColor: `hsl(${proposal.brandColor})` }}
                     onClick={handleFinish}
                   >
                     Launch Profile & Invoice <ArrowRight className="ml-2 size-6" />
                   </Button>
                   <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-4">
                     You can refine your identity and logo anytime in Settings.
                   </p>
                 </CardContent>
               </Card>

               {/* DNA Sidebar */}
               <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-slate-900 text-white rounded-3xl border-none p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <Zap className="size-5 text-accent" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Growth Recommendation</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-accent">Immediate Strategic Move</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{proposal.growthStrategy.initialFocus}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Premium Yield Idea</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{proposal.growthStrategy.premiumTierSuggestion}</p>
                      </div>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="text-center">
                       <p className="text-[10px] text-slate-500 italic">"We don't bill for hours. We bill for the certainty of your success."</p>
                    </div>
                  </Card>

                  <div className="p-8 bg-white rounded-3xl border-2 border-slate-100 flex flex-col items-center gap-4 text-center">
                    <div className="size-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <ShieldCheck className="size-6 text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-sm">Verified Identity Architecture</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your identity ecosystem is now synchronized across all portals.
                    </p>
                  </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
