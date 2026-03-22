'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting professional
 * Strategic Outcome Agreements to accompany an invoice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContractDrafterInputSchema = z.object({
  businessName: z.string(),
  clientName: z.string(),
  serviceBrief: z.string().describe('A brief description of the services/outcomes provided.'),
  brandingTone: z.string().optional(),
});
export type ContractDrafterInput = z.infer<typeof ContractDrafterInputSchema>;

const ContractDrafterOutputSchema = z.object({
  contractTitle: z.string(),
  contractBody: z.string().describe('A structured, professional outcome-based agreement.'),
});
export type ContractDrafterOutput = z.infer<typeof ContractDrafterOutputSchema>;

export async function draftStrategicAgreement(input: ContractDrafterInput): Promise<ContractDrafterOutput> {
  return contractDrafterFlow(input);
}

const contractDrafterPrompt = ai.definePrompt({
  name: 'contractDrafterPrompt',
  input: {schema: ContractDrafterInputSchema},
  output: {schema: ContractDrafterOutputSchema},
  prompt: `You are a Strategic Co-Founder and Identity Architect for {{{businessName}}}.
Your task is to draft a "Strategic Outcome Agreement" for {{{clientName}}} based on these services: {{{serviceBrief}}}.

The tone should be: {{{brandingTone}}}.

Draft a basic but professional contract that:
1. Clearly states the "Strategic Win" being delivered.
2. Outlines the professional standards of the work.
3. Reinforces the market value of the expertise provided.
4. Keeps it concise but authoritative.

Do not use overly complex legalese, but ensure it honors the expert's craft and the client's investment.`,
});

const contractDrafterFlow = ai.defineFlow(
  {
    name: 'contractDrafterFlow',
    inputSchema: ContractDrafterInputSchema,
    outputSchema: ContractDrafterOutputSchema,
  },
  async input => {
    const {output} = await contractDrafterPrompt(input);
    return output!;
  }
);
