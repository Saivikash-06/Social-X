'use client';

import * as React from 'react';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

export default function StudentSettingsPage() {
  const [sprintReminders, setSprintReminders] = React.useState(true);
  const [advisorFeedbackAlerts, setAdvisorFeedbackAlerts] = React.useState(true);

  const handleSave = () => {
    toast.success('Student workspace notification settings saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
          Student Workspace Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage sprint deadlines, lab communication alerts, and campus login access
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          Laboratory & Sprint Alerts
        </h2>

        <div className="space-y-3 divide-y divide-border/60">
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Upcoming Task & Milestone Due Date Alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified 48 hours and 24 hours prior to sprint deliverable deadlines.
              </p>
            </div>
            <input
              type="checkbox"
              checked={sprintReminders}
              onChange={(e) => setSprintReminders(e.target.checked)}
              className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Advisor Feedback & Verification Alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Receive instant notifications when Dr. Rostova reviews and signs off on your uploads.
              </p>
            </div>
            <input
              type="checkbox"
              checked={advisorFeedbackAlerts}
              onChange={(e) => setAdvisorFeedbackAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Campus SSO */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          Student Campus SSO
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Google Institutional Student Account
            </p>
            <p className="text-xs text-muted-foreground">
              Connected via Stanford University Student Directory.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
