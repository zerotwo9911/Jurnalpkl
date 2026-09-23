import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["DISETUJUI", "PERLU_REVISI"]),
  note: z.string().max(5000).optional()
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !["PEMBIMBING", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const id = Number((await params).id);
  const body = schema.parse(await req.json());

  const journal = await prisma.journal.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!journal) return NextResponse.json({ error: "Jurnal tidak ditemukan." }, { status: 404 });

  const now = new Date();
  await prisma.$transaction([
    prisma.journal.update({
      where: { id },
      data: {
        status: body.status,
        supervisor_note: body.note || null,
        approved_at: body.status === "DISETUJUI" ? now : null
      }
    }),
    prisma.supervisorApproval.create({
      data: {
        journal_id: id,
        supervisor_name: session.nama,
        status: body.status,
        note: body.note || null,
        approved_at: body.status === "DISETUJUI" ? now : null
      }
    }),
    prisma.notification.create({
      data: {
        user_id: journal.user_id,
        title: body.status === "DISETUJUI" ? "Jurnal disetujui" : "Jurnal perlu revisi",
        message: body.note || (body.status === "DISETUJUI"
          ? "Jurnal Anda telah disetujui pembimbing."
          : "Jurnal Anda perlu direvisi."),
        type: body.status === "DISETUJUI" ? "APPROVAL" : "REVISI"
      }
    })
  ]);

  return NextResponse.json({ ok: true });
}