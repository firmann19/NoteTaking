import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CommentForm from "../../../../components/comment";
import ShareForm from "../../../../components/share";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: { id: string };
};

export default async function NoteDetailPage({ params }: Props) {
  const session = await getServerSession();
  const email = session?.user?.email;

  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      sharedTo: { include: { user: true } },
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (
    !note ||
    (!note.isPublic &&
      note.author.email !== email &&
      !note.sharedTo.some((s) => s.user.email === email))
  ) {
    notFound();
  }

  const isOwner = note.author.email === email;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <Link
          href="/notes"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Beranda
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{note.title}</h1>

      <p className="text-gray-500 text-sm mb-4">
        Oleh{" "}
        <span className="font-medium">
          {note.author.name || note.author.email}
        </span>
      </p>

      <div className="prose prose-sm mb-6 whitespace-pre-line text-gray-800">
        {note.content}
      </div>

      {isOwner && (
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={`/notes/${note.id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Edit Catatan
          </Link>
          <ShareForm noteId={note.id} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Komentar</h2>
        {note.comments.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-3">
            {note.comments.map((comment) => (
              <li key={comment.id} className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-800">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.user.name || comment.user.email}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CommentForm noteId={note.id} />
    </div>
  );
}
