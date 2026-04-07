import Link from "next/link";
import { getTopicById } from "@/lib/subjects";
import { VideoPlayer } from "@/components/VideoPlayer";

interface Props {
  params: Promise<{ subjectSlug: string; topicId: string }>;
}

export default async function TopicPage({ params }: Props) {
  const { subjectSlug, topicId } = await params;
  const result = getTopicById(subjectSlug, topicId);
  if (!result) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-2">Session not found</h1>
        <p className="text-sm text-neutral-400">
          This session could not be located in the JSON data.
        </p>
      </div>
    );
  }

  const { subject, topic } = result;

  return (
    <div className="space-y-6">
      <nav className="text-xs text-neutral-500">
        <Link href="/dashboard" className="hover:text-neutral-300">
          Dashboard
        </Link>{" "}
        /{" "}
        <Link
          href={`/subjects/${subjectSlug}`}
          className="hover:text-neutral-300"
        >
          {subject}
        </Link>{" "}
        / <span className="text-neutral-300">{topic.title}</span>
      </nav>

      <div>
        <h1 className="text-xl font-semibold mb-1">{topic.title}</h1>
        <p className="text-xs text-neutral-500 mb-4">
          Video embedded directly from the original URL.
        </p>
        <VideoPlayer url={topic.videoUrl} />
      </div>
    </div>
  );
}

