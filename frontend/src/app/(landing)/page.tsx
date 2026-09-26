"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Building2,
  GraduationCap,
  Users2,
  CheckCircle2,
  Camera,
  Mic,
  FileText,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent } from "@/features/shared/components/ui/card";

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = React.useState<
    "multimodal" | "routing" | "resolution"
  >("multimodal");

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-teal-400/15 blur-[120px] dark:from-blue-600/25 dark:via-indigo-500/20 dark:to-teal-400/20" />
        <div className="absolute top-[40%] -right-40 h-[450px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10 blur-[130px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-28 lg:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs backdrop-blur-xs"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span>AI-Powered Societal Innovation & Smart Governance</span>
            <span className="hidden sm:inline-block text-muted-foreground">•</span>
            <span className="hidden sm:inline-block font-normal text-muted-foreground">
              Module 1 Citizen Release
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground"
          >
            Empowering Citizens.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Solving Societal Problems
            </span>{" "}
            with AI.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            Social-X bridges Citizens, Municipal Governments, University R&D,
            Industries, and NGOs into a single real-time action network. Report
            challenges through photos, voice, video, or documents — our AI
            engine routes, investigates, and ensures transparent resolution.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
          >
            <Button asChild size="lg" variant="gradient" className="w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-lg shadow-blue-500/25">
              <Link href="/login/citizen">
                <span>Citizen Portal Access</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-xl gap-2 font-medium">
              <Link href="/login">
                <span>Role Selection</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto rounded-xl gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/how-it-works">
                <span>See How It Works</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>100% Transparent Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>FastAPI Microservice Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Multi-Stakeholder Accountability</span>
            </div>
          </motion.div>
        </div>

        {/* Live Interactive Platform Preview Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card/80 p-2 sm:p-4 shadow-2xl backdrop-blur-xl"
        >
          {/* Showcase Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground font-semibold">
                live_system_simulation // civic-ai-mesh
              </span>
            </div>

            <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveDemoTab("multimodal")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeDemoTab === "multimodal"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                1. Multimodal Report
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoTab("routing")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeDemoTab === "routing"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                2. AI Extraction
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoTab("resolution")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeDemoTab === "resolution"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                3. Multi-Entity Action
              </button>
            </div>
          </div>

          {/* Interactive Simulation Content */}
          <div className="p-4 sm:p-6">
            {activeDemoTab === "multimodal" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border/60 bg-background/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="info">Input 01: Photo & OCR</Badge>
                      <Camera className="h-4 w-4 text-sky-500" />
                    </div>
                    <div className="h-28 rounded-xl bg-slate-900/90 p-3 flex flex-col justify-end text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="relative z-10 text-xs font-mono text-emerald-400">
                        [OCR: "Danger High Voltage cable exposed #B-14"]
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vision model extracts signboards, hazard labels, and visual defects.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-background/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="warning">Input 02: Voice Audio</Badge>
                      <Mic className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="h-28 rounded-xl bg-muted/60 p-3 flex flex-col justify-center space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="h-4 w-1 bg-amber-500 rounded-full animate-pulse" />
                        <span className="h-8 w-1 bg-amber-500 rounded-full animate-pulse" />
                        <span className="h-6 w-1 bg-amber-500 rounded-full animate-pulse" />
                        <span className="h-10 w-1 bg-amber-500 rounded-full animate-pulse" />
                        <span className="h-5 w-1 bg-amber-500 rounded-full animate-pulse" />
                        <span className="h-3 w-1 bg-amber-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        "Water pipe burst flooding lane 4..."
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      FastAPI speech engine transcribes regional dialects automatically.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-background/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple">Input 03: GPS Geotag</Badge>
                      <MapPin className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="h-28 rounded-xl bg-muted/60 p-3 flex flex-col justify-center items-center text-center">
                      <MapPin className="h-6 w-6 text-primary mb-1" />
                      <span className="font-mono text-xs font-bold">
                        12.9716° N, 77.5946° E
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Ward 142, South Bangalore
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Exact spatial coordinates link to municipal jurisdiction boundary.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeDemoTab === "routing" && (
              <div className="rounded-2xl border border-border/80 bg-background/60 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="font-bold text-sm">
                      AI Classifier & Confidence Report
                    </span>
                  </div>
                  <Badge variant="success">Confidence Score: 98.6%</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border/60 p-3 bg-card/40">
                    <span className="text-xs text-muted-foreground block">
                      Detected Category
                    </span>
                    <span className="text-sm font-bold text-primary mt-1 block">
                      Urban Water Infrastructure
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3 bg-card/40">
                    <span className="text-xs text-muted-foreground block">
                      Routed Department
                    </span>
                    <span className="text-sm font-bold text-foreground mt-1 block">
                      Water Supply & Sewerage Board (BWSSB)
                    </span>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3 bg-card/40">
                    <span className="text-xs text-muted-foreground block">
                      Severity Index
                    </span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                      High (Potable loss & Road obstruction)
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-3 text-xs font-mono text-muted-foreground">
                  Citizen edits permitted in AI Preview before final signature. Zero latency routing.
                </div>
              </div>
            )}

            {activeDemoTab === "resolution" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <span className="font-bold text-sm">Municipal Action</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dispatched emergency maintenance team with SLA countdown: 14h remaining.
                  </p>
                  <Badge variant="info">Work Order Dispatched</Badge>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-500" />
                    <span className="font-bold text-sm">University Lab</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    National Tech Institute logged pipeline corrosion data for thesis & IoT sensor pilot.
                  </p>
                  <Badge variant="purple">Research Linked</Badge>
                </div>

                <div className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold text-sm">Civic NGO Observer</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Citizen action committee monitors ground repair and validates water safety test.
                  </p>
                  <Badge variant="success">Independently Audited</Badge>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-border/80 bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <span className="text-3xl sm:text-5xl font-black text-primary tracking-tight">
                148,000+
              </span>
              <p className="text-sm font-medium text-muted-foreground">
                Issues Submitted & Resolved
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                98.4%
              </span>
              <p className="text-sm font-medium text-muted-foreground">
                AI Category Detection Accuracy
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                650+
              </span>
              <p className="text-sm font-medium text-muted-foreground">
                Municipal Hubs & Research Labs
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                &lt; 72 hrs
              </span>
              <p className="text-sm font-medium text-muted-foreground">
                Average Resolution Lifecycle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <Badge variant="info" className="px-3 py-1">
            Built for Real-World Societal Impact
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Six Pillars of Smart Governance
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Engineered from the ground up to replace fragmented grievance portals
            with an intelligent, transparent, and collaborative societal operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Multimodal Ingestion
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Citizens submit grievances via smartphone camera photos, 4K video clips,
                microphone voice memos in vernacular languages, or official scanned PDFs.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                AI Preview & Verification
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before final dispatch, our FastAPI microservice delivers instant OCR
                text, speech transcription, and category prediction for citizen confirmation.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Automated Department Routing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Eliminates bureaucratic delays. Reports are automatically assigned to
                PWD, Health, Sanitation, or Energy with automated jurisdiction matching.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                University & Industry Synergy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Complex societal challenges are synced with academic research departments
                and corporate CSR initiatives for scalable, innovative solutions.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Transparent SLA Tracking
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every stage from assignment to officer dispatch, on-site repair, and
                photo verification is logged in an immutable, real-time audit trail.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Citizen Privacy & Security
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enterprise security standards ensure citizen identity and location
                data are masked from unauthorized third parties while preserving accountability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Workflow Illustration Section */}
      <section className="border-t border-border/80 bg-muted/20 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <Badge variant="purple" className="px-3 py-1">
              End-to-End Governance Lifecycle
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              How Social-X Works
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From civic problem detection on the street to verified resolution and
              academic innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative rounded-3xl border border-border/80 bg-card p-6 space-y-3">
              <div className="text-4xl font-black text-primary/20">01</div>
              <h4 className="text-lg font-bold text-foreground">Citizen Reports</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The citizen records an issue using voice, photo, video, or text with
                automatic GPS coordinates through the intuitive mobile-first portal.
              </p>
            </div>

            <div className="relative rounded-3xl border border-border/80 bg-card p-6 space-y-3">
              <div className="text-4xl font-black text-primary/20">02</div>
              <h4 className="text-lg font-bold text-foreground">AI Ingestion & Preview</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                FastAPI microservices perform OCR extraction and speech-to-text. The
                citizen reviews the extracted metadata and confidence score before dispatch.
              </p>
            </div>

            <div className="relative rounded-3xl border border-border/80 bg-card p-6 space-y-3">
              <div className="text-4xl font-black text-primary/20">03</div>
              <h4 className="text-lg font-bold text-foreground">Multi-Stakeholder Sync</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The issue is automatically routed to the responsible department,
                partner university engineering department, and local NGO observers.
              </p>
            </div>

            <div className="relative rounded-3xl border border-border/80 bg-card p-6 space-y-3">
              <div className="text-4xl font-black text-primary/20">04</div>
              <h4 className="text-lg font-bold text-foreground">Resolution & Proof</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Officers upload post-repair evidence. The citizen and community
                verify resolution before the case is closed on the public tracker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-tr from-blue-900/60 via-indigo-950/60 to-slate-900/80 p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-5">
            <Badge variant="default" className="bg-white/20 text-white border-transparent">
              Join the Movement
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Transform Your Community?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Create your citizen account today. File real-time reports, track municipal
              accountability, and shape the future of smart civic governance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md">
                <Link href="/register">
                  <span>Sign Up as Citizen</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-xl text-white border-white/30 hover:bg-white/10">
                <Link href="/login/citizen">
                  <span>Existing Citizen Login</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
