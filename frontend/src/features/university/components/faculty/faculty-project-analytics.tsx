'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

const MONTHLY_PROJECTS_DATA = [
  { month: 'Apr', adopted: 1, completed: 0, ongoing: 3 },
  { month: 'May', adopted: 2, completed: 1, ongoing: 4 },
  { month: 'Jun', adopted: 1, completed: 1, ongoing: 4 },
  { month: 'Jul', adopted: 2, completed: 0, ongoing: 5 },
  { month: 'Aug', adopted: 3, completed: 2, ongoing: 5 },
  { month: 'Sep', adopted: 2, completed: 1, ongoing: 5 },
];

const STUDENT_PARTICIPATION_DATA = [
  { lab: 'Acoustic Sensing Lab', students: 5, hours: 380, fill: '#3b82f6' },
  { lab: 'Edge Vision AI Lab', students: 4, hours: 290, fill: '#06b6d4' },
  { lab: 'Biomass Clean Energy', students: 3, hours: 210, fill: '#10b981' },
  { lab: 'Drone Micro-Climate', students: 2, hours: 160, fill: '#8b5cf6' },
];

const COMPLETION_RATE_DATA = [
  { week: 'W1', targetRate: 70, actualRate: 72 },
  { week: 'W2', targetRate: 72, actualRate: 74 },
  { week: 'W3', targetRate: 74, actualRate: 73 },
  { week: 'W4', targetRate: 75, actualRate: 76 },
  { week: 'W5', targetRate: 76, actualRate: 79 },
  { week: 'W6', targetRate: 78, actualRate: 82 },
];

const RESEARCH_IMPACT_DATA = [
  { quarter: '2025 Q3', citations: 12, downloads: 410, pilots: 1 },
  { quarter: '2025 Q4', citations: 24, downloads: 680, pilots: 2 },
  { quarter: '2026 Q1', citations: 46, downloads: 1120, pilots: 3 },
  { quarter: '2026 Q2', citations: 78, downloads: 1890, pilots: 4 },
  { quarter: '2026 Q3', citations: 104, downloads: 2450, pilots: 5 },
];

export function FacultyProjectAnalytics() {
  const [activeTab, setActiveTab] = React.useState<'monthly' | 'participation' | 'completion' | 'impact'>('monthly');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 animate-pulse rounded-3xl border border-border bg-card/60 p-6" />
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-6">
      {/* Chart Switcher Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Academic Performance Metrics</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Research & Laboratory Analytics
          </h3>
          <p className="text-xs text-muted-foreground">
            Comparative trends across projects, student contributions, and municipal implementation
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'monthly'
                ? 'bg-card text-foreground shadow-xs font-bold border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('participation')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'participation'
                ? 'bg-card text-foreground shadow-xs font-bold border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Student Participation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completion')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'completion'
                ? 'bg-card text-foreground shadow-xs font-bold border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completion Rate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('impact')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === 'impact'
                ? 'bg-card text-foreground shadow-xs font-bold border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Research Impact
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full">
        {activeTab === 'monthly' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_PROJECTS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.94)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="adopted" name="Projects Adopted" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ongoing" name="Active in Lab" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" name="Completed & Transferred" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'participation' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={STUDENT_PARTICIPATION_DATA}
              margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis dataKey="lab" type="category" stroke="#888888" fontSize={11} tickLine={false} width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.94)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="students" name="Student Fellows Assigned" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              <Bar dataKey="hours" name="Research Hours Logged" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'completion' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={COMPLETION_RATE_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="week" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.94)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="targetRate"
                name="Grant Target Velocity (%)"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="actualRate"
                name="Actual Milestone Completion Rate (%)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorActual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'impact' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RESEARCH_IMPACT_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="quarter" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.94)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="citations" name="Peer Citations" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="downloads" name="Dataset Downloads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pilots" name="Municipal Pilots Active" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footer Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60 text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px]">Cumulative Grant Utilized</span>
          <span className="font-bold text-foreground">₹77.5 Lakhs (88%)</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px]">Peer Reviewed Papers</span>
          <span className="font-bold text-foreground">14 Publications</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px]">Civic Technology Transfer</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">3 Municipal Deployments</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px]">Active Lab Scholars</span>
          <span className="font-bold text-primary">14 Fellows</span>
        </div>
      </div>
    </div>
  );
}
