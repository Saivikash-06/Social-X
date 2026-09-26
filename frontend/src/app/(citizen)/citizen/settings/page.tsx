"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Globe2,
  Bell,
  ShieldCheck,
  CheckCircle2,
  EyeOff,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CitizenSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { updateSettingsMutation } = useCitizenQueries();

  const [language, setLanguage] = React.useState<"en" | "hi" | "kn" | "mr" | "ta">("en");
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [anonymousMode, setAnonymousMode] = React.useState(false);

  const handleSavePreferences = () => {
    updateSettingsMutation.mutate({
      theme: (theme as "light" | "dark" | "system") || "system",
      language,
      emailAlerts,
      smsAlerts,
      pushNotifications,
      anonymousGrievanceMode: anonymousMode,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Citizen Preferences & Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Customize visual theme, language locale, notification channels, and privacy
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={handleSavePreferences}
          isLoading={updateSettingsMutation.isPending}
          className="rounded-xl gap-1.5 font-bold shadow-xs text-xs"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Save Preferences</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-primary">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Appearance Theme</h2>
              <p className="text-xs text-muted-foreground">
                Select your preferred interface display mode
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                theme === "light"
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                  : "border-border/80 bg-background/50 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-foreground">Light Mode</p>
                  <p className="text-[11px] text-muted-foreground">Clean enterprise white</p>
                </div>
              </div>
              {theme === "light" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                theme === "dark"
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                  : "border-border/80 bg-background/50 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-foreground">Dark Mode</p>
                  <p className="text-[11px] text-muted-foreground">Sleek charcoal dark</p>
                </div>
              </div>
              {theme === "dark" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                theme === "system"
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                  : "border-border/80 bg-background/50 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold text-foreground">System Default</p>
                  <p className="text-[11px] text-muted-foreground">Sync with OS theme</p>
                </div>
              </div>
              {theme === "system" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </button>
          </div>
        </Card>

        {/* Language Locale Settings */}
        <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Language & Localization</h2>
              <p className="text-xs text-muted-foreground">
                Social-X supports regional Indian languages for speech and text
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {[
              { code: "en", label: "English" },
              { code: "hi", label: "हिंदी (Hindi)" },
              { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
              { code: "mr", label: "मराठी (Marathi)" },
              { code: "ta", label: "தமிழ் (Tamil)" },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code as typeof language)}
                className={cn(
                  "p-3 rounded-2xl border text-center transition-all",
                  language === lang.code
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border-border/80 bg-background/50 text-muted-foreground hover:bg-muted font-medium"
                )}
              >
                <span className="text-xs">{lang.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Notification Channels</h2>
              <p className="text-xs text-muted-foreground">
                Manage how you receive milestone updates and emergency alerts
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-background/50 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  SMS Notifications
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Receive SMS alerts when field team arrives on-site
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-background/50 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Email Milestone Digest
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Receive detailed photographic proof upon grievance resolution
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border/60 bg-background/50 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Browser Real-Time Push Alerts
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Instant popups when municipal officer comments on your case
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
              />
            </label>
          </div>
        </Card>

        {/* Privacy & Anonymity */}
        <Card className="border-border/80 bg-card rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Grievance Privacy Mode</h2>
              <p className="text-xs text-muted-foreground">
                Control identity visibility on public departmental trackers
              </p>
            </div>
          </div>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-background/50 cursor-pointer">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Mask Name from Field Contractors
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When enabled, your name and phone number will only be visible to executive
                nodal officers, while public field contractors will see an anonymized citizen token.
              </p>
            </div>
            <input
              type="checkbox"
              checked={anonymousMode}
              onChange={(e) => setAnonymousMode(e.target.checked)}
              className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary"
            />
          </label>
        </Card>
      </div>
    </div>
  );
}
