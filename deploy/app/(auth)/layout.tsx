import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

