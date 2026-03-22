
"use client"

import { useParams } from "next/navigation"
import { useDoc, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Quote, BookOpen, CheckCircle2, ShieldCheck, CreditCard, Layers, ExternalLink, ArrowRight } from "lucide-react"
import { useState } from "react"
import { type ProposalGeneratorOutput } from "@/ai/flows/proposal-generator"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PublicProposalPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const proposalId = params.proposalId as string
  const firestore = useFirestore()
  
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)

  const proposalRef = useMemoFirebase(() => {
    if (!firestore || !orgId || !proposalId) return null
    return doc(firestore, 'organizations', orgId, 'proposals', proposalId)
  }, [firestore, orgId, proposalId])

  const { data: proposalData, isLoading } = useDoc(proposalRef)

  const orgRef = useMemoFirebase(() => {
    if (!firestore || !orgId) return null
    return doc(firestore, 'organizations', orgId)
  }, [firestore, orgId])
  const { data: org } = useDoc(orgRef)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-accent" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Architecting Dashboard...</p>
        </div>
      </div>
    )
  }

  let proposal: ProposalGeneratorOutput | null = null
  try {
    proposal = proposalData?.content ? JSON.parse(proposalData.content) : null
  } catch (e) {
    console.error("Failed to parse proposal content", e)
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center">
        <div className="space-y-4 max-w-sm">
          <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Layers className="size-8 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold">Proposal Unavailable</h1>
          <p className="text-sm text-muted-foreground">The requested strategic document has not been launched or has been archived by the architect.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/">Return to ClearBill</Link>
          </Button>
        </div>
      </div>
    )
  }

  const activeTier = proposal.investmentTiers[selectedTierIndex]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body selection:bg-accent/20">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                <CreditCard className="size-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">{org?.name || 'Strategic Partner'}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#story" className="text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors">The Story</a>
              <a href="#investment" className="text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors">Investment</a>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20">
              Accept Proposal
            </Button>
          </div>
        </div>
      </nav>

      <main className="py-20">
        {/* Hero Section */}
        <section id="overview" className="max-w-5xl mx-auto px-6 text-center mb-32">
          <p className="text-accent font-black tracking-[0.3em] uppercase text-xs mb-6">Strategic Outcome Proposal</p>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">
            {proposal.proposalTitle}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-16">
            {proposal.executiveSummary}
          </p>

          <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-10 md:p-16 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity">🎬</div>
            <h3 className="text-2xl font-bold text-accent mb-8 flex items-center justify-center">
              The Narrative Opening
            </h3>
            <div className="font-mono text-lg md:text-xl leading-relaxed text-slate-900 bg-slate-50 border-l-8 border-accent/30 p-8 md:p-12 rounded-2xl shadow-inner text-left italic">
              {proposal.narrativeScript}
            </div>
          </div>
        </section>

        {/* Narrative Arcs Section */}
        <section id="story" className="bg-white py-32 border-y border-slate-200 mb-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-16 text-center md:text-left">
              <p className="text-accent font-black tracking-[0.3em] uppercase text-xs mb-4">The Narrative Arc</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Project Episodes</h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                We frame your project as a series of evolving episodes, focusing on the strategic milestones that define a successful outcome.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-6">
              {proposal.episodes.map((episode, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="bg-slate-50 rounded-[2rem] border-none shadow-sm px-8 py-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-6 text-left">
                      <span className="text-accent font-black text-xs tracking-widest">EPISODE 0{idx + 1}</span>
                      <span className="font-bold text-xl">{episode.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-lg leading-relaxed pt-4 pb-8 border-t border-slate-200/50 mt-4">
                    {episode.arc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Investment Planner Section */}
        <section id="investment" className="max-w-5xl mx-auto px-6 mb-32 scroll-mt-24">
          <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-16">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-black italic">Investment Roadmap</h2>
                <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                  Adjust the slider to calibrate the scope of your expectations. Every tier represents a distinct level of strategic impact.
                </p>
              </div>

              <div className="space-y-12 bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Active Investment Tier</p>
                    <p className="text-6xl font-black font-mono tracking-tighter text-white animate-in fade-in duration-300" key={activeTier.amount}>
                      ${activeTier.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-accent text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
                    {activeTier.label}
                  </div>
                </div>

                <div className="px-4">
                  <Slider 
                    value={[selectedTierIndex]} 
                    max={proposal.investmentTiers.length - 1} 
                    step={1} 
                    onValueChange={([val]) => setSelectedTierIndex(val)}
                    className="py-8"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {proposal.investmentTiers.map((tier, i) => (
                      <span key={i} className={cn(selectedTierIndex === i ? "text-accent" : "")}>
                        {tier.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Guaranteed Deliverables for this tier:</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeTier.scope.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        <CheckCircle2 className="size-5 text-accent shrink-0" />
                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-8">
                <div className="flex flex-col items-center gap-4">
                   <p className="text-xs text-slate-400 font-medium">Recommended Model: <span className="text-white font-bold">{proposal.pricingStructure}</span></p>
                   <Button className="h-20 px-12 text-xl bg-accent hover:bg-accent/90 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] group">
                      Accept & Lock In This Scope <ArrowRight className="ml-3 size-6 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">Secure Strategic Agreement | Powered by ClearBill</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200 text-center space-y-8">
           <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="size-8 text-accent mb-2" />
              <h3 className="text-xl font-bold">The Strategic Win Guarantee</h3>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                "We don't bill for hours. We bill for the certainty of your success within the defined roadmap."
              </p>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             © 2024 {org?.name || 'ClearBill Strategic Partners'}. All Rights Reserved.
           </p>
        </footer>
      </main>
    </div>
  )
}
