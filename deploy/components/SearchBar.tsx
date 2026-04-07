"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "./ui";

interface SearchResult {
  id: string;
  title: string;
  videoUrl: string;
  pageUrl: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search sessions by title or subject..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading && (
        <div className="text-xs text-neutral-500">Searching...</div>
      )}
      {!loading && results.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900/70">
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/subjects/physics/${r.id}`}
              className="block px-3 py-2 text-sm hover:bg-neutral-800"
            >
              <div className="text-neutral-100 truncate">{r.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

