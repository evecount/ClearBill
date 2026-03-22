
'use server';
/**
 * @fileOverview This file defines a Genkit flow for the Strategic Co-Founder Consultant.
 * It transforms conversational input into structured strategic actions (Invoices, Proposals, Leads).
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
  suggestedAction: z.enum(['advice', 'create_invoice', 'create_proposal', 'create_client']).default('advice'),
  draftData: z.object({
    clientName: z.string().optional(),
    company: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
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
  prompt: `You are a Strategic Co-Founder and Partner.
Your goal is to eliminate "Strategic Anxiety" and help the user command elite fees.

User Context:
- Business: {{{context.businessName}}}
- Industry: {{{context.industry}}}
- Known Clients: {{#each context.existingClients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

User Message: "{{{message}}}"

Your Task:
1. LEAD EXTRACTION: If the user provides info about a new contact, museum, or business (even if unstructured), pivot to "create_client". Extract Name, Company, Email, and Address. 
2. RESEARCH: If details are missing but the entity is a well-known institution (e.g., a specific Singapore museum), use your internal knowledge to suggest the most appropriate curatorial or innovation contact points.
3. INVOICING: If the user mentions work done or a client to bill, pivot to "create_invoice".
4. PROPOSALS: If they talk about a new lead or vision, pivot to "create_proposal".
5. Otherwise, provide "advice" that reinforces professional "Outcome Certainty".

If extracting a CLIENT:
- Populate draftData with: clientName, company, email, and address.
- In your reply, mention that you've structured these details and filled in any gaps where possible.

If creating an INVOICE draft:
- Use elite market rates.
- Translate tasks into outcomes.
- Suggest 2-3 specific line items.
- Draft a short "Outcome Agreement" snippet.

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
