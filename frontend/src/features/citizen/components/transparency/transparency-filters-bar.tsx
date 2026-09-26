"use client";

import * as React from "react";
import {
  Search,
  Filter,
  X,
  MapPin,
  Tag,
  Building,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { Input } from "@/features/shared/components/ui/input";
import { Button } from "@/features/shared/components/ui/button";

interface TransparencyFiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedStakeholder: string;
  onStakeholderChange: (value: string) => void;
  selectedDatePreset: string;
  onDatePresetChange: (value: string) => void;
  onReset: () => void;
}

export const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "WATER_AND_SANITATION", label: "Water & Sanitation" },
  { value: "ROADS_AND_TRANSPORT", label: "Roads & Transportation" },
  { value: "ELECTRICITY_AND_LIGHTING", label: "Electricity & Streetlights" },
  { value: "SOLID_WASTE_MANAGEMENT", label: "Solid Waste & Sanitation" },
  { value: "DRAINAGE_AND_FLOOD", label: "Drainage & Flood Management" },
  { value: "PUBLIC_HEALTH_AND_SAFETY", label: "Public Health & Safety" },
];

export const LOCATIONS = [
  { value: "all", label: "All Locations" },
  { value: "Bengaluru", label: "Bengaluru" },
  { value: "Chennai", label: "Chennai" },
  { value: "Indiranagar", label: "Indiranagar (Bengaluru)" },
  { value: "Koramangala", label: "Koramangala (Bengaluru)" },
  { value: "Anna Salai", label: "Anna Salai (Chennai)" },
  { value: "Madurai", label: "Madurai" },
];

export const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "VERIFIED", label: "Verified" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export const STAKEHOLDERS = [
  { value: "all", label: "All Stakeholders" },
  { value: "GOVERNMENT", label: "Government Departments" },
  { value: "UNIVERSITY", label: "Universities / Student Teams" },
  { value: "INDUSTRY", label: "Industry Partners / Contractors" },
  { value: "NGO", label: "Civic NGOs" },
];

export const DATE_PRESETS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Last 24 Hours" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

export function TransparencyFiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedStatus,
  onStatusChange,
  selectedStakeholder,
  onStakeholderChange,
  selectedDatePreset,
  onDatePresetChange,
  onReset,
}: TransparencyFiltersBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    selectedStatus !== "all" ||
    selectedStakeholder !== "all" ||
    selectedDatePreset !== "all";

  return (
    <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
      {/* Top row: Search and Reset */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems by title, description, ID (e.g. SOC-2026-008821), or street..."
            className="pl-10 h-10 rounded-xl bg-background border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="rounded-xl h-10 px-3 text-xs gap-1.5 shrink-0 text-muted-foreground hover:text-foreground border-dashed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-9 rounded-xl bg-background border border-border/80 px-2.5 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full h-9 rounded-xl bg-background border border-border/80 px-2.5 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-9 rounded-xl bg-background border border-border/80 px-2.5 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stakeholder */}
        <div className="relative">
          <select
            value={selectedStakeholder}
            onChange={(e) => onStakeholderChange(e.target.value)}
            className="w-full h-9 rounded-xl bg-background border border-border/80 px-2.5 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {STAKEHOLDERS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Preset */}
        <div className="relative col-span-2 sm:col-span-1">
          <select
            value={selectedDatePreset}
            onChange={(e) => onDatePresetChange(e.target.value)}
            className="w-full h-9 rounded-xl bg-background border border-border/80 px-2.5 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {DATE_PRESETS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
