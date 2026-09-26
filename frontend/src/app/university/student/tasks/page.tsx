'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { StudentTaskChecklist } from '@/features/university/components/student/student-task-checklist';

export default function StudentTasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CheckSquare className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
            Assigned Lab Tasks & Sprints
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your daily research tasks, calibrate equipment, and update milestone deliverables
          </p>
        </div>

        <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
          <Link href="/university/student/uploads">
            <UploadCloud className="h-4 w-4" />
            Submit Task Deliverable
          </Link>
        </Button>
      </div>

      {/* Task Checklist Component */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <StudentTaskChecklist showFilters={true} />
      </div>
    </div>
  );
}
