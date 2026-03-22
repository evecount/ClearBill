
"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser, useAuth } from "@/firebase"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()

  // Ensure a professional identity exists for persistence
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-accent" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Identity...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="hidden md:flex">
        <AppSidebar />
      </div>
      <SidebarInset className="pb-20 md:pb-0">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex md:hidden items-center gap-2 font-bold text-primary mr-auto">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-lg text-white">
                <CreditCard className="size-5" />
              </div>
              <span className="text-lg font-headline tracking-tight">ClearBill</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex-1 text-right">
             {/* Mobile Global Search or Notification Bell could go here */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 bg-slate-50/50">
          {children}
        </div>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
