import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(1).max(100)
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { username: body.username } });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    await createSession({
      id: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama
    });

    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json({ error: "Data login tidak valid." }, { status: 400 });
  }
}