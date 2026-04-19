import { useState, useEffect } from 'react';
import { Bell, Activity } from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hhmm = t => t.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const date = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{
      height: 58,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 14,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>

      {/* Page identity */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '-0.4px',
          color: 'var(--text)',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            fontSize: 11,
            color: 'var(--text3)',
            marginTop: 1,
            letterSpacing: '0.1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{subtitle}</div>
        )}
      </div>

      {/* Live pulse */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 11px',
        background: 'var(--green-dim)',
        border: '1px solid rgba(5,150,105,0.18)',
        borderRadius: 20,
        fontSize: 10.5,
        fontWeight: 600,
        color: 'var(--green)',
        letterSpacing: '0.4px',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--green)',
          animation: 'pulse-dot 2s ease-in-out infinite',
          display: 'inline-block',
        }} />
        LIVE
      </div>

      {/* Date + time */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: '0.5px',
          lineHeight: 1.1,
        }}>{hhmm(time)}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{date}</div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

      {/* Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 10.5,
        fontWeight: 600,
        color: 'var(--cyan)',
        letterSpacing: '0.3px',
      }}>
        <Activity size={11} strokeWidth={2} />
        All systems operational
      </div>

      {/* Bell */}
      <button style={{
        position: 'relative',
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        color: 'var(--text2)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--cyan-dim)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <Bell size={14} strokeWidth={1.75} />
        <span style={{
          position: 'absolute', top: -3, right: -3,
          width: 15, height: 15,
          background: 'var(--red)',
          borderRadius: '50%',
          fontSize: 8, fontWeight: 700, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
        }}>3</span>
      </button>
    </div>
  );
}
