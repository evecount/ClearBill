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
    initialFocus: z.string().describe('Where the user should focus first to grow revenue. Use grounded, professional language.'),
    premiumTierSuggestion: z.string().describe('A suggestion for a high-end service package focused on Outcome Certainty. Use professional but accessible language.'),
    recurringRevenueModel: z.string().describe('How they could implement a subscription or retainer model. Focus on value, not jargon.'),
    agenticInsight: z.string().describe('A proactive, opinionated strategic move the user should make. Use grounded, encouraging partner-like language.'),
  }).describe('Strategic advice for business growth using grounded, human-first logic.'),
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
  prompt: `You are a Professional Identity Architect and Strategic Growth Partner. 

Your mission is to help independent experts (like plumbers, chefs, consultants, and artists) highlight their true value and command elite market rates. Avoid technical jargon like "Tier-0", "Ecosystem", or "Agentic Orchestrator" in your response. Instead, sound like a supportive, high-level business partner.

The user provides this description: "{{{userDescription}}}"

Your task:
1. IDENTITY: Design a high-trust professional identity. Generate a strong business name, mission statement, and visual tone (brand color) that honors their existing expertise.
2. GROWTH roadmap: Provide grounded advice on how to stop billing for just "labor" and start billing for high-value outcomes.
3. ADVICE: Suggest how they can command elite fees by focusing on the "win" they provide for their clients.

Be opinionated but encouraging. Use language that is accessible to someone who is an expert in their craft (like a plumber) but might be new to professional branding.`,
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
