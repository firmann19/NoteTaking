import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      sharedTo: { include: { user: true } },
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  if (
    !note.isPublic &&
    note.author.email !== email &&
    !note.sharedTo.some((s) => s.user.email === email)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const { title, content, isPublic } = await req.json();

  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!note || note.author.email !== email) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  const updated = await prisma.note.update({
    where: { id: params.id },
    data: { title, content, isPublic },
  });

  return NextResponse.json(updated);
}

export async function DELETE({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!note || note.author.email !== email) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  await prisma.note.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Deleted" });
}
