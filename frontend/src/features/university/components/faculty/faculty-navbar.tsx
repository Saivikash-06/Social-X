'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';
import { Button } from '@/features/shared/components/ui/button';
import { ThemeToggle } from '@/features/shared/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/features/shared/components/ui/language-switcher';
import { Breadcrumb, BreadcrumbItem } from '@/features/shared/components/layout/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/shared/components/ui/dropdown-menu';
import { useUniversityStore } from '@/features/university/hooks/use-university-store';
import { useTranslation } from 'react-i18next';

export function FacultyNavbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    role,
    setRole,
    logout,
    toggleMobileSidebar,
    toggleNotificationPanel,
    unreadNotificationsCount,
  } = useUniversityStore();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 2) return [{ label: t("nav.faculty_portal", "Faculty Dashboard") }];

    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("common.roles.faculty", "Faculty"), href: '/university/faculty' },
    ];

    const sub = segments[2];
    if (sub === 'projects') {
      breadcrumbs.push({ label: t("nav.projects", "Research Projects") });
    } else if (sub === 'teams') {
      breadcrumbs.push({ label: t("nav.teams", "Student Teams") });
    } else if (sub === 'proposals') {
      breadcrumbs.push({ label: t("nav.municipal_proposals", "Municipal Proposals") });
    } else if (sub === 'approvals') {
      breadcrumbs.push({ label: t("nav.milestone_approvals", "Milestone Approvals") });
    } else if (sub === 'progress') {
      breadcrumbs.push({ label: t("common.labels.inProgress", "Progress Tracker") });
    } else if (sub === 'reports') {
      breadcrumbs.push({ label: t("nav.reports", "Reports & Analytics") });
    } else if (sub === 'notifications') {
      breadcrumbs.push({ label: t("nav.notifications", "Notifications") });
    } else if (sub === 'profile') {
      breadcrumbs.push({ label: t("nav.profile", "Faculty Profile") });
    } else if (sub === 'settings') {
      breadcrumbs.push({ label: t("nav.settings", "Settings") });
    } else {
      breadcrumbs.push({ label: sub.charAt(0).toUpperCase() + sub.slice(1) });
    }

    return breadcrumbs;
  };

  const handleSwitchToStudent = () => {
    setRole('student');
    if (typeof document !== 'undefined') {
      document.cookie = 'social_x_university_role=student; path=/; max-age=604800; SameSite=Lax';
    }
    router.push('/university/student');
  };

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'social_x_university_role=; path=/; max-age=0';
      document.cookie = 'social_x_university_token=; path=/; max-age=0';
    }
    logout();
    router.push('/login/university/faculty');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={toggleMobileSidebar}
          aria-label={t("common.buttons.toggleMenu", "Open sidebar")}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Repository Link */}
        <Button asChild variant="outline" size="sm" className="hidden md:inline-flex gap-1.5 text-xs">
          <Link href="/university/repository">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {t("university.faculty.proposals.title", "Research Repository")}
          </Link>
        </Button>

        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNotificationPanel}
          className="relative rounded-xl text-muted-foreground hover:text-foreground"
          aria-label={t("nav.notifications", "Notifications")}
        >
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'FA'}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {currentUser?.name || 'Dr. Elena Rostova'}
                  </p>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {t("common.roles.faculty", "Faculty")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.email || 'elena.rostova@stanford.edu'}
                </p>
                <p className="text-[11px] text-muted-foreground/80 font-medium">
                  {currentUser?.department || 'Civil & Environmental Engineering'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/university/profile" className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                {t("nav.profile", "Faculty Profile")}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/university/settings" className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                {t("nav.settings", "Portal Settings")}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSwitchToStudent} className="cursor-pointer gap-2 text-cyan-600 dark:text-cyan-400">
              <ArrowRightLeft className="h-4 w-4" />
              {t("nav.student_portal", "Switch to Student View")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("common.buttons.logout", "Sign Out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
