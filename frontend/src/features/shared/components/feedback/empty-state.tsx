import * as React from "react";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-8 text-center bg-card/40",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        {icon || <FolderSearch className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground">{t(title, title)}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {t(description, description)}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5 rounded-xl">
          {t(actionLabel, actionLabel)}
        </Button>
      )}
    </div>
  );
}
