import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck, Zap, ArrowRight, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-20 flex items-center justify-between border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-primary">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <CreditCard className="size-6" />
          </div>
          <span className="text-2xl font-headline tracking-tight">InvoiceSync</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight">
              Invoicing that gets you <span className="text-accent">paid faster.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Eliminate manual bank transfers with our white-label B2B portal. 
              Secure links, professional AI assistance, and instant digital payments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-accent hover:bg-accent/90" asChild>
                <Link href="/onboarding">
                  Create Your First Invoice <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                View Live Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="bg-accent/10 p-3 rounded-2xl w-fit">
                <Zap className="size-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Instant Payments</h3>
              <p className="text-muted-foreground">
                Route payments directly through your Stripe or preferred gateway. No more waiting for bank settlements.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl w-fit">
                <ShieldCheck className="size-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold">Secure Portals</h3>
              <p className="text-muted-foreground">
                Every invoice gets a unique, tamper-proof URL protected by enterprise-grade security rules.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-emerald-500/10 p-3 rounded-2xl w-fit">
                <TrendingUp className="size-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold">Status Sync</h3>
              <p className="text-muted-foreground">
                Automated reconciliation. When a client pays, your records are updated in real-time instantly.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Build for Multi-Tenancy</h2>
              <p className="text-primary-foreground/80 text-lg">
                Whether you're a single freelancer or a large agency, InvoiceSync handles your organizational 
                structure with ease. Brand your portal, set your rates, and let the system handle the rest.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-1.5 rounded-full"><CheckCircle2 className="size-5" /></div>
                  <span>Custom Logo Upload</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-1.5 rounded-full"><CheckCircle2 className="size-5" /></div>
                  <span>AI Description Suggester</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-1.5 rounded-full"><CheckCircle2 className="size-5" /></div>
                  <span>Client CRM Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-1.5 rounded-full"><CheckCircle2 className="size-5" /></div>
                  <span>Flexible Tax Settings</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm aspect-video flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent" />
               <CreditCard className="size-32 text-white/50 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-primary/50">
            <CreditCard className="size-5" />
            <span className="font-headline">InvoiceSync</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Support</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 InvoiceSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
