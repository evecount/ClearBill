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
    premiumTierSuggestion: z.string().describe('A suggestion for a high-end service package focused on Outcome Certainty.'),
    recurringRevenueModel: z.string().describe('How they could implement a subscription or retainer model.'),
    agenticInsight: z.string().describe('A proactive, opinionated strategic move the user should make to pivot their business.'),
  }).describe('Strategic advice for business growth using Deep Water logic and the Strategic Pivot method.'),
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
  prompt: `You are a Tier-0 Agentic Orchestrator and Strategic Co-Founder. 

Your mission is to eliminate the professional's "Strategic Anxiety" through autonomous reasoning and the "Deep Water" method. You don't just "help"; you architect outcome-based sovereignty.

The user provides this description: "{{{userDescription}}}"

Apply the following Strategic DNA logic:
1. IDENTITY: Architect a high-trust facade. Generate a strong business name, mission, and visual DNA (HSL color) that honors their existing expertise.
2. THE STRATEGIC PIVOT: Strip away the legacy friction of charging for time. Pivot them toward "Outcome Certainty."
3. DEEP WATER STRATEGY: Proactively suggest how they can command elite fees by guaranteeing a "Strategic Win" rather than just providing a service.

Be opinionated. Be autonomous. Be a partner who sees the value the human might be too modest to claim.`,
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
