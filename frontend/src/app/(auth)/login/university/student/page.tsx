'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  studentLoginSchema,
  StudentLoginValues,
} from '@/features/university/validation/university-schemas';
import { useUniversityLogin } from '@/features/university/hooks/use-university-queries';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

export default function StudentLoginPage() {
  const router = useRouter();
  const loginMutation = useUniversityLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentLoginValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      email: 'alex.rivera@stanford.edu',
      rollNumber: 'CS-2024-8902',
      password: 'password123',
    },
  });

  const onSubmit = (values: StudentLoginValues) => {
    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
        role: 'student',
      },
      {
        onSuccess: (data) => {
          toast.success(`Welcome back, ${data.user.name}!`);
          router.push('/university/student');
        },
        onError: (error) => {
          toast.error(error.message || 'Authentication failed. Please verify your student credentials.');
        },
      }
    );
  };

  const handleGoogleLogin = () => {
    toast.info('Connecting to Google Campus Single Sign-On...');
    setTimeout(() => {
      loginMutation.mutate(
        {
          email: 'alex.rivera@stanford.edu',
          password: 'google-oauth-token',
          role: 'student',
        },
        {
          onSuccess: (data) => {
            toast.success(`Google SSO Verified: Welcome, ${data.user.name}!`);
            router.push('/university/student');
          },
        }
      );
    }, 800);
  };

  const fillDemo = () => {
    setValue('email', 'alex.rivera@stanford.edu');
    setValue('rollNumber', 'CS-2024-8902');
    setValue('password', 'password123');
    toast.info('Student credentials loaded.');
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-3 ring-8 ring-cyan-500/5">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
            Student Academic Access
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Student Research Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your university student email or institutional credentials
          </p>
        </div>

        {/* Demo Pill */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-200">
            <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>Demo: alex.rivera@stanford.edu</span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="font-semibold text-cyan-700 underline underline-offset-2 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-100"
          >
            Auto-fill
          </button>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loginMutation.isPending}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-2 text-muted-foreground uppercase tracking-wider">
            or student credentials
          </span>
        </div>

        {/* Student Credential Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Student Email (.edu / institutional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('email')}
                type="email"
                placeholder="name@university.edu"
                className="pl-9"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Roll / Student Registration No.
            </label>
            <Input
              {...register('rollNumber')}
              placeholder="e.g. CS-2024-8902"
              className="uppercase tracking-wider"
            />
            {errors.rollNumber && (
              <p className="mt-1 text-xs text-destructive">{errors.rollNumber.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Link
                href="/forgot-password/university"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
            isLoading={loginMutation.isPending}
          >
            Access Student Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>
            Are you a Faculty Advisor or Department Head?{' '}
            <Link
              href="/login/university/faculty"
              className="font-medium text-primary hover:underline"
            >
              Faculty Login
            </Link>
          </p>
          <p>
            Need help? Contact your university IT desk or{' '}
            <Link href="/contact" className="hover:underline">
              Social-X Campus Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
