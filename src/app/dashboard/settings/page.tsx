
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Save, Sparkles, ArrowRight, Copy, ExternalLink, Globe, Building2, Link as LinkIcon, Landmark, Flag, Camera, Upload } from "lucide-react"
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
    logoUrl: ""
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
        logoUrl: org.logoUrl || ""
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
    toast({ title: "Link Copied", description: "Public profile link copied to clipboard." })
  }

  if (isOrgLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading identity profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Professional Settings</h1>
          <p className="text-muted-foreground">Refine your professional identity and brand presence.</p>
        </div>
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/5 hidden sm:flex">
          <Link href="/onboarding">
            <Sparkles className="size-4 mr-2" /> AI Re-brand
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle>Organization Identity</CardTitle>
            <CardDescription>The visual and factual anchors of your business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
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
                <Avatar className="size-28 border shadow-sm ring-1 ring-slate-200 rounded-3xl overflow-hidden">
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
                <h3 className="text-lg font-bold text-slate-900">Your Brand Logo</h3>
                <p className="text-sm text-muted-foreground">This icon anchors every invoice and proposal you send.</p>
                <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                   <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Upload New</Button>
                   <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setFormData({...formData, logoUrl: ""})}>Remove</Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Business Name</Label>
                <Input id="org-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-industry" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Industry</Label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input id="org-industry" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="h-11 pl-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-taxid" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Tax / Business ID (UEN/GST/EIN)</Label>
                <div className="relative">
                   <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input id="org-taxid" value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="h-11 pl-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-email" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Contact Email</Label>
                <Input id="org-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-country" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Country</Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="org-country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="h-11 pl-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-currency" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                  <SelectTrigger className="h-11 rounded-xl">
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
                <Label htmlFor="org-mission" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Mission Statement</Label>
                <Textarea id="org-mission" value={formData.missionStatement} onChange={(e) => setFormData({...formData, missionStatement: e.target.value})} className="min-h-[100px] rounded-xl text-sm" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="org-address" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Billing Address</Label>
                <Input id="org-address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="h-11 rounded-xl" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t justify-end p-6 rounded-b-2xl">
             <Button className="bg-accent hover:bg-accent/90 h-12 px-8 rounded-xl font-bold" onClick={handleSave} disabled={loading}>
                <Save className="size-4 mr-2" />
                {loading ? "Saving Changes..." : "Save Identity Profile"}
             </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Public Client Portal</CardTitle>
            <CardDescription>Your unique identity handle for client access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-slug" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Public URL Slug</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center h-11 px-3 bg-slate-100 border rounded-l-xl text-muted-foreground text-sm font-mono shrink-0">
                  {origin}/u/
                </div>
                <Input 
                  id="org-slug" 
                  value={formData.slug} 
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-z-]/g, '-')})}
                  className="h-11 rounded-l-none rounded-r-xl font-mono"
                  placeholder="your-handle"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50">
              <div className="bg-white p-2 rounded-lg border shadow-sm">
                <Globe className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{origin}/u/{formData.slug || '...'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyPublicLink}>Copy Link</Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/u/${formData.slug}`} target="_blank">Visit Portal</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
