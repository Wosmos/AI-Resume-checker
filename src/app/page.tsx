"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { analyzeResume, type AnalyzeResumeOutput } from "@/ai/flows/analyze-resume";
import { matchJobDescription, type MatchJobDescriptionOutput } from "@/ai/flows/match-job-description";
import { generateImprovementSuggestions, type GenerateImprovementSuggestionsOutput } from "@/ai/flows/generate-improvement-suggestions";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Logo } from "@/components/Logo";

export type AnalysisState = {
  analysis?: AnalyzeResumeOutput;
  match?: MatchJobDescriptionOutput | null;
  suggestions?: GenerateImprovementSuggestionsOutput;
};

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<AnalysisState | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const { toast } = useToast();

  const handleAnalysis = () => {
    if (!resume.trim()) {
      toast({
        title: "Resume is empty",
        description: "Please paste your resume to get started.",
        variant: "destructive",
      });
      return;
    }

    startAnalyzing(async () => {
      try {
        setResults(null); // Clear previous results and show loading skeletons

        const analysisPromise = analyzeResume({ resumeText: resume });
        const matchPromise = jobDescription.trim()
          ? matchJobDescription({ resumeText: resume, jobDescription })
          : Promise.resolve(null);
        
        const [analysisResult, matchResult] = await Promise.all([analysisPromise, matchPromise]);

        const analysisResultsString = Object.values(analysisResult).join('\n\n');

        const suggestionsResult = await generateImprovementSuggestions({
          resumeText: resume,
          analysisResults: analysisResultsString,
          jobDescription: jobDescription.trim() || undefined,
        });

        setResults({
          analysis: analysisResult,
          match: matchResult,
          suggestions: suggestionsResult,
        });

      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          title: "Analysis Failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
        setResults(null);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Logo />
          <h1 className="text-4xl font-bold tracking-tight text-primary mt-2 font-headline">
            ResumeRight
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Get instant AI-powered feedback to land your dream job.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Analyze Your Resume</CardTitle>
              <CardDescription>
                Paste your resume and a job description to see your match score and get improvement tips.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="resume-input" className="font-medium text-foreground">Your Resume</label>
                <Textarea
                  id="resume-input"
                  placeholder="Paste your resume text here..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={15}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="jd-input" className="font-medium text-foreground">Job Description (Optional)</label>
                <Textarea
                  id="jd-input"
                  placeholder="Paste the job description here to check compatibility..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  className="mt-1"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAnalysis} disabled={isAnalyzing || !resume.trim()} size="lg" className="w-full sm:w-auto">
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </CardFooter>
          </Card>

          {(isAnalyzing || results) && (
            <ResultsDisplay results={results} isLoading={isAnalyzing} />
          )}
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground">
          <p>Powered by AI. Built with Next.js and Firebase.</p>
      </footer>
    </div>
  );
}
