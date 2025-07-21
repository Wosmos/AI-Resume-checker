// src/ai/flows/analyze-resume.ts
'use server';
/**
 * @fileOverview Analyzes a resume for content, grammar, and formatting, providing feedback and suggestions.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to analyze.'),
});

export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  contentFeedback: z.string().describe('Feedback on the resume content.'),
  grammarFeedback: z.string().describe('Feedback on the grammar and spelling.'),
  formattingFeedback: z.string().describe('Feedback on the resume formatting.'),
  overallFeedback: z.string().describe('Overall feedback and suggestions for the resume.'),
});

export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are a resume expert. Analyze the following resume for content, grammar, and formatting. Provide specific feedback in each area.

Resume:
{{{resumeText}}}

Respond with the following JSON format:
{
  "contentFeedback": "Feedback on the resume content.",
  "grammarFeedback": "Feedback on the grammar and spelling.",
  "formattingFeedback": "Feedback on the resume formatting.",
  "overallFeedback": "Overall feedback and suggestions for the resume."
}
`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
