import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase/client-provider"

export const metadata: Metadata = {
  title: 'ClearBill | Professional Invoicing & Strategic Contracts for Experts',
  description: 'Charge market rates and highlight your value. Professional invoicing, AI-drafted outcome contracts, and real-time rate auditing for freelancers, agents, trades, and independent experts.',
  keywords: [
    'professional invoicing',
    'freelance contracts',
    'market rate benchmarking',
    'real estate agent billing',
    'marketing freelancer invoices',
    'handyman service quotes',
    'outcome based billing',
    'independent expert identity',
    'B2B payment portals'
  ],
  authors: [{ name: 'ClearBill Team' }],
  openGraph: {
    title: 'ClearBill | Your Expertise. Clearly Valued.',
    description: 'The professional identity ecosystem for independent experts. Send invoices, draft contracts, and audit market rates with AI.',
    type: 'website',
    siteName: 'ClearBill',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearBill | Professional Invoicing for Experts',
    description: 'Stop undercharging. Start highlighting your value with ClearBill.',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb', // Matches primary brand color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
