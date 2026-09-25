"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderKanban,
  GraduationCap,
  Cpu,
  MapPin,
  ArrowRight,
  X,
  Coins,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/features/shared/components/ui/dialog";
import { useIndustryStore } from "../../hooks/use-industry-store";
import { MOCK_PROJECTS, MOCK_UNIVERSITIES } from "../../services/industry-api";
import { Badge } from "@/features/shared/components/ui/badge";

export function IndustryGlobalSearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setSearchModalOpen } = useIndustryStore();
  const [query, setQuery] = React.useState("");

  // Keyboard shortcut ⌘K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  const q = query.trim().toLowerCase();

  const matchingProjects = React.useMemo(() => {
    if (!q) return MOCK_PROJECTS.slice(0, 3);
    return MOCK_PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.requiredTechnologies.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [q]);

  const matchingUniversities = React.useMemo(() => {
    if (!q) return MOCK_UNIVERSITIES.slice(0, 2);
    return MOCK_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.district.toLowerCase().includes(q) ||
        u.departments.some((d) => d.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [q]);

  const handleNavigate = (path: string) => {
    setSearchModalOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <Dialog open={isSearchModalOpen} onOpenChange={setSearchModalOpen}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-3xl border-border/80 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Global Industry Portal Search</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border/70 bg-muted/30">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, technologies, universities, districts..."
            className="w-full bg-transparent py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Projects Category */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-2">
              <FolderKanban className="h-3.5 w-3.5 text-amber-500" />
              <span>Projects ({matchingProjects.length})</span>
            </p>
            <div className="space-y-1">
              {matchingProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleNavigate(`/industry/projects/${p.id}`)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-amber-500/30 hover:bg-muted/50 cursor-pointer transition-all group"
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                      {p.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{p.university}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium">
                        {p.category}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {p.district}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Universities Category */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-2">
              <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
              <span>Universities & Academic Labs ({matchingUniversities.length})</span>
            </p>
            <div className="space-y-1">
              {matchingUniversities.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleNavigate("/industry/collaboration")}
                  className="flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-blue-500/30 hover:bg-muted/50 cursor-pointer transition-all group"
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {u.location} • NIRF Rank #{u.nirfRanking} • {u.activeProjectsCount} Active Projects
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Footer */}
          <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("/industry/funding")}
                className="hover:text-foreground hover:underline flex items-center gap-1"
              >
                <Coins className="h-3.5 w-3.5 text-emerald-500" />
                <span>Funding Opportunities</span>
              </button>
              <span>•</span>
              <button
                onClick={() => handleNavigate("/industry/prototypes")}
                className="hover:text-foreground hover:underline flex items-center gap-1"
              >
                <Cpu className="h-3.5 w-3.5 text-amber-500" />
                <span>Prototype Pipeline</span>
              </button>
            </div>
            <span>Press ESC to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
