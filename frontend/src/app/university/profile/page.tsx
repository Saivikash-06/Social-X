'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  School,
  Building2,
  Award,
  BookOpen,
  Edit,
  Save,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  Trophy,
  Users,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Star,
  Layers,
  MapPin,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { Textarea } from '@/features/shared/components/ui/textarea';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_CREDIT_SCORE,
  STUDENT_BADGES,
  STUDENT_CERTIFICATES,
} from '@/features/university/services/student-contribution-data';

export default function UniversityProfilePage() {
  const { role, user, setRole } = useUniversityStore();
  const [isEditing, setIsEditing] = React.useState(false);

  // Faculty State
  const [facultyData, setFacultyData] = React.useState({
    name: user?.name || 'Dr. Aris Thorne',
    designation: 'Professor & Dean of Civic Research',
    department: user?.department || 'Department of Computer Science & Engineering',
    institution: user?.institution || 'Indian Institute of Technology (IIT) Delhi',
    email: user?.email || 'aris.thorne@univ.edu.in',
    phone: '+91 98765 43210',
    experience: '14 Years in Academic Research & GovTech Consultations',
    studentsGuided: 84,
    publicationsCount: 18,
    activeProjectsCount: 5,
    researchAreas: [
      'Artificial Intelligence for Urban Governance',
      'Computer Vision & Edge Surveillance',
      'Autonomous Water Infrastructure Sensors',
      'Smart City Traffic Automation',
    ],
    achievements: [
      'MoHUA Smart Governance National Research Award (2025)',
      'Best University Research Supervisor of the Year (2024)',
      'Principal Investigator, ₹ 1.09 Cr Urban Sensing Grants',
    ],
    govCollaborations: [
      'Ministry of Housing & Urban Affairs (MoHUA)',
      'Municipal Corporation of Greater Mumbai (MCGM)',
      'Delhi Urban Shelter Improvement Board (DUSIB)',
    ],
  });

  // Student State
  const [studentData, setStudentData] = React.useState({
    name: user?.name || 'Alex Johnson',
    department: user?.department || 'Computer Science & Engineering',
    semester: '6th Semester (3rd Year)',
    rollNumber: user?.rollNumber || 'CS2023-9082',
    institution: user?.institution || 'National Institute of Technology',
    email: user?.email || 'alex.johnson@student.univ.edu',
    phone: '+91 98111 22334',
    mentor: 'Dr. Aris Thorne (Dept. of Computer Science)',
    credits: 780,
    tier: 'Gold Tier',
    communityHours: 124,
    skills: [
      'Python',
      'PyTorch',
      'Next.js',
      'OpenCV',
      'Sensor Telemetry',
      'PostgreSQL',
      'GIS Mapping',
    ],
    bio: 'Passionate about deploying computer vision and edge IoT algorithms to mitigate urban drainage overflows and civic infrastructure decay.',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Academic profile updated successfully!');
  };

  const backLink =
    role === 'student' ? '/university/student' : '/university/faculty';

  return (
    <div className="min-h-screen bg-muted/20 text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 mb-2">
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <User className="h-7 w-7 text-primary" />
            Institutional Academic Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Role-verified institutional credentials, research records, and civic
            achievements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1.5"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* =========================================================================
          ROLE VIEW: FACULTY PROFILE
         ========================================================================= */}
      {role === 'faculty' && (
        <div className="space-y-6">
          {/* Main Faculty Header Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6 border-b border-border pb-6">
              <div className="h-28 w-28 rounded-3xl bg-primary/10 text-primary font-black text-3xl flex items-center justify-center border-2 border-primary/20 shadow-inner shrink-0">
                {facultyData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {facultyData.name}
                  </h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs uppercase">
                    Tenured Faculty Guide
                  </Badge>
                  <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    MoHUA Verified PI
                  </span>
                </div>

                <p className="text-base font-semibold text-primary">
                  {facultyData.designation}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <School className="h-4 w-4" />
                  {facultyData.department} • {facultyData.institution}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {facultyData.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {facultyData.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {facultyData.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Faculty Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Students Mentored
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {facultyData.studentsGuided}
                </p>
                <span className="text-xs text-emerald-500">
                  Ph.D., M.Tech & B.Tech
                </span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Indexed Publications
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {facultyData.publicationsCount}
                </p>
                <span className="text-xs text-blue-500">IEEE, ACM & Springer</span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Supervised Civic Projects
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {facultyData.activeProjectsCount} Active
                </p>
                <span className="text-xs text-amber-500">
                  ₹ 1.09 Cr Grants
                </span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Gov Partnerships
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">3 Agencies</p>
                <span className="text-xs text-purple-500">MoHUA & MCGM</span>
              </div>
            </div>
          </div>

          {/* Research Areas & Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Research Areas */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Primary Research Areas & Specializations
              </h3>

              <div className="flex flex-wrap gap-2">
                {facultyData.researchAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="secondary"
                    className="text-xs px-3 py-1.5"
                  >
                    {area}
                  </Badge>
                ))}
              </div>

              <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
                Supervising municipal testbed initiatives in automated pothole
                triangulation, real-time flood gate actuation, and drone aerial
                inspection.
              </p>
            </div>

            {/* Achievements */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Academic Honors & Fellowships
              </h3>

              <div className="space-y-2.5">
                {facultyData.achievements.map((ach) => (
                  <div
                    key={ach}
                    className="flex items-start gap-2.5 text-xs text-foreground bg-muted/40 p-3 rounded-xl"
                  >
                    <Trophy className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Collaborations */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 md:col-span-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-500" />
                Active Government & Municipal Collaborations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {facultyData.govCollaborations.map((collab) => (
                  <div
                    key={collab}
                    className="p-4 rounded-xl border border-border bg-muted/30 space-y-1.5"
                  >
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Partner Agency
                    </span>
                    <p className="text-sm font-bold text-foreground">{collab}</p>
                    <span className="text-xs text-emerald-500 font-medium block">
                      Active MoU & Pilot Sandbox
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW: STUDENT PROFILE
         ========================================================================= */}
      {role === 'student' && (
        <div className="space-y-6">
          {/* Main Student Header Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6 border-b border-border pb-6">
              <div className="h-28 w-28 rounded-3xl bg-primary/10 text-primary font-black text-3xl flex items-center justify-center border-2 border-primary/20 shadow-inner shrink-0">
                {studentData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {studentData.name}
                  </h2>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs uppercase font-bold">
                    {studentData.tier}
                  </Badge>
                  <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Enrolled Student Researcher
                  </span>
                </div>

                <p className="text-sm font-semibold text-primary">
                  {studentData.department} • {studentData.semester}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Roll No: <span className="font-mono font-bold text-foreground">{studentData.rollNumber}</span> • {studentData.institution}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {studentData.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {studentData.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Mentor: <strong className="text-foreground">{studentData.mentor}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Student Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Academic Credits
                </span>
                <p className="text-2xl font-bold text-primary mt-1">
                  {studentData.credits}
                </p>
                <span className="text-xs text-emerald-500">
                  Gold Tier Scholar
                </span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Community Hours
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {studentData.communityHours} hrs
                </p>
                <span className="text-xs text-blue-500">Geo-tagged audits</span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Civic Projects
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">3 Projects</p>
                <span className="text-xs text-amber-500">100% Completed</span>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                <span className="text-xs text-muted-foreground block">
                  Preprints Co-authored
                </span>
                <p className="text-2xl font-bold text-foreground mt-1">2 Papers</p>
                <span className="text-xs text-purple-500">Indexed preprints</span>
              </div>
            </div>
          </div>

          {/* Technical Skills & Bio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Technical Competencies & Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {studentData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                {studentData.bio}
              </p>
            </div>

            {/* Badges Earned */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Earned Civic Badges
                </h3>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/university/credits">View All</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/40 rounded-xl border border-border text-center space-y-1">
                  <span className="text-2xl">🥇</span>
                  <p className="text-xs font-bold text-foreground">
                    Smart Governance Champion
                  </p>
                  <span className="text-[10px] text-muted-foreground block">
                    Jan 2026
                  </span>
                </div>

                <div className="p-3 bg-muted/40 rounded-xl border border-border text-center space-y-1">
                  <span className="text-2xl">🥈</span>
                  <p className="text-xs font-bold text-foreground">
                    Innovation Explorer
                  </p>
                  <span className="text-[10px] text-muted-foreground block">
                    Nov 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Certificates */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-emerald-500" />
                  Government & Academic Certificates
                </h3>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/university/credits">Certificates Ledger</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STUDENT_CERTIFICATES.slice(0, 2).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl border border-border bg-muted/30 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-500 font-bold uppercase">
                        {cert.category}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {cert.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Issued by: {cert.issuedBy} • {cert.issueDate}
                      </p>
                      <span className="text-[11px] font-mono text-muted-foreground block">
                        ID: {cert.credentialId}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs shrink-0"
                      onClick={() =>
                        toast.success(
                          `Downloading verified credential for ${cert.name}`
                        )
                      }
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
