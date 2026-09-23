"use client";
import { useState } from "react";
import JournalForm from "./JournalForm";
import JournalList from "./JournalList";
export default function JournalWorkspace({role}:{role:string}){
 const [adding,setAdding]=useState(false);
 return <>{role==="SISWA"&&<div className="journal-toolbar"><div><h1>Jurnal PKL</h1><p className="muted">Catat dan kelola kegiatan Praktik Kerja Lapangan Anda.</p></div><button className="primary-btn" onClick={()=>setAdding(true)}>+ Tambah Jurnal</button></div>}
 {role!=="SISWA"&&<div className="journal-toolbar"><div><h1>Jurnal PKL</h1><p className="muted">{role==="ADMIN"?"Pantau seluruh jurnal siswa.":"Pantau jurnal siswa yang menjadi tanggung jawab Anda."}</p></div></div>}
 {adding&&<JournalForm onCancel={()=>setAdding(false)} onSaved={()=>{setAdding(false);window.location.reload()}}/>}
 <JournalList role={role}/></>;
}
