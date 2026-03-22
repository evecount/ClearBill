# **App Name**: InvoiceSync

## Core Features:

- Organization Onboarding & Profile Management: Tenants can set up their organization profile, upload a custom logo, and securely configure their preferred payment gateway API keys (e.g., Stripe) or banking details within a multi-tenant Firestore structure.
- Invoice Creation & Management with AI Assist: Tenants can create, edit, and view invoices with line items, tax rates, and due dates. An AI tool can provide suggestions for professional and clear line item descriptions.
- Client Management: Tenants can add, view, and manage details of their clients, allowing for efficient assignment of invoices.
- Secure Invoice Link Generation: Upon invoice creation, the system automatically generates a unique, secure URL for that specific invoice, adhering to strict Firebase Security Rules for client access.
- Branded Client Payment Portal: Clients who click the invoice link are directed to a clean, web page displaying invoice details, branded with the tenant's logo, and featuring a direct 'Pay Now' button.
- Automated Payment Processing: The 'Pay Now' button routes payments directly through the tenant's configured payment gateway, facilitating instant credit card or localized digital payments.
- Real-time Invoice Status Update: Once a payment is successfully processed via the configured gateway, the corresponding invoice status in the Firestore database automatically updates from 'Pending' to 'Paid'.

## Style Guidelines:

- Primary color: A sophisticated, deep blue (`#2E4266`) reflecting trust and professionalism in a financial context.
- Background color: A very light, muted blue-gray (`#EAEFF5`), providing a clean and understated canvas for content.
- Accent color: A vibrant yet elegant purple (`#6C46D1`) used to highlight key interactive elements and calls to action, ensuring clarity and modern appeal.
- Body and headline font: 'Inter' (sans-serif) for its modern, highly readable, and objective appearance, suitable for financial data and professional communication.
- Use a set of clear, minimalist, and professionally designed line icons that support functionality without visual clutter, maintaining a consistent modern aesthetic.
- Adopt a responsive, grid-based layout that prioritizes content clarity, efficient navigation, and scalability across devices, ensuring that invoice details are easily digestible.
- Incorporate subtle and tasteful micro-interactions and transitions for state changes (e.g., loading indicators, successful payment confirmation) to enhance user experience and provide feedback.