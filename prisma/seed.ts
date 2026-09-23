import { PrismaClient, Role, JournalStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
 const password = await bcrypt.hash("12345678",12);
 const existingPlace=await prisma.tempatPkl.findFirst({where:{nama:"PT Contoh"}});
 const place=existingPlace||await prisma.tempatPkl.create({data:{nama:"PT Contoh",alamat:"Alamat contoh",kontak:"-"}});
 const pagi=await prisma.shift.upsert({where:{id:1},update:{name:"Pagi",start_time:"07:45",end_time:"15:00",active:true},create:{id:1,name:"Pagi",start_time:"07:45",end_time:"15:00"}});
 await prisma.shift.upsert({where:{id:2},update:{name:"Siang",start_time:"13:00",end_time:"21:00",active:true},create:{id:2,name:"Siang",start_time:"13:00",end_time:"21:00"}});
 const admin=await prisma.user.upsert({where:{username:"admin"},update:{nama:"Administrator",password,role:Role.ADMIN},create:{username:"admin",nama:"Administrator",password,role:Role.ADMIN}});
 const pembimbing=await prisma.user.upsert({where:{username:"pembimbing01"},update:{nama:"Bapak Contoh",password,role:Role.PEMBIMBING,sekolah:"SMKN 1 Sidayu"},create:{username:"pembimbing01",nama:"Bapak Contoh",password,role:Role.PEMBIMBING,sekolah:"SMKN 1 Sidayu"}});
 const siswa=await prisma.user.upsert({where:{username:"siswa01"},update:{nama:"Ahmad",password,role:Role.SISWA,kelas:"XII TKJ 1",jurusan:"Teknik Komputer dan Jaringan",sekolah:"SMKN 1 Sidayu",tempat_pkl:place.nama,pembimbing:pembimbing.nama,tempat_pkl_id:place.id,pembimbing_id:pembimbing.id},create:{username:"siswa01",nama:"Ahmad",password,role:Role.SISWA,kelas:"XII TKJ 1",jurusan:"Teknik Komputer dan Jaringan",sekolah:"SMKN 1 Sidayu",tempat_pkl:place.nama,pembimbing:pembimbing.nama,tempat_pkl_id:place.id,pembimbing_id:pembimbing.id}});
 if(!(await prisma.journal.count({where:{user_id:siswa.id}}))) await prisma.journal.create({data:{user_id:siswa.id,shift_id:pagi.id,date:new Date(),start_time:pagi.start_time,end_time:pagi.end_time,activity:"Melakukan pemeriksaan instalasi dan membantu teknisi melakukan perawatan peralatan.",description:"Kegiatan berjalan dengan baik.",status:JournalStatus.DRAFT}});
 console.log("Seed selesai.",admin.username);
}
main().finally(()=>prisma.$disconnect());
