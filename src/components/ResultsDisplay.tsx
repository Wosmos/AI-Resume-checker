import type { AnalysisState } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8 animate-pulse">
      {/* Job Match Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="w-full space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <Skeleton className="h-6 w-40 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
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
             <Card key={i} className="bg-background/50 dark:bg-card">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      
      {/* Suggestions Skeleton */}
       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 rounded-full mt-1" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
