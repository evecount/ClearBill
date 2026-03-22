
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, Loader2, CreditCard, FileSignature, Zap, Target, ArrowRight, ShieldCheck, User, Bot } from "lucide-react"
import { consultStrategicPartner, type StrategicConsultantOutput } from "@/ai/flows/strategic-consultant"
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Message = {
  role: 'user' | 'assistant'
  content: string
  data?: StrategicConsultantOutput
}

export default function ConsultantPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "I'm your Strategic Partner. Tell me about the work you've done or the project you're envisioning. I'll help you architect the win."
    }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])
  const { data: org } = useDoc(orgRef)

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return collection(firestore, 'organizations', user.uid, 'clients')
  }, [user, firestore])
  const { data: clients } = useCollection(clientsQuery)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !user) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const result = await consultStrategicPartner({
        message: userMsg,
        context: {
          businessName: org?.name,
          industry: org?.industry,
          existingClients: clients?.map(c => c.name) || []
        }
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.reply,
        data: result
      }])
    } catch (error) {
      toast({ title: "Partner Busy", description: "I'm currently recalibrating strategy. Try again in a moment.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleLaunchInvoice = (data: StrategicConsultantOutput['draftData']) => {
    if (!user || !firestore || !data) return
    
    toast({ 
      title: "Architecting Invoice...", 
      description: `Launching strategic billing for ${data.clientName || 'your client'}.` 
    })
    
    router.push('/dashboard/invoices/new') 
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Strategic Partner</h1>
          <p className="text-muted-foreground">Conversational billing architecture for your professional outcomes.</p>
        </div>
        <Badge variant="outline" className="border-accent text-accent bg-accent/5 font-black uppercase tracking-widest text-[10px] px-3 py-1">
          Partner Mode Active
        </Badge>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-transparent">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-12 pb-12">
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
                    "p-8 rounded-[2.5rem] text-lg leading-relaxed shadow-sm",
                    m.role === 'user' ? "bg-slate-100 text-slate-800" : "bg-white border-2 border-slate-50 text-slate-800"
                  )}>
                    {m.content}
                  </div>

                  {m.data?.suggestedAction === 'create_invoice' && m.data.draftData && (
                    <Card className="border-accent/20 bg-accent/5 overflow-hidden rounded-[3rem] animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-xl">
                      <div className="h-2 w-full bg-accent" />
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent">Draft Strategic Invoice</p>
                          <CreditCard className="size-5 text-accent" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{m.data.draftData.title || "Project Outcome Fee"}</CardTitle>
                        <CardDescription className="text-base">Billed to: <span className="text-slate-900 font-bold">{m.data.draftData.clientName || "Professional Client"}</span></CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-6">
                        <div className="space-y-3">
                          {m.data.draftData.lineItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-2 border-b border-dashed">
                              <span className="font-bold text-slate-600">{item.description}</span>
                              <span className="font-black text-slate-900">${item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        {m.data.draftData.contractSnippet && (
                          <div className="p-6 bg-white/50 rounded-2xl border-2 border-dashed text-xs text-slate-500 italic leading-relaxed">
                            "{m.data.draftData.contractSnippet}"
                          </div>
                        )}
                        <Button 
                          className="w-full bg-accent hover:bg-accent/90 rounded-2xl h-14 text-lg font-bold shadow-2xl shadow-accent/20 transition-transform active:scale-95"
                          onClick={() => handleLaunchInvoice(m.data?.draftData)}
                        >
                          Confirm & Launch Invoice <ArrowRight className="size-5 ml-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {m.data?.suggestedAction === 'create_proposal' && (
                    <Button 
                      variant="outline" 
                      className="border-accent text-accent hover:bg-accent/5 rounded-2xl gap-3 h-14 px-8 text-lg font-bold shadow-sm"
                      onClick={() => router.push('/dashboard/proposals/new')}
                    >
                      <FileSignature className="size-5" /> Architect Full Project Roadmap
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="px-4 py-8 bg-transparent">
          <div className="relative flex items-center gap-4 max-w-5xl mx-auto">
            <div className="relative flex-1 group">
              <Input 
                placeholder="e.g. 'I just finished a 10 hour branding project for SAM Singapore...'" 
                className="h-16 rounded-[2rem] pr-20 bg-white border-2 border-slate-100 shadow-xl text-lg px-8 focus-visible:ring-accent/20 focus-visible:border-accent/30 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
              />
              <Button 
                size="icon" 
                className="absolute right-3 top-1/2 -translate-y-1/2 size-12 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? <Loader2 className="size-6 animate-spin" /> : <Send className="size-6" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 justify-center opacity-40">
            <Sparkles className="size-3 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Partner is processing your professional context</span>
          </div>
        </div>
      </div>
    </div>
  )
}
