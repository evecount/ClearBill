
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating professional
 * project proposals that highlight outcome certainty and strategic value.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProposalGeneratorInputSchema = z.object({
  businessName: z.string(),
  clientName: z.string(),
  projectBrief: z.string().describe('A raw description of the project or service requested.'),
  brandingTone: z.string().optional(),
});
export type ProposalGeneratorInput = z.infer<typeof ProposalGeneratorInputSchema>;

const ProposalGeneratorOutputSchema = z.object({
  proposalTitle: z.string(),
  executiveSummary: z.string().describe('A high-level overview focused on the strategic win.'),
  deliverables: z.array(z.string()).describe('List of specific outcomes/deliverables.'),
  pricingStructure: z.string().describe('Recommended pricing model based on value, not just hours.'),
  closingStatement: z.string().describe('A professional closing that reinforces trust.'),
});
export type ProposalGeneratorOutput = z.infer<typeof ProposalGeneratorOutputSchema>;

export async function generateProposal(input: ProposalGeneratorInput): Promise<ProposalGeneratorOutput> {
  return proposalGeneratorFlow(input);
}

const proposalGeneratorPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
  input: {schema: ProposalGeneratorInputSchema},
  output: {schema: ProposalGeneratorOutputSchema},
  prompt: `You are a Strategic Co-Founder and Growth Partner for {{{businessName}}}.
Your mission is to draft a high-value project proposal for {{{clientName}}} based on this project brief: "{{{projectBrief}}}"

The tone should be: {{{brandingTone}}}.

Guidelines:
1. Don't focus on labor; focus on the Strategic Win.
2. Use professional, accessible language suitable for experts (like plumbers, chefs, or consultants).
3. Ensure the deliverables are framed as outcomes, not tasks.
4. Suggest a pricing model that reflects the value of the outcome.
5. Highlight why {{{businessName}}} is the right choice for this specific win.`,
});

const proposalGeneratorFlow = ai.defineFlow(
  {
    name: 'proposalGeneratorFlow',
    inputSchema: ProposalGeneratorInputSchema,
    outputSchema: ProposalGeneratorOutputSchema,
  },
  async input => {
    const {output} = await proposalGeneratorPrompt(input);
    return output!;
  }
);
