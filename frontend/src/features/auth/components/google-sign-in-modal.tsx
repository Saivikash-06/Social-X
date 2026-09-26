"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Badge } from "@/features/shared/components/ui/badge";
import { AlertCircle, ArrowRight, CheckCircle2, User, UserPlus } from "lucide-react";
import Link from "next/link";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleEmail: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const REGISTERED_GOOGLE_PRESETS = [
  {
    name: "Vikash",
    email: "citizen.vikash@example.com",
    role: "Citizen",
    badgeVariant: "success" as const,
  },
  {
    name: "Thiru S. Sivakumar, IAS",
    email: "collector@tn.gov.in",
    role: "Government",
    badgeVariant: "info" as const,
  },
  {
    name: "Dr. R. Kumar",
    email: "faculty.kumar@annauniv.edu",
    role: "Faculty",
    badgeVariant: "secondary" as const,
  },
  {
    name: "Aarav Sharma",
    email: "student.aarav@annauniv.edu",
    role: "Student",
    badgeVariant: "secondary" as const,
  },
  {
    name: "Dr. Vikramaditya Sen",
    email: "owner@socialx.gov.in",
    role: "Admin",
    badgeVariant: "warning" as const,
  },
];

export function GoogleSignInModal({
  isOpen,
  onClose,
  onSelectGoogleEmail,
  isLoading,
  errorMessage,
}: GoogleSignInModalProps) {
  const [customEmail, setCustomEmail] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.trim()) return;
    onSelectGoogleEmail(customEmail.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-border bg-card shadow-2xl">
        {/* Top Google Header */}
        <div className="bg-background border-b border-border p-6 pb-5 text-center space-y-2">
          <div className="flex justify-center mb-1">
            <svg className="h-9 w-9" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Sign in with Google
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose an account to continue to <span className="font-semibold text-foreground">Social-X</span>
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4">
          {/* Error Banner when Google Account is Not Registered */}
          {errorMessage && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 space-y-2 text-destructive">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold leading-snug">Access Blocked</p>
                  <p className="text-xs leading-relaxed font-medium">{errorMessage}</p>
                </div>
              </div>
              <div className="pt-1 flex justify-end">
                <Button asChild size="sm" variant="destructive" className="h-7 text-xs rounded-xl gap-1.5">
                  <Link href="/register" onClick={onClose}>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Create Account First</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Account Selector List */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Select existing Google Account:
            </p>
            <div className="divide-y rounded-2xl border border-border/60 overflow-hidden bg-muted/20">
              {REGISTERED_GOOGLE_PRESETS.map((preset) => (
                <button
                  key={preset.email}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSelectGoogleEmail(preset.email)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/60 transition-colors focus:outline-hidden disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {preset.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{preset.name}</p>
                      <p className="text-[11px] text-muted-foreground">{preset.email}</p>
                    </div>
                  </div>
                  <Badge variant={preset.badgeVariant} className="text-[10px] px-2 py-0.5">
                    {preset.role}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Test Custom / Unregistered Email Option */}
          <div className="pt-2">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full py-2.5 px-3 text-xs font-semibold text-primary hover:text-primary/80 border border-dashed border-primary/40 rounded-xl hover:bg-primary/5 transition-all text-center"
              >
                + Test with another Google Account (Unregistered Email)
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 p-3 rounded-2xl bg-muted/30 border border-border">
                <Label htmlFor="google-email" className="text-xs font-semibold">
                  Google Account Email:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="google-email"
                    type="email"
                    placeholder="example.user@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !customEmail.trim()}
                    className="rounded-xl text-xs gap-1.5 shrink-0"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Rule Check: If this email is not in Social-X database, login will be strictly blocked.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground px-6">
          <span>Social-X OAuth Security</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 text-xs rounded-lg">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
