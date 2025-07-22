import type { AnalyzeResumeOutput } from "@/ai/flows/analyze-resume";
import type { MatchJobDescriptionOutput } from "@/ai/flows/match-job-description";
import type { GenerateImprovementSuggestionsOutput } from "@/ai/flows/generate-improvement-suggestions";

export type AnalysisState = {
  analysis?: AnalyzeResumeOutput;
  match?: MatchJobDescriptionOutput | null;
  suggestions?: GenerateImprovementSuggestionsOutput;
};

export type ResumeFile = {
  file: File;
  text: string;
};
