'use client';

import * as React from 'react';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Eye,
  Key,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

export default function FacultySettingsPage() {
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [grantNotifications, setGrantNotifications] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);

  const handleSavePreferences = () => {
    toast.success('Advisor security and notification preferences updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-primary" />
          Faculty Portal Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage academic notification dispatches, campus SSO security, and lab access policies
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Grant & Milestone Alert Dispatch
        </h2>

        <div className="space-y-3 divide-y divide-border/60">
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Immediate Milestone Verification Alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Receive notifications when student fellows submit lab deliverables for verification.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Municipal Grant & Council Briefings
              </p>
              <p className="text-xs text-muted-foreground">
                Receive alerts when city departments release new civic research grants.
              </p>
            </div>
            <input
              type="checkbox"
              checked={grantNotifications}
              onChange={(e) => setGrantNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Security & SSO */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Institutional SSO & Two-Factor Authentication
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Google Campus Workspace Single Sign-On
            </p>
            <p className="text-xs text-muted-foreground">
              Linked to institutional Google Workspace directory.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Connected
          </span>
        </div>

        <div className="pt-2">
          <Button onClick={handleSavePreferences} className="bg-primary hover:bg-primary/90">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
