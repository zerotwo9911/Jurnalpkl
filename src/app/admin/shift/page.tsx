import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
export default async function ShiftPage(){const s=await getSession();if(!s)redirect("/login");if(s.role!=="ADMIN")redirect("/");const rows=await prisma.shift.findMany({orderBy:{id:"asc"}});return <AppShell role="ADMIN" title="Shift"><div className="page"><div className="detail-head"><div><span className="eyebrow">DATA SHIFT</span><h1>Shift PKL</h1><p className="muted">Daftar waktu kerja yang digunakan pada jurnal.</p></div></div><div className="student-table">{rows.map(x=><div className="student-row" key={x.id}><div><b>{x.name}</b><span>Shift #{x.id}</span></div><strong>{x.start_time} – {x.end_time}</strong></div>)}{!rows.length&&<div className="empty-state"><h3>Belum ada shift</h3><p>Tambahkan shift melalui pengelolaan database yang sudah tersedia.</p></div>}</div></div></AppShell>}
