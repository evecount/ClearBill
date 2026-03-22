import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldCheck, Zap, ArrowRight, TrendingUp, Sparkles, Layout, Globe, Lock, FileText, Scale, Utensils, Shield, Hammer, BarChart3 } from "lucide-react"

export default function LandingPage() {
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
              <span>Professional Identity for Independent Experts</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1]">
              Send Professional <br />
              <span className="text-accent underline decoration-accent/20 underline-offset-8">Invoices & Contracts.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Charge market rates. Never undercharge again. Highlight your true value.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button size="lg" className="h-16 px-10 text-xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 group" asChild>
                <Link href="/onboarding">
                  Get Started for Free <ArrowRight className="ml-2 size-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-xl">
                How it Works
              </Button>
            </div>
          </div>
        </section>

        {/* Market Rate Assurance Section */}
        <section className="py-16 px-6 bg-accent/5 border-y border-accent/10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-accent/10 md:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="size-6 text-accent" />
                <h3 className="font-bold text-lg">Market Rate Benchmarking</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Did you know many independent professionals undercharge by <strong>40-75%</strong>? ClearBill uses AI to analyze your service and regional data, ensuring every invoice you send reflects the true elite market rate for your expertise.
              </p>
              <div className="mt-4 p-3 bg-accent/5 rounded-xl border border-dashed border-accent/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Strategic Insight</p>
                <p className="text-xs italic text-slate-600 mt-1">"Stop billing for labor. Start billing for the outcome."</p>
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-primary">Charge with Confidence.</h2>
              <p className="text-slate-600">
                Never second-guess your pricing again. Our built-in benchmarking tool provides real-time regional averages for your job role, helping you command the fees your hard work actually deserves.
              </p>
            </div>
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 px-6 bg-slate-50 border-b">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.3em] text-accent uppercase">The ClearBill Standard</h2>
              <h3 className="text-4xl font-bold text-primary">Your Expertise. Clearly Valued.</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="space-y-4">
                <p className="text-lg font-medium text-slate-900">Charge what you're actually worth.</p>
                <p className="text-muted-foreground leading-relaxed">
                  Independent experts—from personal chefs to plumbers—often use generic tools that fail to reflect their true worth. ClearBill ensures you command market rates by framing your work as a strategic win, not just a list of tasks.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-medium text-slate-900">Value clarity built into every invoice.</p>
                <p className="text-muted-foreground leading-relaxed">
                  Every invoice should be a testament to your craft. ClearBill provides the professional infrastructure that honors your expertise and reflects the true value you provide, including AI-drafted contracts that protect your work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Led Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-primary">Honoring Every Profession</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">See how independent experts use ClearBill to transform how they are perceived—and how they are paid.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group space-y-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all">
              <div className="bg-orange-500/10 p-3 rounded-2xl w-fit">
                <Utensils className="size-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">The Culinary Consultant</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "I used to just be 'the cook.' With ClearBill, I send professional portals that highlight my nutritional expertise. I've increased my dinner party rates by 40% because I now use the Market Rate tool to justify my value."
                </p>
              </div>
              <div className="pt-4 border-t border-dashed">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
                  <Layout className="size-3" /> Branded Portals
                </div>
              </div>
            </div>

            <div className="group space-y-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all">
              <div className="bg-blue-500/10 p-3 rounded-2xl w-fit">
                <Shield className="size-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">The Risk Mitigation Expert</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Security specialists often struggle to draft legal terms. ClearBill's AI drafts my Outcome Agreements in seconds. It ensures my corporate clients understand the scope and the 'win' they are paying for."
                </p>
              </div>
              <div className="pt-4 border-t border-dashed">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <Scale className="size-3" /> AI Outcome Agreements
                </div>
              </div>
            </div>

            <div className="group space-y-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/10 transition-all">
              <div className="bg-emerald-500/10 p-3 rounded-2xl w-fit">
                <Hammer className="size-8 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">The Property Care Steward</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "Handymen are often undervalued. I use ClearBill to translate 'fixing a leak' into 'Property Asset Protection.' Highlighting the outcome rather than the task has changed how my clients respect my time."
                </p>
              </div>
              <div className="pt-4 border-t border-dashed">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <Zap className="size-3" /> Value Highlighting
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                Simple Setup. Professional Results.
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Clarity is the key to business growth.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Never undercharge again. ClearBill combines your payment gateway with a professional system that highlights the true value of your work at every touchpoint.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Professional Invoices",
                  "AI Strategic Agreements",
                  "Market Rate Benchmarking",
                  "Secure Payment Processing",
                  "Outcome Tracking",
                  "Growth Insights"
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
                         Pay Securely with Card
                       </Button>
                    </div>

                    <div className="flex justify-center gap-6 opacity-30 grayscale items-center">
                      <CreditCard className="size-4" />
                      <Lock className="size-4" />
                      <Globe className="size-4" />
                      <span className="text-[10px] font-bold">Stripe</span>
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
              Professional identity and invoicing for independent experts.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 ClearBill. Honoring Every Profession.
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
