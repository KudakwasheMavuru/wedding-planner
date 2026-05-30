"use client";

import { useEffect, useState } from "react";
import { getNotes, saveNotes } from "@/lib/store";
import { Note } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

const CATEGORIES = ["Venue Decor", "Dress Inspiration", "Flowers", "Cake Ideas", "Music / Playlist", "Photography Poses", "Color Palette", "DIY Projects", "Other"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { getNotes().then(n => { setNotes(n); setMounted(true); }); }, []);

  function update(id: string, field: keyof Note, value: string) {
    const updated = notes.map(n => n.id === id ? { ...n, [field]: value } : n);
    setNotes(updated);
    saveNotes(updated);
  }

  function addNote() {
    const n: Note = { id: uid(), category: "Other", idea: "", source: "", priority: "" };
    const updated = [...notes, n];
    setNotes(updated);
    saveNotes(updated);
  }

  function removeNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  }

  if (!mounted) return null;

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const group = notes.filter(n => n.category === cat);
    if (group.length) acc[cat] = group;
    return acc;
  }, {} as Record<string, Note[]>);

  const otherNotes = notes.filter(n => !CATEGORIES.includes(n.category));
  if (otherNotes.length) byCategory["Other"] = otherNotes;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Ideas</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Notes & Inspiration</h1>
        </div>
        <button onClick={addNote}
          className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90"
          style={{ background: "var(--sage-moss)" }}>
          + Add Note
        </button>
      </div>

      {/* All notes as cards */}
      <div className="columns-1 md:columns-2 gap-6 space-y-0">
        {notes.map(n => (
          <div key={n.id} className="break-inside-avoid mb-6 rounded-2xl p-5 group"
            style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <div className="flex items-center justify-between mb-3">
              <select value={n.category} onChange={e => update(n.id, "category", e.target.value)}
                className="text-xs rounded-full px-3 py-1 border-0 outline-none font-medium"
                style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <select value={n.priority} onChange={e => update(n.id, "priority", e.target.value)}
                  className="text-xs bg-transparent outline-none border-none"
                  style={{ color: n.priority === "High" ? "#c0392b" : n.priority === "Medium" ? "var(--sage-dark)" : "var(--sage-medium)" }}>
                  <option value="">Priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <button onClick={() => removeNote(n.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  style={{ color: "#c0392b" }}>✕</button>
              </div>
            </div>
            <textarea value={n.idea} onChange={e => update(n.id, "idea", e.target.value)}
              placeholder="Write your idea or inspiration here..."
              rows={3}
              className="w-full bg-transparent outline-none resize-none text-sm"
              style={{ color: "var(--sage-evergreen)" }} />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--sage-medium)" }}>🔗</span>
              <input value={n.source} onChange={e => update(n.id, "source", e.target.value)}
                placeholder="Source / link"
                className="flex-1 text-xs bg-transparent outline-none border-b"
                style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
