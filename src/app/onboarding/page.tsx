
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, Building2, Mail, MapPin, Loader2, ShieldCheck, Scissors, Briefcase, Music, Dumbbell, Star, Mic, Shield, GraduationCap, Hammer, PawPrint, Utensils, TrendingUp, Zap, Target, Lightbulb, HeartPulse, Code, Sparkles } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")
  const [proposal, setProposal] = useState<OnboardingConsultantOutput | null>(null)

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Please tell us about your expertise", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      if (!user) {
        initiateAnonymousSignIn(auth)
      }

      const result = await consultBusinessOnboarding({ userDescription: description })
      setProposal(result)
      setStep(2)
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
      contactPhone: "",
      addressLine1: proposal.suggestedAddress.split(',')[0] || "",
      city: proposal.suggestedAddress.split(',')[1]?.trim() || "",
      state: "",
      postalCode: "",
      country: "USA",
      paymentGatewayType: "Stripe",
      brandColor: proposal.brandColor,
      missionStatement: proposal.missionStatement,
      industry: proposal.industry,
      slug: slug,
      growthStrategy: proposal.growthStrategy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    setDocumentNonBlocking(doc(user.auth.firestore, 'organizations', orgId), orgData, { merge: true })

    toast({ title: "Identity Profile Saved", description: "Your professional profile is now live." })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full space-y-8">
        {step === 1 ? (
          <div className="max-w-2xl mx-auto w-full">
            <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-2xl">Tell us about your work</CardTitle>
                <CardDescription className="text-slate-400">Describe what you do in your own words. We'll help you design a professional profile that honors your craft.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="desc" className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Your Expertise</Label>
                  <Textarea 
                    id="desc"
                    placeholder="e.g. I am a boutique marketing consultant for luxury brands, focusing on digital presence and elite brand positioning..."
                    className="min-h-[180px] text-lg p-5 rounded-2xl focus:ring-accent/20 border-slate-200 shadow-inner bg-slate-50/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Or, Start with a Profession</Label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_STARTS.map((qs) => (
                      <button
                        key={qs.label}
                        onClick={() => setDescription(qs.text)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:bg-slate-50 active:scale-95",
                          description === qs.text ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" : "bg-white border-slate-200 text-slate-600"
                        )}
                      >
                        <qs.icon className="size-3" />
                        {qs.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button 
                  className="w-full h-16 text-lg bg-accent hover:bg-accent/90 shadow-xl shadow-accent/30 rounded-2xl group" 
                  onClick={handleConsult}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Analyzing Your Expertise...
                    </>
                  ) : (
                    <>
                      Design My Professional Profile <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Identity & Strategy Card */}
            <Card className="lg:col-span-3 shadow-2xl border-none overflow-hidden h-full rounded-3xl">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-[10px] font-black tracking-widest text-white uppercase">
                    <Zap className="size-3" /> Growth Roadmap
                  </div>
                  <Sparkles className="size-5 text-accent" />
                </div>
                <CardTitle className="text-4xl font-black tracking-tight">{proposal?.suggestedName}</CardTitle>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{proposal?.industry}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                {/* Visual Identity Preview */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Recommended Tone</Label>
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

                {/* Strategic Growth Roadmap */}
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-widest text-accent font-black block border-b pb-2">Recommended Growth Steps</Label>
                  <div className="grid gap-4">
                    <div className="flex gap-4 items-start p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <div className="bg-emerald-100 p-2 rounded-xl shrink-0">
                        <Target className="size-4 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Initial Focus</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proposal?.growthStrategy.initialFocus}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                      <div className="bg-purple-100 p-2 rounded-xl shrink-0">
                        <Star className="size-4 text-purple-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Premium Service Idea</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proposal?.growthStrategy.premiumTierSuggestion}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="bg-blue-100 p-2 rounded-xl shrink-0">
                        <TrendingUp className="size-4 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Ongoing Value Model</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proposal?.growthStrategy.recurringRevenueModel}</p>
                      </div>
                    </div>
                  </div>
                  
                  {proposal?.growthStrategy.agenticInsight && (
                    <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="size-4 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Growth Tip</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300 italic">
                        "{proposal.growthStrategy.agenticInsight}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-8 bg-slate-50 border-t flex flex-col gap-3">
                <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl text-lg font-bold shadow-xl shadow-accent/20" onClick={handleFinish}>
                  Save Profile & Get Started <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900" onClick={() => setStep(1)}>
                  Refine My Description
                </Button>
              </CardFooter>
            </Card>

            {/* Portal Preview */}
            <div className="lg:col-span-2 space-y-6 sticky top-24">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black ml-1">Client Portal Preview</Label>
              <div className="relative group">
                <div 
                  className="absolute -inset-1 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"
                  style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}
                ></div>
                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{proposal?.suggestedName?.[0]}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{proposal?.suggestedName}</span>
                    </div>
                    <ShieldCheck className="size-4 text-emerald-500" />
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Billed To</p>
                        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Professional Fee</p>
                        <p className="text-2xl font-black" style={{ color: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}>$5,000.00</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-slate-50 rounded"></div>
                      <div className="h-2 w-2/3 bg-slate-50 rounded"></div>
                    </div>
                    <Button 
                      disabled 
                      className="w-full text-white h-12 rounded-xl shadow-lg"
                      style={{ 
                        backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})`,
                        boxShadow: `0 10px 15px -3px hsla(${proposal?.brandColor}, 0.3)`
                      }}
                    >
                      Confirm Completion
                    </Button>
                    <p className="text-[8px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em]">Secure Branded Payment Portal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
