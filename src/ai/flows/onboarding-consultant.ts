
'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Onboarding Consultant.
 * It helps small business owners refine their professional identity.
 *
 * - consultBusinessOnboarding - A function that generates professional business details.
 * - OnboardingConsultantInput - The user's raw business description.
 * - OnboardingConsultantOutput - Structured professional business profile.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingConsultantInputSchema = z.object({
  userDescription: z
    .string()
    .describe('A raw description of what the user does or their business idea.'),
});
export type OnboardingConsultantInput = z.infer<typeof OnboardingConsultantInputSchema>;

const OnboardingConsultantOutputSchema = z.object({
  suggestedName: z.string().describe('A professional and catchy business name.'),
  missionStatement: z.string().describe('A brief, impactful mission statement.'),
  suggestedEmail: z.string().describe('A professional support email format suggestion.'),
  suggestedAddress: z.string().describe('A placeholder professional address format.'),
  industry: z.string().describe('The identified industry of the business.'),
  brandingTone: z.string().describe('Recommended branding tone (e.g., modern, corporate, creative).'),
  brandColor: z.string().describe('A suggested primary brand color in HSL format (e.g., "256 60% 55%"). Pick something that matches the industry and tone.'),
});
export type OnboardingConsultantOutput = z.infer<typeof OnboardingConsultantOutputSchema>;

export async function consultBusinessOnboarding(
  input: OnboardingConsultantInput
): Promise<OnboardingConsultantOutput> {
  return onboardingConsultantFlow(input);
}

const onboardingConsultantPrompt = ai.definePrompt({
  name: 'onboardingConsultantPrompt',
  input: {schema: OnboardingConsultantInputSchema},
  output: {schema: OnboardingConsultantOutputSchema},
  prompt: `You are an expert small business consultant and branding specialist.

The user is starting a new venture and provides the following description:
"{{{userDescription}}}"

Your goal is to help them professionalize their brand for invoicing. 
1. Generate a strong, memorable business name.
2. Draft a concise mission statement for their client portal.
3. Suggest a professional industry category.
4. Provide a realistic professional email and address structure.
5. Define their branding tone and a matching HSL color for their professional portal.

Be encouraging and professional. Focus on validating their expertise and creating a premium identity.`,
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
