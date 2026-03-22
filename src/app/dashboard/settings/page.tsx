
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MOCK_ORG } from "@/lib/mock-data"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Save, Lock, CreditCard, RefreshCw, Sparkles, ArrowRight, Copy, ExternalLink, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Settings Saved", description: "Your organization profile has been updated." })
    }, 1500)
  }

  const copyPublicLink = () => {
    const url = `${window.location.origin}/u/${MOCK_ORG.id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Public profile link copied to clipboard." })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your organization profile and payment integrations.</p>
        </div>
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/5">
          <Link href="/onboarding">
            <Sparkles className="size-4 mr-2" /> AI Re-brand
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-accent" />
              <CardTitle>AI Brand Assistant</CardTitle>
            </div>
            <CardDescription>Need a fresh perspective? Let our AI consultant help you rewrite your mission and refine your branding tone.</CardDescription>
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
            <CardTitle>Public Profile Link</CardTitle>
            <CardDescription>Clients can visit this link to view their invoices and manage their account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50">
              <div className="bg-white p-2 rounded-lg border shadow-sm">
                <Globe className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{window.location.origin}/u/{MOCK_ORG.id}</p>
                <p className="text-xs text-muted-foreground">Add this to your website or email signature.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyPublicLink}>
                  <Copy className="size-3 mr-2" /> Copy
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/u/${MOCK_ORG.id}`} target="_blank">
                    <ExternalLink className="size-3 mr-2" /> Visit
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>This information will appear on your client invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="size-24 border-2 border-muted shadow-sm">
                  <AvatarImage src={MOCK_ORG.logoUrl} alt={MOCK_ORG.name} />
                  <AvatarFallback>{MOCK_ORG.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-medium">Organization Logo</h3>
                <p className="text-sm text-muted-foreground">Square image, at least 400x400px recommended.</p>
                <Button variant="outline" size="sm" className="mt-2">Change Logo</Button>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue={MOCK_ORG.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-email">Support Email</Label>
                <Input id="org-email" defaultValue={MOCK_ORG.email} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="org-address">Billing Address</Label>
                <Input id="org-address" defaultValue="123 Corporate Way, San Francisco, CA" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 justify-end py-4">
             <Button className="bg-accent hover:bg-accent/90" onClick={handleSave} disabled={loading}>
                <Save className="size-4 mr-2" /> {loading ? "Saving..." : "Save Profile"}
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
