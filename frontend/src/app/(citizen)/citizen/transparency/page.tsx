"use client";

import * as React from "react";
import {
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Skeleton } from "@/features/shared/components/feedback/loading-skeleton";
import { citizenApi } from "@/features/citizen/services/citizen-api";
import {
  TransparencyMetrics,
  TransparencyProblemSummary,
  PublicAccountabilityDossier,
} from "@/features/citizen/types";
import { TransparencyMetricsDashboard } from "@/features/citizen/components/transparency/transparency-metrics-dashboard";
import { TransparencyFiltersBar } from "@/features/citizen/components/transparency/transparency-filters-bar";
import { TransparencyProblemCard } from "@/features/citizen/components/transparency/transparency-problem-card";
import { PublicAccountabilityDossierModal } from "@/features/citizen/components/transparency/public-accountability-dossier-modal";
import { toast } from "sonner";

export default function CitizenTransparencyPage() {
  const [metrics, setMetrics] = React.useState<TransparencyMetrics | null>(null);
  const [problems, setProblems] = React.useState<TransparencyProblemSummary[]>([]);
  const [loadingMetrics, setLoadingMetrics] = React.useState(true);
  const [loadingProblems, setLoadingProblems] = React.useState(true);
  const [totalProblems, setTotalProblems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);

  // Filters state
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [location, setLocation] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [stakeholder, setStakeholder] = React.useState("all");
  const [datePreset, setDatePreset] = React.useState("all");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Modal inspection state
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null);
  const [dossierData, setDossierData] = React.useState<PublicAccountabilityDossier | null>(null);
  const [loadingDossier, setLoadingDossier] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Load metrics
  const loadMetrics = React.useCallback(async () => {
    try {
      setLoadingMetrics(true);
      const data = await citizenApi.getTransparencyMetrics();
      setMetrics(data);
    } catch (err) {
      console.warn("Could not load transparency metrics", err);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  // Load problems
  const loadProblems = React.useCallback(async () => {
    try {
      setLoadingProblems(true);
      const res = await citizenApi.getTransparencyProblems({
        search,
        category,
        location,
        status,
        stakeholder,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: 9,
      });
      setProblems(res.items);
      setTotalProblems(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.warn("Could not load transparency problems", err);
    } finally {
      setLoadingProblems(false);
    }
  }, [search, category, location, status, stakeholder, startDate, endDate, page]);

  React.useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  React.useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  // Open full dossier
  const handleOpenDossier = async (issueId: string) => {
    setSelectedIssueId(issueId);
    setIsModalOpen(true);
    setLoadingDossier(true);
    try {
      const dossier = await citizenApi.getPublicAccountabilityDossier(issueId);
      setDossierData(dossier);
    } catch (err: any) {
      toast.error("Failed to load public transparency dossier", {
        description: err.message || "Please try again later.",
      });
      setIsModalOpen(false);
    } finally {
      setLoadingDossier(false);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setStatus("all");
    setStakeholder("all");
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Citizen Transparency & Public Accountability Portal
                </h1>
                <Badge className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20 font-mono text-[10px]">
                  LIVE LEDGER
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Complete public visibility into civic grievance journeys, stakeholder handoffs, verified domain experts, government monitoring visits, and public fund expenditures.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadMetrics();
              loadProblems();
              toast.success("Transparency data refreshed from central ledger.");
            }}
            className="rounded-xl text-xs gap-1.5 h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Section 1: Dashboard Metrics */}
      <section aria-label="Transparency Metrics Summary">
        {loadingMetrics && !metrics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : (
          <TransparencyMetricsDashboard
            metrics={
              metrics || {
                totalProblems: 0,
                statusBreakdown: {},
                awaitingAcceptance: 0,
                inResolution: 0,
                completedAndVerified: 0,
                totalBudgetAllocated: 0,
                totalExpenditure: 0,
                remainingBalance: 0,
                totalMonitoringVisits: 0,
                latestMonitoringTimestamp: "Not yet monitored",
                activeCorrectiveActions: 0,
                lastSystemUpdateTime: new Date().toISOString(),
              }
            }
          />
        )}
      </section>

      {/* Section 2: Search & Filter Toolbar */}
      <section aria-label="Search and Filter Public Problems">
        <TransparencyFiltersBar
          searchQuery={search}
          onSearchChange={(v: string) => {
            setSearch(v);
            setPage(1);
          }}
          selectedCategory={category}
          onCategoryChange={(v: string) => {
            setCategory(v);
            setPage(1);
          }}
          selectedLocation={location}
          onLocationChange={(v: string) => {
            setLocation(v);
            setPage(1);
          }}
          selectedStatus={status}
          onStatusChange={(v: string) => {
            setStatus(v);
            setPage(1);
          }}
          selectedStakeholder={stakeholder}
          onStakeholderChange={(v: string) => {
            setStakeholder(v);
            setPage(1);
          }}
          selectedDatePreset={datePreset}
          onDatePresetChange={(v: string) => {
            setDatePreset(v);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />
      </section>

      {/* Section 3: Problem Cards Grid */}
      <section aria-label="Public Accountability Problem Ledger" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">
              Civic Problem Records
            </h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {totalProblems} Found
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Showing Page {page} of {Math.max(1, totalPages)}
          </span>
        </div>

        {loadingProblems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/50 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Grievances Found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No civic issues match your current filter criteria. Try adjusting the category, location, or stakeholder filters above.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-xl text-xs font-semibold mt-2"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <TransparencyProblemCard
                key={problem.id}
                problem={problem}
                onOpenReport={handleOpenDossier}
              />
            ))}
          </div>
        )}

        {/* Pagination controls if multiple pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loadingProblems}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl text-xs"
            >
              Previous
            </Button>
            <span className="text-xs font-mono text-muted-foreground px-3">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loadingProblems}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl text-xs"
            >
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Section 4: Public Accountability Dossier Modal */}
      <PublicAccountabilityDossierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIssueId(null);
          setDossierData(null);
        }}
        dossier={dossierData}
        isLoading={loadingDossier}
      />
    </div>
  );
}
