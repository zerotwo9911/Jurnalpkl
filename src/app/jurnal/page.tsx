import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import JournalForm from "@/components/JournalForm";

export default async function JournalPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <AppShell role={session.role} title="Jurnal PKL"><div className="page"><JournalForm /></div></AppShell>;
}