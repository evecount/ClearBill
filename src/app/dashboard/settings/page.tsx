
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Save, Sparkles, Copy, Globe, Building2, Landmark, Flag, Camera, Upload, CreditCard, Link as LinkIcon, ExternalLink, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useDoc, useUser, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc, serverTimestamp } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])

  const { data: org, isLoading: isOrgLoading } = useDoc(orgRef)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    slug: "",
    address: "",
    city: "",
    country: "",
    taxId: "",
    currency: "USD",
    missionStatement: "",
    industry: "",
    brandColor: "256 60% 55%",
    website: "",
    logoUrl: "",
    paymentLink: ""
  })

  useEffect(() => {
    if (org) {
      setFormData({
        name: org.name || "",
        email: org.contactEmail || "",
        slug: org.slug || "",
        address: org.addressLine1 || "",
        city: org.city || "",
        country: org.country || "USA",
        taxId: org.taxId || "",
        currency: org.currency || "USD",
        missionStatement: org.missionStatement || "",
        industry: org.industry || "",
        brandColor: org.brandColor || "256 60% 55%",
        website: org.website || "",
        logoUrl: org.logoUrl || "",
        paymentLink: org.paymentLink || ""
      })
    }
  }, [org])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!user || !orgRef) return
    setLoading(true)
    
    updateDocumentNonBlocking(orgRef, {
      name: formData.name,
      contactEmail: formData.email,
      slug: formData.slug,
      addressLine1: formData.address,
      city: formData.city,
      country: formData.country,
      taxId: formData.taxId,
      currency: formData.currency,
      missionStatement: formData.missionStatement,
      industry: formData.industry,
      brandColor: formData.brandColor,
      website: formData.website,
      logoUrl: formData.logoUrl,
      paymentLink: formData.paymentLink,
      updatedAt: serverTimestamp()
    })

    setTimeout(() => {
      toast({ 
        title: "Identity Updated", 
        description: "Your professional identity ecosystem has been successfully refined." 
      })
      setLoading(false)
    }, 800)
  }

  const copyPublicLink = () => {
    const url = `${origin}/u/${formData.slug}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Your public profile link is ready to share." })
  }

  if (isOrgLoading) {
    return (
      <div className="p-24 text-center text-muted-foreground flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-accent" />
        <span className="text-[10px] font-black uppercase tracking-widest">Fetching Identity...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-muted-foreground">Manage your professional brand and payout architecture.</p>
        </div>
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/5 hidden sm:flex">
          <Link href="/onboarding">
            <Sparkles className="size-4 mr-2" /> AI Re-brand
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2.5rem]">
          <div className="h-3 w-full bg-slate-100" />
          <CardHeader className="p-8 pb-4">
            <CardTitle>Organization Identity</CardTitle>
            <CardDescription>Visual and factual anchors of your professional business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8 pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleLogoUpload} 
              />
              <div 
                className="relative group cursor-pointer" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="size-28 border shadow-sm ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
                  <AvatarImage src={formData.logoUrl} className="object-contain p-2" />
                  <AvatarFallback className="text-2xl font-bold bg-slate-900 text-white rounded-3xl">
                    <Camera className="size-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="size-6 text-white" />
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">Brand Logo</h3>
                <p className="text-xs text-muted-foreground">Anchors every invoice and proposal you send.</p>
                <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                   <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-9">Update</Button>
                   <Button variant="ghost" size="sm" className="text-destructive rounded-xl h-9" onClick={() => setFormData({...formData, logoUrl: ""})}>Remove</Button>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Business Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Industry</Label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="h-12 pl-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Tax / Business ID</Label>
                <div className="relative">
                   <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="h-12 pl-10 rounded-xl" placeholder="UEN, EIN, etc." />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Contact Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Country</Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="h-12 pl-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="SGD">SGD (S$)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Mission Statement</Label>
                <Textarea value={formData.missionStatement} onChange={(e) => setFormData({...formData, missionStatement: e.target.value})} className="min-h-[100px] rounded-xl text-sm" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t justify-end p-8">
             <Button className="bg-accent hover:bg-accent/90 h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-accent/10" onClick={handleSave} disabled={loading}>
                <Save className="size-5 mr-3" />
                {loading ? "Saving..." : "Save Identity"}
             </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2.5rem]">
          <div className="h-3 w-full bg-accent/20" />
          <CardHeader className="p-8 pb-4">
            <CardTitle>Payments & Payouts</CardTitle>
            <CardDescription>Link your Stripe PayLink to enable the high-trust Double Gateway experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Stripe Payment Link (or similar)</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  value={formData.paymentLink} 
                  onChange={(e) => setFormData({...formData, paymentLink: e.target.value})}
                  className="h-14 pl-10 rounded-2xl font-mono text-sm border-dashed"
                  placeholder="https://buy.stripe.com/..."
                />
              </div>
              <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm border">
                  <ShieldCheck className="size-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Why use a direct link?</p>
                  <p className="text-[10px] text-slate-600 leading-relaxed italic">
                    Stripe handles the move of money, but ClearBill handles the <strong>professional identity</strong>. Your clients will see their detailed outcome agreement and line items first, justifying your fee before they click through to your secure Stripe checkout.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t justify-end p-8">
             <Button className="bg-accent hover:bg-accent/90 h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-accent/10" onClick={handleSave} disabled={loading}>
                <Save className="size-5 mr-3" />
                {loading ? "Saving..." : "Save Payout Settings"}
             </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-white rounded-[2.5rem]">
          <div className="h-3 w-full bg-slate-900" />
          <CardHeader className="p-8 pb-4">
            <CardTitle>Public Client Portal</CardTitle>
            <CardDescription>Your unique identity handle for public client access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8 pt-4">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black ml-1">Public URL Handle</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center h-14 px-5 bg-slate-50 border rounded-l-2xl text-muted-foreground text-sm font-mono shrink-0">
                  {origin}/u/
                </div>
                <Input 
                  value={formData.slug} 
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-z-]/g, '-')})}
                  className="h-14 rounded-l-none rounded-r-2xl font-mono text-lg"
                  placeholder="your-handle"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 border-2 border-dashed rounded-[2rem] bg-slate-50/50">
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <Globe className="size-8 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Your Public Identity</p>
                <p className="text-lg font-black truncate text-slate-900">{origin}/u/{formData.slug || '...'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-11" onClick={copyPublicLink}><Copy className="size-4 mr-2" /> Copy</Button>
                <Button variant="outline" className="rounded-xl h-11" asChild>
                  <Link href={`/u/${formData.slug}`} target="_blank"><ExternalLink className="size-4 mr-2" /> Visit</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Loader2({ className }: { className?: string }) {
  return <Sparkles className={`animate-pulse ${className}`} />
}
