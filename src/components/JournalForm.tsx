"use client";

import { useEffect, useState } from "react";

type Shift = { id: number; name: string; start_time: string; end_time: string };

export default function JournalForm({ onSaved, onCancel }: { onSaved?: () => void; onCancel?: () => void }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftId, setShiftId] = useState<number>();
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/shifts").then(r => r.json()).then((data: Shift[]) => {
      setShifts(data);
      if (data[0]) { setShiftId(data[0].id); setStart(data[0].start_time); setEnd(data[0].end_time); }
    });
  }, []);

  function changeShift(id: number) {
    const s = shifts.find(x => x.id === id);
    setShiftId(id);
    if (s) { setStart(s.start_time); setEnd(s.end_time); }
  }

  async function save(nextStatus: "DRAFT" | "TERKIRIM") {
    setMsg("");
    if (!shiftId || activity.trim().length < 5) { setMsg("Lengkapi kegiatan dan shift terlebih dahulu."); return; }
    setSaving(true);
    const res = await fetch("/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, shift_id: shiftId, start_time: start, end_time: end, activity, description, status: nextStatus })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setMsg(data.error || "Jurnal gagal disimpan."); return; }
    setMsg(nextStatus === "DRAFT" ? "Draft jurnal berhasil disimpan." : "Jurnal berhasil dikirim.");
    onSaved?.();
  }

  return <section className="journal-form-card">
    <div className="section-title">
      <div><span className="eyebrow">JURNAL HARIAN</span><h2>Tambah Jurnal PKL</h2><p className="muted">Catat kegiatan PKL secara terstruktur.</p></div>
      <button className="icon-btn" type="button" onClick={onCancel} aria-label="Tutup">×</button>
    </div>
    <div className="form-grid journal-form-grid">
      <div><label>Tanggal</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
      <div><label>Shift</label><select value={shiftId ?? ""} onChange={e => changeShift(Number(e.target.value))}><option value="" disabled>Pilih shift</option>{shifts.map(s => <option key={s.id} value={s.id}>{s.name} · {s.start_time}–{s.end_time}</option>)}</select></div>
      <div><label>Jam mulai</label><input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
      <div><label>Jam selesai</label><input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
      <div className="field-span-2"><label>Judul / kegiatan</label><input value={activity} onChange={e => setActivity(e.target.value)} placeholder="Contoh: Konfigurasi jaringan komputer" maxLength={10000} /></div>
      <div className="field-span-2"><label>Deskripsi kegiatan <span className="optional">(opsional)</span></label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Jelaskan kegiatan yang dilakukan, hasil, atau catatan penting." rows={6} maxLength={10000} /></div>
    </div>
    {msg && <div className={msg.includes("berhasil") ? "success-box" : "error-box"}>{msg}</div>}
    <div className="action-row">
      <button className="secondary-btn" type="button" disabled={saving} onClick={() => save("DRAFT")}>Simpan Draft</button>
      <button className="primary-btn" type="button" disabled={saving} onClick={() => save("TERKIRIM")}>{saving ? "Menyimpan..." : "Simpan Jurnal"}</button>
    </div>
  </section>;
}
