const cfg = {
  critical: { bar: '#ef4444', bg: '#fef2f2', text: '#dc2626', label: 'Critical' },
  warning:  { bar: '#f59e0b', bg: '#fffbeb', text: '#d97706', label: 'Warning' },
  info:     { bar: '#6366f1', bg: '#eef2ff', text: '#4f46e5', label: 'Info' },
};

export default function AlertCard({ alert }) {
  const c = cfg[alert.level] || cfg.info;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 10, transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 99, background: c.bar, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{alert.title}</p>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.text, letterSpacing: '0.3px' }}>{c.label}</span>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{alert.desc}</p>
      </div>
      <span style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0, marginTop: 1 }}>{alert.time}</span>
    </div>
  );
}