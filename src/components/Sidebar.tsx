"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Sidebar({ role = "SISWA" }: { role?: string }) {
  const path = usePathname();
  const router = useRouter();

  const student = [
    ["📊", "Dashboard", "/dashboard"],
    ["📝", "Jurnal PKL", "/jurnal"],
    ["🕘", "Riwayat Jurnal", "/riwayat"],
    ["📅", "Kalender", "/kalender"],
    ["📈", "Laporan", "/laporan"],
    ["🔔", "Notifikasi", "/notifikasi"],
    ["👤", "Profil", "/profil"]
  ];
  const supervisor = [
    ["📊", "Dashboard", "/pembimbing"],
    ["👥", "Siswa Bimbingan", "/pembimbing/siswa"],
    ["✓", "Persetujuan", "/pembimbing/persetujuan"],
    ["📋", "Jurnal", "/jurnal"],
    ["📈", "Laporan", "/laporan"],
    ["🔔", "Notifikasi", "/notifikasi"]
  ];
  const admin = [
    ["📊", "Dashboard", "/admin"],
    ["👥", "Siswa", "/admin/siswa"],
    ["➕", "Tambah Akun", "/admin/akun"],
    ["🧑‍🏫", "Pembimbing", "/admin/pembimbing"],
    ["🏢", "Tempat PKL", "/admin/tempat-pkl"],
    ["⏱", "Shift", "/admin/shift"],
    ["📝", "Jurnal", "/jurnal"],
    ["📈", "Laporan", "/laporan"],
    ["🔔", "Notifikasi", "/notifikasi"]
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
        <span>{icon}</span><span>{label}</span>
      </button>
    )}</nav>
    <button className="logout-btn" onClick={logout}>↪ Keluar</button>
  </aside>;
}