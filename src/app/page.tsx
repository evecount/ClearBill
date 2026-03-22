import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck, Zap, ArrowRight, TrendingUp, Sparkles, Layout, Globe, Lock } from "lucide-react"

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
        <section className="py-24 px-6 text-center space-y-8 bg-gradient-to-b from-primary/[0.03] to-transparent overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
              <Sparkles className="size-4" />
              <span>The Branding Layer for B2B Payments</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1]">
              Your Brand. Their Payments. <br />
              <span className="text-accent underline decoration-accent/20 underline-offset-8">Zero Friction.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Generic payment links are for casual transfers. **InvoiceSync** provides the professional white-label "shell" that high-ticket clients trust.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button size="lg" className="h-16 px-10 text-xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 group" asChild>
                <Link href="/onboarding">
                  Build Your Branded Portal <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl">
                How It Works
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto border-t">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">Why Use a Branding Shell?</h2>
            <p className="text-muted-foreground mt-2">Bridge the gap between your hard work and the client's bank account.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group space-y-4 p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="bg-accent/10 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Layout className="size-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">White-Label UI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Most gateways look like raw banks. We look like <strong>you</strong>. Custom logos, mission statements, and your unique business tone on every invoice.
              </p>
            </div>
            <div className="group space-y-4 p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="bg-blue-500/10 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold">Trust-First Architecture</h3>
              <p className="text-muted-foreground leading-relaxed">
                Large clients hesitate to pay "raw" links. Our secure portals provide the enterprise-grade feeling that reduces payment friction by 70%.
              </p>
            </div>
            <div className="group space-y-4 p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="bg-emerald-500/10 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Zap className="size-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold">Instant Branded Pages</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply connect your gateway (Stripe/PayPal) once. Every link you generate thereafter is wrapped in your high-end professional brand identity.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                The "Branded Shell" Advantage
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Professionalism is the key to B2B longevity.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Your payment gateway is just a utility. Your brand is your reputation. InvoiceSync combines them into a seamless "shell" that reflects your commitment to quality at every touchpoint.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Branded Checkout Pages",
                  "AI Brand Identity Agent",
                  "Client Billing History Portals",
                  "Secure SSL Trust Badges",
                  "Custom Mission Displays",
                  "Professional Tone Control"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="bg-accent p-1 rounded-full"><ShieldCheck className="size-3" /></div>
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
                        <div className="size-8 bg-slate-900 rounded-lg"></div>
                        <div className="space-y-1">
                          <div className="h-2 w-24 bg-slate-200 rounded"></div>
                          <div className="h-1.5 w-16 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-none">SECURE</Badge>
                    </div>
                    <div className="space-y-4 pt-4">
                       <div className="flex justify-between items-baseline">
                         <div className="h-4 w-32 bg-slate-100 rounded"></div>
                         <span className="text-2xl font-black text-accent">$4,250.00</span>
                       </div>
                       <Separator />
                       <div className="h-10 bg-slate-900 rounded-xl"></div>
                    </div>
                    <div className="flex justify-center gap-8 opacity-20 grayscale">
                      <CreditCard className="size-4" />
                      <Lock className="size-4" />
                      <Globe className="size-4" />
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
              <span className="font-headline">InvoiceSync</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The professional white-label "shell" for modern small business billing.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 InvoiceSync. Built for professionals.
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
