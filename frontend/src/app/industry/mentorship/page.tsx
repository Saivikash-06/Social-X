"use client";

import * as React from "react";
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Video,
  FileCheck2,
  Star,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import {
  useMentorshipEngagements,
  useScheduledMeetings,
  useMentorshipTasks,
  useIndustryQueries,
} from "@/features/industry/hooks/use-industry-queries";
import { MentorshipEngagement } from "@/features/industry/types";
import { toast } from "sonner";

export default function IndustryMentorshipPage() {
  const { data: engagements } = useMentorshipEngagements();
  const { data: meetings } = useScheduledMeetings();
  const { data: tasks } = useMentorshipTasks();
  const { scheduleMeetingMutation, assignTaskMutation, rateTeamMutation } = useIndustryQueries();

  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = React.useState(false);
  const [isRateTeamOpen, setIsRateTeamOpen] = React.useState(false);
  const [selectedEngagement, setSelectedEngagement] = React.useState<MentorshipEngagement | null>(null);

  // Schedule meeting form state
  const [meetingTitle, setMeetingTitle] = React.useState("Sprint Review & Architecture Assessment");
  const [meetingDate, setMeetingDate] = React.useState("2026-09-28");
  const [meetingTime, setMeetingTime] = React.useState("15:00");
  const [meetingAgenda, setMeetingAgenda] = React.useState("Review telemetry logs and discuss hardware component selection.");

  // Assign task state
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDesc, setTaskDesc] = React.useState("");
  const [taskAssignee, setTaskAssignee] = React.useState("");
  const [taskDueDate, setTaskDueDate] = React.useState("2026-10-05");

  // Rate team state
  const [starRating, setStarRating] = React.useState(5);
  const [ratingFeedback, setRatingFeedback] = React.useState("Excellent engineering discipline, rapid telemetry prototype iteration.");

  const handleOpenSchedule = (eng: MentorshipEngagement) => {
    setSelectedEngagement(eng);
    setIsScheduleOpen(true);
  };

  const handleOpenAssign = (eng: MentorshipEngagement) => {
    setSelectedEngagement(eng);
    setTaskAssignee(eng.studentTeamLead);
    setIsAssignTaskOpen(true);
  };

  const handleOpenRate = (eng: MentorshipEngagement) => {
    setSelectedEngagement(eng);
    setIsRateTeamOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEngagement) return;
    scheduleMeetingMutation.mutate(
      {
        engagementId: selectedEngagement.id,
        title: meetingTitle,
        date: meetingDate,
        time: `${meetingTime} IST`,
        agenda: meetingAgenda,
        meetingPlatform: "Google Meet",
      },
      {
        onSuccess: () => setIsScheduleOpen(false),
      }
    );
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEngagement) return;
    assignTaskMutation.mutate(
      {
        engagementId: selectedEngagement.id,
        title: taskTitle,
        description: taskDesc,
        assignedTo: taskAssignee,
        dueDate: taskDueDate,
        priority: "critical",
      },
      {
        onSuccess: () => {
          setIsAssignTaskOpen(false);
          setTaskTitle("");
          setTaskDesc("");
        },
      }
    );
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEngagement) return;
    rateTeamMutation.mutate(
      {
        engagementId: selectedEngagement.id,
        rating: starRating,
        technicalCompetenceScore: 5,
        timelineAdherenceScore: 4,
        feedbackSummary: ratingFeedback,
      },
      {
        onSuccess: () => setIsRateTeamOpen(false),
      }
    );
  };

  const handleApproveDeliverable = (taskTitle: string) => {
    toast.success(`Deliverable for '${taskTitle}' formally approved.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">University Mentorship Hub</h1>
          <p className="text-sm text-muted-foreground">
            Guide university student teams, assign sprint deliverables, schedule technical reviews, and rate engineering competence.
          </p>
        </div>
        <Badge variant="warning" className="px-3 py-1 font-bold text-xs gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Active Industry Fellows</span>
        </Badge>
      </div>

      {/* Active Mentorship Engagements */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Active University Teams Under Mentorship</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(engagements || []).map((eng) => (
            <Card key={eng.id} className="border-border/80 bg-card rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">{eng.university}</Badge>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{eng.rating || 5}.0</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-foreground leading-snug">
                  {eng.projectTitle}
                </CardTitle>
                <p className="text-xs text-muted-foreground">Advisor: {eng.facultyLead}</p>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student Lead:</span>
                    <span className="font-bold text-foreground">{eng.studentTeamLead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours Mentored:</span>
                    <span className="font-bold text-foreground">{eng.totalHoursLogged} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deliverables Reviewed:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{eng.deliverablesReviewedCount} Completed</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleOpenSchedule(eng)}
                      variant="gradient"
                      size="sm"
                      className="rounded-xl text-xs font-bold gap-1 shadow"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Meet</span>
                    </Button>
                    <Button
                      onClick={() => handleOpenAssign(eng)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Assign Task</span>
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleOpenRate(eng)}
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-xl text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
                  >
                    Rate Team & Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2-Column: Scheduled Meetings & Assigned Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Meetings */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>Upcoming Technical Review Meetings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(meetings || []).map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl border border-border/60 bg-muted/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{m.title}</span>
                  <Badge variant="warning" className="text-[10px]">{m.date} • {m.time}</Badge>
                </div>
                <p className="text-muted-foreground">{m.agenda}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">Attendees: {m.attendees.length} members</span>
                  <Button asChild variant="gradient" size="sm" className="h-7 text-[11px] rounded-lg">
                    <a href={m.meetingLink} target="_blank" rel="noreferrer">
                      Join Call
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Tasks & Deliverable Approvals */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-500" />
              <span>Student Deliverables & Sprint Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(tasks || []).map((t) => (
              <div key={t.id} className="p-3.5 rounded-2xl border border-border/60 bg-muted/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{t.title}</span>
                  <Badge
                    variant={t.status === "approved" ? "success" : t.status === "in_review" ? "warning" : "secondary"}
                    className="text-[10px]"
                  >
                    {t.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{t.description}</p>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-muted-foreground">Assigned to: {t.assignedTo} (Due {t.dueDate})</span>
                  {t.status === "in_review" && (
                    <Button
                      onClick={() => handleApproveDeliverable(t.title)}
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span>Approve</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Meeting Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Schedule Mentorship Meeting</DialogTitle>
            <DialogDescription className="text-xs">
              Coordinate technical architecture review with research scholars.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Meeting Subject</Label>
              <Input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="rounded-xl" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Date</Label>
                <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="rounded-xl" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Time</Label>
                <Input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="rounded-xl" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Discussion Agenda</Label>
              <Textarea value={meetingAgenda} onChange={(e) => setMeetingAgenda(e.target.value)} className="rounded-xl h-20 text-xs" required />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="rounded-xl font-bold">
                Confirm Meeting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Task Modal */}
      <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Assign Technical Milestone Task</DialogTitle>
            <DialogDescription className="text-xs">
              Direct student scholars on firmware calibration, sensor bench tests, or safety specs.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Task Title</Label>
              <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Implement Bandpass Hydrophone Filter" className="rounded-xl" required />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assignee</Label>
              <Input value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} className="rounded-xl" required />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Due Date</Label>
              <Input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="rounded-xl" required />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Description & Acceptance Criteria</Label>
              <Textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="Provide exact specifications..." className="rounded-xl h-20 text-xs" required />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignTaskOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="rounded-xl font-bold">
                Assign Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rate Team Modal */}
      <Dialog open={isRateTeamOpen} onOpenChange={setIsRateTeamOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Evaluate Student Research Team</DialogTitle>
            <DialogDescription className="text-xs">
              Log formal industry rating and qualitative feedback on research rigor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRateSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-2 text-center">
              <Label className="text-xs font-semibold">Star Rating (1 - 5)</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="p-1 text-amber-500 hover:scale-125 transition-transform"
                  >
                    <Star className={`h-6 w-6 ${star <= starRating ? "fill-amber-500" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Industry Mentor Feedback</Label>
              <Textarea
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                className="rounded-xl h-24 text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRateTeamOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="rounded-xl font-bold">
                Submit Rating
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
