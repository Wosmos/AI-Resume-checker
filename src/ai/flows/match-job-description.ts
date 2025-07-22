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
  reasoning: z.string().describe('A detailed, point-by-point reasoning behind the compatibility score, comparing resume details to job requirements.'),
  keywordComparison: z.object({
      matched: z.array(z.string()).describe('Keywords from the job description found in the resume.'),
      missing: z.array(z.string()).describe('Keywords from the job description missing from the resume.'),
  }).describe('A comparison of keywords found and missing.'),
});
export type MatchJobDescriptionOutput = z.infer<typeof MatchJobDescriptionOutputSchema>;

export async function matchJobDescription(input: MatchJobDescriptionInput): Promise<MatchJobDescriptionOutput> {
  return matchJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchJobDescriptionPrompt',
  input: {schema: MatchJobDescriptionInputSchema},
  output: {schema: MatchJobDescriptionOutputSchema},
  prompt: `You are a highly sophisticated Applicant Tracking System (ATS). Your task is to analyze a resume against a job description with high precision.

  1.  **Extract Requirements**: First, identify the key requirements from the job description. This includes:
      *   **Must-have skills**: (e.g., 'React Native', 'TypeScript', 'Node.js')
      *   **Years of experience**: (e.g., '5+ years of experience in software development')
      *   **Specific qualifications**: (e.g., 'B.S. in Computer Science', 'experience with GraphQL')
      *   **Soft skills**: (e.g., 'team leadership', 'agile methodologies')

  2.  **Analyze Resume**: Scan the resume to find evidence of these requirements. Be precise. For example, if the job requires 'React Native', do not accept 'React' as a full match. They are different technologies.

  3.  **Calculate Score**: Based on your analysis, provide a compatibility score from 0 to 100. The score should reflect the degree of alignment between the resume and the *specific* job requirements. A candidate missing a must-have skill should receive a significantly lower score.

  4.  **Provide Detailed Reasoning**: Explain your score with a point-by-point analysis. For each key requirement from the job description, state whether you found it in the resume and where.

  5.  **Keyword Analysis**: Provide a list of important keywords from the job description that were matched in the resume, and a list of those that were missing. This is crucial for the applicant to see what they are missing.

  **Resume**:
  {{{resumeText}}}

  **Job Description**:
  {{{jobDescription}}}`,
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
