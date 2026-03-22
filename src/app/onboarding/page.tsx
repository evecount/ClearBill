"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, Building2, Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react"
import { consultBusinessOnboarding, type OnboardingConsultantOutput } from "@/ai/flows/onboarding-consultant"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl mb-4">
            <Sparkles className="size-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Business Consultant</h1>
          <p className="text-muted-foreground">Let's build your professional brand identity in seconds.</p>
        </div>

        {step === 1 ? (
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle>Tell us about your venture</CardTitle>
              <CardDescription>What do you do? Who are your clients? Don't worry about being professional yet—just speak from the heart.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="desc">Your Story</Label>
                <Textarea 
                  id="desc"
                  placeholder="e.g., I'm a freelance web designer helping local bakeries get online. I love minimalist aesthetics and fast turnaround times."
                  className="min-h-[150px] text-lg p-4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg bg-accent hover:bg-accent/90" 
                onClick={handleConsult}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing your business...
                  </>
                ) : (
                  <>
                    Generate My Brand <ArrowRight className="ml-2 size-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-xl border-none">
              <CardHeader className="bg-accent text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">{proposal?.suggestedName}</CardTitle>
                    <p className="text-accent-foreground/80 font-medium">{proposal?.industry}</p>
                  </div>
                  <CheckCircle2 className="size-8" />
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Tone</span>
                    </div>
                    <p className="font-medium text-slate-800">{proposal?.brandingTone}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Support Email</span>
                    </div>
                    <p className="font-medium text-slate-800">{proposal?.suggestedEmail}</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Address Format</span>
                    </div>
                    <p className="font-medium text-slate-800">{proposal?.suggestedAddress}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/20">
                  <p className="text-sm italic text-muted-foreground text-center">
                    "{proposal?.missionStatement}"
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Refine Description
                </Button>
                <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={handleFinish}>
                  Apply & Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
            <p className="text-center text-xs text-muted-foreground">
              You can further customize these details in your settings later.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            Skip for now and enter manually
          </Link>
        </div>
      </div>
    </div>
  )
}
