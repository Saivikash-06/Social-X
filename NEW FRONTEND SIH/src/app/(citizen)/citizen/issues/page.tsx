"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Filter, RotateCcw, FolderKanban } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { SearchInput } from "@/features/shared/components/ui/search-input";
import { Pagination } from "@/features/shared/components/ui/pagination";
import { MyIssuesTable } from "@/features/citizen/components/my-issues-table";
import { useCitizenQueries } from "@/features/citizen/hooks/use-citizen-queries";
import { Skeleton } from "@/features/shared/components/feedback/loading-skeleton";

export default function MyIssuesPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const { useIssues } = useCitizenQueries();
  const { data: issuesData, isLoading, refetch } = useIssues({
    search,
    status: statusFilter,
    priority: priorityFilter,
    page,
    limit: 10,
  });

  const issues = issuesData?.items || [];
  const totalPages = issuesData?.totalPages || 1;

  const STATUS_TABS = [
    { label: "All Grievances", value: "all" },
    { label: "In Progress", value: "in_progress" },
    { label: "AI Verified", value: "verified" },
    { label: "Resolved", value: "resolved" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              My Reported Grievances
            </h1>
            <Badge variant="secondary" className="font-mono text-xs">
              {issuesData?.total ?? issues.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track real-time investigation stages, officer dispatches, and verification milestones
          </p>
        </div>

        <Button asChild variant="gradient" className="rounded-xl gap-2 font-bold shadow-sm">
          <Link href="/citizen/report">
            <PlusCircle className="h-4 w-4" />
            <span>Report New Issue</span>
          </Link>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Priority Select */}
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search by ID, keyword, address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => setSearch("")}
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="flex h-10 rounded-xl border border-input bg-background/50 px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs shrink-0"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl shrink-0"
            title="Refresh issues"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Issues Table/Cards */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : (
        <MyIssuesTable issues={issues} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="pt-4"
      />
    </div>
  );
}
