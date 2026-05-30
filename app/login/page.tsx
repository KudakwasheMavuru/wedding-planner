"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.8 + Math.sin(i * 1.3) * 8 + 5)}%`,
  delay: `${(i * 0.42) % 7}s`,
  duration: `${7 + (i % 5)}s`,
  size: `${10 + (i % 8)}px`,
  opacity: 0.55 + (i % 4) * 0.1,
  rotate: `${i * 37}deg`,
}));

const ANIM = `
@keyframes float-petal {
  0%   { transform: translateY(-40px) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.7; }
  85%  { opacity: 0.5; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
@keyframes sway {
  0%, 100% { margin-left: 0; }
  25%       { margin-left: 18px; }
  75%       { margin-left: -18px; }
}
@keyframes rings-pulse {
  0%, 100% { transform: scale(1) rotate(-8deg); }
  50%       { transform: scale(1.06) rotate(-8deg); }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res?.ok) {
      setError("Incorrect email or password.");
      setLoading(false);
    } else {
      window.location.replace("/");
    }
  }

  return (
    <>
      <style>{ANIM}</style>

      <div className="fixed inset-0" style={{
        background: "linear-gradient(135deg, #344C3D 0%, #405335 40%, #606C46 75%, #9BAA7F 100%)",
      }} />

      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #B7CFB5 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #9AA796 0%, transparent 50%)`,
      }} />

      {/* Falling petals */}
      {mounted && PETALS.map(p => (
        <div key={p.id} className="fixed top-0 pointer-events-none z-10" style={{ left: p.left }}>
          <div style={{
            width: p.size, height: p.size, opacity: p.opacity,
            animation: `float-petal ${p.duration} ${p.delay} infinite linear, sway ${parseFloat(p.duration) * 0.7}s ${p.delay} infinite ease-in-out`,
          }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${p.rotate})` }}>
              <path d="M12 2C12 2 6 7 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 7 12 2 12 2Z" fill="#B7CFB5" />
              <path d="M12 18C12 18 7 14 7 10C7 7.79086 9.23858 6 12 6" fill="#9BAA7F" opacity="0.6" />
            </svg>
          </div>
        </div>
      ))}

      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Rings */}
          <div className="flex justify-center mb-8" style={{ animation: "fade-up 0.9s ease both" }}>
            <div style={{ animation: "rings-pulse 3s ease-in-out infinite" }}>
              <svg width="90" height="60" viewBox="0 0 90 60" fill="none">
                <circle cx="30" cy="30" r="22" stroke="#B7CFB5" strokeWidth="4" fill="none" opacity="0.9" />
                <circle cx="30" cy="30" r="22" stroke="#FAF8F4" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4 8" />
                <polygon points="30,10 33,16 30,18 27,16" fill="#FAF8F4" opacity="0.85" />
                <circle cx="60" cy="30" r="22" stroke="#9BAA7F" strokeWidth="4" fill="none" opacity="0.9" />
                <circle cx="60" cy="30" r="22" stroke="#FAF8F4" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4 8" />
              </svg>
            </div>
          </div>

          {/* Names */}
          <div className="text-center mb-8" style={{ animation: "fade-up 0.9s 0.15s ease both", opacity: 0 }}>
            <p className="text-sm uppercase tracking-[0.35em] mb-2" style={{ color: "#B7CFB5" }}>Wedding Planner</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.8rem", lineHeight: 1.1, color: "white", fontWeight: 400 }}>
              Kudakwashe
            </h1>
            <p style={{ color: "#B7CFB5", fontSize: "1rem", margin: "4px 0", letterSpacing: "0.2em" }}>&amp;</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.8rem", lineHeight: 1.1, color: "white", fontWeight: 400 }}>
              Maxine
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#9AA796", letterSpacing: "0.1em" }}>28 · 08 · 2027</p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8" style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(183,207,181,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            animation: "fade-up 0.9s 0.35s ease both",
            opacity: 0,
          }}>
            <p className="text-center text-sm mb-6" style={{ color: "#B7CFB5", letterSpacing: "0.05em" }}>
              Sign in to your wedding dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-2" style={{ color: "#B7CFB5", letterSpacing: "0.08em" }}>EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@gmail.com"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(183,207,181,0.3)",
                    color: "white",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs mb-2" style={{ color: "#B7CFB5", letterSpacing: "0.08em" }}>PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(183,207,181,0.3)",
                    color: "white",
                  }}
                />
              </div>

              {error && (
                <p className="text-xs text-center" style={{ color: "#f87171" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl py-4 px-6 font-medium text-sm transition-all duration-200 mt-2"
                style={{
                  background: loading ? "rgba(183,207,181,0.5)" : "rgba(183,207,181,0.9)",
                  color: "#344C3D",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: "rgba(183,207,181,0.5)" }}>
                Private access only · Kudakwashe &amp; Maxine
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8" style={{ animation: "fade-up 0.9s 0.5s ease both", opacity: 0 }}>
            <div className="h-px flex-1" style={{ background: "rgba(183,207,181,0.2)" }} />
            <span style={{ color: "rgba(183,207,181,0.5)", fontSize: "1.1rem" }}>✿</span>
            <div className="h-px flex-1" style={{ background: "rgba(183,207,181,0.2)" }} />
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "rgba(183,207,181,0.4)", animation: "fade-up 0.9s 0.55s ease both", opacity: 0 }}>
            Sage Green · Classic · Bohemian · Rustic
          </p>

        </div>
      </div>
    </>
  );
}
