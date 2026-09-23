"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icons";

type Shift = { id: number; name: string; start_time: string; end_time: string };

export default function JournalForm({ onSaved }: { onSaved?: () => void }) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftId, setShiftId] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("07:45");
  const [end, setEnd] = useState("15:00");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/shifts").then(r => r.json()).then(data => {
      setShifts(data);
      if (data[0]) {
        setShiftId(data[0].id);
        setStart(data[0].start_time);
        setEnd(data[0].end_time);
      }
    });
  }, []);

  function changeShift(id: number) {
    const s = shifts.find(x => x.id === id);
    setShiftId(id);
    if (s) { setStart(s.start_time); setEnd(s.end_time); }
  }

  async function save(status: "DRAFT" | "MENUNGGU_PERSETUJUAN") {
    setSaving(true); setMsg("");
    const res = await fetch("/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, shift_id: shiftId, start_time: start, end_time: end, activity, description, status })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setMsg(data.error || "Jurnal gagal disimpan."); return; }
    setMsg(status === "DRAFT" ? "Draft tersimpan" : "Jurnal dikirim untuk persetujuan");
    onSaved?.();
  }

  const count = activity.length;

  return <section className="glass form-card">
    <div className="section-title"><div><span className="eyebrow">CATATAN KEGIATAN</span><h2>Tambah Jurnal PKL</h2></div><span className="pill">Autosave siap</span></div>

    <div className="form-grid">
      <div><label>Tanggal</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
      <div><label>Shift</label><select value={shiftId} onChange={e => changeShift(Number(e.target.value))}>{shifts.map(s => <option key={s.id} value={s.id}>Shift {s.name}</option>)}</select></div>
      <div><label>Jam Mulai</label><input type="time" value={start} onChange={e => setStart(e.target.value)} /></div>
      <div><label>Jam Selesai</label><input type="time" value={end} onChange={e => setEnd(e.target.value)} /></div>
    </div>

    <label>Kegiatan</label>
    <textarea value={activity} onChange={e => setActivity(e.target.value)} placeholder="Tuliskan kegiatan PKL yang kamu lakukan hari ini..." rows={7} maxLength={10000} />
    <div className="counter">{count.toLocaleString("id-ID")} / 10.000 karakter</div>

    <label>Keterangan</label>
    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Keterangan tambahan (opsional)" rows={4} />

    {msg && <div className="success-box">{msg}</div>}
    <div className="action-row">
      <button className="secondary-btn" disabled={saving || activity.length < 5} onClick={() => save("DRAFT")}>SIMPAN DRAFT</button>
      <button className="primary-btn" disabled={saving || activity.length < 5} onClick={() => save("MENUNGGU_PERSETUJUAN")}>{saving ? "MENYIMPAN..." : <>KIRIM UNTUK PERSETUJUAN <Icon name="arrowRight" size={16} /></>}</button>
    </div>
  </section>;
}