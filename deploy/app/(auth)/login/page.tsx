"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Input, Label } from "@/components/ui";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h1 className="text-xl font-semibold mb-1">Sign in</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Host-approved users can access the learning content.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-xs text-neutral-500">
        New here?{" "}
        <a
          href="/signup"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
        >
          Create a user account
        </a>{" "}
        and wait for host approval.
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <h1 className="text-xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-neutral-400 mb-6">Loading...</p>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

