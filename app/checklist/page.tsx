"use client";

import { useEffect, useState } from "react";
import { getChecklist, saveChecklist } from "@/lib/store";
import { ChecklistItem } from "@/lib/data";

const TIMELINES = ["12+ Months Before", "9-12 Months Before", "6-9 Months Before", "4-6 Months Before", "2-4 Months Before", "1-2 Months Before", "1-2 Weeks Before", "Day Of", "After Wedding"];
const CATEGORIES = ["Planning", "Venue", "Catering", "Photography", "Flowers/Decor", "Entertainment", "Attire", "Beauty", "Stationery", "Guests", "Vendors", "Jewelry", "Logistics", "Accommodations", "Honeymoon", "Ceremony", "Events", "Legal", "Wedding Party", "Decor/Gifts", "Registry", "Other"];
const PRIORITY_COLORS: Record<string, string> = {
  "High": "#c0392b",
  "Medium": "var(--sage-dark)",
  "Low": "var(--sage-medium)",
};

const EMPTY_FORM = {
  task: "",
  category: "Planning",
  timeline: "12+ Months Before",
  priority: "Medium" as ChecklistItem["priority"],
  assignedTo: "",
  notes: "",
};

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);

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

  function deleteItem(id: string) {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveChecklist(updated);
  }

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(item: ChecklistItem) {
    setEditId(item.id);
    setForm({ task: item.task, category: item.category, timeline: item.timeline, priority: item.priority, assignedTo: item.assignedTo, notes: item.notes });
    setShowModal(true);
  }

  function saveForm() {
    if (!form.task.trim()) return;
    let updated: ChecklistItem[];
    if (editId) {
      updated = items.map(i => i.id === editId ? { ...i, ...form } : i);
    } else {
      const newItem: ChecklistItem = { id: uid(), status: "Not Started", ...form };
      updated = [...items, newItem];
    }
    setItems(updated);
    saveChecklist(updated);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  if (!mounted) return null;

  const timelines = filter === "All" ? TIMELINES : [filter];
  const completed = items.filter(i => i.status === "Completed").length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Planning</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Wedding Checklist</h1>
          <p className="text-sm mt-1" style={{ color: "var(--sage-medium)" }}>{completed} of {items.length} tasks complete · {pct}%</p>
          <div className="mt-3 h-2 rounded-full w-48" style={{ background: "var(--sage-hint)" }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--sage-moss)" }} />
          </div>
        </div>
        <button onClick={openAdd}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 transition-all"
          style={{ background: "var(--sage-moss)" }}>
          + Add Task
        </button>
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

      {/* Task groups */}
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
                <div key={item.id} className="rounded-xl p-4 flex items-start gap-4 group"
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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select value={item.status} onChange={e => updateStatus(item.id, e.target.value as ChecklistItem["status"])}
                      className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                      style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <button onClick={() => openEdit(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-lg"
                      style={{ color: "var(--sage-dark)", background: "var(--sage-hint)" }}>
                      ✎
                    </button>
                    <button onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      style={{ color: "#c0392b" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            style={{ background: "white", zIndex: 10 }}>
            <h2 className="text-xl font-serif mb-6" style={{ color: "var(--sage-evergreen)" }}>
              {editId ? "Edit Task" : "Add New Task"}
            </h2>

            <div className="space-y-4">
              {/* Task name */}
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Task *</label>
                <input
                  value={form.task}
                  onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                  placeholder="e.g. Book florist"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}
                />
              </div>

              {/* Category + Priority row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as ChecklistItem["priority"] }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>When</label>
                <select value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                  {TIMELINES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Assigned to */}
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Assigned To</label>
                <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                  <option value="">— Anyone —</option>
                  <option>Kudakwashe</option>
                  <option>Maxine</option>
                  <option>Both</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any extra details..."
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border resize-none"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm border transition-all hover:opacity-70"
                style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }}>
                Cancel
              </button>
              <button onClick={saveForm}
                disabled={!form.task.trim()}
                className="flex-1 py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "var(--sage-moss)" }}>
                {editId ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
