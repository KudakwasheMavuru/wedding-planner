"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/checklist", label: "Checklist", icon: "✓" },
  { href: "/budget", label: "Budget", icon: "$" },
  { href: "/guests", label: "Guests", icon: "♥" },
  { href: "/vendors", label: "Vendors", icon: "☎" },
  { href: "/timeline", label: "Day-Of Timeline", icon: "◷" },
  { href: "/seating", label: "Seating Chart", icon: "⊞" },
  { href: "/payments", label: "Payments", icon: "✉" },
  { href: "/notes", label: "Notes", icon: "✎" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col z-30"
      style={{ background: "var(--sage-evergreen)" }}>
      <div className="px-6 py-8 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-hint)" }}>Wedding Planner</p>
        <h1 className="text-white font-serif text-lg leading-tight">Kudakwashe<br />&amp; Maxine</h1>
        <p className="text-xs mt-2" style={{ color: "var(--sage-hint)" }}>28 August 2027</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-6 py-3 text-sm transition-all"
              style={{
                color: active ? "white" : "var(--sage-hint)",
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft: active ? "3px solid var(--sage-hint)" : "3px solid transparent",
              }}>
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 text-xs" style={{ color: "var(--sage-medium)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex gap-2 items-center mb-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--sage-hint)" }} />
          <span>Sage Hint</span>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--sage)" }} />
          <span>Sage</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--sage-dark)" }} />
          <span>Moss</span>
        </div>
      </div>
    </aside>
  );
}
