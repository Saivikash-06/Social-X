"use client";

import * as React from "react";
import {
  Users,
  Search,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Lock,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Card } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/features/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { Label } from "@/features/shared/components/ui/label";
import {
  useGovernmentOfficers,
  useGovernmentMutations,
} from "@/features/government/hooks/use-government-queries";
import { GovernmentOfficer } from "@/features/government/types";
import { toast } from "sonner";

export default function GovernmentOfficersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("all");
  const [revealedKeys, setRevealedKeys] = React.useState<Record<string, boolean>>({});

  // Reset password dialog state
  const [passwordResetOfficer, setPasswordResetOfficer] = React.useState<GovernmentOfficer | null>(null);
  const [newPassword, setNewPassword] = React.useState("");

  const { data: officers, isLoading, refetch } = useGovernmentOfficers();
  const {
    toggleOfficerStatusMutation,
    regeneratePassKeyMutation,
  } = useGovernmentMutations();

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Official Pass Key copied to clipboard");
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetOfficer || !newPassword.trim()) return;
    toast.success(`Password updated for ${passwordResetOfficer.name}`);
    setPasswordResetOfficer(null);
    setNewPassword("");
  };

  const filteredOfficers = React.useMemo(() => {
    let list = officers || [];
    if (deptFilter !== "all") {
      list = list.filter((o) => o.department === deptFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.designation.toLowerCase().includes(q) ||
          o.officialPassKey.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q)
      );
    }
    return list;
  }, [officers, deptFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Official Government Officers Directory
            </h1>
            <Badge className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 text-xs font-mono">
              {officers?.length ?? 0} Provisioned
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            View certified line officers, audit access credentials, and manage state pass keys.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-3xl border-border/80 p-4 shadow-sm bg-card">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search officer name, designation, pass key, email, or district..."
              className="pl-9 rounded-xl border-border/80 text-xs bg-muted/30 focus-visible:ring-indigo-500"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs rounded-xl border border-border/80 bg-background p-2.5 outline-none font-medium text-foreground w-full sm:w-auto"
          >
            <option value="all">All Departments</option>
            <option value="Municipal Administration & Water Supply">Water Supply (MAWS)</option>
            <option value="Chennai Municipal Corporation">Chennai Corporation</option>
            <option value="Public Works Department (PWD)">Public Works (PWD)</option>
            <option value="Highways & Minor Ports (Roads)">Highways & Roads</option>
            <option value="Health & Family Welfare">Health & Sanitation</option>
          </select>
        </div>
      </Card>

      {/* Officer Table */}
      <Card className="rounded-3xl border-border/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="p-3.5">Officer Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Designation</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Official Pass Key</th>
                <th className="p-3.5">Last Login</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOfficers.map((officer) => {
                const isRevealed = !!revealedKeys[officer.id];
                return (
                  <tr key={officer.id} className="hover:bg-muted/30 transition-colors">
                    {/* Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {officer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {officer.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {officer.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                      {officer.email}
                    </td>

                    {/* Department */}
                    <td className="p-3.5 font-medium text-foreground max-w-[150px] truncate">
                      {officer.department}
                    </td>

                    {/* Designation */}
                    <td className="p-3.5 text-muted-foreground max-w-[160px] truncate">
                      <p className="text-foreground font-medium truncate">
                        {officer.designation}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {officer.district} District
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <Badge
                        variant={officer.status === "active" ? "success" : "destructive"}
                        className="text-[10px]"
                      >
                        {officer.status}
                      </Badge>
                    </td>

                    {/* Pass Key */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="font-bold text-indigo-700 dark:text-indigo-400">
                          {isRevealed
                            ? officer.officialPassKey
                            : `${officer.officialPassKey.slice(0, 7)}•••••`}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleReveal(officer.id)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Toggle reveal"
                        >
                          {isRevealed ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyPassKey(officer.officialPassKey)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Copy pass key"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="p-3.5 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                      {officer.lastLoginAt || "Never logged in"}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 rounded-xl text-xs border-border/80"
                          >
                            <span>Manage</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 text-xs">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info(`Editing officer details for ${officer.name}`)
                            }
                            className="rounded-xl cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                            <span>Edit Officer</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              regeneratePassKeyMutation.mutate({ id: officer.id })
                            }
                            className="rounded-xl cursor-pointer text-indigo-600 focus:text-indigo-600"
                          >
                            <KeyRound className="h-3.5 w-3.5 mr-2" />
                            <span>Regenerate Pass Key</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setPasswordResetOfficer(officer)}
                            className="rounded-xl cursor-pointer"
                          >
                            <Lock className="h-3.5 w-3.5 mr-2" />
                            <span>Reset Password</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => toggleOfficerStatusMutation.mutate(officer.id)}
                            className={`rounded-xl cursor-pointer ${
                              officer.status === "active"
                                ? "text-rose-600 focus:text-rose-600 focus:bg-rose-500/10"
                                : "text-emerald-600 focus:text-emerald-600"
                            }`}
                          >
                            <span>
                              {officer.status === "active"
                                ? "Deactivate Officer"
                                : "Reactivate Officer"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}

              {filteredOfficers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No officers match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Password Reset Modal */}
      <Dialog
        open={!!passwordResetOfficer}
        onOpenChange={(open) => !open && setPasswordResetOfficer(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-border/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Reset Officer Password
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign a new temporary password for {passwordResetOfficer?.name} ({passwordResetOfficer?.email}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new 8+ character password..."
                className="text-xs rounded-xl border-border/80 font-mono"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordResetOfficer(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newPassword.trim()}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
