// src/ai/flows/bulk-analyze-resumes.ts
'use server';
/**
 * @fileOverview A flow to analyze multiple resumes against a single job description.
 *
 * - bulkAnalyzeResumes - A function that takes a job description and a list of resumes and returns a ranked list of candidates.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { matchJobDescription } from './match-job-description';
import { BulkAnalyzeResumesInputSchema, BulkAnalysisResultSchema, BulkAnalyzeResumesInput, BulkAnalysisResult } from '@/ai/schemas/bulk-analysis';


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
      } catch (error) => {
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
