export const card = {
  background: '#fff',
  borderRadius: 16,
  padding: '28px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 1px 6px rgba(15,23,42,0.06)',
};

export const inputWrap = { marginBottom: 16 };

export const label = {
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  letterSpacing: '0.2px',
  display: 'block',
  marginBottom: 6,
};

export const input = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid #e8edf2',
  fontSize: 13,
  fontWeight: 500,
  color: '#0f172a',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export const inputFocus = {
  borderColor: '#6366f1',
  boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
};

export function Field({ label: lbl, children }) {
  return (
    <div style={inputWrap}>
      <label style={label}>{lbl}</label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input
      {...props}
      style={input}
      onFocus={e => Object.assign(e.target.style, inputFocus)}
      onBlur={e => Object.assign(e.target.style, { borderColor: '#e8edf2', boxShadow: 'none' })}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{ ...input, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      onFocus={e => Object.assign(e.target.style, inputFocus)}
      onBlur={e => Object.assign(e.target.style, { borderColor: '#e8edf2', boxShadow: 'none' })}
    >
      {children}
    </select>
  );
}

export function Button({ children, loading, onClick, color = '#6366f1', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '12px', borderRadius: 10, border: 'none',
        background: loading ? '#a5b4fc' : color,
        color: '#fff', fontSize: 13, fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, transition: 'all 0.2s', marginTop: 8,
        boxShadow: loading ? 'none' : `0 4px 14px ${color}40`,
        letterSpacing: '0.1px',
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      {...props}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon: Icon, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 240, textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f8fafc', border: '1.5px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={22} color="#cbd5e1" />
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, maxWidth: 200, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

export function ResultBox({ children }) {
  return (
    <div style={{ ...card, animation: 'fadeIn 0.3s ease' }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20, letterSpacing: '-0.2px' }}>{children}</p>;
}