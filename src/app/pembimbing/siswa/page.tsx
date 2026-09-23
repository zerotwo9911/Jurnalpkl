import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function StudentList(){
 const session=await getSession(); if(!session) redirect("/login"); if(session.role!=="PEMBIMBING") redirect("/");
 const students=await prisma.user.findMany({where:{role:"SISWA",pembimbing:session.nama},orderBy:{nama:"asc"}});
 const counts=await Promise.all(students.map(s=>prisma.journal.count({where:{user_id:s.id}})));
 return <AppShell role="PEMBIMBING" title="Siswa Bimbingan"><div className="page"><div className="detail-head"><div><span className="eyebrow">DATA SISWA</span><h1>Siswa Bimbingan</h1><p className="muted">Daftar siswa yang menjadi tanggung jawab Anda.</p></div></div><div className="student-table">{students.map((s,i)=><div className="student-row" key={s.id}><div><b>{s.nama}</b><span>{s.kelas||"-"} · {s.jurusan||"-"}</span></div><span>{s.tempat_pkl||"-"}</span><strong>{counts[i]} jurnal</strong><Link className="text-btn" href={`/pembimbing/siswa/${s.id}`}>Lihat Jurnal</Link></div>)}{!students.length&&<div className="empty-state"><h3>Belum ada siswa bimbingan</h3><p>Belum ada data siswa yang terhubung dengan akun Anda.</p></div>}</div></div></AppShell>;
}
