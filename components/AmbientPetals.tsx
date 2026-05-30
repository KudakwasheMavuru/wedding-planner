"use client";

import { usePathname } from "next/navigation";

const PETALS = [
  { left: "12%",  dur: "22s", delay: "0s",    size: 10, opacity: 0.22 },
  { left: "28%",  dur: "28s", delay: "4s",    size: 8,  opacity: 0.18 },
  { left: "45%",  dur: "19s", delay: "8s",    size: 12, opacity: 0.20 },
  { left: "62%",  dur: "25s", delay: "2s",    size: 9,  opacity: 0.16 },
  { left: "78%",  dur: "31s", delay: "11s",   size: 7,  opacity: 0.20 },
  { left: "88%",  dur: "21s", delay: "6s",    size: 11, opacity: 0.15 },
  { left: "5%",   dur: "34s", delay: "15s",   size: 8,  opacity: 0.17 },
  { left: "55%",  dur: "26s", delay: "18s",   size: 10, opacity: 0.19 },
];

export default function AmbientPetals() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <>
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="app-petal"
          style={{
            left: p.left,
            "--dur": p.dur,
            "--delay": p.delay,
          } as React.CSSProperties}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: p.opacity, transform: `rotate(${i * 43}deg)` }}
          >
            <path
              d="M12 2C12 2 6 7 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 7 12 2 12 2Z"
              fill="#9BAA7F"
            />
            <path
              d="M12 18C12 18 7 14 7 10C7 7.79 9.24 6 12 6"
              fill="#606C46"
              opacity="0.5"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
