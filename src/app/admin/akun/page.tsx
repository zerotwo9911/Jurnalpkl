"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function AdminAkunPage() {
  const router = useRouter();
  const [role, setRole] = useState<"SISWA" | "PEMBIMBING">("SISWA");
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [sekolah, setSekolah] = useState("");
  const [tempatPkl, setTempatPkl] = useState("");
  const [pembimbing, setPembimbing] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setNama(""); setUsername(""); setPassword(""); setKelas("");
    setJurusan(""); setSekolah(""); setTempatPkl(""); setPembimbing("");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama, username, password, role, kelas, jurusan, sekolah,
          tempat_pkl: tempatPkl, pembimbing
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat akun.");
      setMessage(`Akun ${data.user.nama} berhasil dibuat. Username: ${data.user.username}`);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell role="ADMIN" title="Tambah Akun">
      <div className="page">
        <section className="hero">
          <div>
            <span className="eyebrow">USER MANAGEMENT</span>
            <h1>Tambah Akun <span>Siswa / Pembimbing</span></h1>
            <p className="muted">Buat akun baru langsung dari dashboard admin.</p>
          </div>
        </section>

        <div className="form-card glass account-form-card">
          <div className="section-title">
            <div><span className="eyebrow">FORM AKUN</span><h2>Data pengguna</h2></div>
            <span className="pill">ADMIN ONLY</span>
          </div>

          <form onSubmit={submit}>
            <div className="role-switch">
              <button type="button" className={role === "SISWA" ? "role-option active" : "role-option"} onClick={() => setRole("SISWA")}>👨‍🎓 Siswa</button>
              <button type="button" className={role === "PEMBIMBING" ? "role-option active" : "role-option"} onClick={() => setRole("PEMBIMBING")}>🧑‍🏫 Pembimbing</button>
            </div>

            <div className="form-grid account-grid">
              <div><label>Nama lengkap</label><input value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Muhammad Afif" required /></div>
              <div><label>Username</label><input value={username} onChange={e => setUsername(e.target.value)} placeholder="Contoh: afif01" required /></div>
              <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" minLength={6} required /></div>
              <div><label>Sekolah</label><input value={sekolah} onChange={e => setSekolah(e.target.value)} placeholder="Nama sekolah" /></div>
              {role === "SISWA" && <>
                <div><label>Kelas</label><input value={kelas} onChange={e => setKelas(e.target.value)} placeholder="Contoh: XII TKJ 1" /></div>
                <div><label>Jurusan</label><input value={jurusan} onChange={e => setJurusan(e.target.value)} placeholder="Contoh: Teknik Komputer dan Jaringan" /></div>
                <div><label>Tempat PKL</label><input value={tempatPkl} onChange={e => setTempatPkl(e.target.value)} placeholder="Nama perusahaan/tempat PKL" /></div>
                <div><label>Pembimbing</label><input value={pembimbing} onChange={e => setPembimbing(e.target.value)} placeholder="Nama pembimbing" /></div>
              </>}
            </div>

            {error && <div className="error-box">{error}</div>}
            {message && <div className="success-box">{message}</div>}
            <div className="action-row"><button className="primary-btn" type="submit" disabled={loading}>{loading ? "Menyimpan..." : `+ Buat Akun ${role === "SISWA" ? "Siswa" : "Pembimbing"}`}</button></div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
