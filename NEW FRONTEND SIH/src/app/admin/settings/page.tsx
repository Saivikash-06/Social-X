"use client";

import * as React from "react";
import { Sliders, Shield, Save, RefreshCw } from "lucide-react";
import { useSystemSettings, useAdminMutations } from "@/features/admin/hooks/use-admin-queries";
import { useAdminStore } from "@/features/admin/hooks/use-admin-store";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Switch } from "@/features/shared/components/ui/switch";
import { Label } from "@/features/shared/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: settings } = useSystemSettings();
  const { maintenanceMode, setMaintenanceMode } = useAdminStore();

  const handleSave = () => {
    toast.success("Platform settings updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Platform Configuration & System Switches
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure global security parameters, maintenance toggles, and notification gateways.
        </p>
      </div>

      <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-500" />
            <span>Operational & Maintenance Controls</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground">
                Restrict public ingress and redirect users to the scheduled maintenance status page.
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={(checked) => {
                setMaintenanceMode(checked);
                toast.info(`Maintenance mode ${checked ? "activated" : "deactivated"}.`);
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Enforce Hardware FIDO2 2FA for Administrators</Label>
              <p className="text-xs text-muted-foreground">
                Require physical security key or TOTP token for all Level 2 and Root clearance sessions.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Automated AI Triage & Routing</Label>
              <p className="text-xs text-muted-foreground">
                Automatically dispatch civic complaints with &gt;85% AI confidence directly to nodal departments.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Configuration</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
