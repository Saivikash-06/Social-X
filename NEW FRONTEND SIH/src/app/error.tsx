"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home, RefreshCw, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log technical trace for developer observability without showing to user
    console.warn("[Social-X RootError Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-border/80 bg-card p-8 text-center space-y-5 shadow-lg">
        <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Platform Ready to Recover
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The platform encountered a momentary display update issue. Your data and session are intact.
            Click below to resume your activity seamlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 h-9 px-4 shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Resume Activity</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold gap-1.5 h-9 border-border/80"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reload Page</span>
          </Button>
        </div>

        <div className="pt-2 border-t border-border/60">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Social-X Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
