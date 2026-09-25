'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search, Check, Shield, GraduationCap, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useAssignStudentsToProject } from '@/features/university/hooks/use-university-queries';
import { ResearchProject, UniversityUser } from '@/features/university/types';

interface AssignStudentsModalProps {
  project: ResearchProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignStudentsModal({
  project,
  isOpen,
  onClose,
}: AssignStudentsModalProps) {
  const { availableStudents } = useUniversityStore();
  const assignMutation = useAssignStudentsToProject();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([]);
  const [studentRole, setStudentRole] = React.useState('Research Associate');
  const [weeklyHours, setWeeklyHours] = React.useState('15');

  // Initialize selected students when modal opens
  React.useEffect(() => {
    if (project) {
      setSelectedStudentIds(project.assignedStudentIds || []);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedStudentIds.length === 0) {
      toast.warning('Please select at least one student researcher.');
      return;
    }

    assignMutation.mutate(
      {
        projectId: project.id,
        studentIds: selectedStudentIds,
        role: studentRole,
      },
      {
        onSuccess: () => {
          toast.success(`Updated student roster for ${project.title}.`);
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to assign students.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Assign Student Researchers
              </h2>
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {project.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Assignment Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Primary Team Role
              </label>
              <select
                value={studentRole}
                onChange={(e) => setStudentRole(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Lead Student Researcher">Lead Student Researcher</option>
                <option value="Research Associate">Research Associate</option>
                <option value="Data & ML Analyst">Data & ML Analyst</option>
                <option value="Embedded Systems Engineer">Embedded Systems Engineer</option>
                <option value="Field Surveyor">Field Surveyor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Weekly Lab Commitment
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="5"
                  max="40"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="pl-9"
                  placeholder="Hours per week"
                />
              </div>
            </div>
          </div>

          {/* Student Search & Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Candidates ({selectedStudentIds.length} Selected)
              </label>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Students List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : 'border-border/80 bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {student.name}
                          </p>
                          {student.rollNumber && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {student.rollNumber}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {student.email} • {student.department}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Assigned students receive automatic laboratory access and milestone assignments.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              isLoading={assignMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              Update Lab Team ({selectedStudentIds.length})
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
