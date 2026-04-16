"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { SidebarLink } from "./ui";
import { AuthProvider, useAuth } from "./AuthProvider";

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 border-r border-neutral-800 bg-neutral-950 p-4 flex flex-col gap-4
          transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:z-auto lg:bg-neutral-950/80
        `}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-white">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "Defence Platform"}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-neutral-400 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <SidebarLink href="/dashboard">Dashboard</SidebarLink>
          <SidebarLink href="/dashboard#subjects">Subjects</SidebarLink>
          {(user?.role === "host" || user?.role === "admin") && (
            <SidebarLink href="/host">Host Panel</SidebarLink>
          )}
          {user?.role === "admin" && (
            <SidebarLink href="/admin">Admin</SidebarLink>
          )}
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
    </>
  );
}

export function DashboardLayoutShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-950/90 sticky top-0 z-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-neutral-400 hover:text-white"
              aria-label="Open menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-white">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "Defence Platform"}
            </span>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
