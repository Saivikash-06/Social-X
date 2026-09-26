"use client";

import * as React from "react";
import {
  Settings,
  User,
  KeyRound,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Save,
  Building2,
  Copy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Switch } from "@/features/shared/components/ui/switch";
import { useGovernmentStore } from "@/features/government/hooks/use-government-store";
import { toast } from "sonner";

export default function GovernmentSettingsPage() {
  const { officer, updateOfficerProfile } = useGovernmentStore();

  const [name, setName] = React.useState(officer?.name || "");
  const [phone, setPhone] = React.useState(officer?.phone || "");
  const [emergencySms, setEmergencySms] = React.useState(true);
  const [slaWarningEmail, setSlaWarningEmail] = React.useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOfficerProfile({ name, phone });
    toast.success("Officer settings updated successfully.");
  };

  const copyKey = () => {
    if (officer?.officialPassKey) {
      navigator.clipboard.writeText(officer.officialPassKey);
      toast.success("Pass key copied to clipboard.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Officer Settings & Security Configuration
          </h1>
          <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
            NIC Verified Profile
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure departmental notification routing, security credentials, and officer contact details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-600" />
            <span>Official Identity & Department Mandate</span>
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Officer Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Contact Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Official Email (Locked)</Label>
              <Input
                value={officer?.email || ""}
                disabled
                className="text-xs rounded-xl bg-muted font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Department (Locked)</Label>
              <Input
                value={officer?.department || ""}
                disabled
                className="text-xs rounded-xl bg-muted"
              />
            </div>
          </div>
        </Card>

        {/* Security & Pass Key Card */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            <span>State Official Pass Key & Security Token</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your unique government pass key validates your identity alongside your official email and password during portal login.
          </p>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                Active Official Pass Key
              </p>
              <p className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                {officer?.officialPassKey}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyKey}
              className="rounded-xl text-xs gap-1 border-border/80"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Key</span>
            </Button>
          </div>
        </Card>

        {/* Dispatch Alert Triggers */}
        <Card className="rounded-3xl border-border/80 p-6 space-y-4 shadow-sm bg-card">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600" />
            <span>Emergency Alert & Telemetry Notifications</span>
          </CardTitle>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/60">
              <div>
                <p className="font-bold text-foreground">Class-1 Hazard SMS Broadcast</p>
                <p className="text-[11px] text-muted-foreground">
                  Receive instant SMS dispatch when a critical infrastructure hazard is AI-verified in your ward.
                </p>
              </div>
              <Switch checked={emergencySms} onCheckedChange={setEmergencySms} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/60">
              <div>
                <p className="font-bold text-foreground">SLA Breach Warning Email</p>
                <p className="text-[11px] text-muted-foreground">
                  Receive escalation emails 2 hours prior to statutory municipal SLA expiration.
                </p>
              </div>
              <Switch checked={slaWarningEmail} onCheckedChange={setSlaWarningEmail} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 px-5 h-10 shadow-md shadow-indigo-600/20"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
