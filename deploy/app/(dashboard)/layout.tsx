import type { ReactNode } from "react";
import { DashboardLayoutShell } from "@/components/DashboardLayoutShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}

