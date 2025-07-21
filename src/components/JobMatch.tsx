"use client";

import type { MatchJobDescriptionOutput } from "@/ai/flows/match-job-description";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface JobMatchProps {
  match: MatchJobDescriptionOutput;
}

export function JobMatch({ match }: JobMatchProps) {
  const scoreColor = match.compatibilityScore > 75 ? "text-green-500" : match.compatibilityScore > 50 ? "text-yellow-500" : "text-red-500";
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-lg">
                <Target className="w-6 h-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Compatibility Score</CardTitle>
                <CardDescription>How well your resume matches the job description.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
             <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${scoreColor}`}>{match.compatibilityScore}%</span>
            <svg width="120" height="120" viewBox="0 0 36 36" className="block">
              <path
                className="stroke-current text-gray-200 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
              <path
                className={`stroke-current ${scoreColor}`}
                strokeDasharray={`${match.compatibilityScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeLinecap="round"
                strokeWidth="3"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">Reasoning</h3>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{match.reasoning}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
