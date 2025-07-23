// src/components/auth/AuthForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormProps = {
  mode: 'login' | 'signup' | 'forgot-password';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Account created successfully!', description: "You've been signed in." });
        router.push('/');
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Signed in successfully!' });
        router.push('/');
      } else if (mode === 'forgot-password') {
        await sendPasswordResetEmail(auth, values.email);
        toast({ title: 'Password reset email sent!', description: 'Please check your inbox.' });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        title: `Authentication Failed`,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'Log In',
    signup: 'Create an Account',
    'forgot-password': 'Reset Password',
  };

  const descriptions = {
    login: 'Welcome back! Sign in to your account.',
    signup: 'Enter your email and password to get started.',
    'forgot-password': 'Enter your email to receive a password reset link.',
  };
  
  const buttonTexts = {
    login: 'Log In',
    signup: 'Sign Up',
    'forgot-password': 'Send Reset Link',
  };


  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{titles[mode]}</CardTitle>
        <CardDescription>{descriptions[mode]}</CardDescription>
      </CardHeader>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                {mode !== 'forgot-password' && (
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Password</FormLabel>
                                {mode === 'login' && (
                                     <Link href="/forgot-password" passHref>
                                        <Button variant="link" size="sm" className="p-0 h-auto">Forgot password?</Button>
                                    </Link>
                                )}
                            </div>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buttonTexts[mode]}
                </Button>
                
                {mode === 'login' && (
                     <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                )}
                 {mode === 'signup' && (
                     <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                )}
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
