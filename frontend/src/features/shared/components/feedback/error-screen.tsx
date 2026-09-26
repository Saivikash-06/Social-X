import * as React from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  error?: Error;
  reset?: () => void;
}

export function ErrorScreen({
  title = "Something went wrong",
  message = "An error occurred while loading this page. Please try again or return to the dashboard.",
  reset,
}: ErrorScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">{t(title, title)}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        {t(message, message)}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {reset && (
          <Button onClick={reset} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t("common.buttons.retry", "Try Again")}
          </Button>
        )}
        <Button asChild variant="outline" className="gap-2">
          <Link href="/citizen">
            <Home className="h-4 w-4" />
            {t("common.labels.dashboard", "Go to Dashboard")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
