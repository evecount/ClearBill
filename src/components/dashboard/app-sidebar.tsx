
"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  CreditCard,
  Plus,
  FileSignature
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDoc, useUser, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc } from "firebase/firestore"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const firestore = useFirestore()

  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])

  const { data: org } = useDoc(orgRef)

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Proposals", icon: FileSignature, url: "/dashboard/proposals" },
    { title: "Invoices", icon: FileText, url: "/dashboard/invoices" },
    { title: "Clients", icon: Users, url: "/dashboard/clients" },
    { title: "Payments", icon: CreditCard, url: "/dashboard/payments" },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground transition-opacity hover:opacity-80">
          <div className="bg-sidebar-primary p-1.5 rounded-lg">
            <CreditCard className="size-5" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden text-xl font-headline tracking-tight">ClearBill</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-accent" tooltip="Create Invoice">
                  <Link href="/dashboard/invoices/new">
                    <Plus className="size-4" />
                    <span>New Invoice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-3 mt-2 border-t border-sidebar-border group-data-[collapsible=icon]:px-1">
              <Avatar className="size-8">
                <AvatarImage src={org?.logoUrl} alt={org?.name} />
                <AvatarFallback>{org?.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">{org?.name || 'Loading...'}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{org?.contactEmail || user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
