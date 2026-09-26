import * as React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, ExternalLink } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/60 text-card-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                SOCIAL<span className="text-primary">-X</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              An AI-powered societal innovation and smart governance platform
              bridging citizens, administration, academia, industry, and NGOs
              to accelerate solutions to local and national challenges.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Certified Smart Governance & Open Data Compliance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  AI Multimodal Hub
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Role Portals
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Citizen Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Stakeholders
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login/citizen" className="hover:text-primary transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/70 flex items-center gap-1">
                  Municipal Departments
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm">Module 2</span>
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 flex items-center gap-1">
                  University R&D
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm">Module 3</span>
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/70 flex items-center gap-1">
                  NGO Action Group
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm">Module 4</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Grievance FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Help Desk & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Social-X Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for societal transformation and civic empowerment
          </p>
        </div>
      </div>
    </footer>
  );
}
