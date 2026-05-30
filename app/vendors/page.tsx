"use client";

import { useEffect, useState } from "react";
import { getVendors, saveVendors } from "@/lib/store";
import { Vendor } from "@/lib/data";

function uid() { return Math.random().toString(36).slice(2); }

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { getVendors().then(v => { setVendors(v); setMounted(true); }); }, []);

  function update(id: string, field: keyof Vendor, value: unknown) {
    const updated = vendors.map(v => v.id === id ? { ...v, [field]: value } : v);
    setVendors(updated);
    saveVendors(updated);
  }

  function addVendor() {
    const v: Vendor = { id: uid(), category: "Other", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" };
    const updated = [...vendors, v];
    setVendors(updated);
    saveVendors(updated);
  }

  function removeVendor(id: string) {
    const updated = vendors.filter(v => v.id !== id);
    setVendors(updated);
    saveVendors(updated);
  }

  if (!mounted) return null;

  const contractSigned = vendors.filter(v => v.contractSigned).length;
  const depositPaid = vendors.filter(v => v.depositPaid).length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Suppliers</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Vendor Contacts</h1>
        </div>
        <button onClick={addVendor}
          className="px-4 py-2 rounded-xl text-sm text-white hover:opacity-90"
          style={{ background: "var(--sage-moss)" }}>
          + Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Vendors", value: vendors.length },
          { label: "Contracts Signed", value: contractSigned },
          { label: "Deposits Paid", value: depositPaid },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-5 text-center" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <p className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--sage-medium)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {vendors.map(v => (
          <div key={v.id} className="rounded-2xl p-5" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                  {v.category}
                </span>
                <input value={v.vendorName} onChange={e => update(v.id, "vendorName", e.target.value)}
                  placeholder="Vendor name"
                  className="text-base font-medium bg-transparent outline-none border-b"
                  style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--sage-medium)" }}>
                  <input type="checkbox" checked={v.contractSigned} onChange={e => update(v.id, "contractSigned", e.target.checked)} className="accent-green-700" />
                  Contract
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--sage-medium)" }}>
                  <input type="checkbox" checked={v.depositPaid} onChange={e => update(v.id, "depositPaid", e.target.checked)} className="accent-green-700" />
                  Deposit
                </label>
                <button onClick={() => removeVendor(v.id)} className="text-xs opacity-40 hover:opacity-100" style={{ color: "#c0392b" }}>✕</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                ["Contact Person", "contactPerson", "text"],
                ["Phone", "phone", "tel"],
                ["Email", "email", "email"],
                ["Website", "website", "url"],
              ].map(([label, field, type]) => (
                <div key={field}>
                  <p className="text-xs mb-1" style={{ color: "var(--sage-medium)" }}>{label}</p>
                  <input type={type} value={(v as Record<string, unknown>)[field] as string}
                    onChange={e => update(v.id, field as keyof Vendor, e.target.value)}
                    placeholder="—"
                    className="w-full bg-transparent outline-none border-b text-xs"
                    style={{ borderColor: "var(--sage-hint)", color: "var(--sage-evergreen)" }} />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <input value={v.notes} onChange={e => update(v.id, "notes", e.target.value)}
                placeholder="Notes..."
                className="w-full text-xs bg-transparent outline-none border-b"
                style={{ borderColor: "var(--sage-hint)", color: "var(--sage-medium)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
