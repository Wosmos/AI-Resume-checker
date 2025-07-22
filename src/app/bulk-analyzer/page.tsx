// src/app/bulk-analyzer/page.tsx
"use client";

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/lib/pdf';
import { Loader2, Sparkles, UploadCloud, FileText, CheckCircle, Award } from 'lucide-react';
import { bulkAnalyzeResumes, type BulkAnalysisResult } from '@/ai/flows/bulk-analyze-resumes';
import { Badge } from '@/components/ui/badge';

type ResumeFile = {
  file: File;
  text: string;
};

export default function BulkAnalyzerPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const [results, setResults] = useState<BulkAnalysisResult[] | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newResumeFiles: ResumeFile[] = [];
    const failedFiles: string[] = [];

    await Promise.all(
      Array.from(files).map(async file => {
        if (file.type !== 'application/pdf') {
          toast({ title: `Skipping non-PDF file: ${file.name}`, variant: 'destructive' });
          return;
        }
        try {
          const text = await extractTextFromPDF(file);
          newResumeFiles.push({ file, text });
        } catch (error) {
          console.error(`Failed to parse ${file.name}:`, error);
          failedFiles.push(file.name);
        }
      })
    );

    if (failedFiles.length > 0) {
      toast({
        title: 'Some PDFs could not be read',
        description: `Failed to parse: ${failedFiles.join(', ')}`,
        variant: 'destructive',
      });
    }
    
    setResumeFiles(prev => [...prev, ...newResumeFiles]);
  };

  const handleAnalysis = () => {
    if (!jobDescription.trim()) {
      toast({ title: 'Job description is empty', variant: 'destructive' });
      return;
    }
    if (resumeFiles.length === 0) {
      toast({ title: 'No resumes uploaded', variant: 'destructive' });
      return;
    }

    startAnalyzing(async () => {
      setResults(null);
      try {
        const resumeInputs = resumeFiles.map(rf => ({
          fileName: rf.file.name,
          resumeText: rf.text,
        }));
        
        const analysisResults = await bulkAnalyzeResumes({
          jobDescription,
          resumes: resumeInputs,
        });
        
        // Sort results from highest to lowest score
        const sortedResults = analysisResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        
        setResults(sortedResults);

      } catch (error) {
        console.error('Bulk analysis failed:', error);
        toast({
          title: 'Bulk Analysis Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const clearResumes = () => {
    setResumeFiles([]);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Bulk Resume Analyzer</CardTitle>
          <CardDescription>
            Upload multiple resumes and one job description to find the best candidates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="jd-input" className="font-medium text-foreground">
              Job Description
            </label>
            <Textarea
              id="jd-input"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={8}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="resume-upload" className="font-medium text-foreground">
              Resumes
            </label>
            <div
              className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-100/25 cursor-pointer hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <p className="pl-1">Upload one or more resume files</p>
                </div>
                <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PDFs only, up to 10MB each</p>
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                multiple
              />
            </div>
            {resumeFiles.length > 0 && (
              <div className="mt-4">
                <div className='flex justify-between items-center mb-2'>
                    <h4 className="font-semibold">Uploaded Resumes ({resumeFiles.length})</h4>
                    <Button variant="link" size="sm" onClick={clearResumes} className="text-destructive">Clear all</Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2">
                  {resumeFiles.map(({ file }, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-secondary/50 rounded">
                      <div className="flex items-center gap-2 truncate">
                         <FileText className="h-4 w-4 flex-shrink-0" />
                         <span className='truncate'>{file.name}</span>
                      </div>
                      <Badge variant="outline">{ (file.size / 1024).toFixed(2) } KB</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalysis}
            disabled={isAnalyzing || resumeFiles.length === 0 || !jobDescription.trim()}
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : `Analyze ${resumeFiles.length} Resumes`}
          </Button>
        </CardFooter>
      </Card>
      
      {(isAnalyzing || results) && (
        <Card className="max-w-4xl mx-auto shadow-lg mt-8">
            <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Resumes are ranked by compatibility score.</CardDescription>
            </CardHeader>
            <CardContent>
                {isAnalyzing ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0"></div>
                                <div className="w-full space-y-2">
                                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                                </div>
                                <div className="h-8 w-16 bg-muted rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : results && (
                    <ul className="space-y-4">
                        {results.map((result, index) => (
                            <li key={index} className="flex items-center gap-4 p-4 border rounded-lg transition-all hover:bg-secondary/50">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${index < 3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} font-bold text-lg shrink-0`}>
                                   {index < 3 ? <Award className='w-6 h-6' /> : index + 1}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold truncate">{result.fileName}</p>
                                    <p className="text-sm text-muted-foreground truncate">{result.reasoning.split('\n')[0]}</p>
                                </div>
                                <Badge className={`text-base ${result.compatibilityScore > 75 ? "bg-green-100 text-green-800" : result.compatibilityScore > 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                    {result.compatibilityScore}%
                                </Badge>
                            </li>
                        ))}
                         {results.length === 0 && <p className="text-muted-foreground text-center">No results to display.</p>}
                    </ul>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
