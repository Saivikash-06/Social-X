"use client";

import * as React from "react";
import {
  FolderKanban,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Building,
  GraduationCap,
  Calendar,
  IndianRupee,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useAvailableProjects, useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";
import { useNgoStore } from "@/features/ngo/hooks/use-ngo-store";
import { AvailableProject } from "@/features/ngo/types";
import { toast } from "sonner";

export default function NgoProjectsPage() {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [districtFilter, setDistrictFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"deadline" | "budget">("deadline");

  const [selectedProject, setSelectedProject] = React.useState<AvailableProject | null>(null);
  const [applyProject, setApplyProject] = React.useState<AvailableProject | null>(null);
  const [proposalText, setProposalText] = React.useState("");
  const [volunteersCount, setVolunteersCount] = React.useState(25);

  const { toggleBookmark } = useNgoStore();
  const { applyProjectMutation } = useNgoQueries();

  const { data: projects, isLoading } = useAvailableProjects({
    search: search || undefined,
    category: categoryFilter,
    district: districtFilter,
    priority: priorityFilter,
  });

  const sortedProjects = React.useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      if (sortBy === "budget") {
        return b.budget.localeCompare(a.budget);
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [projects, sortBy]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyProject) return;
    applyProjectMutation.mutate(
      {
        projectId: applyProject.id,
        proposalSummary: proposalText || "Grassroots field implementation proposal with community mobilization.",
        proposedTimelineMonths: 6,
        volunteersToDeploy: volunteersCount,
        contactPhone: "+91 98200 12345",
      },
      {
        onSuccess: () => {
          setApplyProject(null);
          setProposalText("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <FolderKanban className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Available Civic & CSR Projects</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Explore government and CSR tenders open for NGO implementation and community partnership
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SDG goal, department..."
              className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-border/80 bg-muted/30 px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Domains</option>
            <option value="water">Water & Sanitation</option>
            <option value="health">Healthcare & Nutrition</option>
            <option value="education">Education & Skilling</option>
            <option value="environment">Environment & Climate</option>
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-2xl border border-border/80 bg-muted/30 px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Districts</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Beed">Beed</option>
            <option value="Dharashiv">Dharashiv</option>
            <option value="Jalna">Jalna</option>
            <option value="Nandurbar">Nandurbar</option>
            <option value="Nashik">Nashik</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-2xl border border-border/80 bg-muted/30 px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="budget">Sort by Budget</option>
          </select>
        </div>
      </Card>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedProjects.map((proj) => (
          <Card
            key={proj.id}
            className="rounded-3xl border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header: SDG Badge, Priority, Bookmark */}
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-semibold">
                  {proj.sdgGoal}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={proj.priority === "Urgent" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {proj.priority} Priority
                  </Badge>
                  <button
                    onClick={() => {
                      toggleBookmark(proj.id);
                      toast.success(proj.isBookmarked ? "Removed from bookmarks" : "Bookmarked project");
                    }}
                    className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {proj.isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground leading-snug hover:text-emerald-600 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <Building className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{proj.governmentDepartment}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{proj.district}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <IndianRupee className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-foreground truncate">{proj.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  <span className="truncate">{proj.timeline}</span>
                </div>
              </div>

              {proj.universityPartner && (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Academic Co-sponsor: <strong>{proj.universityPartner}</strong></span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProject(proj)}
                  className="rounded-xl text-xs flex-1"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => setApplyProject(proj)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex-1 gap-1 shadow-sm"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <Badge className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              {selectedProject?.sdgGoal}
            </Badge>
            <DialogTitle className="text-xl font-bold">{selectedProject?.title}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sanctioned under {selectedProject?.governmentDepartment} • Deadline: {selectedProject?.deadline}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <p className="text-sm font-medium text-foreground">{selectedProject?.description}</p>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
              <p className="font-bold text-foreground">Eligibility & Prerequisites:</p>
              <ul className="list-disc pl-4 space-y-1">
                {selectedProject?.eligibility.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div><strong>District Target:</strong> {selectedProject?.district}</div>
              <div><strong>Grant Allocation:</strong> {selectedProject?.budget}</div>
              <div><strong>Implementation Window:</strong> {selectedProject?.timeline}</div>
              <div><strong>Application Status:</strong> {selectedProject?.status}</div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedProject(null)} className="rounded-xl">
              Close
            </Button>
            <Button
              onClick={() => {
                const target = selectedProject;
                setSelectedProject(null);
                setApplyProject(target);
              }}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Proceed to Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={!!applyProject} onOpenChange={(open) => !open && setApplyProject(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Submit Implementation Proposal</DialogTitle>
            <DialogDescription className="text-xs">
              Applying for: <strong className="text-foreground">{applyProject?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Field Proposal Summary & Methodology</label>
              <textarea
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                rows={4}
                required
                placeholder="Detail your grassroots deployment approach, village mobilization strategy, and past experience..."
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-3 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Volunteers to Deploy</label>
                <Input
                  type="number"
                  value={volunteersCount}
                  onChange={(e) => setVolunteersCount(Number(e.target.value))}
                  min={1}
                  className="rounded-xl text-xs bg-muted/30"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Proposed Duration (Months)</label>
                <Input
                  type="number"
                  defaultValue={6}
                  min={1}
                  max={36}
                  className="rounded-xl text-xs bg-muted/30"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setApplyProject(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applyProjectMutation.isPending}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
              >
                {applyProjectMutation.isPending ? "Transmitting..." : "Submit to Line Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
