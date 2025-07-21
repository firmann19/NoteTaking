import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/notes/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const noteId = context.params.id;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      author: true,
      sharedTo: { include: { user: true } },
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const isAuthor = note.author.email === email;
  const isShared = note.sharedTo.some((s) => s.user.email === email);

  if (!note.isPublic && !isAuthor && !isShared) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(note);
}

// PUT /api/notes/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const noteId = context.params.id;

  const { title, content, isPublic } = await req.json();

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { author: true },
  });

  if (!note || note.author.email !== email) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  const updated = await prisma.note.update({
    where: { id: noteId },
    data: { title, content, isPublic },
  });

  return NextResponse.json(updated);
}

// DELETE /api/notes/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const noteId = context.params.id;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { author: true },
  });

  if (!note || note.author.email !== email) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  await prisma.note.delete({ where: { id: noteId } });

  return NextResponse.json({ message: "Deleted" });
}
