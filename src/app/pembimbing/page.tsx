import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function PembimbingPage() {
 const session=await getSession(); if(!session) redirect("/login"); if(session.role!=="PEMBIMBING") redirect("/");
 const students=await prisma.user.findMany({where:{role:"SISWA",pembimbing:session.nama},orderBy:{nama:"asc"}});
 const ids=students.map(s=>s.id);
 const [totalJournals,latest]=await Promise.all([
   prisma.journal.count({where:{user_id:{in:ids}}}),
   prisma.journal.findMany({where:{user_id:{in:ids}},take:5,orderBy:{created_at:"desc"},include:{user:{select:{nama:true}},shift:true}})
 ]);
 return <AppShell role="PEMBIMBING" title="Dashboard"><div className="page">
   <section className="hero"><div><span className="eyebrow">DASHBOARD PEMBIMBING</span><h1>Halo, <span>{session.nama}</span></h1><p className="muted">Pantau jurnal siswa yang menjadi tanggung jawab Anda.</p></div></section>
   <div className="stat-grid"><Stat n={students.length} label="Siswa Bimbingan"/><Stat n={totalJournals} label="Total Jurnal"/><Stat n={latest.length} label="Jurnal Terbaru"/></div>
   <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">SISWA BIMBINGAN</span><h2>Daftar siswa</h2></div><Link className="text-btn" href="/pembimbing/siswa">Lihat semua</Link></div>
   <div className="student-grid">{students.slice(0,6).map(s=><div className="student-card" key={s.id}><div><b>{s.nama}</b><span>{s.kelas||"-"} · {s.jurusan||"-"}</span><span>{s.tempat_pkl||"Tempat PKL belum diatur"}</span></div><Link className="text-btn" href={`/pembimbing/siswa/${s.id}`}>Lihat Jurnal</Link></div>)}{!students.length&&<div className="empty-state compact"><h3>Belum ada siswa bimbingan</h3><p>Data siswa dengan pembimbing ini akan tampil di sini.</p></div>}</div></section>
   <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">AKTIVITAS</span><h2>Jurnal terbaru</h2></div></div><div className="recent-list">{latest.map(j=><Link href={`/jurnal/${j.id}`} className="recent-row" key={j.id}><div><b>{j.activity}</b><span>{j.user.nama} · {j.date.toLocaleDateString("id-ID")}</span></div><span className={`status ${j.status.toLowerCase()}`}>{j.status==="DRAFT"?"Draft":"Terkirim"}</span></Link>)}</div></section>
 </div></AppShell>;
}
function Stat({n,label}:{n:number,label:string}){return <div className="stat-card glass"><strong>{n}</strong><span>{label}</span></div>}
