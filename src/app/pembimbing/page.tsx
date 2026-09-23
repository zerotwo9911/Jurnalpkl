import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function PembimbingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PEMBIMBING") redirect("/");

  const [students, pending, approved, revision] = await Promise.all([
    prisma.user.count({ where: { role: "SISWA", pembimbing: session.nama } }),
    prisma.journal.count({ where: { status: "MENUNGGU_PERSETUJUAN" } }),
    prisma.journal.count({ where: { status: "DISETUJUI" } }),
    prisma.journal.count({ where: { status: "PERLU_REVISI" } })
  ]);

  return <AppShell role="PEMBIMBING"><div className="page"><section className="hero"><div><span className="eyebrow">DASHBOARD PEMBIMBING</span><h1>Halo, <span>{session.nama}</span></h1><p className="muted">Pantau dan setujui jurnal siswa bimbingan.</p></div></section>
    <div className="stat-grid"><Stat n={students} label="Siswa Dibimbing"/><Stat n={pending} label="Menunggu Persetujuan"/><Stat n={approved} label="Jurnal Disetujui"/><Stat n={revision} label="Perlu Revisi"/></div>
    <div className="glass empty">Modul persetujuan dapat digunakan dari menu <b>Persetujuan</b>.</div>
  </div></AppShell>;
}
function Stat({n,label}:{n:number,label:string}){return <div className="stat-card glass"><strong>{n}</strong><span>{label}</span></div>}