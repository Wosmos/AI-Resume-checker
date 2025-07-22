import { SingleAnalyzer } from '@/components/SingleAnalyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-secondary/30 dark:bg-background">
        <header className="py-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Optimize Your Resume in Seconds
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your resume and a job description to get an instant analysis of your compatibility and areas for improvement.
            </p>
        </header>
      <main className="container mx-auto px-4 pb-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <SingleAnalyzer />
        </div>
      </main>
    </div>
  );
}
