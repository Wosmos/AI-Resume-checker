import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AppHeader } from '@/components/AppHeader';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ResumeRight - AI Resume Analyzer',
  description: 'Get instant feedback on your resume. Optimize your resume for ATS, match it against job descriptions, and get actionable suggestions to land your dream job.',
  keywords: ['resume analyzer', 'ATS checker', 'resume optimization', 'job description matching', 'career tools', 'AI resume'],
  themeColor: '#2962FF',
  openGraph: {
    title: 'ResumeRight - AI Resume Analyzer',
    description: 'Instantly analyze and optimize your resume with AI.',
    url: 'https://resumeright.app',
    siteName: 'ResumeRight',
    images: [
      {
        url: 'https://resumeright.app/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: 'ResumeRight - AI Resume Analyzer',
    description: 'Instantly analyze and optimize your resume with AI.',
    images: ['https://resumeright.app/og-image.png'], // Replace with your actual OG image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased h-full flex flex-col">
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AppHeader />
                <main className="flex-grow">
                    {children}
                </main>
                <Toaster />
                <footer className="text-center p-6 text-sm text-muted-foreground bg-secondary/10">
                    <p>Powered by AI. Built with Next.js and Firebase.</p>
                </footer>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
