import type { AnalyzeResumeOutput } from "@/ai/flows/analyze-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LayoutTemplate, SpellCheck, ThumbsUp } from "lucide-react";
import React from "react";

interface ResumeAnalysisProps {
  analysis: AnalyzeResumeOutput;
}

const feedbackCategories = [
  {
    title: "Content",
    key: "contentFeedback",
    icon: FileText,
  },
  {
    title: "Grammar & Spelling",
    key: "grammarFeedback",
    icon: SpellCheck,
  },
  {
    title: "Formatting",
    key: "formattingFeedback",
    icon: LayoutTemplate,
  },
  {
    title: "Overall Feedback",
    key: "overallFeedback",
    icon: ThumbsUp,
  },
] as const;

export function ResumeAnalysis({ analysis }: ResumeAnalysisProps) {
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Resume Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {feedbackCategories.map((category) => (
            <FeedbackCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              feedback={analysis[category.key]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface FeedbackCardProps {
  icon: React.ElementType;
  title: string;
  feedback: string;
}

function FeedbackCard({ icon: Icon, title, feedback }: FeedbackCardProps) {
    const isPositive = feedback.toLowerCase().includes("good") || feedback.toLowerCase().includes("excellent") || feedback.toLowerCase().includes("strong");

    return (
        <Card className="bg-background/50 dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
                <div className={`flex-shrink-0 ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-primary/10 text-primary'} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                </div>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{feedback}</p>
        </CardContent>
        </Card>
    );
}
