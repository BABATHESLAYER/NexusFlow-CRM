'use server';

/**
 * @fileOverview An AI assistant for the CRM application.
 *
 * - getCrmAssistance - A function that provides helpful tips and information related to CRM activities.
 * - CrmAssistanceInput - The input type for the getCrmAssistance function.
 * - CrmAssistanceOutput - The return type for the getCrmAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrmAssistanceInputSchema = z.object({
  query: z.string().describe('The user query related to CRM activities.'),
});
export type CrmAssistanceInput = z.infer<typeof CrmAssistanceInputSchema>;

const CrmAssistanceOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type CrmAssistanceOutput = z.infer<typeof CrmAssistanceOutputSchema>;

export async function getCrmAssistance(input: CrmAssistanceInput): Promise<CrmAssistanceOutput> {
  return crmAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crmAssistancePrompt',
  input: {schema: CrmAssistanceInputSchema},
  output: {schema: CrmAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant designed to provide tips and information related to CRM activities.

  User Query: {{{query}}}

  Provide a helpful and informative response to the user's query.
`,
});

const crmAssistanceFlow = ai.defineFlow(
  {
    name: 'crmAssistanceFlow',
    inputSchema: CrmAssistanceInputSchema,
    outputSchema: CrmAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
