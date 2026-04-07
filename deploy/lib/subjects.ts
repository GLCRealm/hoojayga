import fs from "fs";
import path from "path";

export interface RawTopic {
  subject: string;
  topic_path: string;
  page_url: string;
  title: string;
  recording_id: number;
  playable_url: string;
  kind: string;
}

export interface Topic {
  id: string;
  title: string;
  videoUrl: string;
  pageUrl: string;
}

export interface SubjectMeta {
  subject: string;
  slug: string;
  topicCount: number;
}

const linksDir = path.join(process.cwd(), "links");

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getAllSubjects(): SubjectMeta[] {
  const files = fs
    .readdirSync(linksDir)
    .filter((f) => f.toLowerCase().endsWith(".json"));

  const subjects: SubjectMeta[] = [];

  for (const file of files) {
    const filePath = path.join(linksDir, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as RawTopic[];
    if (!raw.length) continue;
    const subjectName = raw[0].subject || path.basename(file, ".json");
    const slug = slugify(subjectName);
    subjects.push({
      subject: subjectName,
      slug,
      topicCount: raw.length
    });
  }

  return subjects.sort((a, b) => a.subject.localeCompare(b.subject));
}

export function getSubjectTopics(
  subjectSlug: string
): { subject: string; slug: string; topics: Topic[] } | null {
  const files = fs
    .readdirSync(linksDir)
    .filter((f) => f.toLowerCase().endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(linksDir, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as RawTopic[];
    if (!raw.length) continue;
    const subjectName = raw[0].subject || path.basename(file, ".json");
    const slug = slugify(subjectName);
    if (slug !== subjectSlug) continue;

    const topics: Topic[] = raw.map((t, index) => ({
      id: `${slug}-${index}`,
      title: t.title,
      videoUrl: t.playable_url,
      pageUrl: t.page_url
    }));

    return { subject: subjectName, slug, topics };
  }

  return null;
}

export function getTopicById(
  subjectSlug: string,
  topicId: string
): { subject: string; topic: Topic } | null {
  const subject = getSubjectTopics(subjectSlug);
  if (!subject) return null;

  const topic = subject.topics.find((t) => t.id === topicId);
  if (!topic) return null;

  return { subject: subject.subject, topic };
}

export function searchTopics(query: string): Topic[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const subjects = getAllSubjects();
  const results: Topic[] = [];

  for (const s of subjects) {
    const subject = getSubjectTopics(s.slug);
    if (!subject) continue;
    for (const t of subject.topics) {
      if (
        t.title.toLowerCase().includes(q) ||
        subject.subject.toLowerCase().includes(q)
      ) {
        results.push(t);
      }
    }
  }

  return results;
}

