"use client";

import * as React from "react";
import { Award, Download, CheckCircle2, ShieldCheck, Search, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import { useNgoCertificates } from "@/features/ngo/hooks/use-ngo-queries";
import { toast } from "sonner";

export default function NgoCertificatesPage() {
  const { data: certificates } = useNgoCertificates();
  const [search, setSearch] = React.useState("");

  const filtered = (certificates || []).filter(
    (c) =>
      c.volunteerName.toLowerCase().includes(search.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(search.toLowerCase()) ||
      c.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadCert = (code: string) => {
    toast.success(`Downloading certificate verification packet for [${code}]`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>Issued Volunteer Certificates & Credentials</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Cryptographically signed civic certificates backed by geotagged field activity telemetry
        </p>
      </div>

      {/* Filter / Search */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by volunteer name, verification code (e.g. SX-NGO-V-99421), project..."
            className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
          />
        </div>
      </Card>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((cert) => (
          <Card key={cert.id} className="rounded-3xl border-border/80 bg-card shadow-sm hover:border-emerald-500/50 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                  {cert.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{cert.issueDate}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">{cert.volunteerName}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{cert.projectName}</p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Logged Hours:</span>
                  <span className="font-bold text-foreground">{cert.hoursLogged} hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification Code:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cert.verificationCode}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadCert(cert.verificationCode)}
                className="w-full rounded-xl text-xs font-bold gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Verified PDF</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
