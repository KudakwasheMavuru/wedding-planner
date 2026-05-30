"use client";

import { useEffect, useState } from "react";
import { getBudget, saveBudget } from "@/lib/store";
import { BudgetItem, WEDDING_INFO } from "@/lib/data";

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getBudget());
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  const totalEstimated = items.reduce((s, i) => s + i.estimatedCost, 0);
  const totalActual = items.reduce((s, i) => s + (i.actualCost ?? 0), 0);
  const totalBalance = items.reduce((s, i) => s + i.balanceDue, 0);
  const spentPct = Math.round((totalActual / WEDDING_INFO.budget) * 100);

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Finance</p>
        <h1 className="text-3xl font-serif mb-1" style={{ color: "var(--sage-evergreen)" }}>Budget Tracker</h1>
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
          <div className="h-3 rounded-full" style={{ width: `${Math.min(spentPct, 100)}%`, background: spentPct > 100 ? "#c0392b" : "var(--sage-moss)" }} />
        </div>
      </div>

      {/* Table by category */}
      {categories.map(cat => (
        <div key={cat} className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>{cat}</h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--sage-hint)" }}>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Item</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Estimated</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Actual</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Deposit</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Balance</th>
                  <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.category === cat).map((item, idx) => (
                  <tr key={item.id} style={{ borderTop: idx > 0 ? "1px solid var(--sage-hint)" : "none" }}>
                    <td className="px-4 py-3" style={{ color: "var(--sage-evergreen)" }}>{item.vendorItem}</td>
                    <td className="px-4 py-3 text-right">
                      <input type="number" value={item.estimatedCost}
                        onChange={e => update(item.id, "estimatedCost", e.target.value)}
                        className="w-24 text-right bg-transparent outline-none border-b text-sm"
                        style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input type="number" value={item.actualCost ?? ""}
                        onChange={e => update(item.id, "actualCost", e.target.value)}
                        placeholder="—"
                        className="w-24 text-right bg-transparent outline-none border-b text-sm"
                        style={{ borderColor: "var(--sage-hint)", color: "var(--sage-dark)" }} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input type="number" value={item.depositPaid ?? ""}
                        onChange={e => update(item.id, "depositPaid", e.target.value)}
                        placeholder="—"
                        className="w-24 text-right bg-transparent outline-none border-b text-sm"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
