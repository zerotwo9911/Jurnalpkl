import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import JournalWorkspace from "@/components/JournalWorkspace";

export default async function JournalPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <AppShell role={session.role} title="Jurnal PKL"><div className="page"><JournalWorkspace role={session.role}/></div></AppShell>;
}
