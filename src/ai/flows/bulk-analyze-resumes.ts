// src/ai/flows/bulk-analyze-resumes.ts
'use server';
/**
 * @fileOverview A flow to analyze multiple resumes against a single job description.
 *
 * - bulkAnalyzeResumes - A function that takes a job description and a list of resumes and returns a ranked list of candidates.
 * - BulkAnalyzeResumesInput - The input type for the bulkAnalyzeResumes function.
 * - BulkAnalysisResult - The output type for each item in the results array.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { matchJobDescription, MatchJobDescriptionInputSchema } from './match-job-description';

const ResumeInputSchema = z.object({
  fileName: z.string().describe("The name of the resume file."),
  resumeText: z.string().describe("The text content of the resume."),
});

export const BulkAnalyzeResumesInputSchema = z.object({
  jobDescription: z.string().describe('The job description to match against.'),
  resumes: z.array(ResumeInputSchema).describe('An array of resumes to analyze.'),
});
export type BulkAnalyzeResumesInput = z.infer<typeof BulkAnalyzeResumesInputSchema>;

export const BulkAnalysisResultSchema = z.object({
  fileName: z.string().describe("The name of the resume file."),
  compatibilityScore: z.number().describe('A score (0-100) representing the compatibility.'),
  reasoning: z.string().describe('A brief reasoning for the score.'),
});
export type BulkAnalysisResult = z.infer<typeof BulkAnalysisResultSchema>;

export async function bulkAnalyzeResumes(input: BulkAnalyzeResumesInput): Promise<BulkAnalysisResult[]> {
  return bulkAnalyzeResumesFlow(input);
}

const bulkAnalyzeResumesFlow = ai.defineFlow(
  {
    name: 'bulkAnalyzeResumesFlow',
    inputSchema: BulkAnalyzeResumesInputSchema,
    outputSchema: z.array(BulkAnalysisResultSchema),
  },
  async ({ jobDescription, resumes }) => {
    
    const analysisPromises = resumes.map(async (resume) => {
      try {
        const matchResult = await matchJobDescription({
          resumeText: resume.resumeText,
          jobDescription,
        });

        return {
          fileName: resume.fileName,
          compatibilityScore: matchResult.compatibilityScore,
          reasoning: matchResult.reasoning,
        };
      } catch (error) {
        console.error(`Failed to analyze resume: ${resume.fileName}`, error);
        // Return a result with a score of 0 to indicate failure for this specific resume
        return {
          fileName: resume.fileName,
          compatibilityScore: 0,
          reasoning: "Failed to analyze this resume due to an error.",
        };
      }
    });

    const results = await Promise.all(analysisPromises);
    
    return results;
  }
);
