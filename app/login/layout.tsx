export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-auto" style={{ marginLeft: 0 }}>
      {children}
    </div>
  );
}
