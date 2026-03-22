
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CLIENTS, MOCK_ORG } from "@/lib/mock-data"
import { ArrowLeft, Loader2, Sparkles, Send, FileSignature, Target, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { generateProposal, type ProposalGeneratorOutput } from "@/ai/flows/proposal-generator"
import { useUser, useDoc } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function NewProposalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState("")
  const [selectedClient, setSelectedClient] = useState("")
  const [proposal, setProposal] = useState<ProposalGeneratorOutput | null>(null)

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
        brandingTone: org?.brandColor ? "Professional and Value-First" : "Modern Corporate"
      })
      setProposal(result)
      toast({ title: "Proposal Drafted", description: "AI has architected a high-value proposal based on your brief." })
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
      estimatedAmount: 0, // Could be parsed from AI output if structured better
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/proposals">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">New Proposal</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Brief</CardTitle>
              <CardDescription>Describe the project in your own words. We'll translate it into a high-value proposal.</CardDescription>
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
                <Label>What is the Strategic Win?</Label>
                <Textarea 
                  placeholder="e.g. A residential plumbing overhaul for a 1920s bungalow, focusing on future-proofing and modern efficiency..." 
                  className="min-h-[200px] rounded-2xl p-5 text-lg"
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
                {proposal ? "Refine Proposal" : "Architect Proposal"}
              </Button>
            </CardFooter>
          </Card>

          {proposal && (
            <Card className="border-accent/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-slate-900 text-white p-8 rounded-t-xl">
                <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-[10px] font-black tracking-widest text-white uppercase w-fit mb-4">
                  <FileSignature className="size-3" /> Branded Proposal
                </div>
                <CardTitle className="text-3xl font-black">{proposal.proposalTitle}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Target className="size-5 text-accent" /> Strategic Objective
                  </h3>
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-accent/20 pl-4">
                    {proposal.executiveSummary}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="size-5 text-accent" /> Defined Deliverables
                  </h3>
                  <div className="grid gap-3">
                    {proposal.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border">
                        <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Pricing Framework</h3>
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <p className="text-sm text-slate-700 leading-relaxed">{proposal.pricingStructure}</p>
                  </div>
                </div>

                <div className="pt-8 border-t text-center italic text-sm text-muted-foreground">
                  {proposal.closingStatement}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 p-6 rounded-b-xl">
                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800" onClick={handleSave}>
                  Save & Prepare Delivery
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Why use proposals?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                Proposals are the "Deep Water" bridge. They allow you to move past the ego of the client and the expert.
              </p>
              <p>
                By defining the <strong>Strategic Win</strong> upfront, you eliminate scope creep and ensure your expertise is <strong>Clearly Valued</strong> before the work begins.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
