import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const [students, supervisors, journals, pending, approved, revision] = await Promise.all([
    prisma.user.count({ where: { role: "SISWA" } }),
    prisma.user.count({ where: { role: "PEMBIMBING" } }),
    prisma.journal.count(),
    prisma.journal.count({ where: { status: "MENUNGGU_PERSETUJUAN" } }),
    prisma.journal.count({ where: { status: "DISETUJUI" } }),
    prisma.journal.count({ where: { status: "PERLU_REVISI" } })
  ]);

  return <AppShell role="ADMIN"><div className="page"><section className="hero"><div><span className="eyebrow">ADMIN CONTROL CENTER</span><h1>Dashboard <span>Admin</span></h1><p className="muted">Kelola seluruh data sistem JURNAL PKL.</p></div></section>
  <div className="stat-grid"><Stat n={students} label="Total Siswa"/><Stat n={supervisors} label="Total Pembimbing"/><Stat n={journals} label="Total Jurnal"/><Stat n={pending} label="Menunggu"/><Stat n={approved} label="Disetujui"/><Stat n={revision} label="Revisi"/></div>
  </div></AppShell>;
}
function Stat({n,label}:{n:number,label:string}){return <div className="stat-card glass"><strong>{n}</strong><span>{label}</span></div>}