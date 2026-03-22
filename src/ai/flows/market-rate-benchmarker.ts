'use server';
/**
 * @fileOverview This file defines a Genkit flow for benchmarking market rates.
 * It helps professionals ensure they are charging competitive, high-value fees.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketRateBenchmarkerInputSchema = z.object({
  serviceDescription: z.string().describe('The service or job role being billed.'),
  region: z.string().optional().describe('The geographical region for context.'),
});
export type MarketRateBenchmarkerInput = z.infer<typeof MarketRateBenchmarkerInputSchema>;

const MarketRateBenchmarkerOutputSchema = z.object({
  suggestedRateRange: z.object({
    min: z.number().describe('The lower end of the professional market rate.'),
    max: z.number().describe('The upper end of the elite market rate.'),
    unit: z.string().describe('The unit of billing (e.g., per hour, per project, per outcome).'),
  }),
  valueJustification: z.string().describe('A persuasive explanation of why this rate is justified based on the strategic outcome.'),
  underchargingRiskInsight: z.string().describe('A specific insight into how professionals in this role often undercharge.'),
});
export type MarketRateBenchmarkerOutput = z.infer<typeof MarketRateBenchmarkerOutputSchema>;

export async function benchmarkMarketRate(input: MarketRateBenchmarkerInput): Promise<MarketRateBenchmarkerOutput> {
  return marketRateBenchmarkerFlow(input);
}

const marketRateBenchmarkerPrompt = ai.definePrompt({
  name: 'marketRateBenchmarkerPrompt',
  input: {schema: MarketRateBenchmarkerInputSchema},
  output: {schema: MarketRateBenchmarkerOutputSchema},
  prompt: `You are a Tier-0 Strategic Monetization Orchestrator. 

Your task is to analyze the service description: "{{{serviceDescription}}}" and provide a professional market rate benchmark.

Context: 
- Many independent professionals, particularly women and those in service roles, undercharge by 40-75%.
- We use "Outcome Certainty" logic: we don't just bill for time; we bill for the Strategic Win.

Provide:
1. A suggested rate range (Min/Max) that reflects elite professional standards, not commodity labor.
2. A "Value Justification" that the professional can use to explain their fee to a client.
3. An "Undercharging Risk Insight" that highlights how they might be leaving money on the table.

Be opinionated and encouraging. Help them charge what they are actually worth.`,
});

const marketRateBenchmarkerFlow = ai.defineFlow(
  {
    name: 'marketRateBenchmarkerFlow',
    inputSchema: MarketRateBenchmarkerInputSchema,
    outputSchema: MarketRateBenchmarkerOutputSchema,
  },
  async input => {
    const {output} = await marketRateBenchmarkerPrompt(input);
    return output!;
  }
);
