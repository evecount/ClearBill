
'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Identity Architect.
 * It helps professionals transform their expertise into a premium identity ecosystem.
 *
 * - consultBusinessOnboarding - A function that generates professional business details.
 * - OnboardingConsultantInput - The user's raw business description.
 * - OnboardingConsultantOutput - Structured professional identity ecosystem.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingConsultantInputSchema = z.object({
  userDescription: z
    .string()
    .describe('A raw description of what the user does or their professional expertise.'),
});
export type OnboardingConsultantInput = z.infer<typeof OnboardingConsultantInputSchema>;

const OnboardingConsultantOutputSchema = z.object({
  suggestedName: z.string().describe('A professional and catchy business name.'),
  missionStatement: z.string().describe('A brief, impactful mission statement.'),
  suggestedEmail: z.string().describe('A professional support email format suggestion.'),
  suggestedAddress: z.string().describe('A placeholder professional address format.'),
  industry: z.string().describe('The identified industry of the business.'),
  brandingTone: z.string().describe('Recommended professional tone (e.g., modern, corporate, creative).'),
  brandColor: z.string().describe('A suggested primary brand color in HSL format (e.g., "256 60% 55%"). Pick something that matches the industry and professional tone.'),
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
  prompt: `You are an expert Professional Identity Architect.

The user is an independent expert and provides the following description:
"{{{userDescription}}}"

Your goal is to help them architect a professional identity ecosystem for their billing. 
1. Generate a strong, memorable business name that honors their expertise.
2. Draft a concise mission statement for their professional portal.
3. Suggest a professional industry category.
4. Provide a realistic professional email and address structure.
5. Define their professional tone and a matching HSL color for their identity ecosystem.

Be encouraging and professional. Focus on validating their expertise and creating a premium, trustworthy identity that reflects the value they provide to clients.`,
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
