import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f6f9', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>{title}</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 5, fontWeight: 400 }}>{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}