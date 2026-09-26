'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  FolderGit2,
  Users,
  FileCheck2,
  CheckSquare,
  LineChart,
  FileSpreadsheet,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import { ConfirmationDialog } from '@/features/shared/components/feedback/confirmation-dialog';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useTranslation } from 'react-i18next';

const FACULTY_NAV_ITEMS = [
  { key: 'nav.dashboard', label: 'Dashboard', href: '/university/faculty', icon: LayoutDashboard },
  {
    key: 'nav.projects',
    label: 'Projects',
    href: '/university/projects',
    icon: FolderGit2,
    badge: '5 Active',
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
    label: 'Innovation Lab',
    href: '/university/innovation',
    icon: Sparkles,
    badge: 'New',
  },
  { key: 'nav.teams', label: 'Student Teams', href: '/university/teams', icon: Users },
  { key: 'nav.credits', label: 'Credits & Hall of Fame', href: '/university/credits', icon: FileSpreadsheet },
  { key: 'nav.profile', label: 'Faculty Profile', href: '/university/profile', icon: User },
  { key: 'nav.settings', label: 'Settings', href: '/university/settings', icon: Settings },
  {
    key: 'nav.milestone_approvals',
    label: 'Milestone Approvals',
    href: '/university/faculty/approvals',
    icon: CheckSquare,
    badge: '2 Pending',
    badgeVariant: 'destructive' as const,
  },
  {
    key: 'nav.municipal_proposals',
    label: 'Municipal Proposals',
    href: '/university/faculty/proposals',
    icon: FileCheck2,
    badge: '2 Open',
    badgeVariant: 'secondary' as const,
  },
  { key: 'nav.analytics', label: 'Reports & Analytics', href: '/university/faculty/reports', icon: LineChart },
];

export function FacultySidebar() {
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

  const handleSwitchToStudent = () => {
    setRole('student');
    if (typeof document !== 'undefined') {
      document.cookie = 'social_x_university_role=student; path=/; max-age=604800; SameSite=Lax';
    }
    router.push('/university/student');
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

      {/* Main Sidebar */}
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
            href="/university/faculty"
            className={cn(
              'flex items-center gap-3 transition-opacity',
              isSidebarCollapsed && 'lg:hidden'
            )}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <School className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  SOCIAL-X
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                    {t("common.roles.faculty", "Faculty")}
                  </span>
                </span>
                <span className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {t("nav.faculty_portal", "Faculty Portal")}
                </span>
              </div>
            )}
          </Link>

          {isSidebarCollapsed && (
            <div className="hidden lg:flex w-full justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <School className="h-5 w-5" />
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
          {FACULTY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/university/faculty'
                ? pathname === '/university/faculty' || pathname === '/university/faculty/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
                title={isSidebarCollapsed ? t(item.key, item.label) : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
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
              onClick={handleSwitchToStudent}
              className="flex w-full items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs font-medium text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>{t("nav.student_portal", "Switch to Student View")}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">
                {t("common.roles.student", "Student")}
              </span>
            </button>
          ) : (
            <button
              onClick={handleSwitchToStudent}
              title={t("nav.student_portal", "Switch to Student View")}
              className="flex h-9 w-full items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20"
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                : 'DR'}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">
                  {currentUser?.name || 'Dr. Elena Rostova'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {currentUser?.institution || 'Stanford University'}
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
        title={t("dialog.confirmLogout", "Sign Out of Faculty Portal?")}
        description={t("dialog.confirmLogoutDesc", "Are you sure you want to end your current faculty advisory session? Any unsaved project grade reviews or notes may be lost.")}
        confirmLabel={t("common.buttons.logout", "Sign Out")}
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}
