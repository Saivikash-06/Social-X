"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  category: z.string().min(1, "Please select an inquiry category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "citizen_support",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API contact submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success("Message Dispatched", {
      description: `Thank you ${data.fullName}. The Social-X support team will respond within 24 hours.`,
    });
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="info">Support & Help Desk</Badge>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Get in Touch with Social-X
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Have questions about the platform, municipal integrations, or citizen
          grievance procedures? Our team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/80 bg-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground">Contact Channels</h3>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">Citizen Support Email</p>
                <p className="text-muted-foreground">support@social-x.gov.in</p>
                <p className="text-xs text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">Toll-Free Helpline</p>
                <p className="text-muted-foreground">1800-425-9988</p>
                <p className="text-xs text-muted-foreground">24/7 Civic Emergency Support</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">Innovation Secretariat</p>
                <p className="text-muted-foreground">
                  Smart Governance Tower, Sector 4, Civic Centre, New Delhi 110001
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border/80 bg-muted/40 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h4 className="font-bold text-sm text-foreground">Need Urgent Issue Status?</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have already reported an issue, you can track it in real-time
              directly through the Citizen Portal using your Issue ID.
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/80 bg-card p-6 sm:p-8">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g. Rahul Sharma"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief topic of inquiry"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      {...register("category")}
                      className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs"
                    >
                      <option value="citizen_support">Citizen Portal Inquiry</option>
                      <option value="tech_issue">Technical Bug or Crash</option>
                      <option value="institution_partnership">Institutional Partnership</option>
                      <option value="general_feedback">General Feedback</option>
                    </select>
                    {errors.category && (
                      <p className="text-xs text-destructive">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message Details</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your inquiry or feedback in detail..."
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="gradient"
                  className="rounded-xl w-full sm:w-auto"
                  isLoading={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
