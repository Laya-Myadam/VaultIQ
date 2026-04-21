import { useState, useEffect } from 'react';
import { Bell, Activity } from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const hhmm = t => t.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
  const date  = time.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });

  return (
    <div style={{
      height:58, flexShrink:0, position:'sticky', top:0, zIndex:50,
      background:'rgba(255,255,255,0.82)',
      backdropFilter:'blur(28px) saturate(180%)',
      WebkitBackdropFilter:'blur(28px) saturate(180%)',
      borderBottom:'1px solid rgba(255,255,255,0.88)',
      boxShadow:'0 2px 20px rgba(79,98,232,0.07)',
      display:'flex', alignItems:'center', padding:'0 26px', gap:16,
    }}>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, letterSpacing:'-0.5px', color:'var(--text)', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize:10.5, color:'var(--text3)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{subtitle}</div>}
      </div>

      {/* Live */}
      <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 11px', background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.18)', borderRadius:20, fontSize:10, fontWeight:700, color:'var(--green)', letterSpacing:'0.7px' }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)', animation:'pulse-dot 2s ease-in-out infinite', display:'inline-block' }} />
        LIVE
      </div>

      {/* Clock */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:500, color:'var(--text)', letterSpacing:'0.5px', lineHeight:1.1 }}>{hhmm(time)}</div>
        <div style={{ fontSize:10, color:'var(--text3)', marginTop:1 }}>{date}</div>
      </div>

      <div style={{ width:1, height:22, background:'rgba(79,98,232,0.12)' }} />

      <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10.5, fontWeight:600, color:'var(--cyan)', letterSpacing:'0.2px' }}>
        <Activity size={11} strokeWidth={2} />
        All systems operational
      </div>

      <button style={{
        position:'relative', width:34, height:34,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(248,249,255,0.90)', border:'1px solid rgba(208,216,255,0.80)',
        borderRadius:11, color:'var(--text2)', cursor:'pointer',
        transition:'all 0.17s', boxShadow:'0 2px 8px rgba(79,98,232,0.07)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(79,98,232,0.09)'; e.currentTarget.style.borderColor='rgba(79,98,232,0.28)'; e.currentTarget.style.color='var(--cyan)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(248,249,255,0.90)'; e.currentTarget.style.borderColor='rgba(208,216,255,0.80)'; e.currentTarget.style.color='var(--text2)'; }}
      >
        <Bell size={14} strokeWidth={1.75} />
        <span style={{ position:'absolute', top:-3, right:-3, width:15, height:15, background:'var(--red)', borderRadius:'50%', fontSize:8, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff', boxShadow:'0 2px 6px rgba(220,38,38,0.35)' }}>3</span>
      </button>
    </div>
  );
}
