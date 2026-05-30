"use client";

import { useEffect, useState } from "react";
import { getGuests, saveGuests } from "@/lib/store";
import { Guest } from "@/lib/data";

const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);
const SEATS_PER_TABLE = 8;

export default function SeatingPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => { setGuests(getGuests()); setMounted(true); }, []);

  function assignTable(guestId: string, tableNum: number | null) {
    const updated = guests.map(g => g.id === guestId ? { ...g, tableNumber: tableNum } : g);
    setGuests(updated);
    saveGuests(updated);
  }

  if (!mounted) return null;

  const unassigned = guests.filter(g => g.name && g.tableNumber === null);

  function tableGuests(n: number) {
    return guests.filter(g => g.tableNumber === n);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Layout</p>
        <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Seating Chart</h1>
        <p className="text-sm mt-1" style={{ color: "var(--sage-medium)" }}>
          {guests.filter(g => g.name && g.tableNumber !== null).length} guests assigned · {unassigned.length} unassigned
        </p>
      </div>

      <div className="flex gap-8">
        {/* Table grid */}
        <div className="flex-1">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {TABLES.map(t => {
              const tGuests = tableGuests(t);
              const full = tGuests.length >= SEATS_PER_TABLE;
              return (
                <button key={t} onClick={() => setSelectedTable(selectedTable === t ? null : t)}
                  className="rounded-2xl p-4 text-left transition-all"
                  style={{
                    background: selectedTable === t ? "var(--sage-moss)" : "white",
                    boxShadow: "0 1px 8px rgba(64,83,53,0.07)",
                    border: selectedTable === t ? "2px solid var(--sage-moss)" : "2px solid transparent",
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: selectedTable === t ? "var(--sage-hint)" : "var(--sage-dark)" }}>
                      Table {t}
                    </p>
                    <span className="text-xs" style={{ color: selectedTable === t ? "var(--sage-hint)" : full ? "#c0392b" : "var(--sage-medium)" }}>
                      {tGuests.length}/{SEATS_PER_TABLE}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {tGuests.slice(0, 4).map(g => (
                      <p key={g.id} className="text-xs truncate"
                        style={{ color: selectedTable === t ? "white" : "var(--sage-evergreen)" }}>
                        {g.name}
                      </p>
                    ))}
                    {tGuests.length > 4 && (
                      <p className="text-xs" style={{ color: selectedTable === t ? "var(--sage-hint)" : "var(--sage-medium)" }}>
                        +{tGuests.length - 4} more
                      </p>
                    )}
                    {tGuests.length === 0 && (
                      <p className="text-xs" style={{ color: selectedTable === t ? "var(--sage-hint)" : "var(--sage-light)" }}>
                        Empty table
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-64 flex-shrink-0">
          {selectedTable && (
            <div className="rounded-2xl p-5 mb-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--sage-evergreen)" }}>Table {selectedTable}</h3>
              <div className="space-y-2 mb-4">
                {tableGuests(selectedTable).map(g => (
                  <div key={g.id} className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: "var(--sage-evergreen)" }}>{g.name}</p>
                    <button onClick={() => assignTable(g.id, null)} className="text-xs opacity-50 hover:opacity-100" style={{ color: "#c0392b" }}>✕</button>
                  </div>
                ))}
                {tableGuests(selectedTable).length === 0 && (
                  <p className="text-xs" style={{ color: "var(--sage-light)" }}>No guests assigned</p>
                )}
              </div>
              {unassigned.length > 0 && tableGuests(selectedTable).length < SEATS_PER_TABLE && (
                <>
                  <p className="text-xs mb-2" style={{ color: "var(--sage-medium)" }}>Add from unassigned:</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {unassigned.map(g => (
                      <button key={g.id} onClick={() => assignTable(g.id, selectedTable)}
                        className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:opacity-80 transition-all"
                        style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                        {g.name || "(unnamed)"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="rounded-2xl p-5" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--sage-evergreen)" }}>
              Unassigned ({unassigned.length})
            </h3>
            {unassigned.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--sage-light)" }}>All guests assigned!</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {unassigned.map(g => (
                  <div key={g.id} className="flex items-center justify-between text-xs py-1">
                    <p style={{ color: "var(--sage-evergreen)" }}>{g.name}</p>
                    <p style={{ color: "var(--sage-medium)" }}>{g.group}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
