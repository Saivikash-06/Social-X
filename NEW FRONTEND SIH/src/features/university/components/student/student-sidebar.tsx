'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  UploadCloud,
  Calendar,
  MessageSquare,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { ConfirmationDialog } from '@/features/shared/components/feedback/confirmation-dialog';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useTranslation } from 'react-i18next';

const STUDENT_NAV_ITEMS = [
  { key: 'nav.dashboard', label: 'Dashboard', href: '/university/student', icon: LayoutDashboard },
  {
    key: 'nav.projects',
    label: 'Projects',
    href: '/university/projects',
    icon: FolderGit2,
    badge: '3 Active',
  },
  {
    key: 'nav.research',
    label: 'Research Hub',
    href: '/university/research',
    icon: BookOpen,
    badge: '3 Papers',
  },
  {
    key: 'nav.prototypes',
    label: 'Innovation Challenges',
    href: '/university/innovation',
    icon: Sparkles,
    badge: 'Active',
  },
  { key: 'nav.teams', label: 'My Teams', href: '/university/teams', icon: Users },
  {
    key: 'nav.credits',
    label: 'Credit Score & Badges',
    href: '/university/credits',
    icon: Award,
    badge: '18 Cred',
  },
  { key: 'nav.profile', label: 'Student Profile', href: '/university/profile', icon: User },
  { key: 'nav.settings', label: 'Settings', href: '/university/settings', icon: Settings },
  {
    key: 'nav.lab_tasks',
    label: 'Lab Tasks',
    href: '/university/student/tasks',
    icon: CheckSquare,
    badge: '3 Due',
    badgeVariant: 'secondary' as const,
  },
  {
    key: 'nav.upload_deliverables',
    label: 'Upload Deliverables',
    href: '/university/student/uploads',
    icon: UploadCloud,
  },
  { key: 'nav.milestone_timeline', label: 'Milestone Timeline', href: '/university/student/timeline', icon: Calendar },
  {
    key: 'nav.advisor_discussion',
    label: 'Advisor Discussion',
    href: '/university/student/messages',
    icon: MessageSquare,
  },
];

export function StudentSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    logout,
    setRole,
  } = useUniversityStore();

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'social_x_university_role=; path=/; max-age=0';
      document.cookie = 'social_x_university_token=; path=/; max-age=0';
    }
    logout();
    setShowLogoutDialog(false);
    router.push('/university-login');
  };

  const handleSwitchToFaculty = () => {
    setRole('faculty');
    if (typeof document !== 'undefined') {
      document.cookie = 'social_x_university_role=faculty; path=/; max-age=604800; SameSite=Lax';
    }
    router.push('/university/faculty');
  };


  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Student Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border/80 bg-card transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-20' : 'w-72',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-4">
          <Link
            href="/university/student"
            className={cn(
              'flex items-center gap-3 transition-opacity',
              isSidebarCollapsed && 'lg:hidden'
            )}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  SOCIAL-X
                  <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                    {t("common.roles.student", "Student")}
                  </span>
                </span>
                <span className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {t("university.portalTitle", "Research Portal")}
                </span>
              </div>
            )}
          </Link>

          {isSidebarCollapsed && (
            <div className="hidden lg:flex w-full justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label={isSidebarCollapsed ? t("common.buttons.expandSidebar", "Expand sidebar") : t("common.buttons.collapseSidebar", "Collapse sidebar")}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {STUDENT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/university/student'
                ? pathname === '/university/student' || pathname === '/university/student/dashboard'
                : pathname.startsWith(item.href);


            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
                title={isSidebarCollapsed ? t(item.key, item.label) : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                    isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />

                {!isSidebarCollapsed && (
                  <span className="flex-1 truncate">{t(item.key, item.label)}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <Badge
                    variant={item.badgeVariant || (isActive ? 'secondary' : 'default')}
                    className="text-[10px] px-1.5 py-0 h-5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Quick Switcher & User Profile */}
        <div className="border-t border-border/80 p-3 space-y-2">
          {/* Quick role switch */}
          {!isSidebarCollapsed ? (
            <button
              onClick={handleSwitchToFaculty}
              className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>{t("nav.faculty_portal", "Switch to Faculty View")}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-primary">
                {t("common.roles.faculty", "Faculty")}
              </span>
            </button>
          ) : (
            <button
              onClick={handleSwitchToFaculty}
              title={t("nav.faculty_portal", "Switch to Faculty View")}
              className="flex h-9 w-full items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          )}

          {/* User Preview */}
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-2 transition-colors bg-muted/40',
              isSidebarCollapsed && 'justify-center p-1'
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold text-xs border border-cyan-500/20">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                : 'ST'}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">
                  {currentUser?.name || 'Alex Rivera'}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  {currentUser?.rollNumber || 'CS-2024-8902'}
                </p>
              </div>
            )}

            {!isSidebarCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLogoutDialog(true)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                aria-label={t("common.buttons.logout", "Logout")}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={t("dialog.confirmLogout", "Sign Out of Student Portal?")}
        description={t("dialog.confirmLogoutDesc", "Are you sure you want to end your active research lab session? Any unfinished artifact uploads should be saved.")}
        confirmLabel={t("common.buttons.logout", "Sign Out")}
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}
