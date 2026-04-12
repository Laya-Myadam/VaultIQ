import { LayoutDashboard, ShieldAlert, CreditCard, FileCheck, Activity, FileText, Settings, LogOut, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: ShieldAlert, label: "Fraud", to: "/fraud" },
  { icon: CreditCard, label: "Credit", to: "/credit" },
  { icon: FileCheck, label: "Compliance", to: "/compliance" },
  { icon: Activity, label: "Risk", to: "/risk" },
  { icon: FileText, label: "Documents", to: "/documents" },
];

const S = {
  aside: { width: 220, minWidth: 220, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', padding: '20px 12px', height: '100vh' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 28 },
  logoIcon: { width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px' },
  section: { fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6, marginTop: 4 },
  navGroup: { flex: 1 },
  bottom: { borderTop: '1px solid #f8fafc', paddingTop: 12, marginTop: 12 },
  footBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: 13, fontWeight: 500, color: '#94a3b8' },
};

export default function Sidebar() {
  return (
    <aside style={S.aside}>
      <div style={S.logo}>
        <div style={S.logoIcon}><Zap size={15} color="#fff" strokeWidth={2.5} /></div>
        <span style={S.logoText}>Vault<span style={{ color: '#6366f1' }}>IQ</span></span>
      </div>

      <p style={S.section}>Platform</p>
      <div style={S.navGroup}>
        {nav.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 8, fontSize: 13, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366f1' : '#64748b',
                background: isActive ? '#eef2ff' : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {label}
                {isActive && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#6366f1' }} />}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div style={S.bottom}>
        <button style={S.footBtn}><Settings size={15} /> Settings</button>
        <button style={S.footBtn}><LogOut size={15} /> Logout</button>
      </div>
    </aside>
  );
}