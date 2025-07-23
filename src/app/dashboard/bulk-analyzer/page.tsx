// src/app/dashboard/bulk-analyzer/page.tsx
'use client';
import { BulkAnalyzer } from '@/components/BulkAnalyzer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BulkAnalyzerPage() {
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
            <Skeleton className="h-[600px] w-full max-w-4xl mx-auto" />
        </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <BulkAnalyzer />
    </div>
  );
}
