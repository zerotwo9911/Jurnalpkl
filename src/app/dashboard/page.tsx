import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import Clock from "@/components/Clock";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "SISWA") redirect(session.role === "ADMIN" ? "/admin" : "/pembimbing");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");

  const [total, approved, pending, revision, today] = await Promise.all([
    prisma.journal.count({ where: { user_id: session.id } }),
    prisma.journal.count({ where: { user_id: session.id, status: "DISETUJUI" } }),
    prisma.journal.count({ where: { user_id: session.id, status: "MENUNGGU_PERSETUJUAN" } }),
    prisma.journal.count({ where: { user_id: session.id, status: "PERLU_REVISI" } }),
    prisma.journal.findFirst({ where: { user_id: session.id, date: { gte: new Date(new Date().setHours(0,0,0,0)), lt: new Date(new Date().setHours(24,0,0,0)) } }, include: { shift: true } })
  ]);

  return <AppShell role="SISWA">
    <div className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">DASHBOARD SISWA</span>
          <h1>Selamat datang, <span>{user.nama}</span></h1>
          <p className="muted">Kelola kegiatan PKL kamu dengan rapi dan terstruktur.</p>
        </div>
        <Clock />
      </section>

      <section className="profile-strip glass">
        <div><b>{user.nama}</b><small>NAMA</small></div>
        <div><b>{user.kelas || "-"}</b><small>KELAS</small></div>
        <div><b>{user.jurusan || "-"}</b><small>JURUSAN</small></div>
        <div><b>{user.tempat_pkl || "-"}</b><small>TEMPAT PKL</small></div>
        <div><b>{user.pembimbing || "-"}</b><small>PEMBIMBING</small></div>
      </section>

      <div className="stat-grid">
        <Stat n={total} label="Total Jurnal" icon="📝" />
        <Stat n={approved} label="Jurnal Disetujui" icon="✓" />
        <Stat n={pending} label="Menunggu Persetujuan" icon="◷" />
        <Stat n={revision} label="Perlu Revisi" icon="!" />
      </div>

      <section className="today-card glass">
        <div>
          <span className="eyebrow">JURNAL HARI INI</span>
          <h2>{new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date())}</h2>
          <p className="muted">{today ? `Shift ${today.shift.name} · ${today.start_time} - ${today.end_time}` : "Belum ada jurnal untuk hari ini."}</p>
        </div>
        <Link className="primary-btn link-btn" href={today ? `/jurnal/${today.id}` : "/jurnal"}>{today ? "LIHAT JURNAL" : "+ BUAT JURNAL"}</Link>
      </section>
    </div>
  </AppShell>;
}

function Stat({ n, label, icon }: { n: number; label: string; icon: string }) {
  return <div className="stat-card glass"><span className="stat-icon">{icon}</span><strong>{n}</strong><span>{label}</span></div>;
}