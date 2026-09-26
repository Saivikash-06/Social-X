'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { useProposals } from '@/features/university/hooks/use-university-queries';
import { ResearchProposal } from '@/features/university/types';

export default function FacultyProposalsPage() {
  const { data: proposals = [], isLoading } = useProposals();
  const [adoptingId, setAdoptingId] = React.useState<string | null>(null);
  const [adoptedList, setAdoptedList] = React.useState<string[]>([]);

  const handleAdopt = (proposal: ResearchProposal) => {
    setAdoptingId(proposal.id);
    setTimeout(() => {
      setAdoptedList((prev) => [...prev, proposal.id]);
      setAdoptingId(null);
      toast.success(
        `Adopted Proposal: "${proposal.title}". Your laboratory has initiated project onboarding!`
      );
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Civic Problem Statements & Municipal Grants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileCheck2 className="h-7 w-7 text-primary" />
            Municipal Innovation Proposals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore verified citizen-escalated urban challenges seeking academic research and university lab pilots
          </p>
        </div>
      </div>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-border bg-card/60 p-6"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {proposals.map((proposal) => {
            const isAdopted =
              adoptedList.includes(proposal.id) || proposal.status === 'adopted';

            return (
              <div
                key={proposal.id}
                className={`rounded-2xl border bg-card p-6 shadow-xs transition-all hover:shadow-md ${
                  isAdopted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {proposal.department}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {proposal.submittedBy}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Deadline: {new Date(proposal.deadline || proposal.submittedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {proposal.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        <DollarSign className="h-3.5 w-3.5" />
                        Municipal Grant: ${(proposal.estimatedBudget).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        Target Execution: 6-12 Months
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 border-border/80 pt-4 lg:pt-0">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        isAdopted
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isAdopted ? 'Adopted by Faculty' : 'Open for Adoption'}
                    </span>

                    <Button
                      onClick={() => handleAdopt(proposal)}
                      disabled={isAdopted || adoptingId === proposal.id}
                      isLoading={adoptingId === proposal.id}
                      className={
                        isAdopted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-default'
                          : 'bg-primary hover:bg-primary/90'
                      }
                    >
                      {isAdopted ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Adopted
                        </>
                      ) : (
                        <>
                          Adopt Research Proposal
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
