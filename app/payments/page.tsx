"use client";

import { useEffect, useState } from "react";
import { getPayments, savePayments } from "@/lib/store";
import { PaymentItem } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "var(--sage-hint)", color: "var(--sage-evergreen)" },
  Paid: { bg: "#d4edda", color: "#155724" },
  Overdue: { bg: "#f8d7da", color: "#721c24" },
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { getPayments().then(p => { setPayments(p); setMounted(true); }); }, []);

  function update(id: string, field: keyof PaymentItem, value: unknown) {
    const updated = payments.map(p => p.id === id ? { ...p, [field]: value } : p);
    setPayments(updated);
    savePayments(updated);
  }

  function addPayment() {
    const p: PaymentItem = { id: uid(), vendor: "", description: "", amount: 0, dueDate: "", datePaid: "", method: "", status: "Pending" };
    const updated = [...payments, p];
    setPayments(updated);
    savePayments(updated);
  }

  function removePayment(id: string) {
    const updated = payments.filter(p => p.id !== id);
    setPayments(updated);
    savePayments(updated);
  }

  if (!mounted) return null;

  const totalDue = payments.filter(p => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter(p => p.status === "Overdue").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Finance</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Payment Schedule</h1>
        </div>
        <button onClick={addPayment}
          className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90"
          style={{ background: "var(--sage-moss)" }}>
          + Add Payment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Due", value: `$${totalDue.toLocaleString()}` },
          { label: "Total Paid", value: `$${totalPaid.toLocaleString()}` },
          { label: "Overdue", value: overdue.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-2xl font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--sage-medium)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--sage-hint)" }}>
              {["Vendor", "Description", "Amount", "Due Date", "Date Paid", "Method", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--sage-evergreen)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={p.id} style={{ borderTop: idx > 0 ? "1px solid var(--sage-hint)" : "none" }}>
                <td className="px-4 py-3">
                  <input value={p.vendor} onChange={e => update(p.id, "vendor", e.target.value)}
                    placeholder="Vendor" className="w-24 bg-transparent outline-none border-b text-xs"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </td>
                <td className="px-4 py-3">
                  <input value={p.description} onChange={e => update(p.id, "description", e.target.value)}
                    placeholder="Description" className="w-32 bg-transparent outline-none border-b text-xs"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </td>
                <td className="px-4 py-3">
                  <input type="number" value={p.amount} onChange={e => update(p.id, "amount", Number(e.target.value))}
                    className="w-20 bg-transparent outline-none border-b text-xs font-medium"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-moss)" }} />
                </td>
                <td className="px-4 py-3">
                  <input type="date" value={p.dueDate} onChange={e => update(p.id, "dueDate", e.target.value)}
                    className="text-xs bg-transparent outline-none border-b"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }} />
                </td>
                <td className="px-4 py-3">
                  <input type="date" value={p.datePaid} onChange={e => update(p.id, "datePaid", e.target.value)}
                    className="text-xs bg-transparent outline-none border-b"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }} />
                </td>
                <td className="px-4 py-3">
                  <input value={p.method} onChange={e => update(p.id, "method", e.target.value)}
                    placeholder="Card / Cash" className="w-20 bg-transparent outline-none border-b text-xs"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }} />
                </td>
                <td className="px-4 py-3">
                  <select value={p.status} onChange={e => update(p.id, "status", e.target.value)}
                    className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
                    style={{ background: STATUS_STYLES[p.status].bg, color: STATUS_STYLES[p.status].color }}>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => removePayment(p.id)} className="text-xs opacity-40 hover:opacity-100" style={{ color: "#c0392b" }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
