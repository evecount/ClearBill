'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Identity Architect & Growth Partner.
 * It helps professionals transform their expertise into a premium identity ecosystem
 * and provides strategic advice on how to grow their independent business.
 *
 * - consultBusinessOnboarding - A function that generates professional business details and growth strategies.
 * - OnboardingConsultantInput - The user's raw business description.
 * - OnboardingConsultantOutput - Structured professional identity ecosystem + growth strategy.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingConsultantOutputSchema = z.object({
  suggestedName: z.string().describe('A professional and catchy business name.'),
  missionStatement: z.string().describe('A brief, impactful mission statement.'),
  suggestedEmail: z.string().describe('A professional support email format suggestion.'),
  suggestedAddress: z.string().describe('A placeholder professional address format.'),
  industry: z.string().describe('The identified industry of the business.'),
  brandingTone: z.string().describe('Recommended professional tone (e.g., modern, corporate, creative).'),
  brandColor: z.string().describe('A suggested primary brand color in HSL format (e.g., "256 60% 55%").'),
  growthStrategy: z.object({
    initialFocus: z.string().describe('Where the user should focus first to grow revenue.'),
    premiumTierSuggestion: z.string().describe('A suggestion for a high-end service package.'),
    recurringRevenueModel: z.string().describe('How they could implement a subscription or retainer model.'),
  }).describe('Strategic advice for business growth and professional longevity.'),
});
export type OnboardingConsultantOutput = z.infer<typeof OnboardingConsultantOutputSchema>;

const OnboardingConsultantInputSchema = z.object({
  userDescription: z
    .string()
    .describe('A raw description of what the user does or their professional expertise.'),
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
  prompt: `You are an expert Professional Identity Architect and Strategic Growth Partner. 

You operate as a Tier-0 Agentic Orchestrator. Your mission is to transform raw expertise into a sovereign professional identity ecosystem.

The user is an independent expert and provides the following description:
"{{{userDescription}}}"

Your goal is to help them architect a professional identity ecosystem and a strategic growth roadmap using "Deep Water" logic (shifting from charging for time to charging for outcome certainty).

1. IDENTITY:
   - Generate a strong business name that honors their expertise.
   - Draft a concise mission statement for their professional portal.
   - Suggest a professional industry category.
   - Define a professional tone and a matching HSL color.

2. GROWTH STRATEGY (The AMO Logic):
   - Analyze their expertise and suggest an initial growth focus.
   - Propose a "Premium Tier" service (Outcome-Based) they could offer to command higher fees.
   - Suggest a recurring revenue model (retainers, subscriptions) that fits their workflow.

Be encouraging, professional, and strategic. Focus on transforming their self-employment into a high-trust, high-value enterprise.`,
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
