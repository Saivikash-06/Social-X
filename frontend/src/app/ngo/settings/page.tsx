"use client";

import * as React from "react";
import {
  Settings,
  Sun,
  Moon,
  Shield,
  Bell,
  Lock,
  Globe,
  Eye,
  KeyRound,
  CheckCircle2,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Switch } from "@/features/shared/components/ui/switch";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function NgoSettingsPage() {
  const { theme, setTheme } = useTheme();

  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(true);
  const [highContrast, setHighContrast] = React.useState(false);
  const [language, setLanguage] = React.useState("en");

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security credentials and API secret rotated successfully.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>Platform Settings & Security Center</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage system theme, operational dispatch notifications, password, 2FA, and accessibility preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Theme & Visual Accessibility</span>
              </h2>
              <p className="text-xs text-muted-foreground">Switch between Mild White and Charcoal Black modes</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="rounded-xl text-xs"
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="rounded-xl text-xs"
              >
                Dark
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">High Contrast Mode</p>
              <p className="text-[11px] text-muted-foreground">Enhance border definition for field devices in bright sunlight</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </Card>

        {/* Notifications & Dispatch Preferences */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            <span>Operational Dispatch Notifications</span>
          </h2>
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Email Notifications</p>
                <p className="text-[11px] text-muted-foreground">Daily digest of field telemetry approvals and grant sanctions</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <p className="text-xs font-bold text-foreground">SMS Telemetry Broadcasts</p>
                <p className="text-[11px] text-muted-foreground">Urgent flood, weather, or disaster relief emergency dispatches</p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
          </div>
        </Card>

        {/* Language & Regionalization */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span>Language & Localization</span>
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">System Interface Language</p>
              <p className="text-[11px] text-muted-foreground">Select preferred dialect for volunteer checklists and certificates</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="en">English (Official)</option>
              <option value="mr">Marathi (मराठी)</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
          </div>
        </Card>

        {/* Password & Two-Factor Authentication */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-600" />
            <span>Password & Security Safeguards</span>
          </h2>

          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-muted-foreground">Require OTP verification on new device logins</p>
            </div>
            <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Current Security Password</Label>
                <Input type="password" placeholder="••••••••" className="rounded-xl text-xs bg-muted/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">New Security Password</Label>
                <Input type="password" placeholder="••••••••" className="rounded-xl text-xs bg-muted/30" />
              </div>
            </div>
            <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
