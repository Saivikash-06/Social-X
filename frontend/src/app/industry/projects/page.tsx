"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  Filter,
  Bookmark,
  BookmarkCheck,
  Coins,
  GraduationCap,
  MapPin,
  Clock,
  Users,
  Building,
  Sparkles,
  Search,
  RotateCcw,
  CheckCircle2,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Progress } from "@/features/shared/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { Label } from "@/features/shared/components/ui/label";
import { useIndustryProjects, useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { IndustryProject } from "@/features/industry/types";

export default function IndustryAvailableProjectsPage() {
  const { toggleBookmark } = useIndustryStore();
  const { sponsorProjectMutation } = useIndustryQueries();

  // Filters State
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedDistrict, setSelectedDistrict] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [onlyBookmarked, setOnlyBookmarked] = React.useState(false);

  // Sponsor Dialog State
  const [sponsoringProject, setSponsoringProject] = React.useState<IndustryProject | null>(null);
  const [pledgeAmount, setPledgeAmount] = React.useState<number>(500000);
  const [csrGrantCategory, setCsrGrantCategory] = React.useState("Schedule VII - Clean Water & Sanitation");
  const [paymentTerms, setPaymentTerms] = React.useState<"milestone_escrow" | "direct_tranche" | "upfront_lump_sum">("milestone_escrow");

  const { data: projects, isLoading } = useIndustryProjects({
    category: selectedCategory,
    district: selectedDistrict,
    status: selectedStatus,
    search: searchTerm,
  });

  const filteredProjects = React.useMemo(() => {
    let list = projects || [];
    if (onlyBookmarked) {
      list = list.filter((p) => p.isBookmarked);
    }
    return list;
  }, [projects, onlyBookmarked]);

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsoringProject) return;
    sponsorProjectMutation.mutate(
      {
        projectId: sponsoringProject.id,
        amount: pledgeAmount,
        csrGrantCategory,
        paymentTerms,
      },
      {
        onSuccess: () => setSponsoringProject(null),
      }
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDistrict("all");
    setSelectedStatus("all");
    setOnlyBookmarked(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Available Projects</h1>
          <p className="text-sm text-muted-foreground">
            Explore and sponsor high-impact academic R&D initiatives across Karnataka districts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-bold text-xs">
            {filteredProjects.length} Projects Listed
          </Badge>
          <Button
            variant={onlyBookmarked ? "gradient" : "outline"}
            size="sm"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className="rounded-xl text-xs gap-1.5"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarked Only</span>
          </Button>
        </div>
      </div>

      {/* Multi-Criteria Filter Bar */}
      <Card className="border-border/80 bg-card rounded-3xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, tech, university..."
              className="pl-9 rounded-2xl bg-muted/30 border-border/80 text-xs"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Water Management & Sanitation">Water Management & Sanitation</option>
            <option value="Clean Energy & EV Microgrids">Clean Energy & EV Microgrids</option>
            <option value="Air Quality & Waste Governance">Air Quality & Waste Governance</option>
            <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-2xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Districts</option>
            <option value="Bengaluru Urban">Bengaluru Urban</option>
            <option value="Dharwad">Dharwad</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Tumakuru">Tumakuru</option>
          </select>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 rounded-2xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open_for_sponsorship">Open for Sponsorship</option>
              <option value="in_progress">In Progress</option>
              <option value="prototype_ready">Prototype Ready</option>
              <option value="pilot_testing">Pilot Testing</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="rounded-xl h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border/80 space-y-3">
          <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto stroke-1" />
          <h3 className="text-base font-bold text-foreground">No matching projects found</h3>
          <p className="text-xs text-muted-foreground">Adjust your filter keywords or reset the search query.</p>
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="rounded-xl">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const fundedPercent = Math.min(
              100,
              Math.round((project.fundedAmount / project.expectedBudget) * 100)
            );
            const remainingBudget = Math.max(0, project.expectedBudget - project.fundedAmount);

            return (
              <Card
                key={project.id}
                className="border-border/80 bg-card rounded-3xl shadow-sm hover:border-amber-500/50 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="warning" className="text-[10px] py-0.5 px-2 font-semibold">
                          {project.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0.5 px-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {project.district}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground leading-snug pt-1">
                        {project.title}
                      </CardTitle>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{project.university}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleBookmark(project.id)}
                      className="p-2 rounded-xl border border-border/70 hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors shrink-0"
                      title={project.isBookmarked ? "Remove Bookmark" : "Bookmark Project"}
                    >
                      {project.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {project.problemDescription}
                  </p>

                  {/* Required Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.requiredTechnologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/90 border border-border/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Funding Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Funded: ₹{project.fundedAmount.toLocaleString()}</span>
                      <span className="font-bold text-foreground">
                        Target: ₹{project.expectedBudget.toLocaleString()} ({fundedPercent}%)
                      </span>
                    </div>
                    <Progress value={fundedPercent} className="h-2 rounded-full" />
                    {remainingBudget > 0 && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-right">
                        Remaining CSR Grant Gap: ₹{remainingBudget.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block">Timeline:</span>
                      <span className="font-bold text-foreground">{project.timelineMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Faculty Lead:</span>
                      <span className="font-bold text-foreground truncate block">{project.facultyLead.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Team Size:</span>
                      <span className="font-bold text-foreground">{project.studentTeamSize} Scholars</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Govt Dept:</span>
                      <span className="font-bold text-foreground truncate block">{project.governmentDepartment.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
                    <Button asChild variant="default" size="sm" className="rounded-xl text-xs flex-1">
                      <Link href={`/industry/projects/${project.id}`}>
                        <span>View Details</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => setSponsoringProject(project)}
                      className="rounded-xl text-xs gap-1"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      <span>Sponsor</span>
                    </Button>

                    <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
                      <Link href="/industry/mentorship">Mentor</Link>
                    </Button>

                    <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs">
                      <Link href="/industry/collaboration">Collaborate</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sponsor Project Modal */}
      <Dialog open={!!sponsoringProject} onOpenChange={(open) => !open && setSponsoringProject(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Pledge CSR Sponsorship Grant</DialogTitle>
            <DialogDescription className="text-xs">
              Direct CSR funds toward milestone deliverables under Section 135.
            </DialogDescription>
          </DialogHeader>

          {sponsoringProject && (
            <form onSubmit={handleSponsorSubmit} className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-muted/50 border border-border/70 space-y-1">
                <p className="font-bold text-foreground text-sm">{sponsoringProject.title}</p>
                <p className="text-muted-foreground">{sponsoringProject.university}</p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">
                  Required Budget: ₹{sponsoringProject.expectedBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Pledge Grant Amount (INR)</Label>
                <Input
                  type="number"
                  min={10000}
                  step={10000}
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(Number(e.target.value))}
                  className="rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Statutory CSR Classification</Label>
                <select
                  value={csrGrantCategory}
                  onChange={(e) => setCsrGrantCategory(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-muted/40 p-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Schedule VII - Clean Water & Sanitation">Schedule VII - Clean Water & Sanitation</option>
                  <option value="Schedule VII - Environmental Sustainability">Schedule VII - Environmental Sustainability</option>
                  <option value="Schedule VII - Technology Incubator & R&D">Schedule VII - Technology Incubator & R&D</option>
                  <option value="Schedule VII - Skill Development">Schedule VII - Skill Development</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Disbursement Structure</Label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as any)}
                  className="w-full rounded-xl border border-border/80 bg-muted/40 p-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="milestone_escrow">Milestone Escrow (Tranches released upon milestone audit)</option>
                  <option value="direct_tranche">Direct 50-50 Split Tranches</option>
                  <option value="upfront_lump_sum">Full Upfront Endowment</option>
                </select>
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" onClick={() => setSponsoringProject(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={sponsorProjectMutation.isPending}
                  className="rounded-xl"
                >
                  {sponsorProjectMutation.isPending ? "Executing Pledge..." : "Confirm CSR Sponsorship"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
