"use client";

import { useEffect, useState } from "react";

type HostUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export default function HostPage() {
  const [users, setUsers] = useState<HostUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/host/users", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to load users");
        return;
      }

      setUsers(data.users ?? []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const runAction = async (userId: string, action: "approve" | "reject" | "remove") => {
    setBusyId(userId + action);
    setError(null);

    try {
      const res = await fetch("/api/host/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, action })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Action failed");
        return;
      }

      await loadUsers();
    } catch {
      setError("Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Host panel</h1>
        <p className="text-sm text-neutral-400">
          Approve, reject, and remove normal user accounts. Only host-approved users can access learning content.
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Passwords are securely hashed and cannot be viewed in plain text.
        </p>
      </section>

      {error && (
        <div className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Total normal users</div>
          <div className="text-2xl font-semibold">{users.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Active</div>
          <div className="text-2xl font-semibold">
            {users.filter((u) => u.active).length}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Inactive</div>
          <div className="text-2xl font-semibold">
            {users.filter((u) => !u.active).length}
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="text-sm text-neutral-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-800">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-900/60 text-neutral-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">User ID</th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Active</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-neutral-800">
                    <td className="px-3 py-2 text-xs text-neutral-400">{u.id}</td>
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2 text-neutral-300">{u.email}</td>
                    <td className="px-3 py-2">{u.active ? "active" : "inactive"}</td>
                    <td className="px-3 py-2 capitalize">{u.status}</td>
                    <td className="px-3 py-2 space-x-3">
                      {u.status !== "approved" && (
                        <button
                          onClick={() => runAction(u.id, "approve")}
                          disabled={busyId !== null}
                          className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-40"
                        >
                          Approve
                        </button>
                      )}
                      {u.status !== "rejected" && (
                        <button
                          onClick={() => runAction(u.id, "reject")}
                          disabled={busyId !== null}
                          className="text-xs text-yellow-400 hover:text-yellow-300 disabled:opacity-40"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => runAction(u.id, "remove")}
                        disabled={busyId !== null}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
