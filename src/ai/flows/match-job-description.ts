'use server';

/**
 * @fileOverview A flow to determine the compatibility between a resume and a job description.
 *
 * - matchJobDescription - A function that takes a resume and job description and returns a compatibility score.
 * - MatchJobDescriptionInput - The input type for the matchJobDescription function.
 * - MatchJobDescriptionOutput - The return type for the matchJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchJobDescriptionInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description to match against.'),
});
export type MatchJobDescriptionInput = z.infer<typeof MatchJobDescriptionInputSchema>;

const MatchJobDescriptionOutputSchema = z.object({
  compatibilityScore: z
    .number()
    .describe('A score (0-100) representing the compatibility between the resume and the job description.'),
  reasoning: z.string().describe('The reasoning behind the compatibility score.'),
});
export type MatchJobDescriptionOutput = z.infer<typeof MatchJobDescriptionOutputSchema>;

export async function matchJobDescription(input: MatchJobDescriptionInput): Promise<MatchJobDescriptionOutput> {
  return matchJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchJobDescriptionPrompt',
  input: {schema: MatchJobDescriptionInputSchema},
  output: {schema: MatchJobDescriptionOutputSchema},
  prompt: `You are an expert resume matcher. Given a resume and a job description, determine how well the resume matches the job description.

  Provide a compatibility score between 0 and 100. Also explain your reasoning for the score.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}`,
});

const matchJobDescriptionFlow = ai.defineFlow(
  {
    name: 'matchJobDescriptionFlow',
    inputSchema: MatchJobDescriptionInputSchema,
    outputSchema: MatchJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
