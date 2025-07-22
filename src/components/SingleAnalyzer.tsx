"use client";

import { useState, useTransition, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, UploadCloud } from "lucide-react";
import { analyzeResume } from "@/ai/flows/analyze-resume";
import { matchJobDescription } from "@/ai/flows/match-job-description";
import { generateImprovementSuggestions } from "@/ai/flows/generate-improvement-suggestions";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { extractTextFromPDF } from "@/lib/pdf";
import type { AnalysisState } from "@/types";

export function SingleAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<AnalysisState | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                onClick={() => fileInputRef.current?.click()}
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
                <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" />
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
            />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleAnalysis} disabled={isAnalyzing || !resumeText.trim()} size="lg" className="w-full">
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
                {(isAnalyzing || results) && (
                    <ResultsDisplay results={results} isLoading={isAnalyzing} />
                )}
            </div>
        </div>
    </>
  );
}
