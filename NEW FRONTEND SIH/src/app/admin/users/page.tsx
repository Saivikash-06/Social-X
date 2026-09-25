"use client";

import * as React from "react";
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  KeyRound,
  FileText,
  RefreshCw,
} from "lucide-react";
import {
  useAdminUsers,
  useAdminMutations,
} from "@/features/admin/hooks/use-admin-queries";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/shared/components/ui/card";
import { UserFormDialog } from "@/features/admin/components/users/user-form-dialog";
import { ResetPasswordDialog } from "@/features/admin/components/users/reset-password-dialog";
import { ManagedUser } from "@/features/admin/types";

export default function AdminUsersPage() {
  const { data: usersData, isLoading, refetch } = useAdminUsers();
  const { createUserMutation, updateUserMutation, resetPasswordMutation } = useAdminMutations();

  const [userModalOpen, setUserModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);
  const [targetUser, setTargetUser] = React.useState<ManagedUser | null>(null);

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  const filteredUsers = React.useMemo(() => {
    if (!usersData) return [];
    return usersData.filter((u: ManagedUser) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.organization?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [usersData, search, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            User Management & Identity Directory
          </h1>
          <p className="text-xs text-muted-foreground">
            Provision, audit, and manage user roles across all 6 stakeholder tiers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingUser(null);
              setUserModalOpen(true);
            }}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white gap-1.5 text-xs font-bold shadow-md shadow-rose-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-border/80 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user by name, email, or organization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-2xl border-border/80 bg-muted/30 text-xs"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by stakeholder role"
              className="h-10 rounded-2xl border border-border/80 bg-muted/30 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
            >
              <option value="all">All Stakeholder Roles</option>
              <option value="citizen">Citizens</option>
              <option value="government">Government Officials</option>
              <option value="university">University Faculty/Students</option>
              <option value="industry">Industry CSR Leads</option>
              <option value="ngo">NGO Representatives</option>
              <option value="research">Research Scientists</option>
            </select>
          </div>

          <div className="rounded-2xl border border-border/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">Role & Clearance</th>
                    <th className="p-3.5">Organization / Region</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center shrink-0 border border-rose-500/20">
                              {u.fullName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {u.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              u.role === "government"
                                ? "success"
                                : u.role === "university"
                                ? "purple"
                                : u.role === "industry"
                                ? "warning"
                                : u.role === "ngo"
                                ? "destructive"
                                : "info"
                            }
                            className="font-semibold text-[10px] uppercase"
                          >
                            {u.role}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{u.roleLabel}</p>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-foreground">{u.organization || "Independent"}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {u.district}, {u.state}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={u.status === "active" ? "success" : "destructive"}
                            className="text-[10px] font-bold"
                          >
                            {u.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-mono text-[11px]">{u.lastActive}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setTargetUser(u);
                                setResetModalOpen(true);
                              }}
                              className="h-7 px-2 text-[11px] rounded-lg gap-1 text-muted-foreground hover:text-foreground"
                            >
                              <KeyRound className="h-3 w-3" />
                              <span>Reset</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(u);
                                setUserModalOpen(true);
                              }}
                              className="h-7 px-2 text-[11px] rounded-lg gap-1 text-muted-foreground hover:text-foreground"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                updateUserMutation.mutate({
                                  id: u.id,
                                  data: { status: u.status === "active" ? "suspended" : "active" },
                                });
                              }}
                              className={`h-7 px-2 text-[11px] rounded-lg ${
                                u.status === "active"
                                  ? "text-amber-600 hover:text-amber-700"
                                  : "text-emerald-600 hover:text-emerald-700"
                              }`}
                            >
                              {u.status === "active" ? "Suspend" : "Activate"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, data });
          } else {
            createUserMutation.mutate(data);
          }
          setUserModalOpen(false);
        }}
        initialData={editingUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <ResetPasswordDialog
        user={targetUser}
        isOpen={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
          setTargetUser(null);
        }}
        onSubmit={(data) => {
          if (targetUser) {
            resetPasswordMutation.mutate({
              id: targetUser.id,
              data,
            });
          }
          setResetModalOpen(false);
        }}
        isLoading={resetPasswordMutation.isPending}
      />
    </div>
  );
}
