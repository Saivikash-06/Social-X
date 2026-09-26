"use client";

import * as React from "react";
import {
  LineChart,
  Coins,
  MapPin,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Award,
  Leaf,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { useIndustryAnalytics } from "@/features/industry/hooks/use-industry-queries";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

export default function IndustryCSRDashboardPage() {
  const { data: analytics, isLoading } = useIndustryAnalytics();

  const handleExportCSRReport = () => {
    toast.success("Statutory Form CSR-1 & CSR-2 summary generated and downloaded.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">CSR & Impact Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Measurable societal progress, UN SDG alignment, district geographic coverage, and ESG compliance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSRReport}
            variant="outline"
            size="sm"
            className="rounded-2xl text-xs gap-1.5 font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSR-2 Report</span>
          </Button>
          <Badge variant="success" className="px-3 py-1 font-bold text-xs">
            100% Statutory Adherence
          </Badge>
        </div>
      </div>

      {/* Top 3 Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">Total Beneficiaries Impacted</p>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-foreground">1,07,180</p>
          <p className="text-[11px] text-muted-foreground">Citizens in 6 municipal districts</p>
        </Card>

        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">Clean Water Conserved</p>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">18.4M Liters</p>
          <p className="text-[11px] text-muted-foreground">Via subterranean acoustic leak detection</p>
        </Card>

        <Card className="border-border/80 bg-card rounded-3xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">E-Waste Diverted From Landfill</p>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">12.8 Tonnes</p>
          <p className="text-[11px] text-muted-foreground">Second-life lithium battery modules repurposed</p>
        </Card>
      </div>

      {/* Charts Grid Row 1: Category Funding & District Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Funding Bar Chart */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">CSR Funding by Innovation Category</CardTitle>
            <CardDescription className="text-xs">Capital deployment across Schedule VII domains (in INR)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.innovationCategories || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="category" stroke="currentColor" className="text-[10px] text-muted-foreground opacity-70" />
                  <YAxis
                    stroke="currentColor"
                    className="text-xs text-muted-foreground opacity-70"
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "CSR Funding"]}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "1rem" }}
                  />
                  <Bar dataKey="funding" fill="#d97706" radius={[8, 8, 0, 0]} name="Grant Capital" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* District Coverage Bar Chart */}
        <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">District Geographic Coverage & Impact Score</CardTitle>
            <CardDescription className="text-xs">Civic pilot density across Karnataka regions</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.districtCoverage || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="district" stroke="currentColor" className="text-[10px] text-muted-foreground opacity-70" />
                  <YAxis stroke="currentColor" className="text-xs text-muted-foreground opacity-70" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "1rem" }}
                  />
                  <Legend />
                  <Bar dataKey="projects" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Active Projects" />
                  <Bar dataKey="impactScore" fill="#10b981" radius={[6, 6, 0, 0]} name="Impact Score (100)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sustainable Development Goals (SDGs) Matrix */}
      <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">UN Sustainable Development Goals (SDGs) Target Alignment</CardTitle>
          <CardDescription className="text-xs">
            Direct correlation of sponsored R&D initiatives to global targets
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-500 text-white font-black flex items-center justify-center text-xs">
                6
              </div>
              <span className="font-bold text-foreground">Clean Water & Sanitation</span>
            </div>
            <p className="text-muted-foreground">
              Acoustic leak pin-pointing and electrocatalytic borewell defluoridation in Pavagada.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center text-xs">
                7
              </div>
              <span className="font-bold text-foreground">Affordable Clean Energy</span>
            </div>
            <p className="text-muted-foreground">
              Second-life EV battery swapping lockers for Tier-2 town commercial e-rickshaw fleets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">
                11
              </div>
              <span className="font-bold text-foreground">Sustainable Smart Cities</span>
            </div>
            <p className="text-muted-foreground">
              Decentralized optical polymer waste sortation and V2I green-wave smart ambulance routing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500 text-white font-black flex items-center justify-center text-xs">
                12
              </div>
              <span className="font-bold text-foreground">Responsible Consumption</span>
            </div>
            <p className="text-muted-foreground">
              Preventing lithium cell landfill waste and empowering informal waste picker federations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
