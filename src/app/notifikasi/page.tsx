import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export default async function Notifications() {
  const session = await getSession();
  if (!session) redirect("/login");
  const data = await prisma.notification.findMany({ where: { user_id: session.id }, orderBy: { created_at: "desc" }, take: 50 });

  return <AppShell role={session.role} title="Notifikasi"><div className="page">
    <div className="page-heading"><div><span className="eyebrow">PUSAT INFORMASI</span><h1>Notifikasi</h1></div><span className="pill">{data.filter(x => !x.is_read).length} belum dibaca</span></div>
    <div className="notification-list">{data.map(n => <div className={`notification glass ${!n.is_read ? "unread" : ""}`} key={n.id}><div className="notif-icon"><span aria-hidden="true">N</span></div><div><b>{n.title}</b><p>{n.message}</p><small>{n.created_at.toLocaleString("id-ID")}</small></div></div>)}</div>
  </div></AppShell>;
}