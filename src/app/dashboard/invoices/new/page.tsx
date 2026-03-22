
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_CLIENTS } from "@/lib/mock-data"
import { Plus, Trash2, Wand2, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { suggestInvoiceLineItemDescriptions } from "@/ai/flows/invoice-line-item-description-suggester"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewInvoicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1, price: 0 }])
  const [selectedClient, setSelectedClient] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [dueDate, setDueDate] = useState('')

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
      toast({ title: "Error", description: "Please enter a brief description first." })
      return
    }
    
    setLoading(true)
    try {
      const result = await suggestInvoiceLineItemDescriptions({ briefDescription: currentDesc })
      if (result.suggestions && result.suggestions.length > 0) {
        updateItem(itemId, 'description', result.suggestions[0])
        toast({ title: "AI Suggestion Applied", description: "Professional description updated." })
      }
    } catch (error) {
      toast({ title: "AI Error", description: "Could not fetch suggestions." })
    } finally {
      setLoading(false)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.price), 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  const handleCreate = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Invoice Created", description: "A unique payment link has been generated." })
      router.push('/dashboard/invoices')
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">New Invoice</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CLIENTS.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Line Items</Label>
              {items.map((item, index) => (
                <div key={item.id} className="grid gap-3 items-end sm:grid-cols-12 border-b pb-4">
                  <div className="sm:col-span-6 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <div className="relative">
                      <Input 
                        placeholder="e.g. Web Development Service" 
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-0 top-0 h-10 w-10 text-accent hover:text-accent"
                        onClick={() => handleAiSuggest(item.id, item.description)}
                        disabled={loading}
                      >
                        <Wand2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input 
                      type="number" 
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Price</Label>
                    <Input 
                      type="number" 
                      value={item.price}
                      onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
                <Plus className="size-4 mr-2" /> Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Tax Rate (%)</Label>
                <Input 
                  type="number" 
                  value={taxRate} 
                  onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-accent">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleCreate} disabled={loading}>
                {loading ? "Generating..." : "Create & Send Link"}
                {!loading && <Send className="size-4 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
