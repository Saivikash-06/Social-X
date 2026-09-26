'use client';

import * as React from 'react';
import {
  User,
  Mail,
  School,
  Building2,
  Award,
  BookOpen,
  Edit,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import { Badge } from '@/features/shared/components/ui/badge';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';

export default function FacultyProfilePage() {
  const { currentUser, setAuth } = useUniversityStore();
  const [isEditing, setIsEditing] = React.useState(false);

  const [name, setName] = React.useState(currentUser?.name || 'Dr. Elena Rostova');
  const [department, setDepartment] = React.useState(
    currentUser?.department || 'Civil & Environmental Engineering'
  );
  const [institution, setInstitution] = React.useState(
    currentUser?.institution || 'Stanford University'
  );
  const [officeHours, setOfficeHours] = React.useState('Tue & Thu: 2:00 PM – 5:00 PM');
  const [specializations, setSpecializations] = React.useState(
    'Urban Hydrology, Smart Grid Resilience, Edge IoT Sensors'
  );

  const handleSave = () => {
    if (currentUser) {
      setAuth({
        ...currentUser,
        name,
        department,
        institution,
      });
    }
    setIsEditing(false);
    toast.success('Faculty profile updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <User className="h-7 w-7 text-primary" />
            Faculty Academic Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Academic credentials, research chair details, and institutional affiliation
          </p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-1.5 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-1.5">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border/80 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary font-bold text-2xl border-2 border-primary/20 shadow-inner">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <Badge variant="default" className="bg-primary/20 text-primary uppercase text-[10px]">
                Tenured Professor
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{department}</p>
            <p className="text-xs text-muted-foreground">{institution}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Full Legal / Academic Name
            </label>
            <Input
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Institutional Email
            </label>
            <Input disabled value={currentUser?.email || 'elena.rostova@stanford.edu'} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Academic Department
            </label>
            <Input
              disabled={!isEditing}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Affiliated Institution
            </label>
            <Input
              disabled={!isEditing}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Primary Research Specializations
            </label>
            <Input
              disabled={!isEditing}
              value={specializations}
              onChange={(e) => setSpecializations(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Student Advising & Lab Office Hours
            </label>
            <Input
              disabled={!isEditing}
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
