'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';

export default function UniversityPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUniversityStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/university-login');
      return;
    }

    if (role === 'student') {
      router.replace('/university/student');
    } else {
      router.replace('/university/faculty');
    }
  }, [isAuthenticated, role, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
