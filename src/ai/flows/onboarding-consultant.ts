'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Identity Architect & Growth Partner.
 * It helps professionals transform their expertise into a premium identity ecosystem.
 *
 * - consultBusinessOnboarding - A function that generates professional business details and growth strategies.
 * - OnboardingConsultantInput - The user's raw business description + provided facts.
 * - OnboardingConsultantOutput - Structured professional identity ecosystem + growth strategy + first invoice draft.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingConsultantOutputSchema = z.object({
  suggestedName: z.string().describe('A professional business name. Use the one provided by the user if available.'),
  missionStatement: z.string().describe('A brief, impactful mission statement focused on the win.'),
  suggestedEmail: z.string().describe('A professional support email format suggestion.'),
  suggestedAddress: z.string().describe('The professional address. Use the one provided by the user.'),
  industry: z.string().describe('The identified industry.'),
  brandingTone: z.string().describe('Recommended professional tone.'),
  brandColor: z.string().describe('A suggested primary brand color in HSL format.'),
  suggestedLineItems: z.array(z.object({
    description: z.string().describe('A professional, outcome-based invoice line item description.'),
    price: z.number().describe('A recommended elite market rate price for this item.'),
  })).describe('Standard invoice line items for this type of project/expertise.'),
  growthStrategy: z.object({
    initialFocus: z.string().describe('Grounded, professional language on where to start.'),
    premiumTierSuggestion: z.string().describe('A suggestion for a high-end service package.'),
    recurringRevenueModel: z.string().describe('How to implement a subscription or retainer model.'),
    agenticInsight: z.string().describe('A proactive, opinionated strategic move.'),
  }).describe('Strategic advice for business growth.'),
});
export type OnboardingConsultantOutput = z.infer<typeof OnboardingConsultantOutputSchema>;

const OnboardingConsultantInputSchema = z.object({
  userDescription: z.string().describe('The strategic context provided by the user.'),
  businessName: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
});
export type OnboardingConsultantInput = z.infer<typeof OnboardingConsultantInputSchema>;

export async function consultBusinessOnboarding(
  input: OnboardingConsultantInput
): Promise<OnboardingConsultantOutput> {
  return onboardingConsultantFlow(input);
}

const onboardingConsultantPrompt = ai.definePrompt({
  name: 'onboardingConsultantPrompt',
  input: {schema: OnboardingConsultantInputSchema},
  output: {schema: OnboardingConsultantOutputSchema},
  prompt: `You are a Professional Identity Architect. 

CRITICAL: Use these facts as the absolute source of truth. DO NOT INVENT OR ALTER THEM:
- Business Name: {{{businessName}}}
- Location: {{{location}}}
- Provided Industry: {{{industry}}}

Context: "{{{userDescription}}}"

Your task:
1. IDENTITY: If the user provided a brief description like "I am an artist", expand this into a full professional mission that highlights "Outcome Certainty".
2. INVOICING: Generate 3-4 professional, outcome-based invoice line items that an expert in this field would typically bill for. For an artist, include things like "Conceptual Development & Site Research", "Production & Material Procurement", etc. Assign elite, professional prices.
3. GROWTH: Provide grounded advice on how to command elite fees by focusing on the "win" they provide for their clients.
4. OUTPUT: Ensure the suggestedName and suggestedAddress in the output strictly match the provided facts.

Sound like a supportive, high-level business partner. Avoid jargon.`,
});

const onboardingConsultantFlow = ai.defineFlow(
  {
    name: 'onboardingConsultantFlow',
    inputSchema: OnboardingConsultantInputSchema,
    outputSchema: OnboardingConsultantOutputSchema,
  },
  async input => {
    const {output} = await onboardingConsultantPrompt(input);
    return output!;
  }
);
