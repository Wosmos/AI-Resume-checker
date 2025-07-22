import { SingleAnalyzer } from '@/components/SingleAnalyzer';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-secondary/30 dark:bg-background">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <SingleAnalyzer />
          <div className="col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg flex items-center justify-center h-[500px] bg-background/50">
                <div className="text-center text-muted-foreground p-8">
                  <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
                  <h3 className="mt-4 text-lg font-medium">Your analysis will appear here.</h3>
                  <p className="mt-1 text-sm">Upload your resume to get started.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
