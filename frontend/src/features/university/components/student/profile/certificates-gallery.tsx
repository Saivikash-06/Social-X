'use client';

import * as React from 'react';
import {
  Award,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { StudentCertificate } from '../../../types/student-contribution';
import { Button } from '@/features/shared/components/ui/button';
import { Badge } from '@/features/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/features/shared/components/ui/dialog';

interface CertificatesGalleryProps {
  certificates: StudentCertificate[];
  studentName: string;
}

export function CertificatesGallery({ certificates, studentName }: CertificatesGalleryProps) {
  const [selectedCert, setSelectedCert] = React.useState<StudentCertificate | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<string>('All');
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const categories = [
    'All',
    'Civic Deployment',
    'Academic Research',
    'Civic Service',
    'Innovation Hackathon',
  ];

  const filteredCerts = certificates.filter((cert) => {
    return filterCategory === 'All' || cert.category === filterCategory;
  });

  const handleDownload = (cert: StudentCertificate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDownloadingId(cert.id);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success(`Downloaded Certificate: ${cert.name}`, {
        description: `Verified Credential ID: ${cert.credentialId}`,
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Award className="h-6 w-6 text-violet-500" />
              Verified Micro-Credentials & Certificates
            </h2>
            <Badge variant="outline" className="text-xs font-mono font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30">
              {certificates.length} Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tamper-proof verifiable credentials issued by government ministries, universities, and partner agencies
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.map((cert) => {
          const isDownloading = downloadingId === cert.id;

          return (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group relative cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-md hover:border-violet-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Badge & Credential Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>

                {/* Certificate Name */}
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                  {cert.name}
                </h3>

                {/* Issued By */}
                <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{cert.issuedBy}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>Issued {cert.issueDate}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Credential ID & Download Button */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground truncate">
                  ID: {cert.credentialId}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleDownload(cert, e)}
                  disabled={isDownloading}
                  className="h-8 text-xs rounded-xl gap-1.5 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/30"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isDownloading ? 'Saving...' : 'Download'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-sm font-semibold text-muted-foreground">No certificates found in this category.</p>
        </div>
      )}

      {/* Certificate Preview Modal */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="sm:max-w-lg rounded-3xl border-border bg-card">
            <DialogHeader>
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Official Verified Credential</span>
              </div>
              <DialogTitle className="text-lg font-black text-foreground">
                {selectedCert.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Conferred to {studentName} in recognition of exemplary societal innovation and civic contribution.
              </DialogDescription>
            </DialogHeader>

            {/* Certificate Frame Preview */}
            <div className="my-3 p-6 rounded-2xl border-2 border-dashed border-violet-500/40 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Award className="h-7 w-7" />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Certificate of Honor
                </div>
                <div className="text-base font-black text-foreground mt-1">
                  {studentName}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  has demonstrated verified excellence in <strong className="text-foreground">{selectedCert.name}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="text-left">
                  <span className="block font-semibold text-foreground">{selectedCert.issuedBy}</span>
                  <span>Authority</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-foreground">{selectedCert.issueDate}</span>
                  <span>Date of Issue</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-mono text-muted-foreground">
                SHA-256: {selectedCert.credentialId}-VERIFIED
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCert(null)}
                  className="rounded-xl text-xs h-9"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownload(selectedCert)}
                  className="rounded-xl text-xs h-9 bg-violet-600 hover:bg-violet-700 text-white gap-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
