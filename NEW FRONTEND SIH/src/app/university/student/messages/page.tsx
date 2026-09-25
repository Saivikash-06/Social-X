'use client';

import * as React from 'react';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { FacultyMessagesThread } from '@/features/university/components/student/faculty-messages-thread';

export default function StudentMessagesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <MessageSquare className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
          Advisor Academic Discussion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct communication channel with your faculty advisor, Dr. Elena Rostova
        </p>
      </div>

      {/* Messages Component */}
      <FacultyMessagesThread />
    </div>
  );
}
