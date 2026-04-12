import { ShieldCheck, CreditCard, FileCheck, Activity } from "lucide-react";

const icons = { shield: ShieldCheck, "credit-card": CreditCard, "file-check": FileCheck, activity: Activity };
const status = {
  active:   { dot: '#22c55e', text: '#16a34a', label: 'Active', bg: '#f0fdf4' },
  warning:  { dot: '#f59e0b', text: '#d97706', label: 'Warning', bg: '#fffbeb' },
  inactive: { dot: '#cbd5e1', text: '#94a3b8', label: 'Offline', bg: '#f8fafc' },
};
const bar = (a) => a > 85 ? '#22c55e' : a > 70 ? '#f59e0b' : '#ef4444';

export default function ModuleCard({ module: m }) {
  const Icon = icons[m.icon] || Activity;
  const s = status[m.status] || status.inactive;
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="#6366f1" strokeWidth={2} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, background: s.bg }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: s.text }}>{s.label}</span>
        </div>
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{m.name}</p>
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>{m.stat}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Accuracy</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{m.accuracy}%</span>
      </div>
      <div style={{ width: '100%', height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${m.accuracy}%`, height: '100%', background: bar(m.accuracy), borderRadius: 99, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}