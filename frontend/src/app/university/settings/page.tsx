'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Moon,
  Sun,
  Laptop,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft,
  School,
  Save,
  Check,
  Building,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';

export default function UniversitySettingsPage() {
  const { role, user, setAuth } = useUniversityStore();
  const { theme, setTheme } = useTheme();

  // Profile Form state
  const [name, setName] = React.useState(user?.name || (role === 'faculty' ? 'Dr. Aris Thorne' : 'Alex Johnson'));
  const [email, setEmail] = React.useState(user?.email || (role === 'faculty' ? 'aris.thorne@univ.edu.in' : 'alex.johnson@student.univ.edu'));
  const [department, setDepartment] = React.useState(user?.department || 'Department of Computer Science');
  const [institution, setInstitution] = React.useState(user?.institution || 'Indian Institute of Technology (IIT)');
  const [phone, setPhone] = React.useState(user?.phone || '+91 98765 43210');

  // Access Key & Security state
  const [accessKey, setAccessKey] = React.useState(
    role === 'faculty' ? 'ACAD-FACULTY-2026-9901' : 'ACAD-STUDENT-2026-4412'
  );
  const [isKeyVisible, setIsKeyVisible] = React.useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(true);
  const [campusSsoActive, setCampusSsoActive] = React.useState(true);

  // All 7 required notification preference toggles
  const [notifPrefs, setNotifPrefs] = React.useState({
    government_assignment: true,
    faculty_approval: true,
    project_accepted: true,
    deadline_reminder: true,
    research_review: true,
    certificate_issued: true,
    credit_updated: true,
  });

  const toggleNotification = (key: keyof typeof notifPrefs) => {
    setNotifPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Notification preference updated.');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(accessKey);
    toast.success('University Access Key copied to clipboard!');
  };

  const handleRegenerateKey = () => {
    const prefix = role === 'faculty' ? 'ACAD-FACULTY-2026' : 'ACAD-STUDENT-2026';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newKey = `${prefix}-${rand}`;
    setAccessKey(newKey);
    toast.success(`New University Access Key generated: ${newKey}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setAuth({
        ...user,
        name,
        email,
        department,
        institution,
        phone,
      });
    }
    toast.success('Institutional profile settings updated successfully.');
  };

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-primary" />
            University Portal Preferences & Security
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure institutional verification, notification dispatches, campus
            SSO, and theme appearance.
          </p>
        </div>
      </div>

      {/* Institutional Verification Status Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Institutional Verification Status
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                  Active & Verified
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Affiliated with Ministry of Housing & Urban Affairs (MoHUA) Academic Sandbox
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="text-muted-foreground block">Campus Trust Score</span>
            <span className="font-bold text-base text-primary">99.8 / 100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-muted/40 p-3 rounded-xl">
            <span className="text-muted-foreground block text-[10px]">
              Institutional Role
            </span>
            <span className="font-semibold text-foreground capitalize">
              {role} Member
            </span>
          </div>
          <div className="bg-muted/40 p-3 rounded-xl">
            <span className="text-muted-foreground block text-[10px]">
              NIRF Ranking Tier
            </span>
            <span className="font-semibold text-foreground">
              Tier-1 Technical Institute
            </span>
          </div>
          <div className="bg-muted/40 p-3 rounded-xl">
            <span className="text-muted-foreground block text-[10px]">
              Civic Sandbox Access
            </span>
            <span className="font-semibold text-emerald-500">
              Full Level-3 Clearance
            </span>
          </div>
        </div>
      </div>

      {/* Appearance / Dark Mode Toggle */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            Interface Theme & Appearance
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Select your preferred display theme for the University & Academia Portal.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-semibold gap-2 ${
              theme === 'light'
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border bg-background hover:bg-muted text-muted-foreground'
            }`}
          >
            <Sun className="h-5 w-5" />
            Light
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-semibold gap-2 ${
              theme === 'dark'
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border bg-background hover:bg-muted text-muted-foreground'
            }`}
          >
            <Moon className="h-5 w-5" />
            Dark
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-semibold gap-2 ${
              theme === 'system'
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border bg-background hover:bg-muted text-muted-foreground'
            }`}
          >
            <Laptop className="h-5 w-5" />
            System
          </button>
        </div>
      </div>

      {/* University Access Key & Security */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            University Access Key & Credentials
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Used to securely link your research lab devices, sensors, and CLI
            telemetry clients.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Current Institutional Access Key
          </label>
          <div className="flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Input
                type={isKeyVisible ? 'text' : 'password'}
                value={accessKey}
                readOnly
                className="font-mono text-sm tracking-wider pr-10"
              />
              <button
                type="button"
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {isKeyVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyKey}
              className="gap-1.5"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerateKey}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              title="Regenerate Key"
            >
              <RefreshCw className="h-4 w-4" />
              Cycle Key
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Google Campus Workspace SSO
              </p>
              <p className="text-xs text-muted-foreground">
                Authenticated via verified university email domain (@univ.edu.in)
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
              SSO Enforced
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Hardware & Biometric Two-Factor Authentication
              </p>
              <p className="text-xs text-muted-foreground">
                Mandatory for municipal grant disbursements and project approvals
              </p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => {
                setTwoFactorAuth(e.target.checked);
                toast.success('Two-factor authentication preference saved.');
              }}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Realtime Notification Toggles (All 7 Required Types) */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Subscriptions & Realtime Dispatches
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose which government events and academic milestones trigger instant
            browser notifications and email briefings.
          </p>
        </div>

        <div className="divide-y divide-border space-y-1">
          {/* 1. Government Assignment */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Government Project Assignments
              </p>
              <p className="text-xs text-muted-foreground">
                Alerts when municipal bodies assign civic issues to your department.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.government_assignment}
              onChange={() => toggleNotification('government_assignment')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 2. Faculty Approval */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Faculty Project Approvals & Verifications
              </p>
              <p className="text-xs text-muted-foreground">
                Notifications when student milestone submissions are pending or signed off.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.faculty_approval}
              onChange={() => toggleNotification('faculty_approval')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 3. Project Accepted */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Project Accepted by Municipal Department
              </p>
              <p className="text-xs text-muted-foreground">
                Instant confirmation when an agency approves an interdisciplinary pilot.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.project_accepted}
              onChange={() => toggleNotification('project_accepted')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 4. Deadline Reminder */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Milestone & Field Auditing Deadlines
              </p>
              <p className="text-xs text-muted-foreground">
                Automated 48h and 24h reminders before critical pilot deliverable dates.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.deadline_reminder}
              onChange={() => toggleNotification('deadline_reminder')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 5. Research Review */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Peer Review & Pre-print Status
              </p>
              <p className="text-xs text-muted-foreground">
                Updates regarding peer review annotations and journal pre-print indexing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.research_review}
              onChange={() => toggleNotification('research_review')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 6. Certificate Issued */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                GovTech Certificate Issuance
              </p>
              <p className="text-xs text-muted-foreground">
                Immediate notification when a government-verified certificate is minted.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.certificate_issued}
              onChange={() => toggleNotification('certificate_issued')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>

          {/* 7. Credit Score Updated */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Academic Credit Score & Tier Updates
              </p>
              <p className="text-xs text-muted-foreground">
                Real-time alerts when new academic credits or badges are credited to your transcript.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.credit_updated}
              onChange={() => toggleNotification('credit_updated')}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Institutional Contact & Profile Settings Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Institutional Profile Information
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Synchronized with your university registrar and academic identity directory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Institutional Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Department
            </label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              University / Institution
            </label>
            <Input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-foreground block mb-1">
              Emergency & SMS Alert Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-sm max-w-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Update Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
