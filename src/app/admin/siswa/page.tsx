import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
export default async function AdminSiswa(){
 const s=await getSession(); if(!s) redirect("/login"); if(s.role!=="ADMIN") redirect("/");
 const users=await prisma.user.findMany({where:{role:"SISWA"},orderBy:{nama:"asc"},include:{_count:{select:{journals:true}}}});
 return <AppShell role="ADMIN" title="Data Siswa"><div className="page"><div className="detail-head"><div><span className="eyebrow">DATA SISWA</span><h1>Data Siswa</h1><p className="muted">Kelola akun dan informasi siswa PKL.</p></div><Link className="primary-btn" href="/admin/akun">+ Tambah Siswa</Link></div><div className="student-table">{users.map(u=><div className="student-row" key={u.id}><div><b>{u.nama}</b><span>{u.username} · {u.kelas||"-"}</span></div><span>{u.tempat_pkl||"-"}</span><strong>{u._count.journals} jurnal</strong><span>{u.pembimbing||"-"}</span></div>)}{!users.length&&<div className="empty-state"><h3>Belum ada siswa</h3><p>Tambahkan akun siswa untuk mulai mengelola data.</p></div>}</div></div></AppShell>;
}
