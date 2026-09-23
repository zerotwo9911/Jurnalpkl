import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");
  const [students, supervisors, journals, places, latest] = await Promise.all([
    prisma.user.count({where:{role:"SISWA"}}),
    prisma.user.count({where:{role:"PEMBIMBING"}}),
    prisma.journal.count(),
    prisma.user.findMany({where:{role:"SISWA",tempat_pkl:{not:null}},select:{tempat_pkl:true},distinct:["tempat_pkl"]}),
    prisma.journal.findMany({take:5,orderBy:{created_at:"desc"},include:{user:{select:{nama:true}},shift:true}})
  ]);
  return <AppShell role="ADMIN" title="Dashboard"><div className="page">
    <section className="hero"><div><span className="eyebrow">DASHBOARD ADMIN</span><h1>Ringkasan <span>Administrasi</span></h1><p className="muted">Pantau data utama Jurnal PKL dalam satu tampilan.</p></div></section>
    <div className="stat-grid stat-grid-4"><Stat n={students} label="Total Siswa"/><Stat n={supervisors} label="Total Pembimbing"/><Stat n={places.length} label="Total Tempat PKL"/><Stat n={journals} label="Total Jurnal"/></div>
    <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">AKTIVITAS</span><h2>Jurnal terbaru</h2></div><Link className="text-btn" href="/jurnal">Lihat semua</Link></div>
      <div className="recent-list">{latest.map(j=><Link href={`/jurnal/${j.id}`} className="recent-row" key={j.id}><div><b>{j.activity}</b><span>{j.user.nama} · {j.date.toLocaleDateString("id-ID")}</span></div><span className={`status ${j.status.toLowerCase()}`}>{j.status==="DRAFT"?"Draft":"Terkirim"}</span></Link>)}{!latest.length&&<div className="empty-state compact"><h3>Belum ada jurnal</h3><p>Belum ada kegiatan PKL yang dicatat.</p></div>}</div>
    </section>
  </div></AppShell>;
}
function Stat({n,label}:{n:number,label:string}){return <div className="stat-card glass"><strong>{n}</strong><span>{label}</span></div>}
