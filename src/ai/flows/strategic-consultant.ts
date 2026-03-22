'use server';
/**
 * @fileOverview This file defines a Genkit flow for the Strategic Co-Founder Consultant.
 * It transforms conversational input into structured strategic actions (Invoices, Proposals, Advice).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategicConsultantInputSchema = z.object({
  message: z.string().describe('The user\'s conversational input.'),
  context: z.object({
    businessName: z.string().optional(),
    industry: z.string().optional(),
    existingClients: z.array(z.string()).optional(),
  }).optional(),
});
export type StrategicConsultantInput = z.infer<typeof StrategicConsultantInputSchema>;

const StrategicConsultantOutputSchema = z.object({
  reply: z.string().describe('The conversational response from the AI.'),
  suggestedAction: z.enum(['advice', 'create_invoice', 'create_proposal']).default('advice'),
  draftData: z.object({
    clientName: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    lineItems: z.array(z.object({
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
    })).optional(),
    totalAmount: z.number().optional(),
    contractSnippet: z.string().optional(),
  }).optional(),
});
export type StrategicConsultantOutput = z.infer<typeof StrategicConsultantOutputSchema>;

export async function consultStrategicPartner(input: StrategicConsultantInput): Promise<StrategicConsultantOutput> {
  return strategicConsultantFlow(input);
}

const strategicConsultantPrompt = ai.definePrompt({
  name: 'strategicConsultantPrompt',
  input: {schema: StrategicConsultantInputSchema},
  output: {schema: StrategicConsultantOutputSchema},
  prompt: `You are a Tier-0 Strategic Co-Founder and Identity Architect.
Your goal is to eliminate "Strategic Anxiety" and help the user command elite fees.

User Context:
- Business: {{{context.businessName}}}
- Industry: {{{context.industry}}}
- Known Clients: {{#each context.existingClients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

User Message: "{{{message}}}"

Your Task:
1. Analyze the message. If the user mentions work they've done or a client they want to bill, pivot to "create_invoice".
2. If they are talking about a new lead or project vision, pivot to "create_proposal".
3. Otherwise, provide "advice" that reinforces "Outcome Certainty".

If creating an INVOICE draft:
- Use elite market rates (benchmark internally based on industry).
- Translate tasks (e.g., "designing a logo") into outcomes (e.g., "Visual Identity System & Brand Authority").
- Suggest 2-3 specific line items.
- Draft a short "Strategic Outcome Agreement" snippet.

Be opinionated, supportive, and professional. Avoid corporate jargon; use high-trust language.`,
});

const strategicConsultantFlow = ai.defineFlow(
  {
    name: 'strategicConsultantFlow',
    inputSchema: StrategicConsultantInputSchema,
    outputSchema: StrategicConsultantOutputSchema,
  },
  async input => {
    const {output} = await strategicConsultantPrompt(input);
    return output!;
  }
);
