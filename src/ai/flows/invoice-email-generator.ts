'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating professional email
 * copy to accompany an invoice payment link.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceEmailInputSchema = z.object({
  businessName: z.string(),
  clientName: z.string(),
  invoiceNumber: z.string(),
  amount: z.string(),
  brandingTone: z.string().optional(),
});
export type InvoiceEmailInput = z.infer<typeof InvoiceEmailInputSchema>;

const InvoiceEmailOutputSchema = z.object({
  subject: z.string(),
  body: z.string(),
});
export type InvoiceEmailOutput = z.infer<typeof InvoiceEmailOutputSchema>;

export async function generateInvoiceEmail(input: InvoiceEmailInput): Promise<InvoiceEmailOutput> {
  return invoiceEmailFlow(input);
}

const invoiceEmailPrompt = ai.definePrompt({
  name: 'invoiceEmailPrompt',
  input: {schema: InvoiceEmailInputSchema},
  output: {schema: InvoiceEmailOutputSchema},
  prompt: `You are a professional communications assistant for a business called {{{businessName}}}.
Your task is to write a professional email to {{{clientName}}} regarding invoice {{{invoiceNumber}}} for the amount of {{{amount}}}.

The tone should be: {{{brandingTone}}}.

Include a placeholder for the payment link as [PAYMENT_LINK]. Keep it concise, friendly, and focused on the professional branded portal they are about to visit.`,
});

const invoiceEmailFlow = ai.defineFlow(
  {
    name: 'invoiceEmailFlow',
    inputSchema: InvoiceEmailInputSchema,
    outputSchema: InvoiceEmailOutputSchema,
  },
  async input => {
    const {output} = await invoiceEmailPrompt(input);
    return output!;
  }
);
