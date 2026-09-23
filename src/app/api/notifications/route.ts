import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.notification.findMany({
    where: { user_id: session.id },
    orderBy: { created_at: "desc" },
    take: 50
  });

  return NextResponse.json(data);
}

export async function PATCH() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { user_id: session.id, is_read: false },
    data: { is_read: true }
  });

  return NextResponse.json({ ok: true });
}