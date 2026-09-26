"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { key: "landing_features", label: "Features", href: "/features" },
  { key: "landing_how_it_works", label: "How It Works", href: "/how-it-works" },
  { key: "landing_about", label: "About", href: "/about" },
  { key: "landing_faq", label: "FAQ", href: "/faq" },
  { key: "landing_contact", label: "Contact", href: "/contact" },
];

export function LandingNavbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/80 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-foreground flex items-center gap-1.5">
              SOCIAL<span className="text-primary">-X</span>
            </span>
            <span className="text-[10px] tracking-wider font-semibold uppercase text-muted-foreground">
              {t("nav.operations_ai", "Smart Governance & AI")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5",
                  isActive
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                {t(link.key, link.label)}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons, Language & Theme */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="outline" className="rounded-xl font-medium">
            <Link href="/login">{t('role_login', 'Role Login')}</Link>
          </Button>
          <Button asChild variant="gradient" className="rounded-xl gap-1.5 shadow-sm">
            <Link href="/register">
              <span>{t('citizen_sign_up', 'Citizen Sign Up')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t(link.key, link.label)}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-border/80 flex flex-col gap-2.5">
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                {t('role_login', 'Role Login')}
              </Link>
            </Button>
            <Button asChild variant="gradient" className="w-full rounded-xl">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                {t('citizen_sign_up', 'Citizen Sign Up')}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
