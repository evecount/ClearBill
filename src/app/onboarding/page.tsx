
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Loader2, ShieldCheck, Scissors, Music, HeartPulse, Code, Utensils, Hammer, Shield, Sparkles, Zap, Target, Star, Palette, PenTool, Home, TrendingUp, Briefcase, Landmark, Camera, Upload, Link as LinkIcon, MapPin, Globe } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useAuth, useUser, useFirestore, useDoc } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [basicFacts, setBasicFacts] = useState({
    businessName: "",
    location: "",
    address: "",
    industry: "",
    website: "",
    logoUrl: ""
  })

  const [description, setDescription] = useState("")
  const [proposal, setProposal] = useState<OnboardingConsultantOutput | null>(null)

  // Pre-fill from existing data if user is already logged in
  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])

  const { data: existingOrg, isLoading: isOrgLoading } = useDoc(orgRef)

  useEffect(() => {
    if (existingOrg) {
      setBasicFacts({
        businessName: existingOrg.name || "",
        location: `${existingOrg.city || ""}${existingOrg.country ? `, ${existingOrg.country}` : ""}`,
        address: existingOrg.addressLine1 || "",
        industry: existingOrg.industry || "",
        website: existingOrg.website || "",
        logoUrl: existingOrg.logoUrl || ""
      })
    }
  }, [existingOrg])

  const handleNextToDescription = () => {
    if (!basicFacts.businessName || !basicFacts.location) {
      toast({ title: "Facts Required", description: "Please enter your business name and general location.", variant: "destructive" })
      return
    }
    setStep(2)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBasicFacts({ ...basicFacts, logoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Description Required", description: "Please describe your expertise.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // If not logged in, initiate anonymous sign-in
      if (!user) {
        initiateAnonymousSignIn(auth)
      }

      const result = await consultBusinessOnboarding({ 
        userDescription: description,
        businessName: basicFacts.businessName,
        location: basicFacts.location,
        address: basicFacts.address,
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

    const orgData = {
      id: orgId,
      name: proposal.suggestedName,
      logoUrl: basicFacts.logoUrl || "",
      contactEmail: proposal.suggestedEmail,
      addressLine1: basicFacts.address || proposal.suggestedAddress,
      city: basicFacts.location.split(',')[0]?.trim() || "",
      state: "",
      postalCode: "",
      country: basicFacts.location.split(',').pop()?.trim() || "USA",
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12 font-body selection:bg-accent/30">
      <div className="max-w-5xl w-full space-y-8">
        
        {step === 1 && (
          <div className="max-w-xl mx-auto w-full">
             <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-900 text-white p-10">
                  <CardTitle className="text-3xl font-black">The Foundation</CardTitle>
                  <CardDescription className="text-slate-400">Anchor your professional identity with the hard facts.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground self-start">Business Identity</Label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                    />
                    <div 
                      className="relative group cursor-pointer" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Avatar className="size-32 border-2 border-slate-200 shadow-sm transition-all group-hover:scale-105 rounded-3xl overflow-hidden">
                        <AvatarImage src={basicFacts.logoUrl} className="object-contain p-2" />
                        <AvatarFallback className="bg-slate-50 rounded-3xl"><Camera className="size-10 text-slate-300" /></AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="size-8 text-white" />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      {basicFacts.logoUrl ? "Change Logo" : "Upload Brand Logo"}
                    </p>
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
                      <Label htmlFor="website" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Professional Website</Label>
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
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-xs uppercase font-black tracking-widest text-muted-foreground">General Location (City, Country)</Label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input 
                            id="location" 
                            placeholder="e.g. Berlin, Germany" 
                            className="h-14 pl-12 rounded-2xl text-lg border-slate-200"
                            value={basicFacts.location}
                            onChange={(e) => setBasicFacts({...basicFacts, location: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="address" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Professional Billing Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input 
                            id="address" 
                            placeholder="e.g. 123 Studio Way, Unit 4" 
                            className="h-14 pl-12 rounded-2xl text-lg border-slate-200"
                            value={basicFacts.address}
                            onChange={(e) => setBasicFacts({...basicFacts, address: e.target.value})}
                          />
                        </div>
                      </div>
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
            <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-900 text-white p-10 text-center">
                <CardTitle className="text-3xl font-black">Strategic Intent</CardTitle>
                <CardDescription className="text-slate-400">What are we architecting today, {basicFacts.businessName}?</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Professional Inspirations</Label>
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
                    <Label htmlFor="desc" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Your Unique Craft</Label>
                    {description && <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setDescription("")}>Clear</Button>}
                  </div>
                  <Textarea 
                    id="desc"
                    placeholder="Describe the high-value project or expertise you want to bill for..."
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
                      Architect My Visual First-Look <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
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
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sample Invoice</h1>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                 This is how your client sees your worth. Everything you see can be refined later in Settings.
               </p>
             </div>

             <div className="flex justify-center">
               <Card className="max-w-2xl w-full border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                 <div className="h-4 w-full" style={{ backgroundColor: `hsl(${proposal.brandColor})` }} />
                 <CardContent className="p-10 md:p-14 space-y-10">
                   <div className="flex justify-between items-start gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="space-y-4">
                           <div className="size-20 bg-slate-50 rounded-2xl border flex items-center justify-center overflow-hidden">
                             {basicFacts.logoUrl ? (
                               <img src={basicFacts.logoUrl} alt="Logo" className="object-contain p-1" />
                             ) : (
                               <Landmark className="size-8 text-slate-300" />
                             )}
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">From</p>
                             <h2 className="text-2xl font-black text-slate-900">{proposal.suggestedName}</h2>
                             <p className="text-sm text-muted-foreground leading-relaxed">{proposal.suggestedAddress}</p>
                           </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total Value</p>
                        <p className="text-4xl font-black tracking-tighter" style={{ color: `hsl(${proposal.brandColor})` }}>
                          ${proposal.suggestedLineItems.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                        </p>
                      </div>
                   </div>

                   <Separator className="bg-slate-100" />

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

                   <div className="p-6 bg-slate-50/50 rounded-2xl border border-dashed space-y-3">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Outcome Agreement</p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{proposal.missionStatement}"
                      </p>
                   </div>

                   <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02]" 
                     style={{ backgroundColor: `hsl(${proposal.brandColor})` }}
                     onClick={handleFinish}
                   >
                     Confirm & Go to Dashboard <ArrowRight className="ml-2 size-6" />
                   </Button>
                 </CardContent>
               </Card>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
