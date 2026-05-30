"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (pathname === "/login") return null;

  const sidebarContent = (
    <aside
      className="h-full w-56 flex flex-col"
      style={{ background: "var(--sage-evergreen)" }}
    >
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
              onClick={() => setOpen(false)}
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

      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {session?.user && (
          <div className="flex items-center gap-2 mb-3">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-white">{session.user.name}</p>
              <p className="text-xs truncate" style={{ color: "var(--sage-medium)" }}>{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-xs py-2 rounded-lg text-left px-3 transition-all hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.08)", color: "var(--sage-hint)" }}>
          ↩ Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-56 z-30 flex-col">
        {sidebarContent}
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 py-3"
        style={{ background: "var(--sage-evergreen)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => setOpen(true)} className="text-white text-xl w-8 h-8 flex items-center justify-center">
          ☰
        </button>
        <div className="flex-1 text-center">
          <span className="text-white font-serif text-sm">Kudakwashe &amp; Maxine</span>
        </div>
        {session?.user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
        )}
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-56 h-full flex flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
