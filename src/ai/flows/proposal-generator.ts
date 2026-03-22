'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating rich, cinematic
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
  narrativeScript: z.string().describe('A cinematic narration or storytelling opening for the project.'),
  episodes: z.array(z.object({
    title: z.string(),
    arc: z.string().describe('The narrative or project arc for this specific phase/episode.'),
  })).describe('Phases of the project framed as episodes in a larger story.'),
  deliverables: z.array(z.string()).describe('List of specific outcomes/deliverables.'),
  investmentTiers: z.array(z.object({
    amount: z.number(),
    label: z.string().describe('e.g., MVP Core, Growth, Full Pilot'),
    scope: z.array(z.string()).describe('deliverables included in this tier'),
  })).describe('Tiered pricing milestones.'),
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
  prompt: `You are a Strategic Co-Founder and Identity Architect for {{{businessName}}}.
Your mission is to draft a high-value, cinematic project proposal for {{{clientName}}} based on this project brief: "{{{projectBrief}}}"

The tone should be: {{{brandingTone}}}.

Guidelines:
1. Frame the project as a "Legend" or "Story" being built.
2. NARRATIVE: Provide a "Narrative Script" block (like a film opening) that sets the emotional stakes.
3. EPISODES: Break the work into 3-4 "Episodes" rather than just phases.
4. INVESTMENT: Create 3 investment tiers starting from an MVP entry point to a full pilot.
5. Focus on the "Strategic Win" for the client, not the labor of the expert.
6. Use professional, evocative language that honors the expert's craft.`,
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
