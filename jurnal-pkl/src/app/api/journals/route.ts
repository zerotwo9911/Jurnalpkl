import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  id: z.number().optional(),
  date: z.string(),
  shift_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  activity: z.string().min(5).max(10000),
  description: z.string().max(10000).optional(),
  status: z.enum(["DRAFT", "MENUNGGU_PERSETUJUAN"]).default("DRAFT")
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = session.role === "SISWA" ? { user_id: session.id } : {};
  const journals = await prisma.journal.findMany({
    where,
    include: { shift: true, user: { select: { id: true, nama: true, kelas: true } } },
    orderBy: { date: "desc" }
  });
  return NextResponse.json(journals);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SISWA") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = schema.parse(await req.json());
    const data = {
      user_id: session.id,
      shift_id: body.shift_id,
      date: new Date(body.date + "T12:00:00"),
      start_time: body.start_time,
      end_time: body.end_time,
      activity: body.activity,
      description: body.description || null,
      status: body.status
    };

    const journal = body.id
      ? await prisma.journal.update({
          where: { id: body.id, user_id: session.id },
          data
        })
      : await prisma.journal.create({ data });

    if (body.status === "MENUNGGU_PERSETUJUAN") {
      await prisma.notification.create({
        data: {
          user_id: session.id,
          title: "Jurnal berhasil dikirim",
          message: "Jurnal PKL Anda telah dikirim untuk persetujuan pembimbing.",
          type: "JURNAL"
        }
      });
    }

    return NextResponse.json(journal);
  } catch {
    return NextResponse.json({ error: "Jurnal gagal disimpan." }, { status: 400 });
  }
}