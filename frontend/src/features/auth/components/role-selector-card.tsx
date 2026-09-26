"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  ShieldAlert,
  ArrowRight,
  Lock,
  FlaskConical,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { Role } from "@/features/shared/types/common";

export interface RoleConfig {
  role: Role;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  isImplemented: boolean;
  href: string;
  moduleNotice?: string;
}

export const ROLES_CONFIG: RoleConfig[] = [
  {
    role: "citizen",
    title: "Citizen Portal",
    description:
      "Report local grievances via multimodal inputs, track live resolution timelines, and collaborate with municipal authorities.",
    badge: "Public Access • Live",
    icon: <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
    isImplemented: true,
    href: "/login/citizen",
  },
  {
    role: "government",
    title: "Government & Municipality",
    description:
      "Review incoming municipal grievances, monitor department SLA countdowns, and dispatch field engineering teams.",
    badge: "Official Portal • Live",
    icon: <Building2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
    isImplemented: true,
    href: "/official-login",
  },
  {
    role: "university",
    title: "University & Academia",
    description:
      "Access anonymized societal dataset streams to develop R&D prototypes, thesis research, and pilot technological solutions.",
    badge: "Academia • Live",
    icon: <GraduationCap className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
    isImplemented: true,
    href: "/login/university",
  },
  {
    role: "industry",
    title: "Industry & Corporate CSR",
    description:
      "Partner with cities, sponsor civic modernization projects, and track measurable environmental & social CSR milestones.",
    badge: "Enterprise • Live",
    icon: <Briefcase className="h-7 w-7 text-amber-600 dark:text-amber-400" />,
    isImplemented: true,
    href: "/login/industry",
  },
  {
    role: "ngo",
    title: "Civil Society & Volunteers",
    description:
      "Mobilize ground volunteer squads, execute civic field interventions, log geotagged evidence, and track community impact.",
    badge: "Civil Society • Live",
    icon: <Users className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
    isImplemented: true,
    href: "/login/ngo",
  },
  {
    role: "research",
    title: "Research Organization",
    description:
      "Access municipal telemetry streams, publish peer-reviewed papers, license civic patents, and pilot TRL 1-9 innovations.",
    badge: "R&D Institute • Live",
    icon: <FlaskConical className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
    isImplemented: true,
    href: "/login/research",
  },
  {
    role: "super_admin",
    title: "Super Administrator",
    description:
      "System configuration, AI pipeline monitoring, role provisioning, and platform security oversight.",
    badge: "Platform Owner • Live",
    icon: <ShieldAlert className="h-7 w-7 text-rose-600 dark:text-rose-400" />,
    isImplemented: true,
    href: "/login/admin",
  },
];

interface RoleSelectorCardProps {
  config: RoleConfig;
  onSelectNonImplemented: (config: RoleConfig) => void;
}

export function RoleSelectorCard({
  config,
  onSelectNonImplemented,
}: RoleSelectorCardProps) {
  if (config.isImplemented) {
    return (
      <Link href={config.href} className="group block focus:outline-none">
        <Card className="h-full border-border/80 bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-xl group-hover:-translate-y-1 rounded-3xl relative overflow-hidden ring-2 ring-primary/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <CardContent className="p-7 flex flex-col h-full justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-primary group-hover:scale-110 transition-transform">
                  {config.icon}
                </div>
                <Badge variant="success" className="px-2.5 py-1 text-xs">
                  {config.badge}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  <span>{config.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {config.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-sm font-semibold text-primary">
              <span>{config.role === "citizen" ? "Continue as Citizen" : `Enter ${config.title}`}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <div
      onClick={() => onSelectNonImplemented(config)}
      className="cursor-pointer group block"
    >
      <Card className="h-full border-border/60 bg-card/60 transition-all duration-200 hover:border-border hover:bg-card/90 rounded-3xl opacity-85 hover:opacity-100">
        <CardContent className="p-7 flex flex-col h-full justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                {config.icon}
              </div>
              <Badge variant="secondary" className="px-2.5 py-1 text-xs">
                {config.badge}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span>{config.title}</span>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {config.description}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Enterprise Module Notice</span>
            <span>View Info →</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
