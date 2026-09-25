"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Filter, Download } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shared/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MONTHLY_TREND_DATA = [
  { month: "Apr", reported: 1240, resolved: 1180, escalated: 60 },
  { month: "May", reported: 1450, resolved: 1390, escalated: 60 },
  { month: "Jun", reported: 1680, resolved: 1590, escalated: 90 },
  { month: "Jul", reported: 1890, resolved: 1780, escalated: 110 },
  { month: "Aug", reported: 2120, resolved: 2040, escalated: 80 },
  { month: "Sep", reported: 2450, resolved: 2380, escalated: 70 },
];

const CATEGORY_DISTRIBUTION = [
  { name: "Water Supply & Drainage", value: 34, color: "#3b82f6" },
  { name: "Roads & Transit Infra", value: 26, color: "#f59e0b" },
  { name: "Public Health & Waste", value: 18, color: "#10b981" },
  { name: "Power & Street Lighting", value: 12, color: "#8b5cf6" },
  { name: "Urban Forestry & Green", value: 10, color: "#ec4899" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            National Civic Analytics & SLA Insights
          </h1>
          <p className="text-xs text-muted-foreground">
            Multi-dimensional reporting across line departments, districts, categories, and resolution velocities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-3xl border-border/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Longitudinal Civic Issue Resolution</h3>
            <Badge variant="outline" className="font-mono text-[10px]">
              92.6% Avg Resolution
            </Badge>
          </div>
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/80 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base">Sector Allocation</h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
