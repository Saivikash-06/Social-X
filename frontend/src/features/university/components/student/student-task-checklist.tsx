'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Check,
  Filter,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/features/shared/components/ui/badge';
import { Button } from '@/features/shared/components/ui/button';
import { useStudentTasks, useUpdateTaskProgress } from '@/features/university/hooks/use-university-queries';
import { ResearchTask } from '@/features/university/types';

interface StudentTaskChecklistProps {
  limit?: number;
  showFilters?: boolean;
}

export function StudentTaskChecklist({
  limit,
  showFilters = true,
}: StudentTaskChecklistProps) {
  const { data: tasks = [], isLoading } = useStudentTasks('usr-student-01');
  const updateMutation = useUpdateTaskProgress();

  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredTasks = React.useMemo(() => {
    let list = tasks;
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (limit) {
      list = list.slice(0, limit);
    }
    return list;
  }, [tasks, statusFilter, limit]);

  const handleToggleStatus = (task: ResearchTask) => {
    const nextStatus: ResearchTask['status'] =
      task.status === 'todo'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'review'
        : task.status === 'review'
        ? 'completed'
        : 'todo';

    updateMutation.mutate(
      {
        taskId: task.id,
        status: nextStatus,
      },
      {
        onSuccess: () => {
          toast.success(
            `Task status updated to "${nextStatus.replace('_', ' ')}"`
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-border bg-card/60 p-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'in_progress', 'todo', 'review', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
          No lab tasks match the selected filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isReview = task.status === 'review';

            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 transition-all ${
                  isDone
                    ? 'border-border/60 bg-muted/20 opacity-80'
                    : 'border-border bg-card hover:border-cyan-500/40 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isReview
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                        : 'border-muted-foreground/40 hover:border-cyan-500'
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5" />}
                    {isReview && <Clock className="h-3 w-3" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-semibold text-foreground ${
                          isDone ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold ${
                          task.priority === 'urgent'
                            ? 'border-red-500/30 text-red-500 bg-red-500/10'
                            : task.priority === 'high'
                            ? 'border-amber-500/30 text-amber-500 bg-amber-500/10'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="capitalize font-medium text-foreground">
                        Status: {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(task)}
                    className="h-7 text-xs"
                  >
                    Update Stage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
