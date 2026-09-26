"use client";

import * as React from "react";
import { RefreshCw, RotateCcw, ShieldCheck } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.warn("[Social-X GlobalError Caught]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-5 shadow-xl">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Application Recovery Ready
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Social-X is operating in resilient mode. Click below to refresh your session state safely.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 h-9 px-4 shadow-sm transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Resume Session</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold gap-1.5 h-9 px-4 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload App</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
