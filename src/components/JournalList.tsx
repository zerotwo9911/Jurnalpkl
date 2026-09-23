"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Journal = {
  id:number; date:string; start_time:string; end_time:string; activity:string; description?:string|null;
  status:"DRAFT"|"TERKIRIM"; user:{nama:string; kelas?:string|null}; shift:{name:string};
};
export default function JournalList({ role }: { role:string }) {
  const [data,setData]=useState<Journal[]>([]);
  const [q,setQ]=useState("");
  const [month,setMonth]=useState("");
  const [status,setStatus]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load() {
    setLoading(true); setError("");
    const p=new URLSearchParams();
    if(q.trim()) p.set("q",q.trim());
    if(month) p.set("month",month);
    if(status) p.set("status",status);
    const res=await fetch(`/api/journals?${p.toString()}`,{cache:"no-store"});
    const body=await res.json();
    if(!res.ok){setError(body.error||"Gagal memuat jurnal.");setLoading(false);return;}
    setData(body); setLoading(false);
  }
  useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[q,month,status]);

  async function remove(id:number){
    if(!window.confirm("Hapus jurnal ini?")) return;
    const res=await fetch(`/api/journals?id=${id}`,{method:"DELETE"});
    if(res.ok) load(); else {const b=await res.json();setError(b.error||"Jurnal gagal dihapus.");}
  }

  return <div className="journal-list">
    <div className="filter-bar">
      <div className="search-field"><span className="search-icon">Cari</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder={role==="SISWA"?"Cari kegiatan atau deskripsi...":"Cari kegiatan atau nama siswa..."} /></div>
      <input className="filter-input" type="month" value={month} onChange={e=>setMonth(e.target.value)} aria-label="Filter bulan"/>
      <select className="filter-input" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Semua status</option><option value="DRAFT">Draft</option><option value="TERKIRIM">Terkirim</option></select>
    </div>
    {error && <div className="error-box">{error}</div>}
    {loading ? <div className="empty-state"><div className="loader" /><p>Memuat jurnal...</p></div> :
      !data.length ? <div className="empty-state"><div className="empty-icon">J</div><h3>Belum ada jurnal</h3><p>Belum ada kegiatan PKL yang dicatat.</p>{role==="SISWA"&&<Link className="primary-btn" href="/jurnal?new=1">Tambah Jurnal</Link>}</div> :
      <div className="journal-cards">{data.map(j=><article className="journal-card" key={j.id}>
        <div className="journal-card-top"><div><span className="journal-date">{new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(new Date(j.date))}</span>{role!=="SISWA"&&<span className="journal-student">{j.user.nama} · {j.user.kelas||"Tanpa kelas"}</span>}</div><span className={`status ${j.status.toLowerCase()}`}>{j.status==="DRAFT"?"Draft":"Terkirim"}</span></div>
        <h3>{j.activity}</h3><p>{j.description||"Tidak ada deskripsi tambahan."}</p>
        <div className="journal-meta"><span>{j.start_time}–{j.end_time}</span><span>{j.shift.name}</span></div>
        <div className="journal-actions"><Link className="text-btn" href={`/jurnal/${j.id}`}>Lihat Detail</Link>{role==="SISWA"&&j.status==="DRAFT"&&<><Link className="text-btn" href={`/jurnal/${j.id}?edit=1`}>Edit</Link><button className="danger-text" onClick={()=>remove(j.id)}>Hapus</button></>}</div>
      </article>)}</div>}
  </div>;
}
