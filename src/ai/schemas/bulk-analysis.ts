/**
 * @fileOverview Schemas and types for bulk resume analysis.
 */

import { z } from 'genkit';

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
