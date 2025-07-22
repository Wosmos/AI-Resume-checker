import type { GenerateImprovementSuggestionsOutput } from "@/ai/flows/generate-improvement-suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImprovementSuggestionsProps } from "@/types/interface";
import { Lightbulb } from "lucide-react";

export function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  const suggestionItems = suggestions.improvementSuggestions
    .split(/\n- /)
    .map(s => s.trim().replace(/^- /, ''))
    .filter(Boolean);

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <div className="flex items-center gap-3">
             <div className="flex-shrink-0 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 p-2 rounded-lg">
                <Lightbulb className="w-6 h-6" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Improvement Suggestions</CardTitle>
                <CardDescription>Actionable tips to make your resume stand out.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {suggestionItems.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="text-foreground/90">{suggestion}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
