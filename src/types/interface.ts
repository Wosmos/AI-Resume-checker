import { GenerateImprovementSuggestionsOutput } from "@/ai/flows/generate-improvement-suggestions";
import { MatchJobDescriptionOutput } from "@/ai/flows/match-job-description";
import type { AnalysisState } from "@/types";

export interface ImprovementSuggestionsProps {
    suggestions: GenerateImprovementSuggestionsOutput;
}

export interface JobMatchProps {
  match: MatchJobDescriptionOutput;
}

export interface ResultsDisplayProps {
    results: AnalysisState | null;
    isLoading: boolean;
}



export interface FeedbackCardProps {
  icon: React.ElementType;
  title: string;
  feedback: string;
}