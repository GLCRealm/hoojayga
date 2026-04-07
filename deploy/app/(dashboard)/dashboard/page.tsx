import { getAllSubjects } from "@/lib/subjects";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const subjects = getAllSubjects();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-neutral-400">
          Stay focused. Progress steadily. All your subject content is structured
          for serious defence preparation.
        </p>
      </section>

      <section id="subjects" className="space-y-3">
        <h2 className="text-lg font-semibold">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <a
              key={s.slug}
              href={`/subjects/${s.slug}`}
              className="card hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
            >
              <div className="text-sm text-neutral-400 mb-1">Subject</div>
              <div className="font-semibold text-white">{s.subject}</div>
              <div className="mt-2 text-xs text-neutral-500">
                {s.topicCount} sessions
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

