import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import NoteCard from "@/components/NoteCard";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      notes: {
        include: { author: true },
      },
      shared: {
        include: {
          note: {
            include: { author: true },
          },
        },
      },
    },
  });

  const ownNotes = user?.notes || [];
  const sharedNotes = user?.shared.map((s) => s.note) || [];

  const allNotes = [...ownNotes, ...sharedNotes];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Catatan Saya</h1>

      <Link
        href="/notes/create"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 text-sm"
      >
        + Buat Catatan Baru
      </Link>

      <ul className="space-y-3">
        {allNotes.map((note) => (
          <li key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              content={note.content}
              authorName={
                note.author?.name ??
                note.author?.email ??
                session?.user?.email ??
                "Unknown"
              }
              isPublic={note.isPublic}
            />
          </li>
        ))}
        {allNotes.length === 0 && (
          <p className="text-gray-500">Belum ada catatan.</p>
        )}
      </ul>
    </div>
  );
}
