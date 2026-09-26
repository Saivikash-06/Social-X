"use client";

import * as React from "react";
import {
  Database,
  Search,
  Download,
  Eye,
  Calendar,
  Layers,
  FileCode,
  HardDrive,
  Table,
} from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useDatasets } from "@/features/research/hooks/use-research-queries";
import { DatasetItem } from "@/features/research/types";
import { toast } from "sonner";

export default function ResearchDatasetsPage() {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [selectedDataset, setSelectedDataset] = React.useState<DatasetItem | null>(null);

  const { data: datasets, isLoading } = useDatasets({
    search: search || undefined,
    category: categoryFilter,
  });

  const handleDownload = (d: DatasetItem) => {
    toast.success(`Preparing high-throughput download for ${d.name} (${d.fileSize})...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Municipal Open Datasets & Sensor Streams</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Curated telemetry feeds, acoustic hydrophone pings, and GIS point clouds for civic ML benchmarking
        </p>
      </div>

      {/* Filter / Search */}
      <Card className="rounded-3xl border-border/80 bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets by schema, sensor tag, or domain..."
              className="pl-9 rounded-2xl border-border/80 bg-muted/30 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {["all", "Hydrology", "Transportation", "Energy"].map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl text-xs font-semibold ${
                  categoryFilter === cat ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""
                }`}
              >
                {cat === "all" ? "All Domains" : cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Datasets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(datasets || []).map((ds) => (
          <Card key={ds.id} className="rounded-3xl border-border/80 bg-card shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-[10px]">
                  {ds.category}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {ds.format} • {ds.fileSize}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground leading-snug">{ds.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {ds.description}
                </p>
              </div>

              {/* Data Specs */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Record Volume</span>
                  <span className="font-bold text-foreground">{ds.recordCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Verified Source</span>
                  <span className="font-semibold text-foreground truncate block">{ds.source}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Last Updated: {ds.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDataset(ds)}
                  className="rounded-xl text-xs gap-1.5 flex-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Data</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(ds)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 flex-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dataset Preview Dialog */}
      <Dialog open={!!selectedDataset} onOpenChange={(open) => !open && setSelectedDataset(null)}>
        <DialogContent className="max-w-3xl rounded-3xl p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="text-[10px]">{selectedDataset?.format}</Badge>
              <Badge variant="outline" className="text-[10px]">{selectedDataset?.fileSize}</Badge>
            </div>
            <DialogTitle className="text-xl font-bold">{selectedDataset?.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Source: {selectedDataset?.source} • {selectedDataset?.recordCount}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground">{selectedDataset?.description}</p>

            {/* Schema Columns */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Table className="h-4 w-4 text-indigo-500" />
                <span>Schema Column Definitions:</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDataset?.schemaColumns.map((col) => (
                  <div key={col.key} className="px-2.5 py-1 rounded-xl bg-muted border border-border text-[11px]">
                    <span className="font-mono font-bold text-foreground">{col.key}</span>{" "}
                    <span className="text-muted-foreground">({col.type})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Table Rows */}
            <div className="space-y-1.5 pt-2">
              <h4 className="font-bold text-foreground">Sample First Rows Preview:</h4>
              <div className="overflow-x-auto rounded-2xl border border-border/80">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-muted/60 border-b border-border text-muted-foreground font-mono">
                    <tr>
                      {selectedDataset?.schemaColumns.map((c) => (
                        <th key={c.key} className="p-2.5 font-bold">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {selectedDataset?.previewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        {selectedDataset?.schemaColumns.map((c) => (
                          <td key={c.key} className="p-2.5 font-mono text-foreground">
                            {String(row[c.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedDataset(null)} className="rounded-xl">
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedDataset) handleDownload(selectedDataset);
              }}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download Complete Dataset</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
