import * as React from "react";
import { DepartmentProgressTracker } from "@/features/government/components/progress/department-progress-tracker";

export const metadata = {
  title: "Department Work Progress | Social-X Government Operating System",
  description: "Live project tracking and visual workflow monitoring for citizen complaints assigned to municipal line departments.",
};

export default function DepartmentProgressPage() {
  return <DepartmentProgressTracker />;
}
