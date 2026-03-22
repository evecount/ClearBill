# 🚀 InvoiceSync: Transforming Self-Employment

**InvoiceSync** is a professional identity ecosystem designed for independent experts who provide world-class service but lack the enterprise-grade digital infrastructure to command the respect (and fees) they deserve.

Instead of sending generic, unbranded payment links, **InvoiceSync** allows professionals—from personal chefs and lash artists to sound engineers and security experts—to architect a premium **Professional Identity** that wraps every client touchpoint in a secure, high-trust ecosystem.

## ✨ Core Ethos: Dignity in Every Invoice

Self-employment is the most honest form of enterprise. We believe that independent expertise shouldn't be diminished by "raw" or "utilitarian" billing tools. 

- **Identity First**: We don't just wrap payment links; we architect a professional facade that honors the expert's skill.
- **Trust Architecture**: B2B trust is built on consistency. Our portals reduce payment friction by providing an enterprise-grade feeling.
- **Empowering the Underserved**: We focus on professions often overlooked by premium branding tools (Handymen, Tutors, Performers, etc.).

## 🛠 Features

### 🧠 AI Professional Identity Architect
Using **Genkit (Gemini 2.5 Flash)**, the app transforms a raw description of a user's work into a sophisticated brand identity, including:
- Catchy business names.
- Impactful mission statements.
- Suggested industry categorization.
- **Visual DNA**: AI-generated HSL brand colors that automatically skin the entire client portal.

### 📱 Mobile-Native Experience
Designed for professionals on the go:
- **Bottom Navigation**: Native-feeling mobile tab bar for quick navigation.
- **Touch-Friendly UI**: Card-based lists instead of complex tables on small screens.
- **PWA Ready**: Manifest and meta-tag configurations for a full-screen, installable app experience.

### 💼 Branded Client Portals
- **Identity-Aware Styling**: Portals dynamically adapt to the organization's unique brand color.
- **Secure Processing**: Built-in trust badges (SSL, Payment Security) to reassure premium clients.
- **AI Delivery Snippets**: Automatically generates professional email copy to accompany payment links.

### 📁 Management Suite
- **Invoice Tracking**: Real-time status updates (Pending, Paid, Overdue).
- **Client Directory**: Manage customer details and billing history.
- **Public Profile**: A dedicated URL where clients can view their active balance.

## 💻 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Gemini 2.5 Flash.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
- **Database/Auth**: [Firebase](https://firebase.google.com/) (Firestore and Authentication).
- **Icons**: [Lucide React](https://lucide.dev/).

## 🚀 Getting Started

1. **Clone the repository.**
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**: Create a `.env` file with your Firebase and Gemini API keys.
4. **Run the dev server**: `npm run dev`
5. **Start Genkit UI** (Optional): `npm run genkit:dev`

## 📁 Project Structure

- `src/ai/`: Genkit Flows for the Identity Architect and Email Suggester.
- `src/app/dashboard/`: The internal professional management suite.
- `src/app/onboarding/`: The AI-powered Brand Identity Architect.
- `src/app/p/`: Client-facing branded payment portals.
- `src/app/u/`: Public organization billing lookups.
- `src/components/ui/`: Reusable Shadcn UI components.
- `src/lib/`: Mock data and utility functions.

---

*© 2024 InvoiceSync. Dignity in every invoice. Built with passion for the independent professional.*