"use client";

import * as React from "react";
import { UserCircle2, ShieldCheck, Mail, Phone, Lock, KeyRound, LogOut } from "lucide-react";
import { useAdminStore } from "@/features/admin/hooks/use-admin-store";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";

export default function AdminProfilePage() {
  const { user, logout } = useAdminStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Root Officer Credentials & Profile
        </h1>
        <p className="text-xs text-muted-foreground">
          Active administrative identity, cryptographic key clears, and authenticated sessions.
        </p>
      </div>

      <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-rose-600 to-red-800 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-rose-900/30 ring-4 ring-rose-500/20">
            {user ? user.name.split(" ").map((n) => n[0]).join("") : "SA"}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-foreground">{user?.name || "Dr. Vikramaditya Sen"}</h2>
              <Badge variant="destructive" className="text-[10px] font-mono font-bold uppercase">
                {user?.clearanceLevel || "Level 3 - Root"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{user?.roleTitle || "Principal Director & Platform Owner"}</p>
            <p className="text-[11px] font-mono text-muted-foreground">
              National Informatics Centre (NIC) &bull; New Delhi Node 01
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
              <Mail className="h-3.5 w-3.5" />
              <span>Official Email</span>
            </span>
            <p className="font-mono font-bold text-foreground">{user?.email || "owner@socialx.gov.in"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
              <Phone className="h-3.5 w-3.5" />
              <span>Secure Telephone</span>
            </span>
            <p className="font-mono font-bold text-foreground">{user?.phone || "+91 11 2309 8450"}</p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Hardware Token ID</span>
            </span>
            <p className="font-mono font-bold text-foreground">FIDO2-TOKEN-NIC-9942</p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1.5 font-semibold">
              <Lock className="h-3.5 w-3.5" />
              <span>Two-Factor Authentication</span>
            </span>
            <Badge variant="success" className="text-[10px]">
              Hardware 2FA Active
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="rounded-xl text-xs font-bold gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminate Root Session</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
