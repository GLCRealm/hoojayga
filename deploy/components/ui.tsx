import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
) {
  const { className = "", variant = "primary", ...rest } = props;
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-500"
      : "bg-transparent text-neutral-200 hover:bg-neutral-800 focus-visible:ring-neutral-700";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest} />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      {...rest}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-sm font-medium text-neutral-300 mb-1 block">
      {children}
    </label>
  );
}

export function SidebarLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
    >
      {children}
    </Link>
  );
}

