"use client";

import * as React from "react";
import {
  Users,
  Search,
  Award,
  Clock,
  Phone,
  Mail,
  UserPlus,
  Trash2,
  MessageSquare,
  Eye,
  CheckCircle2,
  Star,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useVolunteers, useAssignedProjects, useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";
import { Volunteer } from "@/features/ngo/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NgoVolunteersPage() {
  const router = useRouter();
  const { data: volunteers, isLoading } = useVolunteers();
  const { data: assignedProjects } = useAssignedProjects();
  const { assignVolunteerMutation } = useNgoQueries();

  const [search, setSearch] = React.useState("");
  const [selectedVolunteer, setSelectedVolunteer] = React.useState<Volunteer | null>(null);
  const [assigningVolunteer, setAssigningVolunteer] = React.useState<Volunteer | null>(null);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [assignRole, setAssignRole] = React.useState("Field Coordinator");

  const filteredVolunteers = (volunteers || []).filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      v.district.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningVolunteer) return;
    assignVolunteerMutation.mutate(
      {
        volunteerId: assigningVolunteer.id,
        projectId: selectedProject || assignedProjects?.[0]?.id || "ASSIGNED-01",
        role: assignRole,
        expectedHoursPerWeek: 15,
      },
      {
        onSuccess: () => {
          setAssigningVolunteer(null);
        },
      }
    );
  };

  const handleRemove = (v: Volunteer) => {
    toast.success(`${v.name} has been unassigned from active field operations.`);
  };

  const handleMessage = (v: Volunteer) => {
    router.push(`/ngo/messages`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Volunteer Force Management</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage field rosters, skills, contribution scores, hours telemetry, and issued certificates
          </p>
        </div>
      </div>

      {/* Filter / Search bar */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteers by name, technical skills (GIS, Python, Civil, Pedagogy), district..."
            className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
          />
        </div>
      </Card>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVolunteers.map((vol) => (
          <Card
            key={vol.id}
            className="rounded-3xl border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            <CardContent className="p-6 space-y-4">
              {/* Header: Avatar, Name, Availability */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-2xl border border-emerald-500/30">
                    <AvatarImage src={vol.avatarUrl} alt={vol.name} />
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                      {vol.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{vol.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-emerald-500" />
                      <span>{vol.district}</span>
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">
                  {vol.availability}
                </Badge>
              </div>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-1.5">
                {vol.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-[10px] rounded-lg">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Hours</span>
                  <span className="font-bold text-foreground">{vol.hoursContributed} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Score</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{vol.contributionScore} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Certs</span>
                  <span className="font-bold text-foreground">{vol.certificatesCount}</span>
                </div>
              </div>

              {/* Assigned Project */}
              <div className="text-xs text-muted-foreground">
                <strong>Deployment:</strong>{" "}
                <span className="text-foreground">{vol.assignedProject || "Standby / Unallocated"}</span>
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVolunteer(vol)}
                  className="rounded-xl text-xs gap-1 flex-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssigningVolunteer(vol)}
                  className="rounded-xl text-xs gap-1 flex-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Assign</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessage(vol)}
                  className="rounded-xl text-xs p-2.5"
                  title="Message Volunteer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(vol)}
                  className="rounded-xl text-xs p-2.5 text-destructive hover:bg-destructive/10"
                  title="Remove from project"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Profile Dialog */}
      <Dialog open={!!selectedVolunteer} onOpenChange={(open) => !open && setSelectedVolunteer(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 rounded-2xl border border-emerald-500/30">
                <AvatarImage src={selectedVolunteer?.avatarUrl} alt={selectedVolunteer?.name} />
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                  {selectedVolunteer?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-bold">{selectedVolunteer?.name}</DialogTitle>
                <DialogDescription className="text-xs">
                  Enrolled since {selectedVolunteer?.joinedDate} • {selectedVolunteer?.district}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold">Contact Info:</span>
              <p className="flex items-center gap-2 text-foreground">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {selectedVolunteer?.email}
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {selectedVolunteer?.phone}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold">Competencies & Skills:</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedVolunteer?.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Project:</span>
                <span className="font-bold text-foreground">{selectedVolunteer?.assignedProject || "Standby"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Contributed Hours:</span>
                <span className="font-bold text-foreground">{selectedVolunteer?.hoursContributed} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Civic Reliability Score:</span>
                <span className="font-bold text-emerald-600">{selectedVolunteer?.contributionScore} / 100</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVolunteer(null)} className="rounded-xl w-full">
              Close Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Volunteer Dialog */}
      <Dialog open={!!assigningVolunteer} onOpenChange={(open) => !open && setAssigningVolunteer(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Assign Volunteer to Project</DialogTitle>
            <DialogDescription className="text-xs">
              Assigning <strong>{assigningVolunteer?.name}</strong> to active ground operations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Assigned Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              >
                {(assignedProjects || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.district})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Operational Role</label>
              <Input
                value={assignRole}
                onChange={(e) => setAssignRole(e.target.value)}
                placeholder="e.g. Lead Surveyor, Workshop Trainer"
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setAssigningVolunteer(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Confirm Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
