"use client";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";

const groups=(role:string)=>{
 if(role==="ADMIN") return [
  {title:"UMUM",items:[["dashboard","Dashboard","/admin"]]},
  {title:"DATA",items:[["users","Data Siswa","/admin/siswa"],["user","Data Pembimbing","/admin/pembimbing"],["building","Tempat PKL","/admin/tempat-pkl"],["clock","Shift","/admin/shift"]]},
  {title:"JURNAL",items:[["book","Jurnal PKL","/jurnal"]]},
  {title:"LAINNYA",items:[["bell","Notifikasi","/notifikasi"],["user","Profil","/profil"]]}
 ];
 if(role==="PEMBIMBING") return [
  {title:"UMUM",items:[["dashboard","Dashboard","/pembimbing"]]},
  {title:"DATA",items:[["users","Siswa Bimbingan","/pembimbing/siswa"]]},
  {title:"JURNAL",items:[["book","Jurnal PKL","/jurnal"]]},
  {title:"LAINNYA",items:[["bell","Notifikasi","/notifikasi"],["user","Profil","/profil"]]}
 ];
 return [
  {title:"UMUM",items:[["dashboard","Dashboard","/dashboard"]]},
  {title:"JURNAL",items:[["book","Jurnal PKL","/jurnal"]]},
  {title:"LAINNYA",items:[["bell","Notifikasi","/notifikasi"],["user","Profil","/profil"]]}
 ];
};
export default function Sidebar({role="SISWA"}:{role?:string}){
 const path=usePathname(),router=useRouter();
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/login");router.refresh();}
 return <aside className="sidebar"><div className="side-brand"><div className="brand-mark small">JP</div><div><b>JURNAL PKL</b><small>Digital Journal</small></div></div><nav>{groups(role).map(g=><div className="nav-group" key={g.title}><span className="nav-group-title">{g.title}</span>{g.items.map(([icon,label,href])=><button key={href} className={path===href||path.startsWith(href+"/")?"nav-item active":"nav-item"} onClick={()=>router.push(href)}><Icon name={icon}/><span>{label}</span></button>)}</div>)}</nav><button className="logout-btn" onClick={logout}><Icon name="logout"/><span>Keluar</span></button></aside>;
}
