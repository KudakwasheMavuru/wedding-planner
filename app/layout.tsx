import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Kudakwashe & Maxine — Wedding Planner",
  description: "Wedding planner for Kudakwashe & Maxine, 28 August 2027",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen overflow-y-auto" style={{ background: "var(--cream)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
