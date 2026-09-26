"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, Check } from "lucide-react";
import { useAdminRoles } from "@/features/admin/hooks/use-admin-queries";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminRolesPage() {
  const { data: roles, isLoading } = useAdminRoles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Role & Access Control Matrix
        </h1>
        <p className="text-xs text-muted-foreground">
          RBAC configuration, privilege tiers, and security scopes across all national platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(roles || []).map((r) => (
          <Card key={r.role} className="rounded-3xl border-border/80 p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={r.badgeVariant || "default"} className="font-mono text-[10px] uppercase font-bold">
                  {r.role}
                </Badge>
                <h3 className="font-bold text-base text-foreground mt-1.5">{r.title}</h3>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {r.userCount} Users
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>

            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Granted Privileges
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {r.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-1 text-[10px] font-medium text-foreground border border-border/60"
                  >
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{p}</span>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
