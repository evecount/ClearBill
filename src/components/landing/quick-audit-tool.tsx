"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { benchmarkMarketRate, type MarketRateBenchmarkerOutput } from "@/ai/flows/market-rate-benchmarker"
import { Loader2, Sparkles, BarChart3, Info, ArrowRight, ShieldAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function QuickAuditTool() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")
  const [result, setResult] = useState<MarketRateBenchmarkerOutput | null>(null)

  const handleAudit = async () => {
    if (!description.trim()) {
      toast({ title: "Please describe your service", description: "Tell us what you're billing for so we can audit the rate.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const auditResult = await benchmarkMarketRate({ serviceDescription: description })
      setResult(auditResult)
      toast({ title: "Audit Complete", description: "We've calculated the professional market rate for your expertise." })
    } catch (error) {
      toast({ title: "Audit Failed", description: "Our strategist is currently over-capacity. Please try again in a moment.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white shadow-2xl border-none rounded-[2rem] overflow-hidden group">
      <div className="bg-accent h-1.5 w-full" />
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between mb-2">
           <Badge variant="outline" className="text-accent border-accent text-[10px] font-black uppercase tracking-widest px-3 py-1">
             Free AI Audit
           </Badge>
           <Sparkles className="size-5 text-accent opacity-50" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">Is your rate fair?</CardTitle>
        <CardDescription className="text-slate-500">
          Paste your service description or quote details to see if you are undercharging for your expertise.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {!result ? (
          <div className="space-y-4">
            <Textarea 
              placeholder="e.g. I am providing 10 hours of strategic consulting for a local tech startup..." 
              className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 focus:ring-accent/20 text-sm leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              className="w-full h-14 bg-accent hover:bg-accent/90 rounded-xl text-lg font-bold shadow-lg shadow-accent/20 group/btn" 
              onClick={handleAudit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Auditing Market Value...
                </>
              ) : (
                <>
                  Check My Rate Fairness <ArrowRight className="ml-2 size-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Powered by Tier-0 Strategic DNA
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1">
                <p className="text-[8px] uppercase font-black tracking-widest text-accent">Elite Market Rate</p>
                <p className="text-2xl font-black">${result.suggestedRateRange.min} - ${result.suggestedRateRange.max}</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase">{result.suggestedRateRange.unit}</p>
              </div>
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="size-3 text-destructive" />
                  <p className="text-[8px] uppercase font-black tracking-widest text-destructive">Undercharging Risk</p>
                </div>
                <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic line-clamp-3">
                  {result.underchargingRiskInsight}
                </p>
              </div>
            </div>

            <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-accent" />
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Value Justification</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{result.valueJustification}"
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl text-sm font-bold" onClick={() => setResult(null)}>
                Audit Another Quote
              </Button>
              <Button variant="link" className="text-accent text-xs font-bold uppercase tracking-widest" asChild>
                <a href="/onboarding">Save this DNA & Launch My Business <ArrowRight className="size-3 ml-2" /></a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
