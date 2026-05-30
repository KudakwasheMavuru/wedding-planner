"use client";

import { useEffect, useState } from "react";
import { getTimeline, saveTimeline } from "@/lib/store";
import { TimelineEvent } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

const EMPTY: Omit<TimelineEvent, "id"> = { time: "", event: "", location: "", responsible: "", notes: "" };

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { getTimeline().then(e => { setEvents(e); setMounted(true); }); }, []);

  function update(id: string, field: keyof TimelineEvent, value: string) {
    const updated = events.map(e => e.id === id ? { ...e, [field]: value } : e);
    setEvents(updated); saveTimeline(updated);
  }

  function removeEvent(id: string) {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated); saveTimeline(updated);
  }

  function openAdd() { setEditId(null); setForm(EMPTY); setShowModal(true); }

  function openEdit(e: TimelineEvent) {
    setEditId(e.id);
    setForm({ time: e.time, event: e.event, location: e.location, responsible: e.responsible, notes: e.notes });
    setShowModal(true);
  }

  function saveForm() {
    if (!form.event.trim()) return;
    const updated = editId
      ? events.map(e => e.id === editId ? { ...e, ...form } : e)
      : [...events, { id: uid(), ...form }];
    // Sort by time after adding
    updated.sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return a.time.localeCompare(b.time);
    });
    setEvents(updated); saveTimeline(updated);
    setShowModal(false); setForm(EMPTY); setEditId(null);
  }

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>28 August 2027</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Day-Of Timeline</h1>
          <p className="text-sm mt-1" style={{ color: "var(--sage-medium)" }}>{events.length} events scheduled</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90" style={{ background: "var(--sage-moss)" }}>
          + Add Event
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-20 top-0 bottom-0 w-px" style={{ background: "var(--sage-hint)" }} />
        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="flex gap-4 items-start group">
              <div className="w-16 text-right flex-shrink-0 pt-4">
                <span className="text-xs font-medium" style={{ color: "var(--sage-dark)" }}>{e.time || "—"}</span>
              </div>
              <div className="relative z-10 flex-shrink-0">
                <div className="mt-4 w-3 h-3 rounded-full border-2" style={{ background: "white", borderColor: "var(--sage-dark)" }} />
              </div>
              <div className="flex-1 rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 6px rgba(64,83,53,0.06)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--sage-evergreen)" }}>{e.event}</p>
                    <div className="flex gap-4 mt-1 text-xs flex-wrap">
                      {e.location && <span style={{ color: "var(--sage-medium)" }}>📍 {e.location}</span>}
                      {e.responsible && <span style={{ color: "var(--sage-medium)" }}>👤 {e.responsible}</span>}
                    </div>
                    {e.notes && <p className="mt-1 text-xs" style={{ color: "var(--sage-light)" }}>{e.notes}</p>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(e)} className="text-xs px-2 py-1 rounded-lg" style={{ color: "var(--sage-dark)", background: "var(--sage-hint)" }}>✎</button>
                    <button onClick={() => removeEvent(e.id)} className="text-xs" style={{ color: "#c0392b" }}>✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: "white", zIndex: 10 }}>
            <h2 className="text-xl font-serif mb-6" style={{ color: "var(--sage-evergreen)" }}>{editId ? "Edit Event" : "Add Event"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Responsible</label>
                  <input value={form.responsible} onChange={e => setForm(f => ({ ...f, responsible: e.target.value }))} placeholder="e.g. Coordinator"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Event / Activity *</label>
                <input value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))} placeholder="e.g. Ceremony begins" autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Ceremony Space"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any extra details..." rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border resize-none" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm border hover:opacity-70" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }}>Cancel</button>
              <button onClick={saveForm} disabled={!form.event.trim()} className="flex-1 py-3 rounded-xl text-sm text-white hover:opacity-90 disabled:opacity-40" style={{ background: "var(--sage-moss)" }}>
                {editId ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
