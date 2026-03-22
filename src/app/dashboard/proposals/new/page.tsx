"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { ArrowLeft, Loader2, Sparkles, FileSignature, Target, Zap, CheckCircle2, Quote, BookOpen, Layers } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { generateProposal, type ProposalGeneratorOutput } from "@/ai/flows/proposal-generator"
import { useUser, useDoc } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"

export default function NewProposalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState("")
  const [selectedClient, setSelectedClient] = useState("")
  const [proposal, setProposal] = useState<ProposalGeneratorOutput | null>(null)
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)

  const orgRef = useMemoFirebase(() => {
    if (!user) return null
    return doc(user.auth.firestore, 'organizations', user.uid)
  }, [user])

  const { data: org } = useDoc(orgRef)

  const handleGenerate = async () => {
    if (!brief.trim()) {
      toast({ title: "Error", description: "Please enter a project brief first.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const result = await generateProposal({
        businessName: org?.name || MOCK_ORG.name,
        clientName: MOCK_CLIENTS.find(c => c.id === selectedClient)?.name || "Potential Client",
        projectBrief: brief,
        brandingTone: org?.brandColor ? "Cinematic and Value-First" : "Modern Professional"
      })
      setProposal(result)
      setSelectedTierIndex(0)
      toast({ title: "Proposal Architected", description: "AI has generated a rich storytelling dashboard for this win." })
    } catch (error) {
      toast({ title: "AI Error", description: "Could not architect proposal at this time.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!proposal || !user) return

    const proposalData = {
      organizationId: user.uid,
      clientId: selectedClient || "new_client",
      title: proposal.proposalTitle,
      status: "Draft",
      content: JSON.stringify(proposal),
      estimatedAmount: proposal.investmentTiers[0]?.amount || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    addDocumentNonBlocking(
      collection(user.auth.firestore, 'organizations', user.uid, 'proposals'),
      proposalData
    )

    toast({ title: "Proposal Saved", description: "Your project win is now ready for delivery." })
    router.push("/dashboard/proposals")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/proposals">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Project Architect</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Define the Win</CardTitle>
              <CardDescription>Describe the project goals. Our AI will translate this into a cinematic proposal dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Potential Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select a client (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CLIENTS.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project Context</Label>
                <Textarea 
                  placeholder="e.g. A global retreat platform for wellness experts, including a digital booking home and a documentary film series..." 
                  className="min-h-[150px] rounded-2xl p-5 text-lg"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-14 bg-accent hover:bg-accent/90 rounded-xl text-lg shadow-lg shadow-accent/20" 
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Sparkles className="mr-2 size-5" />}
                {proposal ? "Refine Narrative" : "Architect Proposal Dashboard"}
              </Button>
            </CardFooter>
          </Card>

          {proposal && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-4 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Strategic Proposal Preview</p>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">{proposal.proposalTitle}</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{proposal.executiveSummary}</p>
              </div>

              {/* Narrative Script Block */}
              <Card className="bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-white border-b p-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-xl">
                      <Quote className="size-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Episode 1: The Narrative Opening</CardTitle>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Cinematic Script Draft</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="font-mono text-lg leading-relaxed text-slate-800 bg-white border-l-8 border-accent/30 p-8 rounded-xl shadow-sm italic">
                      {proposal.narrativeScript}
                   </div>
                </CardContent>
              </Card>

              {/* Episodic Arcs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="size-5 text-accent" />
                  <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Project Story Arcs</h3>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {proposal.episodes.map((episode, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="bg-white rounded-2xl border px-6 py-2 shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <span className="text-accent font-black text-xs">EPISODE 0{idx + 1}</span>
                          <span className="font-bold text-lg">{episode.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 text-base leading-relaxed pt-2 pb-6 border-t mt-2">
                        {episode.arc}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Investment Planner */}
              <div className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-16 space-y-12">
                <div className="space-y-4 text-center">
                  <h3 className="text-3xl font-black italic font-serif">Investment Roadmap</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-sm">Adjust the slider to see how different budget tiers unlock specific building blocks of the project win.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Active Tier</p>
                      <p className="text-5xl font-black font-mono tracking-tighter">${proposal.investmentTiers[selectedTierIndex].amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <span className="bg-accent text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">
                         {proposal.investmentTiers[selectedTierIndex].label}
                       </span>
                    </div>
                  </div>

                  <Slider 
                    value={[selectedTierIndex]} 
                    max={proposal.investmentTiers.length - 1} 
                    step={1} 
                    onValueChange={([val]) => setSelectedTierIndex(val)}
                    className="py-4"
                  />

                  <div className="grid gap-4 pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Deliverables for this tier:</p>
                    {proposal.investmentTiers[selectedTierIndex].scope.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <CheckCircle2 className="size-4 text-accent" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <Button className="h-16 px-12 text-xl bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-2xl" onClick={handleSave}>
                  Save & Launch Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-accent text-white border-none shadow-xl rounded-[2rem]">
            <CardHeader>
              <div className="bg-white/10 p-2 rounded-xl w-fit mb-4">
                <Layers className="size-5 text-white" />
              </div>
              <CardTitle className="text-xl">The Story Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/80 leading-relaxed">
              <p>
                Standard proposals are checklists. Strategic Dashboards are narratives.
              </p>
              <p>
                By framing the project as a series of <strong>Episodes</strong>, you invite the client to become a character in the "Win" you are architecting.
              </p>
              <p>
                This cinematic approach justifies elite rates by shifting the focus from labor to <strong>Legacy</strong>.
              </p>
            </CardContent>
          </Card>

          <div className="p-6 bg-slate-100 rounded-[2rem] border border-dashed border-slate-300">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 text-center">Interactive Tooltips</p>
             <p className="text-xs text-slate-500 leading-relaxed italic text-center">
               "Your clients aren't just buying services. They are buying the certainty of a successful outcome."
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
