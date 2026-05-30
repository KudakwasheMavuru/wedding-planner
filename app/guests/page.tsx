"use client";

import { useEffect, useState } from "react";
import { getGuests, saveGuests } from "@/lib/store";
import { Guest } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

const RSVP_COLORS: Record<string, string> = {
  Accepted: "var(--sage-moss)",
  Declined: "#c0392b",
  Pending: "var(--sage-medium)",
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => { setGuests(getGuests()); setMounted(true); }, []);

  function update(id: string, field: keyof Guest, value: unknown) {
    const updated = guests.map(g => g.id === id ? { ...g, [field]: value } : g);
    setGuests(updated);
    saveGuests(updated);
  }

  function addGuest() {
    const g: Guest = { id: uid(), name: "", plusOne: "", group: "Family", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false };
    const updated = [...guests, g];
    setGuests(updated);
    saveGuests(updated);
  }

  function removeGuest(id: string) {
    const updated = guests.filter(g => g.id !== id);
    setGuests(updated);
    saveGuests(updated);
  }

  if (!mounted) return null;

  const named = guests.filter(g => g.name);
  const filtered = filter === "All" ? guests : guests.filter(g => g.group === filter || g.rsvpStatus === filter);
  const accepted = named.filter(g => g.rsvpStatus === "Accepted").length;
  const declined = named.filter(g => g.rsvpStatus === "Declined").length;
  const pending = named.filter(g => g.rsvpStatus === "Pending").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>People</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Guest List & RSVP</h1>
        </div>
        <button onClick={addGuest}
          className="px-4 py-2 rounded-xl text-sm text-white transition-all hover:opacity-90"
          style={{ background: "var(--sage-moss)" }}>
          + Add Guest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Invited", value: named.length },
          { label: "Accepted", value: accepted },
          { label: "Declined", value: declined },
          { label: "Pending", value: pending },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-2xl font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--sage-medium)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", "Family", "Friends", "Work", "Accepted", "Declined", "Pending"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs transition-all"
            style={{ background: filter === f ? "var(--sage-moss)" : "white", color: filter === f ? "white" : "var(--sage-dark)", border: "1px solid var(--sage-hint)" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--sage-hint)" }}>
                {["Guest Name", "Plus One", "Group", "Invite Sent", "RSVP", "Meal", "Dietary", "Table #", "Gift", "Thank You", ""].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-medium text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--sage-evergreen)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, idx) => (
                <tr key={g.id} style={{ borderTop: idx > 0 ? "1px solid var(--sage-hint)" : "none" }}>
                  <td className="px-3 py-2">
                    <input value={g.name} onChange={e => update(g.id, "name", e.target.value)}
                      placeholder="Name" className="w-28 bg-transparent outline-none border-b text-xs"
                      style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2">
                    <input value={g.plusOne} onChange={e => update(g.id, "plusOne", e.target.value)}
                      placeholder="+" className="w-24 bg-transparent outline-none border-b text-xs"
                      style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2">
                    <select value={g.group} onChange={e => update(g.id, "group", e.target.value)}
                      className="bg-transparent outline-none text-xs" style={{ color: "var(--sage-evergreen)" }}>
                      {["Family", "Friends", "Work", "Other"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={g.inviteSent} onChange={e => update(g.id, "inviteSent", e.target.checked)} className="accent-green-700" />
                  </td>
                  <td className="px-3 py-2">
                    <select value={g.rsvpStatus} onChange={e => update(g.id, "rsvpStatus", e.target.value)}
                      className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                      style={{ background: "var(--sage-hint)", color: RSVP_COLORS[g.rsvpStatus] }}>
                      {["Pending", "Accepted", "Declined"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={g.mealPreference} onChange={e => update(g.id, "mealPreference", e.target.value)}
                      placeholder="Chicken..." className="w-20 bg-transparent outline-none border-b text-xs"
                      style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2">
                    <input value={g.dietaryNeeds} onChange={e => update(g.id, "dietaryNeeds", e.target.value)}
                      placeholder="—" className="w-20 bg-transparent outline-none border-b text-xs"
                      style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={g.tableNumber ?? ""} onChange={e => update(g.id, "tableNumber", e.target.value ? Number(e.target.value) : null)}
                      placeholder="—" className="w-12 bg-transparent outline-none border-b text-xs text-center"
                      style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={g.giftReceived} onChange={e => update(g.id, "giftReceived", e.target.checked)} className="accent-green-700" />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={g.thankYouSent} onChange={e => update(g.id, "thankYouSent", e.target.checked)} className="accent-green-700" />
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeGuest(g.id)} className="text-xs opacity-40 hover:opacity-100" style={{ color: "#c0392b" }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
