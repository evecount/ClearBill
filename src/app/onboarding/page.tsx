
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, Building2, Mail, MapPin, Loader2, CheckCircle2, FileText, Globe, ShieldCheck, Palette, Camera, Scissors, Briefcase, Code, Music, Dumbbell, Star, Mic, Shield, GraduationCap, Hammer, PawPrint, Utensils } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const QUICK_STARTS = [
  {
    label: "Personal Chef",
    icon: Utensils,
    text: "I am a private personal chef providing boutique catering for small dinner parties and customized weekly meal prep for busy families. I need my billing to reflect the premium, artisanal nature of my culinary services."
  },
  {
    label: "Private Tutor",
    icon: GraduationCap,
    text: "I provide private SAT and college prep tutoring for high school students. I need to look professional to parents who are investing in their children's future and want clear, branded billing."
  },
  {
    label: "Lash Artist",
    icon: Scissors,
    text: "I run a boutique eyelash studio providing luxury extensions and lash lifts. I need to look high-end and professional for my premium clients."
  },
  {
    label: "Beauty Consultant",
    icon: Sparkles,
    text: "I am an independent beauty consultant providing personalized skincare regimens and makeup artistry for weddings and corporate events."
  },
  {
    label: "Handyman",
    icon: Hammer,
    text: "I provide high-quality home repair and maintenance services. My clients are homeowners who expect clear, professional billing for my time and materials that reflects my reliability."
  },
  {
    label: "Dog Walker",
    icon: PawPrint,
    text: "I run a boutique dog walking and pet sitting service for busy professionals. A professional portal helps build the immense trust required for them to leave their keys and pets with me."
  },
  {
    label: "Sound Engineer",
    icon: Music,
    text: "I am a freelance sound engineer specializing in podcast post-production, audio restoration, and custom sound design for indie filmmakers."
  },
  {
    label: "Virtual Assistant",
    icon: Briefcase,
    text: "I provide executive-level virtual assistance for creative agency founders, managing complex schedules and client communications."
  },
  {
    label: "Personal Trainer",
    icon: Dumbbell,
    text: "I am a private personal trainer focusing on functional strength and mobility for busy corporate executives."
  },
  {
    label: "Professional Comedian",
    icon: Star,
    text: "I am a stand-up comedian and corporate entertainer providing clean, high-energy comedy sets for galas, retreats, and private parties."
  },
  {
    label: "Freelance Dancer",
    icon: Music,
    text: "I am a professional dancer and choreographer specializing in commercial performance and movement instruction for music videos and luxury events."
  },
  {
    label: "Event Emcee",
    icon: Mic,
    text: "I am a professional master of ceremonies and event host, specializing in charity auctions, corporate conferences, and high-profile festivals."
  },
  {
    label: "Security Expert",
    icon: Shield,
    text: "I provide private security and executive protection for high-profile events and corporate offices. My work is high-stakes, and my billing portal needs to reflect that professional trust."
  },
  {
    label: "Facility Specialist",
    icon: Building2,
    text: "I provide specialized commercial cleaning and facility maintenance for boutique medical offices. Professionalism in my billing is key to maintaining my long-term corporate contracts."
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")
  const [proposal, setProposal] = useState<OnboardingConsultantOutput | null>(null)

  const handleConsult = async () => {
    if (!description.trim()) {
      toast({ title: "Please tell us about your business", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const result = await consultBusinessOnboarding({ userDescription: description })
      setProposal(result)
      setStep(2)
    } catch (error) {
      toast({ title: "AI Consultant Busy", description: "Please try again in a moment.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    toast({ title: "Profile Ready", description: "Welcome to InvoiceSync!" })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-4">
            <Sparkles className="size-8 text-accent" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">AI Brand Architect</h1>
          <p className="text-lg text-muted-foreground">Transforming your expertise into a premium client ecosystem.</p>
        </div>

        {step === 1 ? (
          <div className="max-w-2xl mx-auto w-full">
            <Card className="shadow-2xl border-none">
              <CardHeader>
                <CardTitle>Describe your venture</CardTitle>
                <CardDescription>What do you do? Who are your clients? Our AI will build the professional identity your business deserves.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Quick Start Templates</Label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_STARTS.map((qs) => (
                      <button
                        key={qs.label}
                        onClick={() => setDescription(qs.text)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all hover:bg-slate-50 active:scale-95",
                          description === qs.text ? "bg-accent/10 border-accent text-accent ring-1 ring-accent" : "bg-white border-slate-200 text-slate-600"
                        )}
                      >
                        <qs.icon className="size-3" />
                        {qs.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Your Business Narrative</Label>
                  <Textarea 
                    id="desc"
                    placeholder="e.g., I run a boutique photography studio in Brooklyn. I focus on high-end architectural shots for real estate firms."
                    className="min-h-[150px] text-lg p-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-14 text-lg bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" 
                  onClick={handleConsult}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Designing your ecosystem...
                    </>
                  ) : (
                    <>
                      Generate Brand Identity <ArrowRight className="ml-2 size-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="shadow-xl border-none overflow-hidden h-full">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-center mb-4">
                  <Badge className="bg-accent text-white border-none px-3 py-1">AI PROPOSAL</Badge>
                  <Sparkles className="size-5 text-accent" />
                </div>
                <CardTitle className="text-3xl font-bold">{proposal?.suggestedName}</CardTitle>
                <p className="text-slate-400 font-medium">{proposal?.industry}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid gap-6">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Brand Tone</Label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-4 rounded-full border shadow-sm" 
                        style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }} 
                      />
                      <p className="text-lg font-medium text-slate-800">{proposal?.brandingTone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Mission Statement</Label>
                    <p className="text-slate-600 italic leading-relaxed">"{proposal?.missionStatement}"</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Client Support</Label>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Mail className="size-3 text-accent" /> {proposal?.suggestedEmail}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Business Location</Label>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <MapPin className="size-3 text-accent" /> {proposal?.suggestedAddress?.split(',')[0]}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 bg-slate-50 border-t flex flex-col gap-3">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90" onClick={handleFinish}>
                  Accept Brand & Continue <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                  Redesign Identity
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Live Portal Preview</Label>
              <div className="relative group">
                <div 
                  className="absolute -inset-1 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"
                  style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}
                ></div>
                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{proposal?.suggestedName?.[0]}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{proposal?.suggestedName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="size-4 text-emerald-500" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Secure Portal</span>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Billed To</p>
                        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">Amount Due</p>
                        <p className="text-xl font-black" style={{ color: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}>$2,500.00</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <div className="h-2 w-48 bg-slate-100 rounded"></div>
                        <div className="h-2 w-12 bg-slate-100 rounded"></div>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <div className="h-2 w-32 bg-slate-100 rounded"></div>
                        <div className="h-2 w-12 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <Button 
                      disabled 
                      className="w-full text-white h-10 rounded-xl"
                      style={{ backgroundColor: `hsl(${proposal?.brandColor || '256 60% 55%'})` }}
                    >
                      Pay Securely
                    </Button>
                    <div className="pt-4 flex justify-center items-center gap-4 opacity-30 grayscale scale-75">
                      <Globe className="size-4" />
                      <ShieldCheck className="size-4" />
                      <div className="text-[10px] font-bold">Stripe</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 flex gap-2">
                  <Sparkles className="size-3 shrink-0" />
                  Notice how your brand identity flows through the entire portal. This creates instant trust for your premium clients.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            Skip for now and enter manually
          </Link>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
