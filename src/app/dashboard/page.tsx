// src/app/dashboard/page.tsx
'use client';
import { SingleAnalyzer } from '@/components/SingleAnalyzer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <Skeleton className="h-[600px] w-full" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        </div>
    );
  }

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
