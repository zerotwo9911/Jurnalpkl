"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Icon from "./Icon";

export default function AppShell({ children, role, title }: { children: React.ReactNode; role?: string; title?: string }) {
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    <Sidebar role={role} mobileOpen={open} onClose={() => setOpen(false)} />
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Buka menu"><Icon name="menu" /></button>
          <span className="mobile-brand">JURNAL PKL</span>
          {title && <span className="top-title">{title}</span>}
        </div>
        <div className="topbar-profile"><Icon name="user" size={16}/><span>Profil</span></div>
      </header>
      {children}
    </main>
  </div>;
}
