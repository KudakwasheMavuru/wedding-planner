"use client";

import { useEffect, useState } from "react";
import { getTimeline, saveTimeline } from "@/lib/store";
import { TimelineEvent } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setEvents(getTimeline()); setMounted(true); }, []);

  function update(id: string, field: keyof TimelineEvent, value: string) {
    const updated = events.map(e => e.id === id ? { ...e, [field]: value } : e);
    setEvents(updated);
    saveTimeline(updated);
  }

  function addEvent() {
    const e: TimelineEvent = { id: uid(), time: "", event: "", location: "", responsible: "", notes: "" };
    const updated = [...events, e];
    setEvents(updated);
    saveTimeline(updated);
  }

  function removeEvent(id: string) {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveTimeline(updated);
  }

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>28 August 2027</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Day-Of Timeline</h1>
        </div>
        <button onClick={addEvent}
          className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90"
          style={{ background: "var(--sage-moss)" }}>
          + Add Event
        </button>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-20 top-0 bottom-0 w-px" style={{ background: "var(--sage-hint)" }} />

        <div className="space-y-3">
          {events.map((e, idx) => (
            <div key={e.id} className="flex gap-4 items-start group">
              {/* Time */}
              <div className="w-16 text-right flex-shrink-0 pt-4">
                <input value={e.time} onChange={ev => update(e.id, "time", ev.target.value)}
                  placeholder="Time"
                  className="w-full text-xs text-right bg-transparent outline-none font-medium"
                  style={{ color: "var(--sage-dark)" }} />
              </div>

              {/* Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className="mt-4 w-3 h-3 rounded-full border-2"
                  style={{ background: "white", borderColor: "var(--sage-dark)" }} />
              </div>

              {/* Card */}
              <div className="flex-1 rounded-2xl p-4 transition-all"
                style={{ background: "white", boxShadow: "0 1px 6px rgba(64,83,53,0.06)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <input value={e.event} onChange={ev => update(e.id, "event", ev.target.value)}
                      placeholder="Event or activity..."
                      className="w-full text-sm font-medium bg-transparent outline-none"
                      style={{ color: "var(--sage-evergreen)" }} />
                    <div className="flex gap-4 mt-1 text-xs">
                      <span style={{ color: "var(--sage-medium)" }}>📍</span>
                      <input value={e.location} onChange={ev => update(e.id, "location", ev.target.value)}
                        placeholder="Location" className="bg-transparent outline-none flex-1"
                        style={{ color: "var(--sage-medium)" }} />
                      <span style={{ color: "var(--sage-medium)" }}>👤</span>
                      <input value={e.responsible} onChange={ev => update(e.id, "responsible", ev.target.value)}
                        placeholder="Responsible" className="bg-transparent outline-none flex-1"
                        style={{ color: "var(--sage-medium)" }} />
                    </div>
                    <input value={e.notes} onChange={ev => update(e.id, "notes", ev.target.value)}
                      placeholder="Notes..."
                      className="mt-1 w-full text-xs bg-transparent outline-none"
                      style={{ color: "var(--sage-light)" }} />
                  </div>
                  <button onClick={() => removeEvent(e.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    style={{ color: "#c0392b" }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
