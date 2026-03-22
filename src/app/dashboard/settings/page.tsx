
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MOCK_ORG } from "@/lib/mock-data"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Save, Lock, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization profile and payment integrations.</p>
      </div>

      <div className="grid gap-8">
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
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                   <Upload className="size-6 text-white" />
                </div>
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
                <Save className="size-4 mr-2" /> Save Profile
             </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
            <CardDescription>Connect your Stripe or localized payment gateway to accept digital payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-accent/5 border-accent/20">
               <div className="flex items-center gap-4">
                  <div className="bg-accent p-2 rounded-lg text-white">
                    <CreditCard className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold">Stripe Integration</p>
                    <p className="text-sm text-muted-foreground">Accept credit cards, Apple Pay, and Google Pay.</p>
                  </div>
               </div>
               <Badge className="bg-emerald-500">Connected</Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-key">Publishable API Key</Label>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Lock className="size-2" /> Encrypted
                  </span>
                </div>
                <Input id="api-key" type="password" value="pk_live_************************" readOnly />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="secret-key">Secret API Key</Label>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Lock className="size-2" /> Encrypted
                  </span>
                </div>
                <Input id="secret-key" type="password" value="sk_live_************************" readOnly />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 justify-between py-4">
             <p className="text-xs text-muted-foreground">Changes to API keys require immediate verification.</p>
             <Button variant="outline">Update Credentials</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
