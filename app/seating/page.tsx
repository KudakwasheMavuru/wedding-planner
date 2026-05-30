"use client";

import { useEffect, useState } from "react";
import { getGuests, saveGuests } from "@/lib/store";
import { Guest } from "@/lib/data";

const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);
const SEATS_PER_TABLE = 8;

function RoundTable({ tableNum, guests, selected, onClick }: {
  tableNum: number;
  guests: Guest[];
  selected: boolean;
  onClick: () => void;
}) {
  const cx = 70, cy = 70, r = 28, chairR = 10, orbitR = 48;
  const seats = SEATS_PER_TABLE;
  const filled = guests.length;
  const full = filled >= seats;

  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-1 transition-transform hover:scale-105">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Glow when selected */}
        {selected && (
          <circle cx={cx} cy={cy} r={orbitR + chairR + 6}
            fill="none" stroke="#606C46" strokeWidth="2" strokeDasharray="4 3" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="12s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Chairs around the table */}
        {Array.from({ length: seats }).map((_, i) => {
          const angle = (i / seats) * 2 * Math.PI - Math.PI / 2;
          const sx = cx + orbitR * Math.cos(angle);
          const sy = cy + orbitR * Math.sin(angle);
          const hasGuest = i < filled;
          return (
            <g key={i}>
              <circle cx={sx} cy={sy} r={chairR}
                fill={hasGuest ? (selected ? "#9BAA7F" : "#B7CFB5") : "white"}
                stroke={hasGuest ? (selected ? "#405335" : "#606C46") : "#B7CFB5"}
                strokeWidth="1.5"
                style={{ transition: "all 0.3s" }}
              />
              {hasGuest && (
                <circle cx={sx} cy={sy - chairR * 0.25} r={chairR * 0.35}
                  fill={selected ? "#405335" : "#606C46"} opacity="0.7" />
              )}
            </g>
          );
        })}

        {/* Table surface */}
        <circle cx={cx} cy={cy} r={r}
          fill={selected ? "#405335" : "white"}
          stroke={selected ? "#344C3D" : "#B7CFB5"}
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 2px 6px rgba(64,83,53,0.15))", transition: "all 0.3s" }}
        />

        {/* Floral centre on table */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill={selected ? "#B7CFB5" : "#9BAA7F"}>✿</text>

        {/* Table number */}
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fontWeight="600"
          fill={selected ? "white" : "#405335"} fontFamily="Georgia, serif">
          {tableNum}
        </text>
      </svg>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs font-semibold" style={{ color: selected ? "var(--sage-moss)" : "var(--sage-dark)" }}>
          Table {tableNum}
        </p>
        <p className="text-xs" style={{ color: full ? "#c0392b" : "var(--sage-medium)" }}>
          {filled}/{seats} seats
        </p>
      </div>
    </button>
  );
}

export default function SeatingPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => { getGuests().then(g => { setGuests(g); setMounted(true); }); }, []);

  function assignTable(guestId: string, tableNum: number | null) {
    const updated = guests.map(g => g.id === guestId ? { ...g, tableNumber: tableNum } : g);
    setGuests(updated);
    saveGuests(updated);
  }

  if (!mounted) return null;

  const namedGuests = guests.filter(g => g.name);
  const unassigned = namedGuests.filter(g => g.tableNumber === null);
  const assigned = namedGuests.filter(g => g.tableNumber !== null);

  function tableGuests(n: number) {
    return guests.filter(g => g.tableNumber === n && g.name);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Layout</p>
          <h1 className="text-3xl font-serif" style={{ color: "var(--sage-evergreen)" }}>Seating Chart</h1>
          <p className="text-sm mt-1" style={{ color: "var(--sage-medium)" }}>
            {assigned.length} of {namedGuests.length} guests seated · {unassigned.length} unassigned
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--sage-medium)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#B7CFB5" }} /> Seated
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block border" style={{ borderColor: "#B7CFB5" }} /> Empty
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Venue floor plan */}
        <div className="flex-1">
          <div className="rounded-3xl p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f8f6f0 0%, #f0ede4 100%)", boxShadow: "0 2px 20px rgba(64,83,53,0.08)", border: "1px solid var(--sage-hint)" }}>

            {/* Venue label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--sage-light)" }}>Reception Hall</p>
            </div>

            {/* Dance floor indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="px-6 py-2 rounded-full text-xs text-center"
                style={{ background: "rgba(183,207,181,0.2)", border: "1px dashed var(--sage-hint)", color: "var(--sage-light)" }}>
                ✦ Dance Floor ✦
              </div>
            </div>

            {/* Tables grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-8 mb-12">
              {TABLES.map(t => (
                <div key={t} className="flex justify-center">
                  <RoundTable
                    tableNum={t}
                    guests={tableGuests(t)}
                    selected={selectedTable === t}
                    onClick={() => setSelectedTable(selectedTable === t ? null : t)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:w-72 flex-shrink-0 space-y-4">
          {/* Selected table panel */}
          {selectedTable && (
            <div className="rounded-2xl p-5" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif" style={{ color: "var(--sage-evergreen)" }}>
                  Table {selectedTable}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--sage-hint)", color: "var(--sage-dark)" }}>
                  {tableGuests(selectedTable).length}/{SEATS_PER_TABLE} seats
                </span>
              </div>

              {/* Seated guests */}
              <div className="space-y-1.5 mb-4">
                {tableGuests(selectedTable).length === 0
                  ? <p className="text-xs" style={{ color: "var(--sage-light)" }}>No guests assigned yet</p>
                  : tableGuests(selectedTable).map(g => (
                    <div key={g.id} className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: "var(--sage-hint)" }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--sage-evergreen)" }}>{g.name}</p>
                        {g.mealPreference && <p className="text-xs" style={{ color: "var(--sage-medium)" }}>{g.mealPreference}</p>}
                      </div>
                      <button onClick={() => assignTable(g.id, null)}
                        className="text-xs opacity-50 hover:opacity-100 transition-opacity ml-2"
                        style={{ color: "#c0392b" }}>✕</button>
                    </div>
                  ))
                }
              </div>

              {/* Add from unassigned */}
              {tableGuests(selectedTable).length < SEATS_PER_TABLE && unassigned.length > 0 && (
                <>
                  <p className="text-xs mb-2 font-medium" style={{ color: "var(--sage-medium)" }}>Add to this table:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {unassigned.map(g => (
                      <button key={g.id} onClick={() => assignTable(g.id, selectedTable)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg hover:opacity-80 transition-all flex items-center justify-between"
                        style={{ background: "var(--sage-hint)", color: "var(--sage-evergreen)" }}>
                        <span>{g.name}</span>
                        <span style={{ color: "var(--sage-medium)" }}>+ Add</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Unassigned guests */}
          <div className="rounded-2xl p-5" style={{ background: "white", boxShadow: "0 1px 8px rgba(64,83,53,0.07)" }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center justify-between" style={{ color: "var(--sage-evergreen)" }}>
              Unassigned
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--sage-hint)", color: "var(--sage-dark)" }}>
                {unassigned.length}
              </span>
            </h3>
            {unassigned.length === 0
              ? <p className="text-xs" style={{ color: "var(--sage-moss)" }}>✓ All guests seated!</p>
              : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {unassigned.map(g => (
                    <div key={g.id} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0"
                      style={{ borderColor: "var(--sage-hint)" }}>
                      <p style={{ color: "var(--sage-evergreen)" }}>{g.name}</p>
                      <p style={{ color: "var(--sage-medium)" }}>{g.group}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Tables", value: TABLES.length },
              { label: "Capacity", value: TABLES.length * SEATS_PER_TABLE },
              { label: "Seated", value: assigned.length },
              { label: "Available", value: TABLES.length * SEATS_PER_TABLE - assigned.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "white", boxShadow: "0 1px 6px rgba(64,83,53,0.06)" }}>
                <p className="text-lg font-serif" style={{ color: "var(--sage-evergreen)" }}>{value}</p>
                <p className="text-xs" style={{ color: "var(--sage-medium)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
