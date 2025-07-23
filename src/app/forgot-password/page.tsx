// src/app/forgot-password/page.tsx
'use client';

import { AuthForm } from '@/components/auth/AuthForm';

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] items-center justify-center px-4 py-12">
      <AuthForm mode="forgot-password" />
    </div>
  );
}
