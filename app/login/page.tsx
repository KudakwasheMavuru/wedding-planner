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

const RINGS_ANIM = `
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
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <>
      <style>{RINGS_ANIM}</style>

      {/* Full-screen background */}
      <div className="fixed inset-0" style={{
        background: "linear-gradient(135deg, #344C3D 0%, #405335 40%, #606C46 75%, #9BAA7F 100%)",
      }} />

      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #B7CFB5 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #9AA796 0%, transparent 50%),
                          radial-gradient(circle at 60% 80%, #405335 0%, transparent 40%)`,
      }} />

      {/* Falling petals */}
      {mounted && PETALS.map(p => (
        <div key={p.id} className="fixed top-0 pointer-events-none z-10" style={{ left: p.left }}>
          <div style={{
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-petal ${p.duration} ${p.delay} infinite linear, sway ${parseFloat(p.duration) * 0.7}s ${p.delay} infinite ease-in-out`,
          }}>
            {/* Petal SVG */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ transform: `rotate(${p.rotate})` }}>
              <path d="M12 2C12 2 6 7 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 7 12 2 12 2Z"
                fill="#B7CFB5" />
              <path d="M12 18C12 18 7 14 7 10C7 7.79086 9.23858 6 12 6"
                fill="#9BAA7F" opacity="0.6" />
            </svg>
          </div>
        </div>
      ))}

      {/* Login card */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Rings illustration */}
          <div className="flex justify-center mb-8" style={{ animation: "fade-up 0.9s ease both" }}>
            <div style={{ animation: "rings-pulse 3s ease-in-out infinite" }}>
              <svg width="90" height="60" viewBox="0 0 90 60" fill="none">
                {/* Left ring */}
                <circle cx="30" cy="30" r="22" stroke="#B7CFB5" strokeWidth="4" fill="none" opacity="0.9" />
                <circle cx="30" cy="30" r="22" stroke="#FAF8F4" strokeWidth="1.5" fill="none" opacity="0.3"
                  strokeDasharray="4 8" />
                {/* Diamond on left ring */}
                <polygon points="30,10 33,16 30,18 27,16" fill="#FAF8F4" opacity="0.85" />
                {/* Right ring */}
                <circle cx="60" cy="30" r="22" stroke="#9BAA7F" strokeWidth="4" fill="none" opacity="0.9" />
                <circle cx="60" cy="30" r="22" stroke="#FAF8F4" strokeWidth="1.5" fill="none" opacity="0.3"
                  strokeDasharray="4 8" />
                {/* Connector overlap highlight */}
                <path d="M45 20 Q45 40 45 40" stroke="#FAF8F4" strokeWidth="0.5" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Monogram */}
          <div className="text-center mb-2" style={{ animation: "fade-up 0.9s 0.1s ease both", opacity: 0 }}>
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: "#B7CFB5" }}>
              Wedding Planner
            </p>
          </div>

          {/* Names */}
          <div className="text-center mb-8" style={{ animation: "fade-up 0.9s 0.2s ease both", opacity: 0 }}>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "2.8rem",
              lineHeight: 1.1,
              color: "white",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}>
              Kudakwashe
            </h1>
            <p style={{ color: "#B7CFB5", fontSize: "1rem", margin: "4px 0", letterSpacing: "0.2em" }}>
              &amp;
            </p>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "2.8rem",
              lineHeight: 1.1,
              color: "white",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}>
              Maxine
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#9AA796", letterSpacing: "0.1em" }}>
              28 · 08 · 2027
            </p>
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

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 px-6 font-medium text-sm transition-all duration-200"
              style={{
                background: loading ? "rgba(255,255,255,0.7)" : "white",
                color: "#344C3D",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transform: loading ? "scale(0.98)" : "scale(1)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={e => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={e => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              {loading ? (
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#9BAA7F" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading ? "Signing in…" : "Continue with Google"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: "rgba(183,207,181,0.6)" }}>
                Private access only · Kudakwashe &amp; Maxine
              </p>
            </div>
          </div>

          {/* Floral divider */}
          <div className="flex items-center justify-center gap-3 mt-8" style={{
            animation: "fade-up 0.9s 0.5s ease both", opacity: 0,
          }}>
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
