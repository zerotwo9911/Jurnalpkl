import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function JournalDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const id=Number((await params).id);
  if(!Number.isInteger(id)) notFound();
  const journal=await prisma.journal.findUnique({where:{id},include:{shift:true,user:true}});
  if(!journal) notFound();
  const allowed=session.role==="ADMIN" || (session.role==="SISWA" && journal.user_id===session.id) || (session.role==="PEMBIMBING" && journal.user.role==="SISWA" && journal.user.pembimbing===session.nama);
  if(!allowed) redirect("/jurnal");
  return <AppShell role={session.role} title="Detail Jurnal"><div className="page detail-page">
    <div className="detail-head"><div><span className="eyebrow">JURNAL PKL</span><h1>Detail Jurnal</h1><p className="muted">Informasi lengkap kegiatan yang dicatat.</p></div><Link className="secondary-btn" href="/jurnal">Kembali</Link></div>
    <section className="detail-card">
      <div className="detail-status"><span className={`status ${journal.status.toLowerCase()}`}>{journal.status==="DRAFT"?"Draft":"Terkirim"}</span></div>
      <div className="detail-grid">
        <div><small>Tanggal</small><strong>{journal.date.toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</strong></div>
        <div><small>Waktu</small><strong>{journal.start_time} – {journal.end_time}</strong></div>
        <div className="field-span-2"><small>Kegiatan</small><strong>{journal.activity}</strong></div>
        <div className="field-span-2"><small>Deskripsi</small><p>{journal.description||"Tidak ada deskripsi tambahan."}</p></div>
        <div><small>Siswa</small><strong>{journal.user.nama}</strong></div>
        <div><small>Tempat PKL</small><strong>{journal.user.tempat_pkl||"-"}</strong></div>
        <div><small>Pembimbing</small><strong>{journal.user.pembimbing||"-"}</strong></div>
        <div><small>Shift</small><strong>{journal.shift.name}</strong></div>
      </div>
    </section>
  </div></AppShell>;
}
