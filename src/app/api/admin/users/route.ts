import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100),
  username: z.string().trim().min(3, "Username minimal 3 karakter.").max(50).regex(/^[a-zA-Z0-9._-]+$/, "Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung."),
  password: z.string().min(6, "Password minimal 6 karakter.").max(100),
  role: z.enum(["SISWA", "PEMBIMBING"]),
  kelas: z.string().trim().max(100).optional(),
  jurusan: z.string().trim().max(150).optional(),
  sekolah: z.string().trim().max(150).optional(),
  tempat_pkl: z.string().trim().max(150).optional(),
  pembimbing: z.string().trim().max(100).optional()
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Hanya admin yang dapat membuat akun." }, { status: 403 });
  }

  try {
    const body = schema.parse(await req.json());
    const username = body.username.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username sudah digunakan. Silakan pilih username lain." }, { status: 409 });
    }

    const password = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        nama: body.nama,
        username,
        password,
        role: body.role,
        kelas: body.role === "SISWA" ? body.kelas || null : null,
        jurusan: body.role === "SISWA" ? body.jurusan || null : null,
        sekolah: body.sekolah || null,
        tempat_pkl: body.role === "SISWA" ? body.tempat_pkl || null : null,
        pembimbing: body.role === "SISWA" ? body.pembimbing || null : null
      },
      select: { id: true, nama: true, username: true, role: true }
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Data tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal membuat akun." }, { status: 500 });
  }
}
