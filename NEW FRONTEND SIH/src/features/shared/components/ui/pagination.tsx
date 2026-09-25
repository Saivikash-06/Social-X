import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="gap-1 rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{t("common.buttons.previous", "Previous")}</span>
      </Button>

      {visiblePages.map((page, index) => {
        const prev = visiblePages[index - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <React.Fragment key={page}>
            {showEllipsis && (
              <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="h-9 w-9 rounded-xl p-0"
            >
              {page}
            </Button>
          </React.Fragment>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="gap-1 rounded-xl"
      >
        <span className="hidden sm:inline">{t("common.buttons.next", "Next")}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
