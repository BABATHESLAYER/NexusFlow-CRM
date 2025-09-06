// This is a server-side file.
'use server';

/**
 * @fileOverview Explains the current step in the non-recursive inorder traversal.
 *
 * - explainTraversalStep - A function that explains the current traversal action with pseudocode and code snippets.
 * - ExplainTraversalStepInput - The input type for the explainTraversalStep function.
 * - ExplainTraversalStepOutput - The return type for the explainTraversalStep function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTraversalStepInputSchema = z.object({
  stepDescription: z
    .string()
    .describe('A description of the current step in the traversal.'),
  stackContents: z.string().describe('The contents of the stack.'),
  currentNode: z.string().describe('The current node being visited.'),
});
export type ExplainTraversalStepInput = z.infer<
  typeof ExplainTraversalStepInputSchema
>;

const ExplainTraversalStepOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'An explanation of the current traversal step using pseudocode and code snippets.'
    ),
});
export type ExplainTraversalStepOutput = z.infer<
  typeof ExplainTraversalStepOutputSchema
>;

export async function explainTraversalStep(
  input: ExplainTraversalStepInput
): Promise<ExplainTraversalStepOutput> {
  return explainTraversalStepFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTraversalStepPrompt',
  input: {schema: ExplainTraversalStepInputSchema},
  output: {schema: ExplainTraversalStepOutputSchema},
  prompt: `You are an expert computer science tutor explaining a step in a non-recursive inorder traversal of a binary tree.

  Here's a description of the current step:
  {{stepDescription}}

  The current node being visited is: {{currentNode}}

  The contents of the stack are: {{stackContents}}

  Explain the current traversal action by relating it to pseudocode for a non-recursive inorder traversal algorithm. Present relevant code snippets to demonstrate the current action.
  Use 'Source Code Pro' font when displaying code snippets.
  Focus on clarity and simplicity in your explanation.
  `,
});

const explainTraversalStepFlow = ai.defineFlow(
  {
    name: 'explainTraversalStepFlow',
    inputSchema: ExplainTraversalStepInputSchema,
    outputSchema: ExplainTraversalStepOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
