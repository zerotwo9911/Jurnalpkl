import { SVGProps } from "react";

export type IconName =
  | "dashboard" | "journal" | "history" | "calendar" | "chart" | "bell"
  | "user" | "users" | "check" | "plus" | "teacher" | "building" | "clock"
  | "logout" | "student" | "eye" | "eyeOff" | "arrowRight" | "alert";

const paths: Record<IconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  journal: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
  history: <><circle cx="12" cy="12" r="9"/><path d="M3 12a9 9 0 0 0 3 6.7M12 7v5l3 2"/></>,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 9h18"/></>,
  chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  users: <><circle cx="9" cy="8" r="4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.5a4 4 0 0 1 0 7.5M17 14.5a6 6 0 0 1 4.5 5.5"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  plus: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
  teacher: <><path d="M3 9.5 12 5l9 4.5-9 4.5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M21 10v6"/></>,
  building: <><path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17M2 21h20"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M11 21v-4h2v4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M13 4h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-6"/></>,
  student: <><path d="M3 9.5 12 5l9 4.5-9 4.5z"/><path d="M6 12v4.5c3 2 9 2 12 0V12M12 14v6"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/></>,
  eyeOff: <><path d="m3 3 18 18M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6"/><path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 3.9M6.2 6.2C3.5 8.2 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.7"/></>,
  arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  alert: <><path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2z"/><path d="M12 9v4M12 17h.01"/></>
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = "" }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{paths[name]}</svg>;
}
