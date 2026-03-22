
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
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome. I'm your Strategic Identity Architect. To start, let's anchor the basic facts of your business. What's your business called and where are you based?", component: 'foundation' }
  ])
  
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSaveFoundation = () => {
    if (!basicFacts.businessName || !basicFacts.location) {
      toast({ title: "Facts Required", description: "Name and location are the minimum anchors." })
      return
    }
    
    setMessages(prev => [
      ...prev,
      { role: 'user', content: `My business is ${basicFacts.businessName}, based in ${basicFacts.location}.` },
      { role: 'assistant', content: "Excellent. Now, for the most critical visual anchor—your brand logo. Upload it here so I can embed it into your professional ecosystem.", component: 'logo' }
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
          { role: 'assistant', content: "Identity confirmed. Now, tell me about your unique craft. What is the 'Strategic Win' you deliver for your clients? Feel free to use one of our inspirations below.", component: 'description' }
        ])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Strategic Intent Required", description: "Describe your expertise to architect a win." })
      return
    }

    setLoading(true)
    try {
      if (!user) {
        initiateAnonymousSignIn(auth!)
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
      setMessages(prev => [
        ...prev,
        { role: 'user', content: description },
        { role: 'assistant', content: "I have architected your professional ecosystem. Your sample invoice and identity roadmap are ready.", component: 'final' }
      ])
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

    toast({ title: "Identity Launched", description: "Your ecosystem is live." })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-8 font-body selection:bg-accent/30">
      <div className="max-w-4xl w-full flex flex-col h-[calc(100vh-120px)] space-y-4">
        
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg text-white">
              <Bot className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Identity Architect</h1>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Sovereign Onboarding Active</p>
            </div>
          </div>
          <Badge variant="outline" className="text-accent border-accent text-[10px] font-black uppercase tracking-widest">
            Tier-0 Protocol
          </Badge>
        </div>

        <Card className="flex-1 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white flex flex-col">
          <ScrollArea className="flex-1 p-6 md:p-10">
            <div className="space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex gap-4",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    m.role === 'user' ? "bg-slate-900 text-white" : "bg-accent text-white"
                  )}>
                    {m.role === 'user' ? <User className="size-5" /> : <Bot className="size-5" />}
                  </div>
                  <div className={cn(
                    "space-y-6 w-full max-w-[85%]",
                    m.role === 'user' ? "items-end text-right" : "items-start"
                  )}>
                    <div className={cn(
                      "p-6 rounded-[2rem] text-sm md:text-base leading-relaxed",
                      m.role === 'user' ? "bg-slate-100 text-slate-800" : "bg-white border-2 border-slate-100 text-slate-800 shadow-sm"
                    )}>
                      {m.content}
                    </div>

                    {m.role === 'assistant' && m.component === 'foundation' && (
                      <Card className="border-accent/10 bg-slate-50/50 rounded-3xl p-6 space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Name</Label>
                            <Input 
                              placeholder="e.g. Nexus Creative" 
                              className="h-12 rounded-xl bg-white"
                              value={basicFacts.businessName}
                              onChange={(e) => setBasicFacts({...basicFacts, businessName: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</Label>
                            <Input 
                              placeholder="e.g. Singapore" 
                              className="h-12 rounded-xl bg-white"
                              value={basicFacts.location}
                              onChange={(e) => setBasicFacts({...basicFacts, location: e.target.value})}
                            />
                          </div>
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90 h-12 rounded-xl font-black" onClick={handleSaveFoundation}>
                          Save Foundation <ArrowRight className="size-4 ml-2" />
                        </Button>
                      </Card>
                    )}

                    {m.role === 'assistant' && m.component === 'logo' && (
                      <div className="flex flex-col items-center gap-4 w-full animate-in zoom-in-95 duration-500">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <Avatar className="size-32 border-4 border-accent/10 shadow-lg rounded-3xl overflow-hidden ring-4 ring-white transition-transform hover:scale-105">
                            <AvatarImage src={basicFacts.logoUrl} className="object-contain p-2" />
                            <AvatarFallback className="bg-slate-50"><Camera className="size-10 text-slate-300" /></AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="size-8 text-white" />
                          </div>
                        </div>
                        <Button variant="outline" className="border-accent text-accent hover:bg-accent/5 rounded-xl px-8" onClick={() => fileInputRef.current?.click()}>
                          Click to Select Brand Logo
                        </Button>
                      </div>
                    )}

                    {m.role === 'assistant' && m.component === 'description' && (
                      <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {QUICK_STARTS.map((qs) => (
                            <button
                              key={qs.label}
                              onClick={() => setDescription(qs.text)}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-xl text-[10px] border transition-all text-left group",
                                description === qs.text ? "bg-accent border-accent text-white shadow-md" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                              )}
                            >
                              <qs.icon className="size-4 shrink-0" />
                              <span className="font-bold truncate">{qs.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <Textarea 
                            placeholder="Describe your expertise..." 
                            className="min-h-[140px] rounded-2xl p-5 text-base border-slate-200 bg-slate-50 shadow-inner"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                          <Button 
                            className="absolute bottom-3 right-3 bg-accent hover:bg-accent/90 rounded-xl"
                            onClick={handleConsult}
                            disabled={loading}
                          >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {m.role === 'assistant' && m.component === 'final' && proposal && (
                      <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                         <Card className="w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                           <div className="h-4 w-full" style={{ backgroundColor: `hsl(${proposal.brandColor})` }} />
                           <CardContent className="p-8 md:p-12 space-y-8">
                             <div className="flex justify-between items-start gap-4">
                                <div className="space-y-4">
                                   <div className="size-16 bg-slate-50 rounded-2xl border flex items-center justify-center overflow-hidden">
                                     {basicFacts.logoUrl ? <img src={basicFacts.logoUrl} className="object-contain p-1" /> : <Landmark className="size-6 text-slate-300" />}
                                   </div>
                                   <div className="space-y-1">
                                     <h2 className="text-xl font-black">{proposal.suggestedName}</h2>
                                     <p className="text-xs text-muted-foreground">{proposal.suggestedAddress}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Sample Total</p>
                                  <p className="text-3xl font-black" style={{ color: `hsl(${proposal.brandColor})` }}>
                                    ${proposal.suggestedLineItems.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                  </p>
                                </div>
                             </div>
                             <div className="space-y-4">
                               {proposal.suggestedLineItems.map((item, i) => (
                                 <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-dashed">
                                   <span className="font-bold text-slate-800">{item.description}</span>
                                   <span className="font-black text-slate-900">${item.price.toLocaleString()}</span>
                                 </div>
                               ))}
                             </div>
                             <div className="p-4 bg-slate-50 rounded-xl border border-dashed">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Outcome Agreement</p>
                                <p className="text-[10px] text-slate-600 italic">"{proposal.missionStatement}"</p>
                             </div>
                             <Button className="w-full h-14 font-black rounded-xl shadow-lg" 
                               style={{ backgroundColor: `hsl(${proposal.brandColor})` }}
                               onClick={handleFinish}
                             >
                               Confirm & Go to Dashboard <ArrowRight className="ml-2 size-5" />
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
        </Card>
      </div>
    </div>
  )
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black transition-colors uppercase",
      variant === "outline" ? "border-current" : "bg-primary text-primary-foreground",
      className
    )}>
      {children}
    </span>
  )
}
