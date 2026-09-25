"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  FlaskConical,
  FolderGit2,
  FileCheck2,
  Cpu,
  GitFork,
  BarChart3,
  Bell,
  ScrollText,
  Sliders,
  Activity,
  Database,
  UserCircle2,
} from "lucide-react";
import { useAdminStore } from "../../hooks/use-admin-store";
import { cn } from "@/lib/utils";

const SEARCH_ITEMS = [
  { title: "Dashboard & Key Metrics", href: "/admin/dashboard", icon: LayoutDashboard, category: "Overview" },
  { title: "Platform Analytics & Recharts", href: "/admin/analytics", icon: BarChart3, category: "Overview" },
  { title: "User Management & Directory", href: "/admin/users", icon: Users, category: "Access & Identity" },
  { title: "Role & Permission Matrix", href: "/admin/roles", icon: ShieldCheck, category: "Access & Identity" },
  { title: "Government & Municipalities", href: "/admin/government", icon: Building2, category: "Stakeholders" },
  { title: "University Labs & Academia", href: "/admin/universities", icon: GraduationCap, category: "Stakeholders" },
  { title: "Industry & Corporate CSR", href: "/admin/industry", icon: Briefcase, category: "Stakeholders" },
  { title: "NGOs & Civil Society Squads", href: "/admin/ngos", icon: HeartHandshake, category: "Stakeholders" },
  { title: "Research Organizations & Patents", href: "/admin/research", icon: FlaskConical, category: "Stakeholders" },
  { title: "Line Departments & Districts", href: "/admin/departments", icon: FolderGit2, category: "Stakeholders" },
  { title: "Issue Management & Triage", href: "/admin/issues", icon: FileCheck2, category: "Operations" },
  { title: "AI Pipeline & OCR/Speech Telemetry", href: "/admin/ai-monitoring", icon: Cpu, category: "Operations" },
  { title: "Workflow SLA & Routing Logs", href: "/admin/workflow-monitoring", icon: GitFork, category: "Operations" },
  { title: "API Status & Latency Gauges", href: "/admin/api-monitoring", icon: Activity, category: "Observability" },
  { title: "Database Pools & Cache Hit Ratio", href: "/admin/database-status", icon: Database, category: "Observability" },
  { title: "Audit Trail & Immutable Security Logs", href: "/admin/audit-logs", icon: ScrollText, category: "Observability" },
  { title: "Real-time Notification Center", href: "/admin/notifications", icon: Bell, category: "Observability" },
  { title: "Platform System Settings & SMTP", href: "/admin/settings", icon: Sliders, category: "Configuration" },
  { title: "Root Officer Profile & 2FA Keys", href: "/admin/profile", icon: UserCircle2, category: "Configuration" },
];

export function AdminSearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setSearchModalOpen } = useAdminStore();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === "Escape" && isSearchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filtered = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setSearchModalOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar */}
        <div className="p-4 border-b border-border/80 flex items-center gap-3 bg-muted/20">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Jump to section, tool, or telemetry log (e.g. AI, Users, Database)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No administrative sections matched &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted/80 text-muted-foreground group-hover:text-rose-500 group-hover:bg-rose-500/10 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/80 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground px-4">
          <span>Navigate with ⌘K</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
