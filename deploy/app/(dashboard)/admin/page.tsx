import { getAllSubjects } from "@/lib/subjects";
import { listUsers } from "@/lib/auth";

async function approveOrReject(userId: string, action: "approve" | "reject") {
  "use server";
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action }),
    cache: "no-store"
  });
}

export default async function AdminPage() {
  const users = await listUsers();
  const subjects = getAllSubjects();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Admin dashboard</h1>
        <p className="text-sm text-neutral-400">
          Approve or reject hosts and monitor platform usage.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Total users</div>
          <div className="text-2xl font-semibold">{users.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Approved</div>
          <div className="text-2xl font-semibold">
            {users.filter((u) => u.status === "approved").length}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">Subjects</div>
          <div className="text-2xl font-semibold">{subjects.length}</div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-900/60 text-neutral-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Role</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id.toString()} className="border-t border-neutral-800">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2 text-neutral-400">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.role}</td>
                  <td className="px-3 py-2 capitalize">{u.status}</td>
                  <td className="px-3 py-2 space-x-2">
                    {u.status === "pending" && (
                      <>
                        <form
                          action={async () => {
                            "use server";
                            await approveOrReject(u._id.toString(), "approve");
                          }}
                          className="inline"
                        >
                          <button className="text-xs text-emerald-400 hover:text-emerald-300">
                            Approve
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await approveOrReject(u._id.toString(), "reject");
                          }}
                          className="inline"
                        >
                          <button className="text-xs text-red-400 hover:text-red-300">
                            Reject
                          </button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

