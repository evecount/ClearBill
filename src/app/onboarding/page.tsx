
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Loader2, ShieldCheck, Sparkles, Zap, Target, Star, Bot, User, Camera, Upload, Globe, MapPin, Send, Palette, PenTool, Utensils, Home, Hammer, Code, TrendingUp, Shield, HeartPulse, Briefcase, Music, Scissors, Landmark } from "lucide-react"
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
  { label: "Personal Chef", icon: Utensils, text: "I am a private personal chef providing boutique catering for small dinner parties." },
  { label: "Real Estate", icon: Home, text: "I am a luxury real estate agent providing high-trust property acquisition." },
  { label: "Handyman", icon: Hammer, text: "I provide high-quality home repair and maintenance services." },
  { label: "Software Expert", icon: Code, text: "I provide high-end software architectural consulting." },
  { label: "Marketing", icon: TrendingUp, text: "I am a marketing freelancer producing outcome-based campaign strategies." },
  { label: "Security", icon: Shield, text: "I provide private security and executive protection." },
  { label: "Wellness", icon: HeartPulse, text: "I provide personalized health and longevity coaching." },
  { label: "Trainer", icon: Briefcase, text: "I provide corporate training and leadership development workshops." },
  { label: "Music/Sound", icon: Music, text: "I provide world-class music production and sound engineering." },
  { label: "Beauty/Aesthetics", icon: Scissors, text: "I am a luxury aesthetic artist providing high-trust beauty transformations." }
]

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
  component?: 'foundation' | 'description' | 'logo' | 'final'
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const firestore = useFirestore()
  const { user, isUserLoading } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome back. Let's get your first professional invoice ready. To start, what's your business called and where are you based?", component: 'foundation' }
  ])
  
  const [loading, setLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(true)
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

  // Fetch real org data to check for existing identity
  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])
  const { data: existingOrg, isLoading: isOrgLoading } = useDoc(orgRef)

  // 1. Anchor Identity Immediately
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  // 2. Redirect if Identity already exists (bypass onboarding)
  useEffect(() => {
    if (!isOrgLoading && !isUserLoading) {
      if (existingOrg) {
        router.push('/dashboard')
      } else {
        setIsSyncing(false)
      }
    }
  }, [existingOrg, isOrgLoading, isUserLoading, router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSaveFoundation = () => {
    if (!basicFacts.businessName || !basicFacts.location) {
      toast({ title: "Details Required", description: "Business name and location are required to start." })
      return
    }
    
    setMessages(prev => [
      ...prev,
      { role: 'user', content: `My business is ${basicFacts.businessName}, based in ${basicFacts.location}.` },
      { role: 'assistant', content: "Great. Now, let's add your logo to the invoice. Upload it here so I can professionally brand your documents.", component: 'logo' }
    ])
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBasicFacts({ ...basicFacts, logoUrl: reader.result as string })
        setMessages(prev => [
          ...prev,
          { role: 'user', content: "Logo uploaded." },
          { role: 'assistant', content: "Branding set. Now, tell me about the work you do. What services are we billing for today?", component: 'description' }
        ])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Work Description Required", description: "Please describe the services to be billed." })
      return
    }

    setLoading(true)
    try {
      const result = await consultBusinessOnboarding({ 
        userDescription: description,
        businessName: basicFacts.businessName,
        location: basicFacts.location,
        address: basicFacts.address,
        industry: basicFacts.industry,
        website: basicFacts.website
      })
      
      setProposal(result)
      setMessages(prev => [
        ...prev,
        { role: 'user', content: description },
        { role: 'assistant', content: "I've drafted your first professional invoice based on your expertise. Take a look at the preview below.", component: 'final' }
      ])
    } catch (error) {
      toast({ title: "Partner Busy", description: "Please try again in a moment.", variant: "destructive" })
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
      contractContent: `Outcome Agreement: ${proposal.missionStatement}`,
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

    toast({ title: "Invoice Ready", description: "Your professional billing ecosystem is live." })
    router.push("/dashboard")
  }

  if (isSyncing || isUserLoading || isOrgLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="size-12 animate-spin text-accent mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Recognizing Identity...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 font-body selection:bg-accent/30">
      <div className="max-w-4xl w-full flex flex-col h-[calc(100vh-40px)]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-12 py-12">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  m.role === 'user' ? "bg-slate-900 text-white" : "bg-accent text-white"
                )}>
                  {m.role === 'user' ? <User className="size-6" /> : <Bot className="size-6" />}
                </div>
                <div className={cn(
                  "space-y-6 w-full max-w-[85%]",
                  m.role === 'user' ? "items-end text-right" : "items-start"
                )}>
                  <div className={cn(
                    "p-8 rounded-[2.5rem] text-lg md:text-xl leading-relaxed shadow-sm",
                    m.role === 'user' ? "bg-slate-50 text-slate-800" : "bg-white border-2 border-slate-100 text-slate-800"
                  )}>
                    {m.content}
                  </div>

                  {m.role === 'assistant' && m.component === 'foundation' && (
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-8 w-full border border-slate-100 animate-in zoom-in-95 duration-500">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Business Name</Label>
                          <Input 
                            placeholder="e.g. Nexus Creative" 
                            className="h-14 rounded-2xl bg-white text-lg px-6"
                            value={basicFacts.businessName}
                            onChange={(e) => setBasicFacts({...basicFacts, businessName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Location</Label>
                          <Input 
                            placeholder="e.g. Singapore" 
                            className="h-14 rounded-2xl bg-white text-lg px-6"
                            value={basicFacts.location}
                            onChange={(e) => setBasicFacts({...basicFacts, location: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90 h-14 rounded-2xl font-black text-lg" onClick={handleSaveFoundation}>
                        Continue <ArrowRight className="size-5 ml-2" />
                      </Button>
                    </div>
                  )}

                  {m.role === 'assistant' && m.component === 'logo' && (
                    <div className="flex flex-col items-center gap-6 w-full animate-in zoom-in-95 duration-500">
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="size-40 border-8 border-accent/5 shadow-2xl rounded-[3rem] overflow-hidden ring-4 ring-white transition-all hover:scale-105">
                          <AvatarImage src={basicFacts.logoUrl} className="object-contain p-4" />
                          <AvatarFallback className="bg-slate-50"><Camera className="size-12 text-slate-300" /></AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-[3rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="size-10 text-white" />
                        </div>
                      </div>
                      <Button variant="outline" className="border-accent text-accent hover:bg-accent/5 rounded-2xl px-12 h-14 font-bold text-lg" onClick={() => fileInputRef.current?.click()}>
                        Upload Brand Logo
                      </Button>
                    </div>
                  )}

                  {m.role === 'assistant' && m.component === 'description' && (
                    <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {QUICK_STARTS.map((qs) => (
                          <button
                            key={qs.label}
                            onClick={() => setDescription(qs.text)}
                            className={cn(
                              "flex flex-col items-center gap-3 p-6 rounded-[2rem] text-sm border transition-all text-center group",
                              description === qs.text ? "bg-accent border-accent text-white shadow-xl scale-105" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            <qs.icon className={cn("size-8 shrink-0 mb-1", description === qs.text ? "text-white" : "text-accent")} />
                            <span className="font-black uppercase tracking-tighter leading-none">{qs.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <Textarea 
                          placeholder="Tell me about the work you've done..." 
                          className="min-h-[180px] rounded-[2.5rem] p-8 text-xl border-slate-200 bg-slate-50 shadow-inner leading-relaxed"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button 
                          className="absolute bottom-6 right-6 bg-accent hover:bg-accent/90 rounded-2xl size-14 shadow-xl"
                          onClick={handleConsult}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="size-6 animate-spin" /> : <Send className="size-6" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {m.role === 'assistant' && m.component === 'final' && proposal && (
                    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                       <Card className="w-full border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[3.5rem] overflow-hidden bg-white">
                         <div className="h-6 w-full" style={{ backgroundColor: `hsl(${proposal.brandColor})` }} />
                         <CardContent className="p-12 md:p-20 space-y-12">
                           <div className="flex justify-between items-start gap-8">
                                <div className="space-y-6">
                                   <div className="size-24 bg-slate-50 rounded-[2rem] border-2 flex items-center justify-center overflow-hidden shadow-sm">
                                     {basicFacts.logoUrl ? <img src={basicFacts.logoUrl} className="object-contain p-2" /> : <Landmark className="size-10 text-slate-200" />}
                                   </div>
                                   <div className="space-y-2">
                                     <h2 className="text-3xl font-black tracking-tight">{proposal.suggestedName}</h2>
                                     <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{proposal.suggestedAddress}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Elite Outcome Fee</p>
                                  <p className="text-6xl font-black tracking-tighter" style={{ color: `hsl(${proposal.brandColor})` }}>
                                    ${proposal.suggestedLineItems.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                  </p>
                                </div>
                           </div>
                           <div className="space-y-6">
                             {proposal.suggestedLineItems.map((item, i) => (
                               <div key={i} className="flex justify-between items-center text-lg py-4 border-b-2 border-slate-50 border-dashed">
                                 <span className="font-bold text-slate-800">{item.description}</span>
                                 <span className="font-black text-slate-900">${item.price.toLocaleString()}</span>
                               </div>
                             ))}
                           </div>
                           <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Strategic Outcome Agreement</p>
                                <p className="text-lg text-slate-600 italic leading-relaxed">"{proposal.missionStatement}"</p>
                           </div>
                           <Button className="w-full h-20 text-2xl font-black rounded-[2rem] shadow-2xl transition-transform hover:scale-[1.01] active:scale-95" 
                             style={{ backgroundColor: `hsl(${proposal.brandColor})` }}
                             onClick={handleFinish}
                           >
                             Confirm & Launch First Invoice <ArrowRight className="ml-3 size-7" />
                           </Button>
                         </CardContent>
                       </Card>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
