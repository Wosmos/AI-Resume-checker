import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'ResumeRight',
  description: 'AI-powered resume checker to optimize your job applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full flex flex-col">
        <AppHeader />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
         <footer className="text-center p-6 text-sm text-muted-foreground bg-background">
            <p>Powered by AI. Built with Next.js and Firebase.</p>
        </footer>
      </body>
    </html>
  );
}
