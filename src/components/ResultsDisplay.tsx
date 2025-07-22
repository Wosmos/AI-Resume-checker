import type { AnalysisState } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobMatch } from "./JobMatch";
import { ResumeAnalysis } from "./ResumeAnalysis";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { ScrollArea } from "./ui/scroll-area";
import { ResultsDisplayProps } from "@/types/interface";

export function ResultsDisplay({ results }: ResultsDisplayProps) {

  if (!results) {
    return null;
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
      <div className="space-y-8">
        {results.match && (
          <JobMatch match={results.match} />
        )}
        {results.analysis && (
          <ResumeAnalysis analysis={results.analysis} />
        )}
        {results.suggestions && (
          <ImprovementSuggestions suggestions={results.suggestions} />
        )}
      </div>
    </ScrollArea>
  );
}
