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
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Strategic Partner</h1>
          <p className="text-muted-foreground">Zero-form architecture for your professional billing.</p>
        </div>
        <Badge variant="outline" className="border-accent text-accent bg-accent/5 font-black uppercase tracking-widest text-[10px]">
          Partner Mode Active
        </Badge>
      </div>

      <Card className="flex-1 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white flex flex-col">
        <ScrollArea className="flex-1 p-6 md:p-8">
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
                  "space-y-4 max-w-[85%]",
                  m.role === 'user' ? "items-end text-right" : "items-start"
                )}>
                  <div className={cn(
                    "p-5 rounded-3xl text-sm leading-relaxed",
                    m.role === 'user' ? "bg-slate-100 text-slate-800" : "bg-white border-2 border-slate-100 text-slate-800 shadow-sm"
                  )}>
                    {m.content}
                  </div>

                  {m.data?.suggestedAction === 'create_invoice' && m.data.draftData && (
                    <Card className="border-accent/20 bg-accent/5 overflow-hidden rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="h-1.5 w-full bg-accent" />
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent">Draft Strategic Invoice</p>
                          <CreditCard className="size-4 text-accent" />
                        </div>
                        <CardTitle className="text-lg font-bold">{m.data.draftData.title || "Project Outcome Fee"}</CardTitle>
                        <CardDescription>Billed to: <span className="text-slate-900 font-bold">{m.data.draftData.clientName || "Professional Client"}</span></CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {m.data.draftData.lineItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-dashed">
                              <span className="font-medium text-slate-600">{item.description}</span>
                              <span className="font-bold text-slate-900">${item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        {m.data.draftData.contractSnippet && (
                          <div className="p-3 bg-white/50 rounded-xl border border-dashed text-[10px] text-slate-500 italic">
                            {m.data.draftData.contractSnippet}
                          </div>
                        )}
                        <Button 
                          className="w-full bg-accent hover:bg-accent/90 rounded-xl h-10 font-bold shadow-lg shadow-accent/20"
                          onClick={() => handleLaunchInvoice(m.data?.draftData)}
                        >
                          Confirm & Launch Invoice <ArrowRight className="size-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {m.data?.suggestedAction === 'create_proposal' && (
                    <Button 
                      variant="outline" 
                      className="border-accent text-accent hover:bg-accent/5 rounded-xl gap-2"
                      onClick={() => router.push('/dashboard/proposals/new')}
                    >
                      <FileSignature className="size-4" /> Architect Full Proposal
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-slate-50/50">
          <div className="relative flex items-center gap-2">
            <Input 
              placeholder="e.g. 'I just finished a 10 hour branding project for Nexus Creative...'" 
              className="h-14 rounded-2xl pr-20 bg-white border-slate-200 shadow-inner text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <Button 
              size="icon" 
              className="absolute right-2 size-10 rounded-xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-3 px-2">
            <Sparkles className="size-3 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI is processing your professional context</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
