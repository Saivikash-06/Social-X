"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, FolderKanban, Lightbulb, BookOpen, Database, Building, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/features/shared/components/ui/dialog";
import { useResearchStore } from "../../hooks/use-research-store";

const SEARCH_SHORTCUTS = [
  { label: "Research Projects", href: "/research/projects", icon: FolderKanban, category: "R&D Labs" },
  { label: "Innovation Lab (TRL 1-9)", href: "/research/innovation", icon: Lightbulb, category: "Prototypes" },
  { label: "Publications & Patents", href: "/research/publications", icon: BookOpen, category: "IP Repository" },
  { label: "Dataset Library", href: "/research/datasets", icon: Database, category: "Data Streams" },
  { label: "Government Technical RFPs", href: "/research/government-requests", icon: Building, category: "Grants" },
  { label: "Academic Partnerships", href: "/research/partnerships", icon: BookOpen, category: "Consortia" },
  { label: "Grant Reports & Utilization", href: "/research/reports", icon: FolderKanban, category: "Governance" },
];

export function ResearchGlobalSearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setSearchModalOpen, searchQuery, setSearchQuery } = useResearchStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchModalOpen]);

  const filtered = searchQuery.trim()
    ? SEARCH_SHORTCUTS.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SHORTCUTS;

  const handleSelect = (href: string) => {
    setSearchModalOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <Dialog open={isSearchModalOpen} onOpenChange={setSearchModalOpen}>
      <DialogContent className="max-w-xl p-0 gap-0 rounded-3xl overflow-hidden border-border/80 shadow-2xl">
        <div className="flex items-center px-4 py-3.5 border-b border-border/80 bg-card">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search publications, patents, datasets, TRL innovations..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-3 space-y-1 bg-card/60">
          <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Research Modules
          </p>
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-muted text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </button>
            );
          })}
        </div>

        <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Navigate with ↵ or click</span>
          <span>ESC to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
