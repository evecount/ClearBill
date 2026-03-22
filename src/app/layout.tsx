import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase/client-provider"

export const metadata: Metadata = {
  metadataBase: new URL('https://clearbill.app'), // Replace with your production URL
  title: {
    default: 'ClearBill | Professional Invoicing & Strategic Contracts',
    template: '%s | ClearBill'
  },
  description: 'The professional identity ecosystem for independent experts. Charge market rates, draft AI outcome contracts, and audit market value. Stop undercharging and start highlighting your true worth.',
  keywords: [
    'professional invoicing',
    'freelance contracts',
    'market rate benchmarking',
    'real estate agent billing',
    'marketing freelancer invoices',
    'outcome based billing',
    'independent expert identity',
    'B2B payment portals',
    'consultant agreements',
    'expert rate auditing',
    'strategic win agreements'
  ],
  authors: [{ name: 'ClearBill Team' }],
  creator: 'ClearBill',
  publisher: 'ClearBill',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClearBill | Your Expertise. Clearly Valued.',
    description: 'The professional identity ecosystem for independent experts. Send invoices, draft contracts, and audit market rates with AI.',
    url: 'https://clearbill.app',
    siteName: 'ClearBill',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearBill | Professional Invoicing for Experts',
    description: 'Stop undercharging. Start highlighting your value with ClearBill.',
    creator: '@clearbill',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5', // Matches primary brand color
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
        {/* JSON-LD Structured Data for the App */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'ClearBill',
              operatingSystem: 'Web',
              applicationCategory: 'BusinessApplication',
              description: 'Professional invoicing and strategic contracts for independent experts.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
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
