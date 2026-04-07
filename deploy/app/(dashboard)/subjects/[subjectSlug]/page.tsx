import { getSubjectTopics } from "@/lib/subjects";
import Link from "next/link";

interface Props {
  params: Promise<{ subjectSlug: string }>;
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params;
  const subject = getSubjectTopics(subjectSlug);
  if (!subject) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-2">Subject not found</h1>
        <p className="text-sm text-neutral-400">
          This subject does not exist in the current JSON data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{subject.subject}</h1>
        <p className="text-sm text-neutral-400">
          {subject.topics.length} recorded sessions.
        </p>
      </div>

      <div className="space-y-2">
        {subject.topics.map((t) => (
          <Link
            key={t.id}
            href={`/subjects/${subject.slug}/${t.id}`}
            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
          >
            <span className="text-neutral-100">{t.title}</span>
            <span className="text-xs text-neutral-500">View</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

