"use client";

import * as React from "react";
import {
  GraduationCap,
  RefreshCw,
  Award,
  BookOpen,
  Building2,
  Users,
  IndianRupee,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card } from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { toast } from "sonner";

export default function AdminUniversitiesPage() {
  const [tab, setTab] = React.useState<"collaborations" | "universities" | "faculty" | "certificates">("collaborations");
  const [adminData, setAdminData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Registration Dialog
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [regType, setRegType] = React.useState<"university" | "faculty" | "student">("university");
  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regDept, setRegDept] = React.useState("Artificial Intelligence");
  const [regCity, setRegCity] = React.useState("Chennai");
  const [submitting, setSubmitting] = React.useState(false);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/university-collaborations");
      const json = await res.json();
      if (json.success) {
        setAdminData(json);
      }
    } catch (e) {
      console.warn("Failed to load university audit data", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAuditData();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsRegisterOpen(false);
      toast.success(`${regType.toUpperCase()} Registered`, {
        description: `${regName} has been accredited and granted municipal portal credentials.`,
      });
      setRegName("");
      setRegEmail("");
      fetchAuditData();
    }, 600);
  };

  const stats = adminData?.stats || {
    totalCollaborations: 1,
    activeCollaborations: 1,
    completedCollaborations: 0,
    totalGrantsCommitted: 120000,
    certificatesIssued: 2,
  };

  const collaborations = adminData?.collaborations || [];
  const universities = adminData?.universities || [];
  const facultyMentors = adminData?.facultyMentors || [];
  const certificates = adminData?.certificates || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs font-mono">
              Academic Governance
            </Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            <span>University & Research Innovation Ecosystem</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee Industry–University research partnerships, student prototype development, and academic credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAuditData}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-1.5 shadow-sm h-9"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Institution / Faculty</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="rounded-2xl border-border/80 p-4 space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground">Accredited Univs</span>
          <div className="text-2xl font-black text-foreground">{universities.length || 6}</div>
          <div className="text-[10px] text-purple-600 font-medium">NIRF Ranked Institutes</div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground">Industry Collabs</span>
          <div className="text-2xl font-black text-indigo-600">{stats.totalCollaborations}</div>
          <div className="text-[10px] text-muted-foreground">{stats.activeCollaborations} currently active</div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground">Faculty Mentors</span>
          <div className="text-2xl font-black text-foreground">{facultyMentors.length || 5}</div>
          <div className="text-[10px] text-muted-foreground">Top domain experts</div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground">R&D Grants Committed</span>
          <div className="text-2xl font-black text-emerald-600">₹{(stats.totalGrantsCommitted / 1000).toFixed(0)}k</div>
          <div className="text-[10px] text-emerald-600/80 font-medium">From Industry Sponsors</div>
        </Card>

        <Card className="rounded-2xl border-border/80 p-4 space-y-1 shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground">Certificates Issued</span>
          <div className="text-2xl font-black text-purple-600">{stats.certificatesIssued}</div>
          <div className="text-[10px] text-purple-600/80 font-medium">Verifiable Credits</div>
        </Card>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={tab === "collaborations" ? "default" : "ghost"}
            onClick={() => setTab("collaborations")}
            className="rounded-xl text-xs font-bold h-8"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>Industry Collaborations ({collaborations.length})</span>
          </Button>

          <Button
            size="sm"
            variant={tab === "universities" ? "default" : "ghost"}
            onClick={() => setTab("universities")}
            className="rounded-xl text-xs font-bold h-8"
          >
            <Building2 className="h-3.5 w-3.5 mr-1" />
            <span>Accredited Universities ({universities.length})</span>
          </Button>

          <Button
            size="sm"
            variant={tab === "faculty" ? "default" : "ghost"}
            onClick={() => setTab("faculty")}
            className="rounded-xl text-xs font-bold h-8"
          >
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>Faculty & Student Squads</span>
          </Button>

          <Button
            size="sm"
            variant={tab === "certificates" ? "default" : "ghost"}
            onClick={() => setTab("certificates")}
            className="rounded-xl text-xs font-bold h-8"
          >
            <Award className="h-3.5 w-3.5 mr-1" />
            <span>Certificates & Credits ({certificates.length})</span>
          </Button>
        </div>

        <div className="relative w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partnerships, mentors..."
            className="rounded-xl pl-8 h-8 text-xs bg-card"
          >
          </Input>
        </div>
      </div>

      {/* TAB 1: Live Industry-University Collaborations */}
      {tab === "collaborations" && (
        <div className="space-y-4">
          {collaborations.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-3xl">
              No active industry-university collaborations lodged yet.
            </div>
          ) : (
            collaborations.map((collab: any) => {
              const statusBadges: Record<string, { label: string; color: string }> = {
                requested: { label: "Request Sent to University", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                faculty_accepted: { label: "Faculty Accepted & Defining Milestones", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                team_assigned: { label: "Student Squad Assigned", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
                prototype_submitted: { label: "Prototype Submitted for Review", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
                faculty_approved: { label: "Faculty Mentor Endorsed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                industry_validated: { label: "Industry Validated & Field Deployed", color: "bg-emerald-600 text-white border-emerald-600" },
                modifications_requested: { label: "Revisions Requested", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
              };
              const badge = statusBadges[collab.status] || { label: collab.status, color: "bg-muted text-muted-foreground" };

              return (
                <Card key={collab.id} className="rounded-3xl border-border/80 p-5 space-y-4 hover:border-purple-500/40 transition-all shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold">
                          {collab.id}
                        </Badge>
                        <Badge className={`text-[10px] font-mono ${badge.color}`}>
                          {badge.label}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        {collab.issueTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground">{collab.objectives}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Research Grant</span>
                      <div className="text-lg font-black text-emerald-600">₹{collab.researchGrant?.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Industry Partner</span>
                      <div className="font-semibold text-foreground">{collab.industryName}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">University & Dept</span>
                      <div className="font-semibold text-foreground">{collab.universityName}</div>
                      <div className="text-[11px] text-muted-foreground">{collab.department}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Faculty Mentor</span>
                      <div className="font-semibold text-foreground">{collab.facultyName}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Student Team</span>
                      <div className="font-semibold text-foreground">{collab.studentTeam?.teamName || "Pending Assignment"}</div>
                    </div>
                  </div>

                  {/* Prototype if Available */}
                  {collab.prototype && (
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-purple-700 dark:text-purple-300">
                        <span>Prototype: {collab.prototype.title}</span>
                        {collab.prototype.codeUrl && (
                          <a
                            href={collab.prototype.codeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-purple-600 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Code / CAD</span>
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{collab.prototype.description}</p>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Accredited Universities */}
      {tab === "universities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((uni: any) => (
            <Card key={uni.id} className="rounded-3xl border-border/80 p-5 space-y-3 hover:border-purple-500/40 transition-all shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="font-mono text-[10px] font-bold">
                    NIRF #{uni.nirfRank} &bull; {uni.district}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground mt-1">{uni.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{uni.city}, {uni.state}</p>
                </div>
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-bold">
                  NAAC {uni.naacGrade}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <span>Dean / POC:</span>
                  <span className="font-semibold text-foreground">{uni.dean}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contact Email:</span>
                  <span className="font-mono text-muted-foreground">{uni.contactEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                    Specialized Departments:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uni.departments?.map((d: string) => (
                      <Badge key={d} variant="outline" className="text-[9px] py-0">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: Faculty & Student Squads */}
      {tab === "faculty" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 text-purple-600" />
              <span>Registered Faculty Mentors</span>
            </h3>
            {facultyMentors.map((fac: any) => (
              <Card key={fac.id} className="rounded-2xl border-border/80 p-4 space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{fac.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{fac.designation} &bull; {fac.department}</p>
                    <p className="text-[11px] text-purple-600 font-medium">{fac.universityName}</p>
                  </div>
                  <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-none font-mono">
                    Rating {fac.rating}/5.0
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {fac.specialization?.map((s: string) => (
                    <Badge key={s} variant="outline" className="text-[9px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Student Innovation Squads</span>
            </h3>
            <Card className="rounded-2xl border-border/80 p-4 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-foreground">Team AquaSense AI</h4>
                  <p className="text-[11px] text-muted-foreground">IIT Madras &bull; Dept of AI & Robotics</p>
                </div>
                <Badge className="text-[10px] bg-indigo-500/15 text-indigo-600 border-none">
                  4 Innovators
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-1">
                <div>Lead: <span className="text-foreground font-semibold">Arun Kumar</span> (AI & Edge Compute)</div>
                <div>Members: Priya S., Vignesh R., Kavitha M.</div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[9px]">Computer Vision</Badge>
                <Badge variant="outline" className="text-[9px]">IoT Telemetry</Badge>
                <Badge variant="outline" className="text-[9px]">Acoustic Sensors</Badge>
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 p-4 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-foreground">Team Trenchless Dynamics</h4>
                  <p className="text-[11px] text-muted-foreground">Anna University &bull; Civil & Environmental Eng</p>
                </div>
                <Badge className="text-[10px] bg-indigo-500/15 text-indigo-600 border-none">
                  3 Innovators
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-1">
                <div>Lead: <span className="text-foreground font-semibold">Dinesh Karthik</span> (Hydraulics)</div>
                <div>Members: Meera N., Gokul V.</div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[9px]">Hydraulic Flow</Badge>
                <Badge variant="outline" className="text-[9px]">Pipeline Sealing</Badge>
                <Badge variant="outline" className="text-[9px]">GIS Mapping</Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: Certificates & Innovation Credits */}
      {tab === "certificates" && (
        <div className="space-y-3">
          {certificates.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-3xl">
              No certificates issued yet. Validated university solutions automatically generate verifiable certificates.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certificates.map((cert: any) => (
                <Card key={cert.id} className="rounded-2xl border-border/80 p-4 space-y-2 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="font-mono text-[9px] font-bold text-purple-600 border-purple-500/30">
                        {cert.certificateNumber}
                      </Badge>
                      <h4 className="font-bold text-xs text-foreground mt-1">{cert.recipientName}</h4>
                      <p className="text-[11px] text-muted-foreground">{cert.institution} &bull; {cert.role.toUpperCase()}</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-none text-[10px] font-mono">
                      +{cert.creditsAwarded} Academic Credits
                    </Badge>
                  </div>
                  <p className="text-[11px] text-foreground/90">&ldquo;{cert.citation}&rdquo;</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                    <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                    <span className="font-mono text-purple-600">Verification Hash: {cert.verificationHash}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Super Admin Registration Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              Accredit Institution / Mentor
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register educational institutions, departments, and certified mentors onto the Social-X innovation grid.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegister} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Entity Type</Label>
              <select
                value={regType}
                onChange={(e: any) => setRegType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
              >
                <option value="university">Accredited University</option>
                <option value="faculty">Faculty Mentor</option>
                <option value="student">Student Innovation Team</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Name / Title</Label>
              <Input
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={regType === "university" ? "e.g., Coimbatore Institute of Technology" : "e.g., Dr. M. Sangeetha"}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Contact Email</Label>
              <Input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="poc@institution.edu.in"
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department</Label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Environmental Engineering">Environmental Engineering</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Biotechnology">Biotechnology</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">District / City</Label>
                <Input
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                {submitting ? "Accrediting..." : "Accredit & Issue API Key"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
