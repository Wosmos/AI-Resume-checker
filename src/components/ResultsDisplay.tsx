import type { AnalysisState } from "@/app/page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobMatch } from "./JobMatch";
import { ResumeAnalysis } from "./ResumeAnalysis";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { ScrollArea } from "./ui/scroll-area";

interface ResultsDisplayProps {
  results: AnalysisState | null;
  isLoading: boolean;
}

export function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

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

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Job Match Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Analysis Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      
      {/* Suggestions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
