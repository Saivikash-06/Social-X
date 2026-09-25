"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ClipboardList,
  Building2,
  Users,
  Compass,
  ArrowRight,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/features/shared/components/ui/dialog";
import { Badge } from "@/features/shared/components/ui/badge";
import { INITIAL_CASES, INITIAL_OFFICERS, INITIAL_DEPARTMENTS } from "../../services/government-api";
import { useTranslation } from "react-i18next";

export function GovernmentSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const filteredCases = React.useMemo(() => {
    if (!query.trim()) return INITIAL_CASES.slice(0, 3);
    const q = query.toLowerCase();
    return INITIAL_CASES.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredOfficers = React.useMemo(() => {
    if (!query.trim()) return INITIAL_OFFICERS.slice(0, 2);
    const q = query.toLowerCase();
    return INITIAL_OFFICERS.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.department.toLowerCase().includes(q) ||
        o.district.toLowerCase().includes(q) ||
        o.officialPassKey.toLowerCase().includes(q)
    );
  }, [query]);

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border-border/80">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/30">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder", "Search grievance ID, citizen, officer, department, or pass key...")}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("cancel", "Clear")}
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Cases */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ClipboardList className="h-3 w-3" />
              <span>{t("recent_grievances", "Grievance Cases")}</span>
            </span>
            <div className="space-y-1">
              {filteredCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/government/assigned?search=${encodeURIComponent(c.id)}`)}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-muted/70 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        #{c.id}
                      </span>
                      <span className="text-xs font-semibold text-foreground group-hover:text-indigo-600 transition-colors truncate max-w-sm">
                        {c.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {c.location} &bull; {c.department}
                    </p>
                  </div>
                  <Badge
                    variant={c.priority === "critical" ? "destructive" : "outline"}
                    className="text-[10px]"
                  >
                    {t(c.priority, c.priority)}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Officers */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              <span>{t("government_portal", "Government Officers")}</span>
            </span>
            <div className="space-y-1">
              {filteredOfficers.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/government/officers?search=${encodeURIComponent(o.name)}`)}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-muted/70 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground group-hover:text-indigo-600 transition-colors">
                      {o.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {o.designation} &bull; {o.department}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {o.officialPassKey}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
