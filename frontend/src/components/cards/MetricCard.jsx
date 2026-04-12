const cfg = {
  success: { bg: '#f0fdf4', val: '#15803d', badge: '#dcfce7', badgeText: '#16a34a', dot: '#22c55e' },
  danger:  { bg: '#fef2f2', val: '#b91c1c', badge: '#fee2e2', badgeText: '#dc2626', dot: '#ef4444' },
  warning: { bg: '#fffbeb', val: '#92400e', badge: '#fef3c7', badgeText: '#d97706', dot: '#f59e0b' },
  info:    { bg: '#eef2ff', val: '#3730a3', badge: '#e0e7ff', badgeText: '#4f46e5', dot: '#6366f1' },
};

export default function MetricCard({ label, value, change, changeType }) {
  const c = cfg[changeType] || cfg.info;
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 20px',
      border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
      transition: 'box-shadow 0.2s', cursor: 'default'
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 14, lineHeight: 1 }}>{value}</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 99, background: c.badge }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: c.badgeText }}>{change}</span>
      </div>
    </div>
  );
}