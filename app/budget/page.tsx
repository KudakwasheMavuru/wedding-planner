"use client";

import { useEffect, useState } from "react";
import { getBudget, saveBudget } from "@/lib/store";
import { BudgetItem, WEDDING_INFO } from "@/lib/data";

const CATEGORIES = ["Venue", "Catering", "Photography", "Flowers/Decor", "Entertainment", "Attire", "Beauty", "Stationery", "Jewelry", "Logistics", "Accommodations", "Gifts", "Events", "Legal", "Honeymoon", "Misc"];

const EMPTY_FORM = {
  category: "Venue",
  vendorItem: "",
  estimatedCost: 0,
  actualCost: null as number | null,
  depositPaid: null as number | null,
  paymentDueDate: "",
  status: "Not Paid" as BudgetItem["status"],
};

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    getBudget().then(items => { setItems(items); setMounted(true); });
  }, []);

  function calcBalance(item: typeof EMPTY_FORM & { estimatedCost: number }) {
    return (item.actualCost ?? item.estimatedCost) - (item.depositPaid ?? 0);
  }

  function update(id: string, field: keyof BudgetItem, raw: string) {
    const value = ["estimatedCost", "actualCost", "depositPaid"].includes(field)
      ? raw === "" ? null : Number(raw)
      : raw;
    const updated = items.map(item => {
      if (item.id !== id) return item;
      const next = { ...item, [field]: value };
      next.balanceDue = (next.actualCost ?? next.estimatedCost) - (next.depositPaid ?? 0);
      return next;
    });
    setItems(updated as BudgetItem[]);
    saveBudget(updated as BudgetItem[]);
  }

  function deleteItem(id: string) {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveBudget(updated);
  }

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(item: BudgetItem) {
    setEditId(item.id);
    setForm({ category: item.category, vendorItem: item.vendorItem, estimatedCost: item.estimatedCost, actualCost: item.actualCost, depositPaid: item.depositPaid, paymentDueDate: item.paymentDueDate, status: item.status });
    setShowModal(true);
  }

  function saveForm() {
    if (!form.vendorItem.trim()) return;
    const balanceDue = calcBalance(form);
    let updated: BudgetItem[];
    if (editId) {
      updated = items.map(i => i.id === editId ? { ...i, ...form, balanceDue } : i);
    } else {
      const newItem: BudgetItem = { id: uid(), ...form, balanceDue };
      updated = [...items, newItem];
    }
    setItems(updated);
    saveBudget(updated);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  if (!mounted) return null;

  const totalEstimated = items.reduce((s, i) => s + i.estimatedCost, 0);
  const totalActual = items.reduce((s, i) => s + (i.actualCost ?? 0), 0);
  const totalBalance = items.reduce((s, i) => s + i.balanceDue, 0);
  const spentPct = Math.round((totalActual / WEDDING_INFO.budget) * 100);
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Finance</p>
          <h1 className="text-3xl font-serif mb-1" style={{ color: "var(--sage-evergreen)" }}>Budget Tracker</h1>
        </div>
        <button onClick={openAdd}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm text-white hover:opacity-90 transition-all"
          style={{ background: "var(--sage-moss)" }}>
          + Add Item
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Budget", value: `$${WEDDING_INFO.budget.toLocaleString()}`, sub: "Set limit" },
          { label: "Estimated", value: `$${totalEstimated.toLocaleString()}`, sub: "Planned spend" },
          { label: "Actual Spent", value: `$${totalActual.toLocaleString()}`, sub: `${spentPct}% of budget` },
          { label: "Balance Due", value: `$${totalBalance.toLocaleString()}`, sub: "Remaining payments" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>{label}</p>
            <p className="text-2xl font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--sage-medium)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div className="rounded-2xl p-5 mb-8" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--sage-medium)" }}>Budget utilisation</span>
          <span style={{ color: "var(--sage-evergreen)" }}>{spentPct}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: "var(--sage-hint)" }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(spentPct, 100)}%`, background: spentPct > 100 ? "#c0392b" : "var(--sage-moss)" }} />
        </div>
      </div>

      {/* Table by category */}
      {categories.map(cat => (
        <div key={cat} className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>{cat}</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--sage-hint)" }}>
                    <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Item</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Estimated</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Actual</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Deposit</th>
                    <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Balance</th>
                    <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.filter(i => i.category === cat).map((item, idx) => (
                    <tr key={item.id} className="group" style={{ borderTop: idx > 0 ? "1px solid var(--sage-hint)" : "none" }}>
                      <td className="px-4 py-3" style={{ color: "var(--sage-evergreen)" }}>{item.vendorItem}</td>
                      <td className="px-4 py-3 text-right">
                        <input type="number" value={item.estimatedCost} onChange={e => update(item.id, "estimatedCost", e.target.value)}
                          className="w-24 text-right bg-transparent outline-none border-b text-sm"
                          style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input type="number" value={item.actualCost ?? ""} onChange={e => update(item.id, "actualCost", e.target.value)}
                          placeholder="—" className="w-24 text-right bg-transparent outline-none border-b text-sm"
                          style={{ borderColor: "var(--sage-hint)", color: "var(--sage-dark)" }} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input type="number" value={item.depositPaid ?? ""} onChange={e => update(item.id, "depositPaid", e.target.value)}
                          placeholder="—" className="w-24 text-right bg-transparent outline-none border-b text-sm"
                          style={{ borderColor: "var(--sage-hint)", color: "var(--sage-dark)" }} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: "var(--sage-moss)" }}>
                        ${item.balanceDue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select value={item.status} onChange={e => update(item.id, "status", e.target.value)}
                          className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                          style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                          <option>Not Paid</option>
                          <option>Deposit Paid</option>
                          <option>Paid in Full</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="text-xs px-2 py-1 rounded-lg"
                            style={{ color: "var(--sage-dark)", background: "var(--sage-hint)" }}>✎</button>
                          <button onClick={() => deleteItem(item.id)} className="text-xs" style={{ color: "#c0392b" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl" style={{ background: "white", zIndex: 10 }}>
            <h2 className="text-xl font-serif mb-6" style={{ color: "var(--sage-evergreen)" }}>
              {editId ? "Edit Budget Item" : "Add Budget Item"}
            </h2>
            <div className="space-y-4">
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
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BudgetItem["status"] }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                    <option>Not Paid</option>
                    <option>Deposit Paid</option>
                    <option>Paid in Full</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Item / Vendor *</label>
                <input value={form.vendorItem} onChange={e => setForm(f => ({ ...f, vendorItem: e.target.value }))}
                  placeholder="e.g. Wedding Photographer" autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Estimated ($)</label>
                  <input type="number" value={form.estimatedCost} onChange={e => setForm(f => ({ ...f, estimatedCost: Number(e.target.value) }))}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Actual ($)</label>
                  <input type="number" value={form.actualCost ?? ""} onChange={e => setForm(f => ({ ...f, actualCost: e.target.value === "" ? null : Number(e.target.value) }))}
                    placeholder="—" className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Deposit ($)</label>
                  <input type="number" value={form.depositPaid ?? ""} onChange={e => setForm(f => ({ ...f, depositPaid: e.target.value === "" ? null : Number(e.target.value) }))}
                    placeholder="—" className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: "var(--sage-dark)" }}>Payment Due Date</label>
                <input type="date" value={form.paymentDueDate} onChange={e => setForm(f => ({ ...f, paymentDueDate: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm border transition-all hover:opacity-70"
                style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }}>Cancel</button>
              <button onClick={saveForm} disabled={!form.vendorItem.trim()}
                className="flex-1 py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "var(--sage-moss)" }}>
                {editId ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
