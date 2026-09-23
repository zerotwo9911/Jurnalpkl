import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getSession } from "@/lib/auth";

const schema = z.object({
  id: z.number().int().positive().optional(),
  date: z.string().min(1),
  shift_id: z.number().int().positive(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  activity: z.string().trim().min(5).max(10000),
  description: z.string().max(10000).optional(),
  status: z.enum(["DRAFT", "TERKIRIM"]).default("DRAFT")
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const month = searchParams.get("month") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") as "DRAFT" | "TERKIRIM" | null;

  const where: Prisma.JournalWhereInput = {};
  if (session.role === "SISWA") where.user_id = session.id;
  if (session.role === "PEMBIMBING") {
    where.user = { pembimbing: session.nama, role: "SISWA" };
  }
  if (q) {
    where.OR = session.role === "SISWA"
      ? [{ activity: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }]
      : [
          { activity: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { user: { nama: { contains: q, mode: "insensitive" } } }
        ];
  }
  if (status === "DRAFT" || status === "TERKIRIM") where.status = status;
  if (date) {
    const d = new Date(`${date}T00:00:00`);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  } else if (/^\d{4}-\d{2}$/.test(month)) {
    const start = new Date(`${month}-01T00:00:00`);
    const next = new Date(start); next.setMonth(next.getMonth() + 1);
    where.date = { gte: start, lt: next };
  }

  const journals = await prisma.journal.findMany({
    where,
    include: {
      shift: true,
      user: { select: { id: true, nama: true, kelas: true, jurusan: true, tempat_pkl: true, pembimbing: true } }
    },
    orderBy: [{ date: "desc" }, { created_at: "desc" }]
  });
  return NextResponse.json(journals);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SISWA") {
    return NextResponse.json({ error: "Hanya siswa yang dapat membuat jurnal." }, { status: 403 });
  }

  try {
    const body = schema.parse(await req.json());
    const data = {
      user_id: session.id,
      shift_id: body.shift_id,
      date: new Date(`${body.date}T12:00:00`),
      start_time: body.start_time,
      end_time: body.end_time,
      activity: body.activity,
      description: body.description?.trim() || null,
      status: body.status
    };

    const journal = body.id
      ? await prisma.journal.update({ where: { id: body.id, user_id: session.id }, data })
      : await prisma.journal.create({ data });

    await prisma.notification.create({
      data: {
        user_id: session.id,
        title: body.id ? "Jurnal berhasil diperbarui" : "Jurnal berhasil disimpan",
        message: body.status === "TERKIRIM"
          ? "Jurnal kegiatan PKL berhasil dikirim."
          : "Jurnal kegiatan PKL tersimpan sebagai draft.",
        type: "JURNAL"
      }
    });

    return NextResponse.json(journal);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Data jurnal tidak valid." }, { status: 400 });
    return NextResponse.json({ error: "Jurnal gagal disimpan." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SISWA") return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "ID jurnal tidak valid." }, { status: 400 });

  const journal = await prisma.journal.findFirst({ where: { id, user_id: session.id } });
  if (!journal) return NextResponse.json({ error: "Jurnal tidak ditemukan." }, { status: 404 });

  await prisma.journal.delete({ where: { id } });
  await prisma.notification.create({
    data: { user_id: session.id, title: "Jurnal dihapus", message: "Jurnal kegiatan PKL berhasil dihapus.", type: "JURNAL" }
  });
  return NextResponse.json({ ok: true });
}
