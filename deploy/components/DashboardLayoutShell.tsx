"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { SidebarLink } from "./ui";
import { AuthProvider, useAuth } from "./AuthProvider";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950/80 p-4 flex flex-col gap-4">
      <div className="text-lg font-semibold text-white">
        {process.env.NEXT_PUBLIC_APP_NAME ?? "Defence Platform"}
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <SidebarLink href="/dashboard">Dashboard</SidebarLink>
        <SidebarLink href="/dashboard#subjects">Subjects</SidebarLink>
        {(user?.role === "host" || user?.role === "admin") && (
          <SidebarLink href="/host">Host Panel</SidebarLink>
        )}
        {user?.role === "admin" && <SidebarLink href="/admin">Admin</SidebarLink>}
      </nav>
      <div className="border-t border-neutral-800 pt-3 text-xs text-neutral-400">
        <div className="font-medium text-neutral-200">
          {user?.name ?? "User"}
        </div>
        <div className="capitalize">{user?.role ?? "role"}</div>
        <Link
          href="/logout"
          className="mt-2 inline-flex text-xs text-neutral-400 hover:text-red-400"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}

export function DashboardLayoutShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
        <Sidebar />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </AuthProvider>
  );
}

