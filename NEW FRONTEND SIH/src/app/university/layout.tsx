'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FacultySidebar } from '@/features/university/components/faculty/faculty-sidebar';
import { FacultyNavbar } from '@/features/university/components/faculty/faculty-navbar';
import { StudentSidebar } from '@/features/university/components/student/student-sidebar';
import { StudentNavbar } from '@/features/university/components/student/student-navbar';
import { UniversityNotificationPanel } from '@/features/university/components/shared/university-notification-panel';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { cn } from '@/lib/utils';
import { GlobalErrorBoundary } from '@/features/shared/components/error/global-error-boundary';

export function UniversityDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarCollapsed, role, isAuthenticated } = useUniversityStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/university-login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isFaculty = role === 'faculty';

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col antialiased">
      {/* Role-Adaptive Sidebar */}
      {isFaculty ? <FacultySidebar /> : <StudentSidebar />}

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        )}
      >
        {/* Role-Adaptive Top Navbar */}
        {isFaculty ? <FacultyNavbar /> : <StudentNavbar />}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <GlobalErrorBoundary sectionName="University Portal">
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>

      {/* Global Realtime Notification Panel */}
      <UniversityNotificationPanel />
    </div>
  );
}

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UniversityDashboardLayout>
      {children}
    </UniversityDashboardLayout>
  );
}

