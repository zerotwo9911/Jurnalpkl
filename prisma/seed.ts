import { PrismaClient, Role, JournalStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("12345678", 12);

  await prisma.shift.upsert({
    where: { id: 1 },
    update: { name: "Pagi", start_time: "07:45", end_time: "15:00" },
    create: { name: "Pagi", start_time: "07:45", end_time: "15:00" }
  });

  await prisma.shift.upsert({
    where: { id: 2 },
    update: { name: "Siang", start_time: "13:00", end_time: "21:00" },
    create: { name: "Siang", start_time: "13:00", end_time: "21:00" }
  });

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      nama: "Administrator",
      password,
      role: Role.ADMIN
    },
    create: {
      username: "admin",
      nama: "Administrator",
      password,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { username: "pembimbing01" },
    update: {
      nama: "Bapak Contoh",
      password,
      role: Role.PEMBIMBING,
      sekolah: "SMKN 1 Sidayu"
    },
    create: {
      username: "pembimbing01",
      nama: "Bapak Contoh",
      password,
      role: Role.PEMBIMBING,
      sekolah: "SMKN 1 Sidayu"
    }
  });

  const siswa = await prisma.user.upsert({
    where: { username: "siswa01" },
    update: {
      nama: "Ahmad",
      password,
      role: Role.SISWA,
      kelas: "XII TITL 1",
      jurusan: "Teknik Instalasi Tenaga Listrik",
      sekolah: "SMKN 1 Sidayu",
      tempat_pkl: "PT Contoh",
      pembimbing: "Bapak Contoh"
    },
    create: {
      username: "siswa01",
      nama: "Ahmad",
      password,
      role: Role.SISWA,
      kelas: "XII TITL 1",
      jurusan: "Teknik Instalasi Tenaga Listrik",
      sekolah: "SMKN 1 Sidayu",
      tempat_pkl: "PT Contoh",
      pembimbing: "Bapak Contoh"
    }
  });

  const count = await prisma.journal.count({ where: { user_id: siswa.id } });
  if (!count) {
    await prisma.journal.create({
      data: {
        user_id: siswa.id,
        shift_id: 1,
        date: new Date(),
        start_time: "07:45",
        end_time: "15:00",
        activity: "Melakukan pemeriksaan instalasi listrik dan membantu teknisi melakukan perawatan peralatan.",
        description: "Kegiatan berjalan dengan baik.",
        status: JournalStatus.DRAFT
      }
    });
  }

  console.log("Seed selesai.");
  console.log("Admin: admin / 12345678");
  console.log("Pembimbing: pembimbing01 / 12345678");
  console.log("Siswa: siswa01 / 12345678");
}

main().finally(() => prisma.$disconnect());