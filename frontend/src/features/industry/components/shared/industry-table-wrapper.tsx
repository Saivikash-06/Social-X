"use client";

import * as React from "react";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, Filter } from "lucide-react";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";
import { Pagination } from "@/features/shared/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shared/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface IndustryTableWrapperProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T | ((row: T) => string);
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  filterComponent?: React.ReactNode;
  className?: string;
}

export function IndustryTableWrapper<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  pageSize = 10,
  emptyMessage = "No matching records found.",
  filterComponent,
  className,
}: IndustryTableWrapperProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Search filtering
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((row) => {
      let val = "";
      if (typeof searchKey === "function") {
        val = searchKey(row);
      } else {
        val = String(row[searchKey] ?? "");
      }
      return val.toLowerCase().includes(lower);
    });
  }, [data, searchTerm, searchKey]);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {searchKey && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-10 rounded-2xl bg-card border-border/80"
            />
          </div>
        )}
        {filterComponent && <div className="flex items-center gap-2">{filterComponent}</div>}
      </div>

      {/* Table Container with Sticky Header */}
      <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 border-b border-border/70">
              <TableRow className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap py-3.5",
                      col.sortable && "cursor-pointer select-none hover:text-foreground",
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="shrink-0">
                          {sortKey === col.key ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5 text-amber-500" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-amber-500" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <TableRow
                    key={row.id || idx}
                    className="hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0"
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={cn("py-3.5 text-sm", col.className)}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} records
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
