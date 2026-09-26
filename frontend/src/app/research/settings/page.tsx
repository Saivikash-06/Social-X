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
  Share2,
  KeyRound,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Switch } from "@/features/shared/components/ui/switch";
import { Badge } from "@/features/shared/components/ui/badge";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function ResearchSettingsPage() {
  const { theme, setTheme } = useTheme();

  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [grantAlerts, setGrantAlerts] = React.useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(true);
  const [orcidSync, setOrcidSync] = React.useState(true);
  const [highContrast, setHighContrast] = React.useState(false);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security credentials updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Research Platform Settings & Academic Sync</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure visual appearance, ORCID synchronization, grant alert notifications, and security protocols
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
              <p className="text-xs font-bold text-foreground">High Contrast Diagrams</p>
              <p className="text-[11px] text-muted-foreground">Enhance charts and sensor time-series waveforms for presentation</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </Card>

        {/* Connected Academic Accounts (ORCID / ResearchGate) */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Share2 className="h-4 w-4 text-emerald-600" />
            <span>Connected Academic Profiles</span>
          </h2>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">ORCID Academic ID</span>
                  <Badge variant="success" className="text-[9px]">Connected</Badge>
                </div>
                <p className="font-mono text-xs text-emerald-600">0000-0002-1825-0097</p>
              </div>
              <Switch checked={orcidSync} onCheckedChange={setOrcidSync} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">Google Scholar Citations</span>
                <p className="text-[11px] text-muted-foreground">Automated bi-weekly citation count refresh</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Sync Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600" />
            <span>Grant & Peer Review Notifications</span>
          </h2>
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Municipal RFP Alerts</p>
                <p className="text-[11px] text-muted-foreground">Instant notifications when government tenders matching focus areas open</p>
              </div>
              <Switch checked={grantAlerts} onCheckedChange={setGrantAlerts} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <p className="text-xs font-bold text-foreground">Citation & Patent Activity</p>
                <p className="text-[11px] text-muted-foreground">Digest of newly discovered citations and patent office journal notices</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </div>
        </Card>

        {/* Password & Security */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-600" />
            <span>Security & Institutional Credentials</span>
          </h2>

          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <p className="text-xs font-bold text-foreground">Multi-Factor Authentication (MFA)</p>
              <p className="text-[11px] text-muted-foreground">Require time-based one-time password (TOTP) for grant submissions</p>
            </div>
            <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Current Password</Label>
                <Input type="password" placeholder="••••••••" className="rounded-xl text-xs bg-muted/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">New Institutional Password</Label>
                <Input type="password" placeholder="••••••••" className="rounded-xl text-xs bg-muted/30" />
              </div>
            </div>
            <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
