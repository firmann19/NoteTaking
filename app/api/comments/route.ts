import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { noteId, content } = await req.json();

  if (!noteId || !content) {
    return NextResponse.json(
      { error: "noteId dan content wajib diisi" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user!.id,
      noteId,
    },
  });

  return NextResponse.json(comment);
}
