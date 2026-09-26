'use client';

import * as React from 'react';
import {
  Rocket,
  FileText,
  CheckCircle2,
  Trophy,
  HeartHandshake,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/features/shared/components/ui/badge';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  creditsEarned: number;
  icon: React.ElementType;
  iconColor: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    date: 'Sep 12, 2026',
    title: 'Deployed Solar Mesh Microgrid in District Health Clinic',
    description: 'Field prototype deployed with real-time solar inverter telemetry and battery safety monitoring for rural ward.',
    category: 'Solution Deployment',
    creditsEarned: 75,
    icon: Rocket,
    iconColor: 'text-violet-500 bg-violet-500/10 border-violet-500/30',
  },
  {
    id: 'm2',
    date: 'Aug 29, 2026',
    title: 'Peer-Reviewed Research Paper Accepted at IEEE CIVIC-2026',
    description: 'Co-authored "Decentralized Edge Telemetry for Real-Time Water Potability Governance" with faculty advisor Dr. Elizabeth Stone.',
    category: 'Research Contribution',
    creditsEarned: 85,
    icon: FileText,
    iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  },
  {
    id: 'm3',
    date: 'Aug 14, 2026',
    title: '1st Runner-Up at Smart Governance National Hackathon',
    description: 'Developed automated pothole and drainage blockage triage pipeline using edge computer vision.',
    category: 'Hackathons',
    creditsEarned: 90,
    icon: Trophy,
    iconColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  },
  {
    id: 'm4',
    date: 'Jul 22, 2026',
    title: 'Successfully Verified 12 Citizen Municipal Grievances',
    description: 'Conducted on-site inspection for storm drainage flooding and validated contractor work order fulfillment.',
    category: 'Verification',
    creditsEarned: 60,
    icon: CheckCircle2,
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'm5',
    date: 'Jun 18, 2026',
    title: 'Led NSS Clean River Watershed & Reforestation Drive',
    description: 'Mobilized 45 student volunteers for riparian buffer tree plantation and environmental soil sampling.',
    category: 'NSS Activities',
    creditsEarned: 60,
    icon: HeartHandshake,
    iconColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
  },
];

export function AchievementTimeline() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Contribution & Achievement Timeline
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Chronological milestone log of verified civic deployments, hackathon victories, and academic publications
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-border/80 space-y-6 sm:space-y-8 my-4">
        {MILESTONES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              {/* Dot on the timeline */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border ${item.iconColor} bg-card shadow-sm group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>

              {/* Card Container */}
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs hover:border-cyan-500/40 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {item.category}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    <Sparkles className="h-3 w-3" />
                    +{item.creditsEarned} Credits
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
