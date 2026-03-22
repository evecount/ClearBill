
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck, Zap, ArrowRight, TrendingUp, Sparkles, Layout, Globe, Lock, FileText, Scale, Utensils, Shield, Hammer, BarChart3, Briefcase, Camera, Home, PenTool, CheckCircle, HeartPulse, Code, Music, Scissors, Loader2 } from "lucide-react"
import { QuickAuditTool } from "@/components/landing/quick-audit-tool"
import { useUser, useFirestore, useDoc } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { doc } from "firebase/firestore"

export default function LandingPage() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()

  const orgRef = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'organizations', user.uid)
  }, [user, firestore])

  const { data: org, isLoading: isOrgLoading } = useDoc(orgRef)

  const dashboardLink = org ? "/dashboard" : "/onboarding"

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-20 flex items-center justify-between border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-primary">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <CreditCard className="size-6" />
          </div>
          <span className="text-2xl font-headline tracking-tight">ClearBill</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={dashboardLink}>{user ? "Dashboard" : "Login"}</Link>
          </Button>
          <Button className="bg-accent hover:bg-accent/90" asChild>
            <Link href={dashboardLink}>{org ? "Go to Dashboard" : "Get Started"}</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-primary/[0.03] to-transparent overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
              <Sparkles className="size-4" />
              <span>The Professional Identity Layer for Stripe</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1]">
              Detailed Invoices for <br />
              <span className="text-accent underline decoration-accent/20 underline-offset-8">Elite Professionals.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Stripe handles the payment. ClearBill handles the <strong>identity</strong>. Send detailed, outcome-based invoices that justify your elite market rates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button size="lg" className="h-16 px-10 text-xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 group" asChild>
                <Link href={dashboardLink}>
                  {org ? "Continue Your Strategy" : "Start Your First Invoice"} <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl" asChild>
                 <Link href="#how-it-works">Why ClearBill?</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Market Rate Assurance Section */}
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-bold tracking-[0.3em] text-accent uppercase">The Detailed Difference</h2>
                <h3 className="text-4xl md:text-5xl font-black text-primary leading-tight">
                  Stop billing for labor. <br />
                  <span className="text-accent">Start billing for value.</span>
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Stripe PayLinks are great for checkout, but they lack the professional narrative elite experts need. ClearBill bridges the gap with detailed outcome descriptions and AI-drafted agreements.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-fit">
                     <BarChart3 className="size-6 text-accent" />
                   </div>
                   <h4 className="font-bold text-primary">Market Rate Benchmarking</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Real-time AI auditing that justifies elite fees and prevents undercharging.
                   </p>
                 </div>
                 <div className="space-y-3">
                   <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-fit">
                     <Scale className="size-6 text-blue-600" />
                   </div>
                   <h4 className="font-bold text-primary">Outcome Agreements</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Detailed contracts that protect your work and reinforce your professional standard.
                   </p>
                 </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-2xl opacity-30 animate-pulse"></div>
              <QuickAuditTool />
            </div>
          </div>
        </section>

        {/* Profession-Specific Solutions */}
        <section id="how-it-works" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-sm font-bold tracking-[0.3em] text-accent uppercase">Built for the Modern Expert</h2>
              <h3 className="text-4xl font-bold text-primary">Tailored for your specific craft.</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ClearBill provides the professional architecture you need to command the rates you deserve, while keeping your payments secure via Stripe.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Real Estate Agents", icon: Home, desc: "Detailed commission invoices and high-trust agent portals." },
                { title: "Marketing Freelancers", icon: PenTool, desc: "Outcome-based contracts that highlight strategic campaign value." },
                { title: "Sales Consultants", icon: TrendingUp, desc: "Success-fee tracking and professional performance summaries." },
                { title: "Expert Trades", icon: Hammer, desc: "Service quotes that translate labor into 'Property Asset Protection'." },
                { title: "Creative Directors", icon: Camera, desc: "High-end portfolios integrated with secure B2B billing." },
                { title: "Legal & Security", icon: Shield, desc: "AI-drafted compliance terms and professional risk mitigation agreements." },
                { title: "Culinary Experts", icon: Utensils, desc: "Boutique catering portals for high-value client experiences." },
                { title: "Corporate Trainers", icon: Briefcase, desc: "Structured workshop billing focused on organizational outcomes." },
                { title: "Health & Wellness", icon: HeartPulse, desc: "Personal training and wellness plans focused on long-term vitality outcomes." },
                { title: "Software Architects", icon: Code, desc: "Technical roadmaps and delivery verification for elite engineering." },
                { title: "Music & Sound", icon: Music, desc: "Production and engineering billing for world-class sonic outcomes." },
                { title: "Boutique Studios", icon: Scissors, desc: "Lash, hair, and aesthetic artists providing high-trust luxury experiences." },
              ].map((role) => (
                <div key={role.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-accent/20 transition-all hover:bg-white hover:shadow-xl group">
                  <role.icon className="size-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-primary mb-2">{role.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                Double Gateway Security
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Your Identity. <br/> Their Security.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                ClearBill handles the professional narrative, then passes the client to Stripe for the secure checkout. It's the high-trust way to bill for elite outcomes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Professional Facade",
                  "AI Outcome Agreements",
                  "Market Rate Auditing",
                  "Secure Stripe Checkout",
                  "Branded Client Portals",
                  "Detailed Line Items"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-accent p-1 rounded-full"><CheckCircle className="size-3" /></div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative bg-white/5 border border-white/10 rounded-3xl p-1 md:p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
                  <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6 text-slate-900">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">L</div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold">Lumina Creative</p>
                          <p className="text-[10px] text-muted-foreground">Verified Merchant</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 flex items-center gap-1">
                        <ShieldCheck className="size-2.5" /> SECURE
                      </Badge>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                       <div className="flex justify-between items-start">
                         <div className="space-y-1">
                           <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Billed To</p>
                           <p className="text-xs font-bold">Global Tech Partners</p>
                           <p className="text-[10px] text-muted-foreground">accounts@globaltech.com</p>
                         </div>
                         <div className="text-right space-y-1">
                           <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest">Total</p>
                           <span className="text-2xl font-black text-accent">$4,250.00</span>
                         </div>
                       </div>
                       
                       <div className="space-y-2 border-t border-dashed pt-4">
                         <div className="flex justify-between text-[10px]">
                           <span className="font-medium text-slate-600">Visual Identity System Development</span>
                           <span className="font-bold">$3,500.00</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                           <span className="font-medium text-slate-600">Brand Strategy Workshop</span>
                           <span className="font-bold">$750.00</span>
                         </div>
                       </div>

                       <Separator />
                       
                       <Button disabled className="w-full bg-slate-900 text-white h-12 rounded-xl text-sm font-bold shadow-lg shadow-slate-200">
                         Review Outcomes & Pay Securely
                       </Button>
                    </div>

                    <div className="flex justify-center gap-6 opacity-30 grayscale items-center">
                      <CreditCard className="size-4" />
                      <Lock className="size-4" />
                      <Globe className="size-4" />
                      <span className="text-[10px] font-bold">Stripe Secured</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-primary">
              <CreditCard className="size-5" />
              <span className="font-headline">ClearBill</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional identity layer for elite independent experts.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 ClearBill. Your Expertise. Clearly Valued.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}

function Separator() {
  return <div className="h-[1px] w-full bg-slate-100" />
}
