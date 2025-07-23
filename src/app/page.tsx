// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Briefcase, FileText, Bot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';

const features = [
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Get instant, detailed feedback on your resume\'s content, grammar, and formatting.',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: 'Job Description Matching',
    description: 'See how well your resume aligns with a specific job description and get a compatibility score.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'Bulk Resume Screening',
    description: 'Analyze multiple resumes against one job description to find the top candidates quickly.',
  },
   {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: 'Actionable Suggestions',
    description: 'Receive concrete tips to improve your resume and increase your chances of getting an interview.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-secondary/30 dark:bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Land Your Dream Job with an AI-Perfected Resume
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              ResumeRight analyzes your resume against job descriptions, providing instant feedback and actionable insights to beat the applicant tracking systems.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">Why Choose ResumeRight?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform is designed to give you a competitive edge in your job search.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="mb-4 inline-block bg-primary/10 p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-20 bg-secondary/30 dark:bg-background">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2 className="text-3xl sm:text-4xl font-bold">Simple Steps to a Better Resume</h2>
                    <p>Our intuitive platform makes it easy to optimize your application materials. Follow these simple steps to get started.</p>
                    <ul className="mt-6 space-y-4">
                        <li className='flex items-start gap-3'><CheckCircle className='w-6 h-6 text-primary mt-1 flex-shrink-0' /><span><span className='font-semibold'>Create an Account:</span> Sign up for free to access all our analysis tools.</span></li>
                        <li className='flex items-start gap-3'><CheckCircle className='w-6 h-6 text-primary mt-1 flex-shrink-0' /><span><span className='font-semibold'>Upload Your Resume:</span> Add your resume by uploading a PDF or pasting the text.</span></li>
                        <li className='flex items-start gap-3'><CheckCircle className='w-6 h-6 text-primary mt-1 flex-shrink-0' /><span><span className='font-semibold'>Add Job Description:</span> Paste the job description you're targeting for a detailed comparison.</span></li>
                        <li className='flex items-start gap-3'><CheckCircle className='w-6 h-6 text-primary mt-1 flex-shrink-0' /><span><span className='font-semibold'>Get Instant Insights:</span> Receive your compatibility score, keyword analysis, and actionable feedback.</span></li>
                    </ul>
                     <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/signup">Analyze My Resume Now</Link>
                        </Button>
                    </div>
                </div>
                <div>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Resume analysis dashboard preview"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl"
                        data-ai-hint="resume analysis dashboard"
                    />
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
