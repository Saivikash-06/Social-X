"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  Coins,
  Sparkles,
  Edit3,
  User,
  CheckCircle2,
  Layers,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { useOrganizationProfile, useIndustryQueries } from "@/features/industry/hooks/use-industry-queries";
import {
  organizationProfileSchema,
  OrganizationProfileFormData,
} from "@/features/industry/validation/industry-schemas";

export default function IndustryProfilePage() {
  const { data: org } = useOrganizationProfile();
  const { updateProfileMutation } = useIndustryQueries();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationProfileFormData>({
    resolver: zodResolver(organizationProfileSchema),
    defaultValues: {
      name: org?.name || "",
      legalEntityName: org?.legalEntityName || "",
      sector: org?.sector || "",
      cinOrRegNumber: org?.cinOrRegNumber || "",
      website: org?.website || "",
      email: org?.email || "",
      phone: org?.phone || "",
      addressStreet: org?.address.street || "",
      addressCity: org?.address.city || "",
      addressState: org?.address.state || "",
      addressPincode: org?.address.pincode || "",
      contactPersonName: org?.contactPerson.name || "",
      contactPersonDesignation: org?.contactPerson.designation || "",
      contactPersonEmail: org?.contactPerson.email || "",
      contactPersonPhone: org?.contactPerson.phone || "",
      availableBudget: org?.availableBudget || 45000000,
    },
  });

  React.useEffect(() => {
    if (org) {
      reset({
        name: org.name,
        legalEntityName: org.legalEntityName,
        sector: org.sector,
        cinOrRegNumber: org.cinOrRegNumber,
        website: org.website,
        email: org.email,
        phone: org.phone,
        addressStreet: org.address.street,
        addressCity: org.address.city,
        addressState: org.address.state,
        addressPincode: org.address.pincode,
        contactPersonName: org.contactPerson.name,
        contactPersonDesignation: org.contactPerson.designation,
        contactPersonEmail: org.contactPerson.email,
        contactPersonPhone: org.contactPerson.phone,
        availableBudget: org.availableBudget,
      });
    }
  }, [org, reset]);

  const onSubmit = (data: OrganizationProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => setIsEditDialogOpen(false),
    });
  };

  const formattedBudget = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(org?.availableBudget || 45000000);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-1 shadow-lg shrink-0 flex items-center justify-center text-white text-3xl font-black">
              {org?.name?.charAt(0) || "T"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{org?.name}</h1>
                <Badge variant="success" className="px-2.5 py-0.5 text-xs gap-1 font-bold">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>Verified Corporate Entity</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{org?.legalEntityName}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{org?.sector}</p>
            </div>
          </div>

          <Button
            onClick={() => setIsEditDialogOpen(true)}
            variant="gradient"
            className="rounded-2xl gap-2 font-bold shadow"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Profile Overview Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corporate Details & Credentials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory Details */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-500" />
                <span>Statutory Registration & Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground font-semibold">CIN / Corporate Registration</span>
                <p className="font-mono font-bold text-foreground text-sm mt-1">{org?.cinOrRegNumber}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground font-semibold">Corporate Tax Exemption 80G</span>
                <p className="font-mono font-bold text-foreground text-sm mt-1">{org?.csrRegistration80G}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground font-semibold">Official Website</span>
                <a
                  href={org?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mt-1 hover:underline truncate"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{org?.website}</span>
                </a>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground font-semibold">Official CSR Email</span>
                <p className="font-bold text-foreground mt-1 flex items-center gap-1 truncate">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{org?.email}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CSR Focus Areas & Tech Domains */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>CSR Priority Themes & Technology Domains</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Primary CSR Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {org?.csrFocusAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="px-3 py-1 text-xs rounded-xl font-medium">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Supported Engineering Domains</p>
                <div className="flex flex-wrap gap-2">
                  {org?.technologyDomains.map((tech) => (
                    <Badge key={tech} variant="info" className="px-3 py-1 text-xs rounded-xl font-medium">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registered Office Address */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>Registered Corporate Headquarters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <p className="font-bold text-foreground">{org?.address.street}</p>
              <p className="text-muted-foreground">
                {org?.address.city}, {org?.address.state} - {org?.address.pincode}
              </p>
              <p className="text-muted-foreground">{org?.address.country}</p>
              <p className="text-muted-foreground pt-1">Phone: {org?.phone}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Available Budget & Contact Officer */}
        <div className="space-y-6">
          {/* CSR Financial Capacity */}
          <Card className="border-border/80 bg-gradient-to-br from-amber-500/10 to-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>CSR Grant Capacity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Available CSR Budget Pool</p>
                <p className="text-3xl font-black text-foreground tracking-tight mt-1">{formattedBudget}</p>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-border/60">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allocated Grants:</span>
                  <span className="font-bold text-foreground">₹2,85,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disbursed Tranches:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹1,92,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active R&D Initiatives:</span>
                  <span className="font-bold text-foreground">{org?.activeInitiativesCount} Projects</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person Card */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-amber-500" />
                <span>Designated Nodal Officer</span>
              </CardTitle>
              <CardDescription className="text-xs">Primary contact for academic & civic MoU signing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <p className="font-bold text-foreground text-sm">{org?.contactPerson.name}</p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">{org?.contactPerson.designation}</p>
              </div>
              <div className="space-y-1.5 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{org?.contactPerson.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{org?.contactPerson.phone}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ESG Rating Capsule */}
          <Card className="border-border/80 bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>ESG Composite Score</span>
                <Badge variant="success" className="font-black text-xs">AAA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environmental:</span>
                <span className="font-bold text-foreground">{org?.esgRating.environmental} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Social Impact:</span>
                <span className="font-bold text-foreground">{org?.esgRating.social} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Governance:</span>
                <span className="font-bold text-foreground">{org?.esgRating.governance} / 100</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Organization Profile</DialogTitle>
            <DialogDescription className="text-xs">
              Update statutory details, contact person, and registered corporate address.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Organization Brand Name</Label>
                <Input {...register("name")} className="rounded-xl" />
                {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Legal Entity Name</Label>
                <Input {...register("legalEntityName")} className="rounded-xl" />
                {errors.legalEntityName && <p className="text-[11px] text-destructive">{errors.legalEntityName.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Industry Sector</Label>
                <Input {...register("sector")} className="rounded-xl" />
                {errors.sector && <p className="text-[11px] text-destructive">{errors.sector.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">CIN / Registration No.</Label>
                <Input {...register("cinOrRegNumber")} className="rounded-xl" />
                {errors.cinOrRegNumber && <p className="text-[11px] text-destructive">{errors.cinOrRegNumber.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Website</Label>
                <Input {...register("website")} className="rounded-xl" />
                {errors.website && <p className="text-[11px] text-destructive">{errors.website.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Corporate Email</Label>
                <Input {...register("email")} className="rounded-xl" />
                {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone</Label>
                <Input {...register("phone")} className="rounded-xl" />
                {errors.phone && <p className="text-[11px] text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Available Budget (INR)</Label>
                <Input type="number" {...register("availableBudget")} className="rounded-xl" />
                {errors.availableBudget && <p className="text-[11px] text-destructive">{errors.availableBudget.message}</p>}
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <p className="text-xs font-bold text-foreground mb-2">Designated Contact Officer</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Contact Person Name</Label>
                  <Input {...register("contactPersonName")} className="rounded-xl" />
                  {errors.contactPersonName && <p className="text-[11px] text-destructive">{errors.contactPersonName.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Designation</Label>
                  <Input {...register("contactPersonDesignation")} className="rounded-xl" />
                  {errors.contactPersonDesignation && <p className="text-[11px] text-destructive">{errors.contactPersonDesignation.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Official Email</Label>
                  <Input {...register("contactPersonEmail")} className="rounded-xl" />
                  {errors.contactPersonEmail && <p className="text-[11px] text-destructive">{errors.contactPersonEmail.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone Number</Label>
                  <Input {...register("contactPersonPhone")} className="rounded-xl" />
                  {errors.contactPersonPhone && <p className="text-[11px] text-destructive">{errors.contactPersonPhone.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <p className="text-xs font-bold text-foreground mb-2">Corporate Office Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-semibold">Street Address</Label>
                  <Input {...register("addressStreet")} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input {...register("addressCity")} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">State</Label>
                  <Input {...register("addressState")} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Pincode</Label>
                  <Input {...register("addressPincode")} className="rounded-xl" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending} variant="gradient" className="rounded-xl">
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
