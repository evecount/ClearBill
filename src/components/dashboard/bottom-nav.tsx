
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Invoices", icon: FileText, url: "/dashboard/invoices" },
    { title: "Clients", icon: Users, url: "/dashboard/clients" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link 
              key={item.url} 
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-accent" : "text-muted-foreground hover:text-slate-900"
              )}
            >
              <item.icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.title}</span>
            </Link>
          )
        })}
        <Link 
          href="/dashboard/invoices/new"
          className="flex flex-col items-center justify-center w-full h-full text-primary"
        >
          <div className="bg-accent text-white p-2 rounded-full shadow-lg shadow-accent/30 -mt-8 border-4 border-white">
            <Plus className="size-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">New</span>
        </Link>
      </div>
    </nav>
  )
}
