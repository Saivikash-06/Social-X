"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Social-X ErrorBoundary caught in ${this.props.sectionName || "Section"}]:`, error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-3xl border border-border/80 bg-card p-8 my-4 text-center space-y-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              {this.props.fallbackTitle || "This section is momentarily unavailable"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {this.props.fallbackMessage ||
                "A temporary issue occurred while loading this view. The rest of the platform remains active and operational."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={this.handleReset}
              className="rounded-xl text-xs font-semibold gap-1.5 h-8 border-border/80"
            >
              <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />
              <span>Try Again</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-8"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span>Refresh Page</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
