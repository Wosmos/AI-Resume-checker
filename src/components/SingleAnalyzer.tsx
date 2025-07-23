// src/components/SingleAnalyzer.tsx
"use client";

import { useState, useTransition, useRef, lazy, Suspense } from "react";
import dynamic from 'next/dynamic';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, UploadCloud, Lock } from "lucide-react";
import { analyzeResume } from "@/ai/flows/analyze-resume";
import { matchJobDescription } from "@/ai/flows/match-job-description";
import { generateImprovementSuggestions } from "@/ai/flows/generate-improvement-suggestions";
import type { AnalysisState } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

// Lazy load the ResultsDisplay component
const ResultsDisplay = dynamic(() => import('@/components/ResultsDisplay').then(mod => mod.ResultsDisplay), { 
  suspense: true,
  loading: () => <LoadingSkeleton /> 
});

// Lazy load the PDF parser
const extractTextFromPDF = async (file: File) => {
  const { extractTextFromPDF } = await import('@/lib/pdf');
  return extractTextFromPDF(file);
};


function InitialStateCard() {
    return (
        <Card className="shadow-lg flex items-center justify-center h-[500px] bg-background/50">
            <div className="text-center text-muted-foreground p-8">
                <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-medium">Your analysis will appear here.</h3>
                <p className="mt-1 text-sm">Upload your resume to get started.</p>
            </div>
        </Card>
    )
}

function AuthCTA() {
    return (
        <Card className="shadow-lg flex items-center justify-center h-[500px] bg-background/50">
            <div className="text-center text-muted-foreground p-8 max-w-sm mx-auto">
                <Lock className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-xl font-medium text-foreground">Feature Locked</h3>
                <p className="mt-2 text-sm">
                    Please log in or create an account to analyze your resume.
                </p>
                 <div className="mt-6 flex items-center justify-center gap-4">
                    <Button asChild>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
            </div>
        </Card>
    );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
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
    </div>
  );
}

export function SingleAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<AnalysisState | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useAuth();


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setResumeFileName(file.name);
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } catch (error) {
        console.error("Failed to extract text from PDF:", error);
        toast({
          title: "PDF Parsing Failed",
          description: "Could not read text from the PDF. Please try another file.",
          variant: "destructive",
        });
        setResumeFileName("");
      }
    }
  };

  const handleAnalysis = () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume is empty",
        description: "Please upload or paste your resume to get started.",
        variant: "destructive",
      });
      return;
    }

    startAnalyzing(async () => {
      try {
        setResults(null); 

        const analysisPromise = analyzeResume({ resumeText: resumeText });
        const matchPromise = jobDescription.trim()
          ? matchJobDescription({ resumeText: resumeText, jobDescription })
          : Promise.resolve(null);
        
        const [analysisResult, matchResult] = await Promise.all([analysisPromise, matchPromise]);

        const analysisResultsString = Object.values(analysisResult).join('\n\n');

        const suggestionsResult = await generateImprovementSuggestions({
          resumeText: resumeText,
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

  if (loading) {
      return (
          <>
            <Card className="shadow-lg col-span-1">
                <CardHeader>
                    <Skeleton className="h-8 w-3/5" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-12 w-full" />
                </CardFooter>
            </Card>
            <div className="col-span-1">
                <div className="sticky top-8">
                    <LoadingSkeleton />
                </div>
            </div>
          </>
      )
  }

  return (
    <>
        <Card className="shadow-lg col-span-1">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Get Started</CardTitle>
                <CardDescription>
                Upload your resume and optionally a job description to begin.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label htmlFor="resume-upload" className="font-medium text-foreground">Your Resume</label>
                    <div 
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-100/25 cursor-pointer hover:border-primary"
                    onClick={() => user && fileInputRef.current?.click()}
                    >
                    <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                        <p className="pl-1">
                        {resumeFileName ? resumeFileName : "Upload a file or paste content below"}
                        </p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PDF up to 10MB</p>
                    </div>
                    <input id="resume-upload" name="resume-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" disabled={!user} />
                    </div>
                </div>
                <div>
                <Textarea
                    id="resume-input"
                    placeholder="...or paste your resume text here."
                    value={resumeText}
                    onChange={(e) => {
                    setResumeText(e.target.value);
                    setResumeFileName("");
                    }}
                    rows={8}
                    className="mt-1"
                    disabled={!user}
                />
                </div>
                <div>
                <label htmlFor="jd-input" className="font-medium text-foreground">Job Description (Optional)</label>
                <Textarea
                    id="jd-input"
                    placeholder="Paste the job description here to check compatibility..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="mt-1"
                    disabled={!user}
                />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAnalysis} disabled={isAnalyzing || !resumeText.trim() || !user} size="lg" className="w-full">
                {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
            </CardFooter>
        </Card>
        
        <div className="col-span-1">
            <div className="sticky top-8">
              <Suspense fallback={<LoadingSkeleton />}>
                {!user ? <AuthCTA /> :
                 isAnalyzing ? <LoadingSkeleton /> :
                 !isAnalyzing && results ? <ResultsDisplay results={results} /> :
                 !isAnalyzing && !results ? <InitialStateCard /> :
                 null
                }
              </Suspense>
            </div>
        </div>
    </>
  );
}
    