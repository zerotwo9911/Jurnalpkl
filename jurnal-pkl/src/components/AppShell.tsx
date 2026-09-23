"use client";

import Sidebar from "./Sidebar";

export default function AppShell({ children, role, title }: { children: React.ReactNode; role?: string; title?: string }) {
  return <div className="app-shell">
    <Sidebar role={role} />
    <main className="main-area">
      <header className="topbar">
        <div><span className="mobile-brand">JURNAL PKL</span>{title && <span className="top-title">{title}</span>}</div>
        <div className="top-status"><span className="live-dot" /> Sistem Online</div>
      </header>
      {children}
    </main>
  </div>;
}