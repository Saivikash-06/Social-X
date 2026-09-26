import * as React from "react";
import { LandingNavbar } from "@/features/shared/components/layout/landing-navbar";
import { LandingFooter } from "@/features/shared/components/layout/footer";
import { GlobalErrorBoundary } from "@/features/shared/components/error/global-error-boundary";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingNavbar />
      <main className="flex-1">
        <GlobalErrorBoundary sectionName="Landing Page">
          {children}
        </GlobalErrorBoundary>
      </main>
      <LandingFooter />
    </div>
  );
}
