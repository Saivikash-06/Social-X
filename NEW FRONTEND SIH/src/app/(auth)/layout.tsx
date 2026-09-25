import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/features/shared/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/features/shared/components/ui/language-switcher";
import { Button } from "@/features/shared/components/ui/button";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Top Bar */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border/40 backdrop-blur-xs">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="rounded-xl gap-1.5 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </Button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight">
              SOCIAL<span className="text-primary">-X</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <GlobalErrorBoundary sectionName="Authentication">
          {children}
        </GlobalErrorBoundary>
      </main>

      {/* Bottom Legal Notice */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} Social-X Platform. Open Governance & Societal Innovation.
      </footer>
    </div>
  );
}
