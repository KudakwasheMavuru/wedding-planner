"use client";

import { useEffect, useState } from "react";
import { getGuests, saveGuests } from "@/lib/store";
import { Guest } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

const RSVP_COLORS: Record<string, string> = {
  Accepted: "var(--sage-moss)", Declined: "#c0392b", Pending: "var(--sage-medium)",
};

const EMPTY: Omit<Guest, "id" | "inviteSent" | "tableNumber" | "giftReceived" | "thankYouSent"> = {
  name: "", plusOne: "", group: "Family", rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "",
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { getGuests().then(g => { setGuests(g); setMounted(true); }); }, []);

  function update(id: string, field: keyof Guest, value: unknown) {
    const updated = guests.map(g => g.id === id ? { ...g, [field]: value } : g);
    setGuests(updated); saveGuests(updated);
  }

  function removeGuest(id: string) {
    const updated = guests.filter(g => g.id !== id);
    setGuests(updated); saveGuests(updated);
  }

  function openAdd() { setEditId(null); setForm(EMPTY); setShowModal(true); }

  function openEdit(g: Guest) {
    setEditId(g.id);
    setForm({ name: g.name, plusOne: g.plusOne, group: g.group, rsvpStatus: g.rsvpStatus, mealPreference: g.mealPreference, dietaryNeeds: g.dietaryNeeds });
    setShowModal(true);
  }

  function saveForm() {
    if (!form.name.trim()) return;
    const updated = editId
      ? guests.map(g => g.id === editId ? { ...g, ...form } : g)
      : [...guests, { id: uid(), inviteSent: false, tableNumber: null, giftReceived: false, thankYouSent: false, ...form }];
    setGuests(updated); saveGuests(updated);
    setShowModal(false); setForm(EMPTY); setEditId(null);
  }

  if (!mounted) return null;

  const named = guests.filter(g => g.name);
  const filtered = filter === "All" ? guests : guests.filter(g => g.group === filter || g.rsvpStatus === filter);
  const accepted = named.filter(g => g.rsvpStatus === "Accepted").length;
  const declined = named.filter(g => g.rsvpStatus === "Declined").length;
  const pending = named.filter(g => g.rsvpStatus === "Pending").length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>People</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Guest List & RSVP</h1>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90" style={{ background: "var(--sage-moss)" }}>
          + Add Guest
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ label: "Total Invited", value: named.length }, { label: "Accepted", value: accepted }, { label: "Declined", value: declined }, { label: "Pending", value: pending }].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-2xl font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--sage-medium)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["All", "Family", "Friends", "Work", "Accepted", "Declined", "Pending"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1 rounded-full text-xs transition-all"
            style={{ background: filter === f ? "var(--sage-moss)" : "white", color: filter === f ? "white" : "var(--sage-dark)", border: "1px solid var(--sage-hint)" }}>
            {f}
          </button>
        ))}
      </div>

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
                <tr key={g.id} className="group" style={{ borderTop: idx > 0 ? "1px solid var(--sage-hint)" : "none" }}>
                  <td className="px-3 py-2">
                    <button onClick={() => openEdit(g)} className="text-xs font-medium hover:underline" style={{ color: "var(--sage-evergreen)" }}>
                      {g.name || "—"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-xs" style={{ color: "var(--sage-medium)" }}>{g.plusOne || "—"}</td>
                  <td className="px-3 py-2">
                    <select value={g.group} onChange={e => update(g.id, "group", e.target.value)} className="bg-transparent outline-none text-xs" style={{ color: "var(--sage-evergreen)" }}>
                      {["Family", "Friends", "Work", "Other"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={g.inviteSent} onChange={e => update(g.id, "inviteSent", e.target.checked)} className="accent-green-700" /></td>
                  <td className="px-3 py-2">
                    <select value={g.rsvpStatus} onChange={e => update(g.id, "rsvpStatus", e.target.value)} className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                      style={{ background: "var(--sage-hint)", color: RSVP_COLORS[g.rsvpStatus] }}>
                      {["Pending", "Accepted", "Declined"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs" style={{ color: "var(--sage-medium)" }}>{g.mealPreference || "—"}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: "var(--sage-medium)" }}>{g.dietaryNeeds || "—"}</td>
                  <td className="px-3 py-2">
                    <input type="number" value={g.tableNumber ?? ""} onChange={e => update(g.id, "tableNumber", e.target.value ? Number(e.target.value) : null)}
                      placeholder="—" className="w-12 bg-transparent outline-none border-b text-xs text-center" style={{ borderColor: "var(--sage-hint)" }} />
                  </td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={g.giftReceived} onChange={e => update(g.id, "giftReceived", e.target.checked)} className="accent-green-700" /></td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={g.thankYouSent} onChange={e => update(g.id, "thankYouSent", e.target.checked)} className="accent-green-700" /></td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeGuest(g.id)} className="text-xs opacity-0 group-hover:opacity-60 transition-opacity hover:!opacity-100" style={{ color: "#c0392b" }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: "white", zIndex: 10 }}>
            <h2 className="text-xl font-serif mb-6" style={{ color: "var(--sage-evergreen)" }}>{editId ? "Edit Guest" : "Add Guest"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Doe" autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Plus One</label>
                <input value={form.plusOne} onChange={e => setForm(f => ({ ...f, plusOne: e.target.value }))} placeholder="Partner's name (optional)"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Group</label>
                  <select value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value as Guest["group"] }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    {["Family", "Friends", "Work", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>RSVP</label>
                  <select value={form.rsvpStatus} onChange={e => setForm(f => ({ ...f, rsvpStatus: e.target.value as Guest["rsvpStatus"] }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    {["Pending", "Accepted", "Declined"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Meal Preference</label>
                <input value={form.mealPreference} onChange={e => setForm(f => ({ ...f, mealPreference: e.target.value }))} placeholder="e.g. Chicken, Vegetarian"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Dietary Needs</label>
                <input value={form.dietaryNeeds} onChange={e => setForm(f => ({ ...f, dietaryNeeds: e.target.value }))} placeholder="e.g. Nut allergy, Vegan"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm border hover:opacity-70" style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }}>Cancel</button>
              <button onClick={saveForm} disabled={!form.name.trim()} className="flex-1 py-3 rounded-xl text-sm text-white hover:opacity-90 disabled:opacity-40" style={{ background: "var(--sage-moss)" }}>
                {editId ? "Save Changes" : "Add Guest"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
