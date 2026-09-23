import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function Riwayat() {
  const session = await getSession();
  if (!session) redirect("/login");

  const journals = await prisma.journal.findMany({
    where: session.role === "SISWA" ? { user_id: session.id } : {},
    include: { shift: true, user: { select: { nama: true } } },
    orderBy: { date: "desc" },
    take: 100
  });

  return <AppShell role={session.role} title="Riwayat Jurnal"><div className="page">
    <div className="page-heading"><div><span className="eyebrow">JURNAL</span><h1>Riwayat Jurnal</h1></div><input className="search" placeholder="Cari kegiatan jurnal..." /></div>
    <div className="table-wrap glass">
      <table><thead><tr><th>Tanggal</th><th>Pengguna</th><th>Shift</th><th>Jam</th><th>Kegiatan</th><th>Status</th></tr></thead>
      <tbody>{journals.map(j => <tr key={j.id}><td>{j.date.toLocaleDateString("id-ID")}</td><td>{j.user.nama}</td><td>{j.shift.name}</td><td>{j.start_time} - {j.end_time}</td><td className="activity-cell">{j.activity}</td><td><Status status={j.status} /></td></tr>)}</tbody></table>
      {!journals.length && <div className="empty">Belum ada jurnal.<br/><small>Mulai catat kegiatan PKL kamu hari ini.</small></div>}
    </div>
  </div></AppShell>;
}

function Status({ status }: { status: string }) {
  const label: Record<string,string> = { DRAFT:"DRAFT", MENUNGGU_PERSETUJUAN:"MENUNGGU", DISETUJUI:"DISETUJUI", PERLU_REVISI:"REVISI" };
  return <span className={`status ${status.toLowerCase()}`}>{label[status] || status}</span>;
}