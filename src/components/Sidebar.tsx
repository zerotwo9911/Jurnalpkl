"use client";

import { usePathname, useRouter } from "next/navigation";
import Icon, { IconName } from "./Icons";

type NavItem = [IconName, string, string];

export default function Sidebar({ role = "SISWA" }: { role?: string }) {
  const path = usePathname();
  const router = useRouter();

  const student: NavItem[] = [
    ["dashboard", "Dashboard", "/dashboard"], ["journal", "Jurnal PKL", "/jurnal"], ["history", "Riwayat Jurnal", "/riwayat"],
    ["calendar", "Kalender", "/kalender"], ["chart", "Laporan", "/laporan"], ["bell", "Notifikasi", "/notifikasi"], ["user", "Profil", "/profil"]
  ];
  const supervisor: NavItem[] = [
    ["dashboard", "Dashboard", "/pembimbing"], ["users", "Siswa Bimbingan", "/pembimbing/siswa"], ["check", "Persetujuan", "/pembimbing/persetujuan"],
    ["journal", "Jurnal", "/jurnal"], ["chart", "Laporan", "/laporan"], ["bell", "Notifikasi", "/notifikasi"]
  ];
  const admin: NavItem[] = [
    ["dashboard", "Dashboard", "/admin"], ["users", "Siswa", "/admin/siswa"], ["plus", "Tambah Akun", "/admin/akun"], ["teacher", "Pembimbing", "/admin/pembimbing"],
    ["building", "Tempat PKL", "/admin/tempat-pkl"], ["clock", "Shift", "/admin/shift"], ["journal", "Jurnal", "/jurnal"], ["chart", "Laporan", "/laporan"], ["bell", "Notifikasi", "/notifikasi"]
  ];

  const items = role === "ADMIN" ? admin : role === "PEMBIMBING" ? supervisor : student;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return <aside className="sidebar">
    <div className="side-brand"><div className="brand-mark small">JP</div><div><b>JURNAL PKL</b><small>Digital Journal</small></div></div>
    <nav>{items.map(([icon, label, href]) =>
      <button key={href} className={path === href ? "nav-item active" : "nav-item"} onClick={() => router.push(href)}>
        <span className="nav-icon"><Icon name={icon} /></span><span>{label}</span>
      </button>
    )}</nav>
    <button className="logout-btn" onClick={logout}><Icon name="logout" /> <span>Keluar</span></button>
  </aside>;
}
