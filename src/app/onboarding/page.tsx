
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowRight, Briefcase, Loader2, ShieldCheck, Scissors, Music, HeartPulse, Code, Utensils, Hammer, Shield, Sparkles, Zap, Target, Star, TrendingUp, Lightbulb } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@/firebase"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { doc, serverTimestamp } from "firebase/firestore"
import { Separator } from "@/components/ui/separator"

const QUICK_STARTS = [
  { label: "Personal Chef", icon: Utensils, text: "I am a private personal chef providing boutique catering for small dinner parties and customized weekly meal prep for busy families." },
  { label: "Software Architect", icon: Code, text: "I provide high-end software architectural consulting and delivery management for scale-up startups." },
  { label: "Lash Artist", icon: Scissors, text: "I run a boutique eyelash studio providing luxury extensions and lash lifts." },
  { label: "Handyman", icon: Hammer, text: "I provide high-quality home repair and maintenance services for local homeowners." },
  { label: "Sound Engineer", icon: Music, text: "I am a freelance sound engineer specializing in podcast post-production and custom sound design." },
  { label: "Security Expert", icon: Shield, text: "I provide private security and executive protection for high-profile events and corporate offices." },
  { label: "Wellness Coach", icon: HeartPulse, text: "I provide personalized health and longevity coaching for high-performance executives." }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user } = useUser()
  const [step, setStep] = useState(1) // 1: Basic Facts, 2: Strategic Description, 3: Review
  const [loading, setLoading] = useState(false)
  
  // Basic Facts
  const [basicFacts, setBasicFacts] = useState({
    businessName: "",
    location: "",
    industry: ""
  })

  // Strategic Context
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

      // We pass the basic facts so the AI works within the human's constraints
      const result = await consultBusinessOnboarding({ 
        userDescription: `Business Name: ${basicFacts.businessName}. Industry: ${basicFacts.industry}. Context: ${description}` 
      })
      
      // Override AI suggestions with human facts for total accuracy
      setProposal({
        ...result,
        suggestedName: basicFacts.businessName,
        suggestedAddress: basicFacts.location,
        industry: basicFacts.industry || result.industry
      })
      setStep(3)
    } catch (error) {
      toast({ title: "Consultant Busy", description: "Please try again in a moment.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    if (!proposal || !user) return

    const orgId = user.uid
    const slug = proposal.suggestedName.toLowerCase().replace(/[^a-z0-9]/g, '-')

    const orgData = {
      id: orgId,
      name: proposal.suggestedName,
      logoUrl: `https://picsum.photos/seed/${orgId}/200/200`,
      contactEmail: proposal.suggestedEmail,
      addressLine1: proposal.suggestedAddress,
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
      taxId: "",
      currency: "USD",
      brandColor: proposal.brandColor,
      missionStatement: proposal.missionStatement,
      industry: proposal.industry,
      slug: slug,
      website: "",
      growthStrategy: proposal.growthStrategy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    setDocumentNonBlocking(doc(user.auth.firestore, 'organizations', orgId), orgData, { merge: true })

    toast({ 
      title: "Identity Profile Saved", 
      description: "Your professional profile is now live. You can edit these details any time in Settings." 
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        
        {step === 1 && (
          <div className="max-w-xl mx-auto w-full">
             <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-2xl">The Professional Foundation</CardTitle>
                  <CardDescription className="text-slate-400">Let's start with the non-negotiable facts of your craft.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="biz-name">Business Name</Label>
                    <Input 
                      id="biz-name" 
                      placeholder="e.g. Silver Oak Restoration" 
                      className="h-12 rounded-xl"
                      value={basicFacts.businessName}
                      onChange={(e) => setBasicFacts({...basicFacts, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g. Austin, Texas" 
                      className="h-12 rounded-xl"
                      value={basicFacts.location}
                      onChange={(e) => setBasicFacts({...basicFacts, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Input 
                      id="industry" 
                      placeholder="e.g. Master Carpentry" 
                      className="h-12 rounded-xl"
                      value={basicFacts.industry}
                      onChange={(e) => setBasicFacts({...basicFacts, industry: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-xl text-lg font-bold" onClick={handleNextToDescription}>
                    Next: Strategic Context <ArrowRight className="ml-2 size-5" />
                  </Button>
                </CardFooter>
             </Card>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full">
            <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8 text-center">
                <CardTitle className="text-2xl">The Strategic Core</CardTitle>
                <CardDescription className="text-slate-400">How do you provide a win for your clients, {basicFacts.businessName}?</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="desc" className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Your Expertise</Label>
                  <Textarea 
                    id="desc"
                    placeholder="Describe your services in your own words..."
                    className="min-h-[180px] text-lg p-5 rounded-2xl focus:ring-accent/20 border-slate-200 shadow-inner bg-slate-50/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Quick Inspiration</Label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_STARTS.map((qs) => (
                      <button
                        key={qs.label}
                        onClick={() => setDescription(qs.text)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:bg-slate-50",
                          description === qs.text ? "bg-accent border-accent text-white shadow-lg" : "bg-white border-slate-200 text-slate-600"
                        )}
                      >
                        <qs.icon className="size-3" />
                        {qs.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 gap-3">
                <Button variant="ghost" className="h-14 px-6" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  className="flex-1 h-14 text-lg bg-accent hover:bg-accent/90 shadow-xl rounded-xl group" 
                  onClick={handleConsult}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Architecting Profile...
                    </>
                  ) : (
                    <>
                      Design My Identity <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="grid lg:grid-cols-5 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="lg:col-span-3 shadow-2xl border-none overflow-hidden h-full rounded-3xl">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-[10px] font-black tracking-widest text-white uppercase">
                    <Zap className="size-3" /> Strategic DNA
                  </div>
                  <Sparkles className="size-5 text-accent" />
                </div>
                <CardTitle className="text-4xl font-black tracking-tight">{proposal?.suggestedName}</CardTitle>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{proposal?.industry}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Identity Tone</Label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border">
                      <div 
                        className="size-5 rounded-full border shadow-sm shrink-0" 
                        style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }} 
                      />
                      <p className="font-bold text-slate-800">{proposal?.brandingTone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Professional Mission</Label>
                    <p className="text-sm text-slate-600 italic leading-relaxed font-medium">"{proposal?.missionStatement}"</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-widest text-accent font-black block border-b pb-2">Growth Roadmap</Label>
                  <div className="grid gap-4">
                    <div className="flex gap-4 items-start p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <div className="bg-emerald-100 p-2 rounded-xl shrink-0">
                        <Target className="size-4 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Immediate Focus</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proposal?.growthStrategy.initialFocus}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                      <div className="bg-purple-100 p-2 rounded-xl shrink-0">
                        <Star className="size-4 text-purple-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Premium Outcome</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proposal?.growthStrategy.premiumTierSuggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 bg-slate-50 border-t flex flex-col gap-3">
                <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl text-lg font-bold shadow-xl" onClick={handleFinish}>
                  Launch My Profile <ArrowRight className="ml-2 size-5" />
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">You can refine all details later in Settings</p>
              </CardFooter>
            </Card>

            <div className="lg:col-span-2 space-y-6 sticky top-24">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black ml-1">Live Portal Preview</Label>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                      {proposal?.suggestedName?.[0]}
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">{proposal?.suggestedName}</span>
                  </div>
                  <ShieldCheck className="size-4 text-emerald-500" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase font-bold text-muted-foreground">Billed To</p>
                      <div className="h-2.5 w-24 bg-slate-100 rounded"></div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase font-bold text-muted-foreground">Strategic Fee</p>
                      <p className="text-xl font-black" style={{ color: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}>$1,250.00</p>
                    </div>
                  </div>
                  <Button 
                    disabled 
                    className="w-full text-white h-10 rounded-xl"
                    style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}
                  >
                    Pay Securely
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
