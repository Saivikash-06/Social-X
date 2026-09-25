'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { GlobalErrorBoundary } from '@/features/shared/components/error/global-error-boundary';

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role, isAuthenticated } = useUniversityStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/university-login');
    } else if (role !== 'faculty') {
      router.replace('/university/student');
    }

  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'faculty') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <GlobalErrorBoundary sectionName="Faculty Portal">
      {children}
    </GlobalErrorBoundary>
  );
}
