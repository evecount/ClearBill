
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MOCK_ORG } from "@/lib/mock-data"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Save, Sparkles, ArrowRight, Copy, ExternalLink, Globe, Palette, Building2, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const [formData, setFormData] = useState({
    name: MOCK_ORG.name,
    email: MOCK_ORG.email,
    slug: MOCK_ORG.slug || "",
    address: MOCK_ORG.address || "",
    missionStatement: MOCK_ORG.missionStatement || "",
    industry: MOCK_ORG.industry || "",
    brandColor: MOCK_ORG.brandColor || "256 60% 55%"
  })

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      toast({ 
        title: "Identity Updated", 
        description: "Your professional identity ecosystem has been successfully refined." 
      })
      setLoading(false)
    }, 1500)
  }

  const copyPublicLink = () => {
    const url = `${origin}/u/${formData.slug}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Public profile link copied to clipboard." })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Settings</h1>
          <p className="text-muted-foreground">Manage the identity architecture of your business ecosystem.</p>
        </div>
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/5 hidden sm:flex">
          <Link href="/onboarding">
            <Sparkles className="size-4 mr-2" /> AI Re-brand
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-accent/20 bg-accent/5 overflow-hidden">
          <div className="h-1 bg-accent/20" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-accent" />
              <CardTitle>AI Identity Architect</CardTitle>
            </div>
            <CardDescription>Need a fresh perspective? Let our AI help you architect a more impactful mission and professional tone.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/onboarding">
                Run AI Consultation <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Client Portal</CardTitle>
            <CardDescription>This is the unique URL where clients can view their historical invoices and pay outstanding balances.</CardDescription>
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
              <p className="text-[10px] text-muted-foreground">Choose a handle that reflects your brand (e.g., 'chef-julian').</p>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50">
              <div className="bg-white p-2 rounded-lg border shadow-sm shrink-0">
                <Globe className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{origin}/u/{formData.slug || '...'}</p>
                <p className="text-xs text-muted-foreground">Share this link to provide high-trust client access.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="hidden md:flex" onClick={copyPublicLink}>
                  <Copy className="size-3 mr-2" /> Copy
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/u/${formData.slug}`} target="_blank">
                    <ExternalLink className="size-3 mr-2" /> Visit
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle>Organization Identity</CardTitle>
            <CardDescription>These details form the core of your client-facing professional portals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="size-24 border-2 border-white shadow-md ring-1 ring-slate-200">
                  <AvatarImage src={MOCK_ORG.logoUrl} alt={formData.name} />
                  <AvatarFallback className="text-2xl font-bold bg-slate-900 text-white">{formData.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">Professional Logo</h3>
                <p className="text-sm text-muted-foreground">This icon anchors your professional ecosystem.</p>
                <div className="flex gap-2 mt-3">
                   <Button variant="outline" size="sm">Change Logo</Button>
                   <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/5">Remove</Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Organization Name</Label>
                <Input 
                  id="org-name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-industry" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Industry Category</Label>
                <div className="relative">
                   <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                   <Input 
                    id="org-industry" 
                    value={formData.industry} 
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="h-11 pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-email" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Support Email</Label>
                <Input 
                  id="org-email" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-color" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Brand Color (HSL)</Label>
                <div className="flex gap-3">
                  <div className="size-11 rounded-xl border shrink-0" style={{ backgroundColor: `hsl(${formData.brandColor})` }} />
                  <Input 
                    id="org-color" 
                    value={formData.brandColor} 
                    onChange={(e) => setFormData({...formData, brandColor: e.target.value})}
                    className="h-11 rounded-xl font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="org-mission" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Mission Statement</Label>
                <Textarea 
                  id="org-mission" 
                  value={formData.missionStatement} 
                  onChange={(e) => setFormData({...formData, missionStatement: e.target.value})}
                  className="min-h-[100px] rounded-xl text-sm leading-relaxed"
                  placeholder="e.g. Providing world-class artisanal catering for intimate gatherings."
                />
                <p className="text-[10px] text-muted-foreground italic">This statement appears on your branded payment portals to reinforce client trust.</p>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="org-address" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Billing Address</Label>
                <Input 
                  id="org-address" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t justify-end p-6 rounded-b-2xl">
             <Button className="bg-accent hover:bg-accent/90 h-12 px-8 rounded-xl" onClick={handleSave} disabled={loading}>
                {loading ? <Save className="size-4 mr-2 animate-pulse" /> : <Save className="size-4 mr-2" />}
                {loading ? "Honoring Changes..." : "Save Identity Profile"}
             </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="h-20 md:hidden" /> {/* Spacer for bottom nav */}
    </div>
  )
}
