"use client";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";

const groups=(role:string)=>{
 if(role==="ADMIN") return [
  {title:"UTAMA",items:[["dashboard","Dashboard","/admin"],["book","Jurnal","/jurnal"]]},
  {title:"DATA",items:[["users","Siswa","/admin/siswa"],["user","Pembimbing","/admin/pembimbing"],["building","Tempat PKL","/admin/tempat-pkl"],["clock","Shift","/admin/shift"]]},
  {title:"LAINNYA",items:[["chart","Rekap","/admin/rekap"],["settings","Pengaturan","/pengaturan"],["user","Profil","/profil"]]}
 ];
 if(role==="PEMBIMBING") return [
  {title:"UTAMA",items:[["dashboard","Dashboard","/pembimbing"],["users","Siswa Bimbingan","/pembimbing/siswa"],["book","Jurnal","/jurnal"]]},
  {title:"AKUN",items:[["user","Profil","/profil"]]}
 ];
 return [
  {title:"UTAMA",items:[["dashboard","Dashboard","/dashboard"],["book","Jurnal","/jurnal"]]},
  {title:"AKUN",items:[["user","Profil","/profil"]]}
 ];
};
export default function Sidebar({role="SISWA", mobileOpen=false, onClose}:{role?:string;mobileOpen?:boolean;onClose?:()=>void}){
 const path=usePathname(),router=useRouter();
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/login");router.refresh();}
 return <>
    {mobileOpen&&<button className="sidebar-overlay" aria-label="Tutup menu" onClick={onClose}/>}
  <aside className={`sidebar ${mobileOpen?"open":""}`}>
   <div className="side-brand"><div className="brand-mark small">JP</div><div><b>JURNAL PKL</b><small>Sistem Manajemen PKL</small></div><button className="sidebar-close" onClick={onClose} aria-label="Tutup menu"><Icon name="close"/></button></div>
   <nav>{groups(role).map(g=><div className="nav-group" key={g.title}><span className="nav-group-title">{g.title}</span>{g.items.map(([icon,label,href])=><button key={href} className={path===href||path.startsWith(href+"/")?"nav-item active":"nav-item"} onClick={()=>{router.push(href);onClose?.()}}><Icon name={icon}/><span>{label}</span></button>)}</div>)}</nav>
   <button className="logout-btn" onClick={logout}><Icon name="logout"/><span>Logout</span></button>
  </aside>
 </>;
}
