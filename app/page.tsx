"use client";

import { useEffect, useState } from "react";
import { getChecklist, getBudget, getGuests } from "@/lib/store";
import { WEDDING_INFO } from "@/lib/data";

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0, completed: 0, inProgress: 0, notStarted: 0,
    totalBudget: 20000, totalSpent: 0, remaining: 20000,
    totalInvited: 0, accepted: 0, declined: 0, pending: 0,
  });

  useEffect(() => {
    setMounted(true);
    Promise.all([getChecklist(), getBudget(), getGuests()]).then(([checklist, budget, allGuests]) => {
      const guests = allGuests.filter(g => g.name);
      const totalSpent = budget.reduce((s, b) => s + (b.actualCost || 0), 0);
      setStats({
        totalTasks: checklist.length,
        completed: checklist.filter(c => c.status === "Completed").length,
        inProgress: checklist.filter(c => c.status === "In Progress").length,
        notStarted: checklist.filter(c => c.status === "Not Started").length,
        totalBudget: WEDDING_INFO.budget,
        totalSpent,
        remaining: WEDDING_INFO.budget - totalSpent,
        totalInvited: guests.length,
        accepted: guests.filter(g => g.rsvpStatus === "Accepted").length,
        declined: guests.filter(g => g.rsvpStatus === "Declined").length,
        pending: guests.filter(g => g.rsvpStatus === "Pending").length,
      });
    });
  }, []);

  const daysUntil = getDaysUntil(WEDDING_INFO.date);
  const completionPct = stats.totalTasks ? Math.round((stats.completed / stats.totalTasks) * 100) : 0;
  const spentPct = Math.round((stats.totalSpent / stats.totalBudget) * 100);
  const rsvpPct = stats.totalInvited
    ? Math.round(((stats.accepted + stats.declined) / stats.totalInvited) * 100)
    : 0;

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>Welcome back</p>
        <h1 className="text-4xl font-serif mb-1" style={{ color: "var(--sage-evergreen)" }}>
          {WEDDING_INFO.couple}
        </h1>
        <p style={{ color: "var(--sage-medium)" }}>
          {WEDDING_INFO.theme} · {WEDDING_INFO.colorPalette}
        </p>
      </div>

      {/* Countdown hero */}
      <div className="rounded-3xl p-10 mb-8 flex items-center justify-between"
        style={{ background: "var(--sage-evergreen)" }}>
        <div>
          <p className="text-sm uppercase tracking-widest mb-1" style={{ color: "var(--sage-hint)" }}>The Big Day</p>
          <p className="text-white text-2xl font-serif">28 August 2027</p>
          <p className="mt-1 text-sm" style={{ color: "var(--sage-light)" }}>Ceremony at {WEDDING_INFO.ceremonyTime}</p>
        </div>
        <div className="text-right">
          <p className="font-serif" style={{ fontSize: "5rem", lineHeight: 1, color: "white" }}>{daysUntil}</p>
          <p className="text-sm" style={{ color: "var(--sage-hint)" }}>days to go</p>
        </div>
      </div>

      {/* Key details */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)" }}>Key Details</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ["Couple", WEDDING_INFO.couple],
            ["Wedding Date", "28 August 2027"],
            ["Est. Guests", WEDDING_INFO.guestsEstimated.toString()],
            ["Total Budget", `$${WEDDING_INFO.budget.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ color: "var(--sage-medium)" }}>{k}</p>
              <p className="font-medium mt-0.5" style={{ color: "var(--sage-evergreen)" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: "Budget Snapshot",
            pct: spentPct,
            pctLabel: "Spent",
            cells: [
              { label: "Total", value: `$${stats.totalBudget.toLocaleString()}`, color: "var(--sage-evergreen)" },
              { label: "Spent", value: `$${stats.totalSpent.toLocaleString()}`, color: "var(--sage-dark)" },
              { label: "Left", value: `$${stats.remaining.toLocaleString()}`, color: "var(--sage-moss)" },
            ],
          },
          {
            title: "Checklist Progress",
            pct: completionPct,
            pctLabel: "Complete",
            cells: [
              { label: "Done", value: stats.completed, color: "var(--sage-moss)" },
              { label: "Active", value: stats.inProgress, color: "var(--sage)" },
              { label: "Todo", value: stats.notStarted, color: "var(--sage-light)" },
            ],
          },
          {
            title: "Guest RSVP",
            pct: rsvpPct,
            pctLabel: "Responded",
            cells: [
              { label: "Yes", value: stats.accepted, color: "var(--sage-moss)" },
              { label: "No", value: stats.declined, color: "var(--sage)" },
              { label: "Pending", value: stats.pending, color: "var(--sage-light)" },
            ],
          },
        ].map(({ title, pct, pctLabel, cells }) => (
          <div key={title} className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>{title}</p>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: "var(--sage-medium)" }}>{pctLabel}</span>
                <span style={{ color: "var(--sage-evergreen)" }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "var(--sage-hint)" }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--sage-moss)" }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {cells.map(({ label, value, color }) => (
                <div key={label}>
                  <p className="font-semibold text-base" style={{ color }}>{value}</p>
                  <p style={{ color: "var(--sage-medium)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Color palette strip */}
      <div className="rounded-2xl overflow-hidden flex h-12">
        {["#B7CFB5", "#A2B5A2", "#9BAA7F", "#9AA796", "#606C46", "#405335", "#344C3D"].map(c => (
          <div key={c} className="flex-1" style={{ background: c }} title={c} />
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{ color: "var(--sage-medium)" }}>
        Monochromatic Sage Green Palette
      </p>
    </div>
  );
}
