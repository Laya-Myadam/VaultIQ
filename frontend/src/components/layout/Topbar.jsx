import { Bell, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid #f0f0f0',
      padding: '0 24px', height: 52, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#16a34a' }}>Live</span>
        </div>
        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 300 }}>|</span>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: '#f0fdf4', border: '1px solid #bbf7d0'
        }}>
          <Wifi size={11} color="#16a34a" strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d' }}>All systems operational</span>
        </div>
        <button style={{
          width: 34, height: 34, borderRadius: 8, border: '1px solid #f1f5f9',
          background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', position: 'relative'
        }}>
          <Bell size={14} color="#94a3b8" />
          <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, background: '#ef4444', borderRadius: '50%', border: '1.5px solid #fff' }} />
        </button>
      </div>
    </header>
  );
}