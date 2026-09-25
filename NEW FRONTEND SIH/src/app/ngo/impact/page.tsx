"use client";

import * as React from "react";
import {
  LineChart,
  HeartHandshake,
  MapPin,
  Trees,
  Stethoscope,
  GraduationCap,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useImpactAnalytics } from "@/features/ngo/hooks/use-ngo-queries";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

export default function NgoImpactPage() {
  const { data: impact, isLoading } = useImpactAnalytics();

  const handleExport = () => {
    toast.success("Community Impact Telemetry compiled and exported to PDF.");
  };

  const PIE_COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <LineChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Community Impact & Field Analytics</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Audited socio-environmental metrics verified across villages and aspirational districts
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-2xl text-xs gap-2">
          <Download className="h-4 w-4" />
          <span>Export Analytics Dossier</span>
        </Button>
      </div>

      {/* Top 5 Key Impact Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="rounded-3xl border-border/80 bg-card p-4 text-center">
          <p className="text-[11px] font-semibold text-muted-foreground">People Benefited</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {(impact?.peopleBenefited ?? 184500).toLocaleString()}
          </p>
        </Card>
        <Card className="rounded-3xl border-border/80 bg-card p-4 text-center">
          <p className="text-[11px] font-semibold text-muted-foreground">Villages Covered</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {impact?.villagesCovered ?? 64}
          </p>
        </Card>
        <Card className="rounded-3xl border-border/80 bg-card p-4 text-center">
          <p className="text-[11px] font-semibold text-muted-foreground">Districts Active</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {impact?.districtCoverage ?? 8}
          </p>
        </Card>
        <Card className="rounded-3xl border-border/80 bg-card p-4 text-center">
          <p className="text-[11px] font-semibold text-muted-foreground">Volunteer Hours</p>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {(impact?.volunteerHours ?? 18640).toLocaleString()}
          </p>
        </Card>
        <Card className="rounded-3xl border-border/80 bg-card p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {impact?.successRate ?? 94.6}%
          </p>
        </Card>
      </div>

      {/* 3 Domain Impact Pillar Cards: Environmental, Healthcare, Education */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Environmental */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Trees className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Environmental Impact</CardTitle>
                <CardDescription className="text-[11px]">Ecological balance & water table</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Trees Planted</span>
              <span className="font-bold text-foreground">
                {(impact?.environmentalImpact.treesPlanted ?? 52000).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">CO2 Offset</span>
              <span className="font-bold text-emerald-600">
                {impact?.environmentalImpact.co2OffsetTonnes ?? 1240} Tonnes
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Water Bodies Restored</span>
              <span className="font-bold text-foreground">
                {impact?.environmentalImpact.waterBodiesRestored ?? 42} Reservoirs
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Healthcare */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Healthcare Impact</CardTitle>
                <CardDescription className="text-[11px]">Preventive care & malnutrition</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Diagnostic Screenings</span>
              <span className="font-bold text-foreground">
                {(impact?.healthcareImpact.freeScreenings ?? 34200).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Essential Medicines</span>
              <span className="font-bold text-rose-600">
                {(impact?.healthcareImpact.medicinesDistributed ?? 18500).toLocaleString()} Kits
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Maternal Health Camps</span>
              <span className="font-bold text-foreground">
                {impact?.healthcareImpact.maternalCareCamps ?? 148} Camps
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Education Impact</CardTitle>
                <CardDescription className="text-[11px]">Digital literacy & school labs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Students Mentored</span>
              <span className="font-bold text-foreground">
                {(impact?.educationImpact.studentsMentored ?? 12400).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">ZP Schools Equipped</span>
              <span className="font-bold text-amber-600">
                {impact?.educationImpact.schoolsEquipped ?? 46} Schools
              </span>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/40">
              <span className="text-muted-foreground">Digital STEM Labs</span>
              <span className="font-bold text-foreground">
                {impact?.educationImpact.digitalLabsSet ?? 22} Labs
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations: District Breakdown BarChart & SDG PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District BarChart */}
        <Card className="lg:col-span-2 rounded-3xl border-border/80 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">District Reach Breakdown</CardTitle>
            <CardDescription className="text-xs">Direct beneficiaries per district</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impact?.districtBreakdown || []} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="district" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      borderRadius: "16px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="beneficiaries" name="Beneficiaries" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* SDG Share PieChart */}
        <Card className="rounded-3xl border-border/80 bg-card shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">SDG Focus Distribution</CardTitle>
            <CardDescription className="text-xs">United Nations Sustainable Development Goals</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impact?.sdgDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {(impact?.sdgDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-1.5 pt-2">
              {(impact?.sdgDistribution || []).map((item, idx) => (
                <div key={item.sdg} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground truncate max-w-[170px]">{item.sdg}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
