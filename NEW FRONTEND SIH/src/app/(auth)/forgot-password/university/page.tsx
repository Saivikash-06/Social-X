'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { School, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid university email (.edu / institutional domain)'),
  role: z.enum(['faculty', 'student']),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function UniversityForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      role: 'faculty',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    // Simulate backend verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmittedEmail(values.email);
    setIsSubmitted(true);
    toast.success('Password reset instructions sent to your institutional email.');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 ring-8 ring-primary/5">
            <School className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            University Account Recovery
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset access to your institutional faculty or student research workspace
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recovery Link Dispatched</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent secure cryptographic password reset instructions to{' '}
                <strong className="text-foreground">{submittedEmail}</strong>. If your institution uses
                LDAP/SSO, you may need to reset your password via campus IT.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground text-left">
              <strong>Check Spam or Campus Quarantine:</strong> Institutional email filters may flag automated reset links. Allow 2-3 minutes for server delivery.
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login/university">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to University Sign In
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border p-2.5 text-xs font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary">
                  <input
                    {...register('role')}
                    type="radio"
                    value="faculty"
                    className="sr-only"
                  />
                  Faculty / Advisor
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border p-2.5 text-xs font-medium has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/5 has-[:checked]:text-cyan-600">
                  <input
                    {...register('role')}
                    type="radio"
                    value="student"
                    className="sr-only"
                  />
                  Student Researcher
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Institutional Email (.edu / campus domain)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="advisor@university.edu"
                  className="pl-9"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Dispatch Reset Link
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="pt-3 text-center">
              <Link
                href="/login/university"
                className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Back to University Selection
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
