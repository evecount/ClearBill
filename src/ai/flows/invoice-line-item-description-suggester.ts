'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating professional and clear
 * invoice line item descriptions based on a brief input from the user.
 *
 * - suggestInvoiceLineItemDescriptions - A function that provides AI-generated suggestions.
 * - InvoiceLineItemDescriptionSuggesterInput - The input type for the suggestion function.
 * - InvoiceLineItemDescriptionSuggesterOutput - The return type for the suggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceLineItemDescriptionSuggesterInputSchema = z.object({
  briefDescription: z
    .string()
    .describe('A brief description of the service or item for which a line item suggestion is needed.'),
});
export type InvoiceLineItemDescriptionSuggesterInput = z.infer<
  typeof InvoiceLineItemDescriptionSuggesterInputSchema
>;

const InvoiceLineItemDescriptionSuggesterOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of AI-generated professional and clear line item description suggestions.'),
});
export type InvoiceLineItemDescriptionSuggesterOutput = z.infer<
  typeof InvoiceLineItemDescriptionSuggesterOutputSchema
>;

export async function suggestInvoiceLineItemDescriptions(
  input: InvoiceLineItemDescriptionSuggesterInput
): Promise<InvoiceLineItemDescriptionSuggesterOutput> {
  return invoiceLineItemDescriptionSuggesterFlow(input);
}

const suggestInvoiceLineItemDescriptionPrompt = ai.definePrompt({
  name: 'suggestInvoiceLineItemDescriptionPrompt',
  input: {schema: InvoiceLineItemDescriptionSuggesterInputSchema},
  output: {schema: InvoiceLineItemDescriptionSuggesterOutputSchema},
  prompt: `You are an AI assistant specialized in crafting professional, clear, and concise invoice line item descriptions.

Based on the brief description provided, generate 3-5 distinct and professional suggestions for an invoice line item. Focus on clarity, accuracy, and professional wording suitable for billing purposes.

Brief description: {{{briefDescription}}}`,
});

const invoiceLineItemDescriptionSuggesterFlow = ai.defineFlow(
  {
    name: 'invoiceLineItemDescriptionSuggesterFlow',
    inputSchema: InvoiceLineItemDescriptionSuggesterInputSchema,
    outputSchema: InvoiceLineItemDescriptionSuggesterOutputSchema,
  },
  async input => {
    const {output} = await suggestInvoiceLineItemDescriptionPrompt(input);
    return output!;
  }
);
