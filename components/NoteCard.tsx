"use client";

import Link from "next/link";

type NoteCardProps = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  isPublic: boolean;
};

export default function NoteCard({
  id,
  title,
  content,
  authorName,
  isPublic,
}: NoteCardProps) {
  return (
    <Link
      href={`/notes/${id}/detail`}
      className="block p-4 border rounded hover:shadow transition"
    >
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-700 line-clamp-3 mb-2">{content}</p>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Oleh {authorName}</span>
        {isPublic && <span className="text-green-600">Publik</span>}
      </div>
    </Link>
  );
}
