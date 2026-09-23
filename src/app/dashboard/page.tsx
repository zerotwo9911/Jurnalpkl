import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import Clock from "@/components/Clock";

export default async function Dashboard() {
 const session=await getSession(); if(!session) redirect("/login"); if(session.role!=="SISWA") redirect(session.role==="ADMIN"?"/admin":"/pembimbing");
 const user=await prisma.user.findUnique({where:{id:session.id}}); if(!user) redirect("/login");
 const [total,drafts,recent]=await Promise.all([
  prisma.journal.count({where:{user_id:session.id}}),
  prisma.journal.count({where:{user_id:session.id,status:"DRAFT"}}),
  prisma.journal.findMany({where:{user_id:session.id},take:5,orderBy:{date:"desc"},include:{shift:true}})
 ]);
 return <AppShell role="SISWA" title="Dashboard"><div className="page">
  <section className="hero"><div><span className="eyebrow">DASHBOARD SISWA</span><h1>Selamat datang, <span>{user.nama}</span></h1><p className="muted">Kelola kegiatan PKL dengan rapi dan terstruktur.</p></div><Clock/></section>
  <section className="profile-strip glass"><div><b>{user.nama}</b><small>NAMA</small></div><div><b>{user.kelas||"-"}</b><small>KELAS</small></div><div><b>{user.jurusan||"-"}</b><small>JURUSAN</small></div><div><b>{user.tempat_pkl||"-"}</b><small>TEMPAT PKL</small></div><div><b>{user.pembimbing||"-"}</b><small>PEMBIMBING</small></div></section>
  <div className="stat-grid"><Stat n={total} label="Total Jurnal"/><Stat n={drafts} label="Draft Jurnal"/></div>
  <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">JURNAL TERBARU</span><h2>Kegiatan terakhir</h2></div><Link className="primary-btn" href="/jurnal">Kelola Jurnal</Link></div><div className="recent-list">{recent.map(j=><Link href={`/jurnal/${j.id}`} className="recent-row" key={j.id}><div><b>{j.activity}</b><span>{j.date.toLocaleDateString("id-ID")} · {j.start_time}–{j.end_time}</span></div><span className={`status ${j.status.toLowerCase()}`}>{j.status==="DRAFT"?"Draft":"Terkirim"}</span></Link>)}{!recent.length&&<div className="empty-state compact"><h3>Belum ada jurnal</h3><p>Mulai catat kegiatan PKL Anda.</p></div>}</div></section>
 </div></AppShell>;
}
function Stat({n,label}:{n:number,label:string}){return <div className="stat-card glass"><strong>{n}</strong><span>{label}</span></div>}
