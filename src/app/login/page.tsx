"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login gagal.");
      setLoading(false);
      return;
    }

    router.push(data.role === "SISWA" ? "/dashboard" : data.role === "PEMBIMBING" ? "/pembimbing" : "/admin");
    router.refresh();
  }

  return (
    <main className="login-page">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-bg" />
      <form className="glass login-card" onSubmit={submit}>
        <div className="brand-mark">JP</div>
        <p className="eyebrow">DIGITAL JOURNAL SYSTEM</p>
        <h1>JURNAL <span>PKL</span></h1>
        <p className="muted">Kelola jurnal kegiatan PKL dengan cepat dan terstruktur.</p>

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan username" autoComplete="username" />

        <label>Password</label>
        <div className="password-wrap">
          <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password" />
          <button type="button" className="eye" onClick={() => setShow(!show)}>{show ? "🙈" : "👁"}</button>
        </div>

        {error && <div className="error-box">{error}</div>}
        <button className="primary-btn" disabled={loading}>{loading ? "MEMPROSES..." : "MASUK →"}</button>

        <div className="demo-hint">Demo: siswa01 / 12345678</div>
      </form>
    </main>
  );
}