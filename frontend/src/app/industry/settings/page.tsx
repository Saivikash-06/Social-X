"use client";

import * as React from "react";
import {
  Settings,
  ShieldCheck,
  Bell,
  Coins,
  KeyRound,
  Save,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Badge } from "@/features/shared/components/ui/badge";
import { ThemeToggle } from "@/features/shared/components/ui/theme-toggle";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { toast } from "sonner";

export default function IndustrySettingsPage() {
  const { user, organization } = useIndustryStore();

  const [budgetThreshold, setBudgetThreshold] = React.useState("5000000");
  const [enableEmailAlerts, setEnableEmailAlerts] = React.useState(true);
  const [enableMilestoneAlerts, setEnableMilestoneAlerts] = React.useState(true);
  const [enableEscrowAlerts, setEnableEscrowAlerts] = React.useState(true);
  const [apiKey, setApiKey] = React.useState("sk_live_csr_sec135_893240219801");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Industry account configurations successfully saved.");
  };

  const handleRotateKey = () => {
    const newKey = `sk_live_csr_sec135_${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setApiKey(newKey);
    toast.success("CSR Integration Webhook API Key rotated.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Portal Settings & Security</h1>
          <p className="text-sm text-muted-foreground">
            Manage CSR budget warning thresholds, webhook tokens, notification relays, and signatory permissions.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Enterprise Security Level 3</span>
        </Badge>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* CSR Budget Threshold Warnings */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>CSR Grant Discretionary Thresholds</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Automated multi-signatory requirement when single tranche releases exceed threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Dual-Signatory Trigger Limit (INR)</Label>
              <Input
                type="number"
                value={budgetThreshold}
                onChange={(e) => setBudgetThreshold(e.target.value)}
                className="rounded-2xl max-w-md"
              />
              <p className="text-[11px] text-muted-foreground">
                Releases above ₹{Number(budgetThreshold).toLocaleString()} will prompt board trustee second authorization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-500" />
              <span>Automated Telemetry & Audit Relays</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 cursor-pointer">
              <div>
                <p className="font-bold text-foreground">Escrow Tranche Settlement Alerts</p>
                <p className="text-muted-foreground text-[11px]">Instant email dispatch upon bank RTGS settlement</p>
              </div>
              <input
                type="checkbox"
                checked={enableEscrowAlerts}
                onChange={(e) => setEnableEscrowAlerts(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 cursor-pointer">
              <div>
                <p className="font-bold text-foreground">University Milestone Submission Alerts</p>
                <p className="text-muted-foreground text-[11px]">Notify when research scholar submits deliverable file</p>
              </div>
              <input
                type="checkbox"
                checked={enableMilestoneAlerts}
                onChange={(e) => setEnableMilestoneAlerts(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60 cursor-pointer">
              <div>
                <p className="font-bold text-foreground">Weekly Digest & ESG Executive Summary</p>
                <p className="text-muted-foreground text-[11px]">Consolidated PDF dispatch every Monday morning</p>
              </div>
              <input
                type="checkbox"
                checked={enableEmailAlerts}
                onChange={(e) => setEnableEmailAlerts(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
            </label>
          </CardContent>
        </Card>

        {/* API & Webhook Credentials */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-500" />
              <span>Corporate ERP & SAP Webhook Integration</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Direct telemetry sync into corporate financial accounting software
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Active Production API Key</Label>
              <div className="flex gap-2">
                <Input
                  value={apiKey}
                  readOnly
                  className="rounded-2xl font-mono text-xs bg-muted/40"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRotateKey}
                  className="rounded-2xl shrink-0 text-xs font-semibold"
                >
                  Rotate Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Display Mode */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Theme & Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-foreground">Toggle Light / Dark Mode</p>
              <p className="text-muted-foreground">Synchronize with system OS or select explicit palette</p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="gradient" className="rounded-2xl font-bold px-8 shadow">
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
