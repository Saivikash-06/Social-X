"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Coins,
  Cpu,
  Award,
  FileCheck2,
  Scale,
  Users2,
  ArrowRight,
  TrendingUp,
  Leaf,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Progress } from "@/features/shared/components/ui/progress";
import { useOrganizationProfile } from "@/features/industry/hooks/use-industry-queries";

export default function IndustryOrganizationDetailsPage() {
  const { data: org } = useOrganizationProfile();

  const totalBudget = (org?.availableBudget || 45000000) + (org?.allocatedBudget || 28500000);
  const spentRatio = Math.round(((org?.spentBudget || 19250000) / totalBudget) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Organization Details</h1>
          <p className="text-sm text-muted-foreground">
            Corporate governance, CSR Section 135 compliance, and technology domain charters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-bold text-xs">
            MoCA & MCA Compliant
          </Badge>
          <Button asChild variant="outline" className="rounded-2xl text-xs font-semibold">
            <Link href="/industry/profile">Manage Profile</Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CSR Charter, ESG & Compliance */}
        <div className="lg:col-span-2 space-y-6">
          {/* CSR Charter & Section 135 Objectives */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-rose-500" />
                <span>Companies Act 2013 • Section 135 CSR Charter</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Statutory alignment under Schedule VII for societal technology transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                The Foundation commits an annual minimum 2% average net profits toward fostering sustainable civic technological solutions, with special emphasis on decentralized water purification, clean renewable microgrids, and urban waste segregation robotics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="font-bold text-foreground">Schedule VII - Item (i)</span>
                  <p className="text-muted-foreground">Eradicating extreme hunger, poverty & promoting sanitation, safe drinking water.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="font-bold text-foreground">Schedule VII - Item (iv)</span>
                  <p className="text-muted-foreground">Ensuring environmental sustainability, ecological balance & natural resource conservation.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Domains & Co-Development R&D */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-amber-500" />
                <span>Technical Domains & Academic R&D Alliances</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                    <Leaf className="h-4 w-4" />
                    <span>CleanTech & Battery Systems</span>
                  </div>
                  <p className="text-muted-foreground">
                    Supporting second-life EV cell diagnostics, solar MPPT micro-converters, and grid-tied storage.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                    <Building2 className="h-4 w-4" />
                    <span>Hydro-Informatics & Telemetry</span>
                  </div>
                  <p className="text-muted-foreground">
                    Subterranean acoustic pipe leak detection, electrocoagulation fluoride filtration skids.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorized Signatories & Board Committee */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users2 className="h-4 w-4 text-purple-500" />
                <span>CSR Committee & Authorized Signatories</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Dr. Rajeshwar Kulkarni</p>
                  <p className="text-muted-foreground">Head of Social R&D Alliances • Principal Signatory</p>
                </div>
                <Badge variant="success" className="text-[10px]">Active Signatory</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Meera Deshpande, IAS (Retd.)</p>
                  <p className="text-muted-foreground">Independent Director & ESG Oversight Chair</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Board Trustee</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: ESG Card, Tax Certs & Budget Progress */}
        <div className="space-y-6">
          {/* Budget Allocation Progress */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-500" />
                <span>Annual CSR Deployment</span>
              </CardTitle>
              <CardDescription className="text-xs">Tranche release tracking for current fiscal year</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-muted-foreground">Disbursed vs Total Corpus:</span>
                  <span className="font-bold text-foreground">{spentRatio}%</span>
                </div>
                <Progress value={spentRatio} className="h-2 rounded-full" />
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total CSR Fund:</span>
                  <span className="font-bold text-foreground">₹7,35,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Released to Date:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹1,92,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reserved in Escrow:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">₹2,85,00,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Exemption Registrations */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-blue-500" />
                <span>Statutory Tax Clearances</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Section 80G Certificate</p>
                  <p className="font-mono text-muted-foreground text-[11px]">{org?.csrRegistration80G}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Section 12A Registration</p>
                  <p className="font-mono text-muted-foreground text-[11px]">{org?.csrRegistration12A}</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          {/* ESG Rating Audit */}
          <Card className="border-border/80 bg-gradient-to-br from-emerald-500/10 to-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>ESG Audit & Verification</span>
                <Badge variant="success" className="font-bold text-xs">AAA Rating</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-muted-foreground">
                Audited by independent sustainability verifiers. Certified 100% adherence to Ministry of Corporate Affairs CSR spending mandates.
              </p>
              <div className="pt-2 border-t border-border/60">
                <Button asChild variant="outline" className="w-full rounded-xl text-xs font-semibold">
                  <Link href="/industry/csr">View Full CSR Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
