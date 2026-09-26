'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { GlobalErrorBoundary } from '@/features/shared/components/error/global-error-boundary';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role, isAuthenticated } = useUniversityStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/university-login');
    } else if (role !== 'student') {
      router.replace('/university/faculty');
    }

  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'student') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <GlobalErrorBoundary sectionName="Student Portal">
      {children}
    </GlobalErrorBoundary>
  );
}
