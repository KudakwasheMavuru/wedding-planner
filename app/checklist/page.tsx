"use client";

import { useEffect, useState } from "react";
import { getChecklist, saveChecklist } from "@/lib/store";
import { ChecklistItem } from "@/lib/data";

const TIMELINES = ["12+ Months Before", "9-12 Months Before", "6-9 Months Before", "4-6 Months Before", "2-4 Months Before", "1-2 Months Before", "1-2 Weeks Before", "Day Of", "After Wedding"];
const STATUS_COLORS: Record<string, string> = {
  "Completed": "var(--sage-moss)",
  "In Progress": "var(--sage-dark)",
  "Not Started": "var(--sage-light)",
};
const PRIORITY_COLORS: Record<string, string> = {
  "High": "#c0392b",
  "Medium": "var(--sage-dark)",
  "Low": "var(--sage-medium)",
};

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getChecklist().then(items => { setItems(items); setMounted(true); });
  }, []);

  function updateStatus(id: string, status: ChecklistItem["status"]) {
    const updated = items.map(i => i.id === id ? { ...i, status } : i);
    setItems(updated);
    saveChecklist(updated);
  }

  function updateField(id: string, field: keyof ChecklistItem, value: string) {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    saveChecklist(updated);
  }

  if (!mounted) return null;

  const timelines = filter === "All" ? TIMELINES : [filter];
  const completed = items.filter(i => i.status === "Completed").length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Planning</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Wedding Checklist</h1>
          <p className="text-sm mt-1" style={{ color: "var(--sage-medium)" }}>{completed} of {items.length} tasks complete · {pct}%</p>
        </div>
        <div className="w-32">
          <div className="h-2 rounded-full mb-1" style={{ background: "var(--sage-hint)" }}>
            <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "var(--sage-moss)" }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", ...TIMELINES].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-3 py-1 rounded-full text-xs transition-all"
            style={{
              background: filter === t ? "var(--sage-moss)" : "white",
              color: filter === t ? "white" : "var(--sage-dark)",
              border: "1px solid var(--sage-hint)",
            }}>
            {t}
          </button>
        ))}
      </div>

      {timelines.map(timeline => {
        const group = items.filter(i => i.timeline === timeline);
        if (!group.length) return null;
        return (
          <div key={timeline} className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: "var(--sage-dark)" }}>
              <span className="h-px flex-1" style={{ background: "var(--sage-hint)" }} />
              {timeline}
              <span className="h-px flex-1" style={{ background: "var(--sage-hint)" }} />
            </h2>
            <div className="space-y-2">
              {group.map(item => (
                <div key={item.id} className="rounded-xl p-4 flex items-start gap-4"
                  style={{ background: "white", boxShadow: "0 1px 4px rgba(64,83,53,0.06)", opacity: item.status === "Completed" ? 0.65 : 1 }}>
                  <button onClick={() => updateStatus(item.id, item.status === "Completed" ? "Not Started" : "Completed")}
                    className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: item.status === "Completed" ? "var(--sage-moss)" : "var(--sage-hint)",
                      background: item.status === "Completed" ? "var(--sage-moss)" : "transparent",
                    }}>
                    {item.status === "Completed" && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: "var(--sage-evergreen)", textDecoration: item.status === "Completed" ? "line-through" : "none" }}>
                        {item.task}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                        {item.category}
                      </span>
                      <span className="text-xs font-medium" style={{ color: PRIORITY_COLORS[item.priority] }}>
                        {item.priority}
                      </span>
                    </div>
                    <input value={item.notes} onChange={e => updateField(item.id, "notes", e.target.value)}
                      placeholder="Add a note..."
                      className="mt-1 w-full text-xs bg-transparent outline-none border-none"
                      style={{ color: "var(--sage-medium)" }} />
                  </div>
                  <select value={item.status} onChange={e => updateStatus(item.id, e.target.value as ChecklistItem["status"])}
                    className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                    style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
