'use server';

/**
 * @fileOverview A flow to generate specific, actionable recommendations for improving a resume based on AI analysis.
 *
 * - generateImprovementSuggestions - A function that generates improvement suggestions for a resume.
 * - GenerateImprovementSuggestionsInput - The input type for the generateImprovementSuggestions function.
 * - GenerateImprovementSuggestionsOutput - The return type for the generateImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovementSuggestionsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to analyze.'),
  analysisResults: z
    .string()
    .describe('The AI analysis results of the resume, including areas for improvement.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to tailor the resume towards.'),
});
export type GenerateImprovementSuggestionsInput = z.infer<
  typeof GenerateImprovementSuggestionsInputSchema
>;

const GenerateImprovementSuggestionsOutputSchema = z.object({
  improvementSuggestions: z
    .string()
    .describe(
      'Specific, actionable recommendations for improving the resume based on the AI analysis.'
    ),
});
export type GenerateImprovementSuggestionsOutput = z.infer<
  typeof GenerateImprovementSuggestionsOutputSchema
>;

export async function generateImprovementSuggestions(
  input: GenerateImprovementSuggestionsInput
): Promise<GenerateImprovementSuggestionsOutput> {
  return generateImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovementSuggestionsPrompt',
  input: {schema: GenerateImprovementSuggestionsInputSchema},
  output: {schema: GenerateImprovementSuggestionsOutputSchema},
  prompt: `You are a resume expert. Analyze the resume and provide specific, actionable recommendations for improvement based on the AI analysis results. If a job description is provided, tailor the recommendations towards the job description.

Resume:
{{resumeText}}

AI Analysis Results:
{{analysisResults}}

Job Description (if provided):
{{jobDescription}}

Recommendations:
`,
});

const generateImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateImprovementSuggestionsFlow',
    inputSchema: GenerateImprovementSuggestionsInputSchema,
    outputSchema: GenerateImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
