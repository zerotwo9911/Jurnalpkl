import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function Students({params}:{params:Promise<{id:string}>}) {
 const session=await getSession(); if(!session) redirect("/login"); if(session.role!=="PEMBIMBING") redirect("/");
 const id=Number((await params).id);
 const student=await prisma.user.findFirst({where:{id,role:"SISWA",pembimbing:session.nama},include:{journals:{orderBy:{date:"desc"},include:{shift:true}}}});
 if(!student) redirect("/pembimbing/siswa");
 return <AppShell role="PEMBIMBING" title="Siswa Bimbingan"><div className="page"><div className="detail-head"><div><span className="eyebrow">SISWA BIMBINGAN</span><h1>{student.nama}</h1><p className="muted">{student.kelas||"-"} · {student.jurusan||"-"} · {student.tempat_pkl||"-"}</p></div><Link className="secondary-btn" href="/pembimbing/siswa">Kembali</Link></div>
 <div className="journal-cards">{student.journals.map(j=><article className="journal-card" key={j.id}><div className="journal-card-top"><span className="journal-date">{j.date.toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</span><span className={`status ${j.status.toLowerCase()}`}>{j.status==="DRAFT"?"Draft":"Terkirim"}</span></div><h3>{j.activity}</h3><p>{j.description||"Tidak ada deskripsi tambahan."}</p><div className="journal-meta"><span>{j.start_time}–{j.end_time}</span><span>{j.shift.name}</span></div><Link className="text-btn" href={`/jurnal/${j.id}`}>Lihat Detail</Link></article>)}{!student.journals.length&&<div className="empty-state"><h3>Belum ada jurnal</h3><p>Siswa ini belum mencatat kegiatan PKL.</p></div>}</div>
 </div></AppShell>;
}
