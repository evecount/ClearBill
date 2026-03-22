
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_ORG } from "@/lib/mock-data"
import { Plus, Trash2, Wand2, ArrowLeft, Send, Scale, Loader2, BarChart3, ShieldCheck, FileText, Calendar, User, Landmark } from "lucide-react"
import Link from "next/link"
import { suggestInvoiceLineItemDescriptions } from "@/ai/flows/invoice-line-item-description-suggester"
import { draftStrategicAgreement } from "@/ai/flows/contract-drafter"
import { benchmarkMarketRate } from "@/ai/flows/market-rate-benchmarker"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDoc, useUser, useCollection, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function NewInvoicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  
  const [loading, setLoading] = useState(false)
  const [loadingContract, setLoadingContract] = useState(false)
  const [loadingBenchmark, setLoadingBenchmark] = useState<string | null>(null)
  
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1, price: 0 }])
  const [selectedClient, setSelectedClient] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [contractContent, setContractContent] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`)

  // Fetch real org and client data
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

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const handleAiSuggest = async (itemId: string, currentDesc: string) => {
    if (!currentDesc) {
      toast({ title: "Fact Required", description: "Please enter a brief description first." })
      return
    }
    setLoadingBenchmark(itemId)
    try {
      const result = await suggestInvoiceLineItemDescriptions({ briefDescription: currentDesc })
      if (result.suggestions && result.suggestions.length > 0) {
        updateItem(itemId, 'description', result.suggestions[0])
        toast({ title: "AI Suggestion Applied", description: "Professional description updated." })
      }
    } catch (error) {
      toast({ title: "AI Error", description: "Could not fetch suggestions." })
    } finally {
      setLoadingBenchmark(null)
    }
  }

  const handleBenchmarkPrice = async (itemId: string, description: string) => {
    if (!description) {
      toast({ title: "Context Required", description: "Describe the service to audit market rates." })
      return
    }
    setLoadingBenchmark(itemId)
    try {
      const result = await benchmarkMarketRate({ serviceDescription: description })
      const recommendedPrice = Math.round((result.suggestedRateRange.min + result.suggestedRateRange.max) / 2)
      updateItem(itemId, 'price', recommendedPrice)
      toast({ title: "Market Rate Audit Complete", description: `Suggested: $${result.suggestedRateRange.min} - $${result.suggestedRateRange.max}` })
    } catch (error) {
      toast({ title: "AI Error", description: "Could not audit rates." })
    } finally {
      setLoadingBenchmark(null)
    }
  }

  const handleGenerateContract = async () => {
    const clientObj = clients?.find(c => c.id === selectedClient)
    if (!clientObj) {
      toast({ title: "Client Required", description: "Please select a client first." })
      return
    }
    const serviceBrief = items.map(i => i.description).filter(Boolean).join(", ")
    if (!serviceBrief) {
      toast({ title: "Scope Required", description: "Add at least one item description." })
      return
    }
    setLoadingContract(true)
    try {
      const result = await draftStrategicAgreement({
        businessName: org?.name || "Your Business",
        clientName: clientObj.name,
        serviceBrief: serviceBrief,
        brandingTone: org?.brandingTone || "Professional"
      })
      setContractContent(result.contractBody)
      toast({ title: "Agreement Drafted", description: "Outcome contract generated." })
    } catch (error) {
      toast({ title: "AI Error", description: "Could not draft agreement." })
    } finally {
      setLoadingContract(false)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  const handleCreate = () => {
    if (!user || !firestore || !selectedClient) {
      toast({ title: "Missing Data", description: "Please select a client and ensure you are logged in." })
      return
    }
    setLoading(true)
    
    const invoiceData = {
      organizationId: user.uid,
      clientId: selectedClient,
      number: invoiceNumber,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: 'Pending',
      totalAmount: total,
      taxRate: taxRate,
      contractContent: contractContent,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    addDocumentNonBlocking(collection(firestore, 'organizations', user.uid, 'invoices'), invoiceData)
      .then((docRef) => {
        // Add line items
        items.forEach(item => {
          addDocumentNonBlocking(
            collection(firestore, 'organizations', user.uid, 'invoices', docRef?.id as string, 'lineItems'),
            { ...item, organizationId: user.uid, invoiceId: docRef?.id }
          )
        })
        setLoading(false)
        toast({ title: "Invoice Launched", description: "A high-trust payment link has been generated." })
        router.push('/dashboard/invoices')
      })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Architect</h1>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 h-12 px-8 rounded-xl shadow-lg shadow-accent/20" 
          onClick={handleCreate} 
          disabled={loading || items.length === 0 || !selectedClient}
        >
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
          Launch Invoice
        </Button>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
        <div className="h-3 w-full bg-accent opacity-20" />
        <CardContent className="p-12 md:p-16 space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6 flex-1">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">From</p>
                <h2 className="text-2xl font-bold text-slate-900">{org?.name || "Your Business Name"}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{org?.addressLine1 || "Your Address"}</p>
                <p className="text-sm font-medium text-accent">{org?.contactEmail || user?.email}</p>
              </div>
              
              {org?.taxId && (
                <div className="pt-4 border-t border-dashed">
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Tax ID</p>
                  <div className="flex items-center gap-2">
                    <Landmark className="size-3 text-slate-400" />
                    <span className="text-xs font-mono font-bold text-slate-700">{org.taxId}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Bill To</p>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="h-12 rounded-xl border-dashed focus:ring-accent/20">
                    <SelectValue placeholder="Select a professional client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                    {(!clients || clients.length === 0) && (
                      <SelectItem value="none" disabled>No clients found. Add one in Clients.</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {selectedClient && clients?.find(c => c.id === selectedClient) && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {clients.find(c => c.id === selectedClient)?.address}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Invoice No.</p>
                  <Input 
                    value={invoiceNumber} 
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className="h-10 border-dashed rounded-lg font-mono text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Due Date</p>
                  <Input 
                    type="date" 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="h-10 border-dashed rounded-lg text-xs" 
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Line Items Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-2">
              <div className="col-span-7"><p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Professional Outcome</p></div>
              <div className="col-span-2 text-center"><p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Qty</p></div>
              <div className="col-span-3 text-right"><p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Value</p></div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center group relative p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="col-span-7 relative">
                    <Input 
                      placeholder="e.g. Cinematic Storytelling Production" 
                      className="h-11 border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm font-bold"
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-accent" onClick={() => handleAiSuggest(item.id, item.description)}>
                        <Wand2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      className="h-11 border-none bg-transparent shadow-none focus-visible:ring-0 text-center text-sm"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <div className="flex flex-col items-end flex-1">
                      <div className="flex items-center gap-2">
                         <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <button 
                                 className="text-accent opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all"
                                 onClick={() => handleBenchmarkPrice(item.id, item.description)}
                                 disabled={!!loadingBenchmark}
                               >
                                 {loadingBenchmark === item.id ? <Loader2 className="size-3 animate-spin" /> : <BarChart3 className="size-3" />}
                               </button>
                             </TooltipTrigger>
                             <TooltipContent><p className="text-[10px] font-bold">Audit Market Rate</p></TooltipContent>
                           </Tooltip>
                         </TooltipProvider>
                        <span className="text-xs text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          className="h-11 border-none bg-transparent shadow-none focus-visible:ring-0 w-24 text-right text-sm font-black"
                          value={item.price}
                          onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    {items.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeItem(item.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={addItem} className="text-accent hover:text-accent hover:bg-accent/5 rounded-lg text-xs font-bold uppercase tracking-widest">
              <Plus className="size-3 mr-2" /> Add Outcome Block
            </Button>
          </div>

          <Separator className="bg-slate-100" />

          {/* Totals & Agreement Section */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-accent" />
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Strategic Agreement</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-accent text-[10px] font-bold uppercase"
                  onClick={handleGenerateContract}
                  disabled={loadingContract}
                >
                  {loadingContract ? <Loader2 className="size-3 animate-spin mr-2" /> : <Wand2 className="size-3 mr-2" />}
                  {contractContent ? "Refine" : "Draft"}
                </Button>
              </div>
              <Textarea 
                placeholder="The AI will architect an outcome-based agreement here..." 
                className="min-h-[120px] rounded-2xl bg-slate-50/50 border-none shadow-inner text-xs leading-relaxed italic"
                value={contractContent}
                onChange={(e) => setContractContent(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Service Subtotal</span>
                  <span className="font-bold text-slate-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Regional Tax Rate (%)</span>
                  <Input 
                    type="number" 
                    className="h-8 w-16 text-right border-dashed rounded bg-white text-xs" 
                    value={taxRate} 
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <Separator className="bg-slate-200/50" />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-900">Outcome Fee</span>
                  <span className="text-4xl font-black text-accent tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 justify-center py-2">
                <ShieldCheck className="size-3 text-emerald-500" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Securely Powered By ClearBill</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
