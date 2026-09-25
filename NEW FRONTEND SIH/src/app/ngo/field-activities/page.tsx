"use client";

import * as React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Camera,
  Upload,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Navigation,
  Sparkles,
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
import { useFieldActivities, useAssignedProjects, useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoFieldActivitiesPage() {
  const { data: activities, isLoading } = useFieldActivities();
  const { data: assignedProjects } = useAssignedProjects();
  const { createActivityMutation } = useNgoQueries();

  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState("");
  const [locationName, setLocationName] = React.useState("Khadki Village, Ashti Taluka");
  const [latitude, setLatitude] = React.useState(18.8052);
  const [longitude, setLongitude] = React.useState(75.1843);
  const [volunteerCount, setVolunteerCount] = React.useState(28);
  const [description, setDescription] = React.useState("");
  const [activityNotes, setActivityNotes] = React.useState("");

  const handleFetchCurrentGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          toast.success("GPS Location coordinates acquired via hardware sensor.");
        },
        () => {
          toast.info("Using simulated Marathwada GPS testbed coordinates.");
        }
      );
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActivityMutation.mutate(
      {
        projectId: selectedProjectId || assignedProjects?.[0]?.id || "ASSIGNED-01",
        date: new Date().toISOString().split("T")[0],
        time: "10:30 AM",
        location: locationName,
        latitude,
        longitude,
        volunteerCount,
        description,
        activityNotes,
      },
      {
        onSuccess: () => {
          setIsLogModalOpen(false);
          setDescription("");
          setActivityNotes("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Field Activity Evidence & Geotagged Logs</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Immutable ground evidence logs verified by line department nodal engineers
          </p>
        </div>
        <Button
          onClick={() => setIsLogModalOpen(true)}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Log New Field Activity</span>
        </Button>
      </div>

      {/* Activities Feed */}
      <div className="space-y-6">
        {(activities || []).map((activity) => (
          <Card key={activity.id} className="rounded-3xl border-border/80 bg-card overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-5">
              {/* Header: Project, Location, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                      {activity.id}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">{activity.projectTitle}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{activity.location}</span>
                  </h3>
                </div>

                <Badge
                  variant={activity.approvalStatus === "Approved" ? "success" : "warning"}
                  className="w-fit text-xs px-2.5 py-1"
                >
                  {activity.approvalStatus === "Approved" ? "Verified by Nodal Officer" : "Under Department Review"}
                </Badge>
              </div>

              {/* Description & Metadata */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activity.description}
              </p>

              {/* Specs pill */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-teal-500" />
                  <span><strong>{activity.volunteerCount}</strong> Volunteers</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground truncate">
                  <Navigation className="h-3.5 w-3.5 text-purple-500" />
                  <span className="truncate">{activity.gpsCoordinates.lat}, {activity.gpsCoordinates.lng}</span>
                </div>
              </div>

              {/* Notes */}
              {activity.activityNotes && (
                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground">
                  <strong>Site Officer Notes:</strong> {activity.activityNotes}
                </div>
              )}

              {/* Evidence Gallery */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Evidence Gallery ({activity.evidenceGallery.length} items)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activity.evidenceGallery.map((file) => (
                    <div
                      key={file.id}
                      className="rounded-2xl border border-border/80 bg-muted/30 overflow-hidden flex flex-col justify-between group"
                    >
                      {file.type === "image" ? (
                        <div className="relative h-36 w-full overflow-hidden">
                          <img src={file.url} alt={file.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                      ) : (
                        <div className="h-36 flex flex-col items-center justify-center p-4 text-center bg-muted/60">
                          <FileText className="h-8 w-8 text-emerald-600 mb-1" />
                          <span className="text-xs font-semibold truncate max-w-full">{file.name}</span>
                          <span className="text-[10px] text-muted-foreground">{file.size || "1.2 MB"}</span>
                        </div>
                      )}
                      <div className="p-2.5 bg-card/90 border-t border-border/60 flex items-center justify-between text-[10px]">
                        <span className="truncate text-foreground font-medium">{file.name}</span>
                        <span className="text-muted-foreground shrink-0">{file.uploadedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log Activity Dialog */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">Log Ground Activity & Geotagged Evidence</DialogTitle>
            <DialogDescription className="text-xs">
              Upload photos, telemetry logs, and GPS tags for verification by municipal line departments.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Project Selection */}
            <div className="space-y-1">
              <label className="font-bold text-foreground">Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              >
                {(assignedProjects || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.district})</option>
                ))}
              </select>
            </div>

            {/* Location & GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Location Description</label>
                <Input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Village / Taluka / Survey No."
                  className="rounded-xl text-xs bg-muted/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">GPS Coordinates</label>
                  <button
                    type="button"
                    onClick={handleFetchCurrentGps}
                    className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5"
                  >
                    <Navigation className="h-2.5 w-2.5" /> Acquire Device GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <Input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="rounded-xl text-xs bg-muted/30"
                  />
                  <Input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="rounded-xl text-xs bg-muted/30"
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Count */}
            <div className="space-y-1">
              <label className="font-bold text-foreground">Volunteers Present On Site</label>
              <Input
                type="number"
                value={volunteerCount}
                onChange={(e) => setVolunteerCount(Number(e.target.value))}
                min={1}
                className="rounded-xl text-xs bg-muted/30"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-foreground">Activity Description & Ground Output</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Detail the work carried out (e.g., meters desilted, children tested, saplings planted)..."
                className="w-full rounded-2xl border border-border/80 bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            {/* File Upload Mock Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 text-center space-y-1.5 cursor-pointer hover:bg-muted/40 transition-colors">
              <Upload className="h-6 w-6 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-foreground">Drag & Drop Field Evidence Photos / PDFs</p>
              <p className="text-[10px] text-muted-foreground">Supports JPG, PNG, MP4 video clips, and Lab PDF reports (up to 25MB)</p>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsLogModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createActivityMutation.isPending}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {createActivityMutation.isPending ? "Submitting..." : "Submit Geotagged Evidence"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
