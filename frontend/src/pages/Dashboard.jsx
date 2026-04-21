import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Activity, ArrowUpRight, Clock } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

const G = {
  background: 'rgba(255,255,255,0.80)',
  backdropFilter: 'blur(28px) saturate(175%)',
  WebkitBackdropFilter: 'blur(28px) saturate(175%)',
  border: '1px solid rgba(255,255,255,0.92)',
  borderRadius: 18,
  boxShadow: '0 0 0 1px rgba(79,98,232,0.06), 0 4px 18px rgba(79,98,232,0.10), 0 14px 44px rgba(79,98,232,0.08), inset 0 1px 0 rgba(255,255,255,1)',
};

/* ── KPI Card ───────────────────────────── */
function KPI({ label, value, sub, trend, trendUp, gradA, gradB, icon: Icon }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...G, padding:'22px 22px 20px',
        position:'relative', overflow:'hidden',
        animation:'fade-in 0.35s ease forwards',
        transition:'transform 0.2s ease, box-shadow 0.2s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov
          ? '0 0 0 1px rgba(79,98,232,0.10), 0 8px 26px rgba(79,98,232,0.14), 0 22px 52px rgba(79,98,232,0.12), inset 0 1px 0 rgba(255,255,255,1)'
          : G.boxShadow,
      }}
    >
      {/* Gradient top strip */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${gradA},${gradB},transparent)`, borderRadius:'18px 18px 0 0' }} />
      {/* Corner glow */}
      <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, background:`radial-gradient(circle,${gradA}28 0%,transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:9.5, fontWeight:700, color:'var(--text3)', letterSpacing:'1.1px', textTransform:'uppercase', fontFamily:'var(--font)', marginTop:2 }}>{label}</span>
        <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, background:`linear-gradient(145deg,${gradA},${gradB})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 16px ${gradA}55, inset 0 1px 0 rgba(255,255,255,0.28)` }}>
          <Icon size={16} color="#fff" strokeWidth={2} />
        </div>
      </div>

      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:34, color:'var(--text)', letterSpacing:'-1.2px', lineHeight:1, marginBottom:14 }}>{value}</div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:10.5, fontWeight:600, color: trendUp ? 'var(--green)' : 'var(--red)', background: trendUp ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.10)', padding:'3px 9px', borderRadius:20 }}>
          {trendUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
          {trend}
        </span>
        <span style={{ fontSize:11.5, color:'var(--text3)' }}>{sub}</span>
      </div>
    </div>
  );
}

/* ── Sparkline ──────────────────────────── */
function Spark({ data, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * devicePixelRatio; c.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const mn = Math.min(...data), mx = Math.max(...data);
    const xs = W / (data.length - 1);
    const pts = data.map((v,i) => [i*xs, H-((v-mn)/(mx-mn))*(H-8)-4]);
    const gr = ctx.createLinearGradient(0,0,0,H);
    gr.addColorStop(0, color+'40'); gr.addColorStop(1, color+'00');
    ctx.beginPath();
    pts.forEach(([x,y],i) => i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y));
    ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.stroke();
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fillStyle=gr; ctx.fill();
    const [lx,ly]=pts[pts.length-1];
    ctx.beginPath(); ctx.arc(lx,ly,3.5,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    ctx.beginPath(); ctx.arc(lx,ly,6,0,Math.PI*2); ctx.fillStyle=color+'28'; ctx.fill();
  },[data,color]);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }}/>;
}

/* ── Alert row ──────────────────────────── */
function Alert({ level, title, desc, time }) {
  const C = { critical:'#DC2626', warning:'#D97706', info:'#4F62E8' };
  const B = { critical:'rgba(220,38,38,0.08)', warning:'rgba(217,119,6,0.08)', info:'rgba(79,98,232,0.08)' };
  return (
    <div style={{ display:'flex', gap:14, padding:'13px 0', borderBottom:'1px solid rgba(208,216,255,0.40)', animation:'slide-in 0.25s ease forwards' }}>
      <div style={{ width:3.5, borderRadius:4, flexShrink:0, alignSelf:'stretch', background:C[level], boxShadow:`0 0 10px ${C[level]}60` }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <span style={{ fontWeight:600, fontSize:12.5, color:'var(--text)', flex:1, letterSpacing:'-0.1px', fontFamily:'var(--font-display)' }}>{title}</span>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.7px', padding:'2px 8px', borderRadius:5, background:B[level], color:C[level], textTransform:'uppercase' }}>{level}</span>
        </div>
        <div style={{ fontSize:11.5, color:'var(--text3)', lineHeight:1.55 }}>{desc}</div>
      </div>
      <div style={{ fontSize:10, color:'var(--text3)', display:'flex', alignItems:'flex-start', gap:3, flexShrink:0, paddingTop:2, fontFamily:'var(--mono)' }}>
        <Clock size={9} style={{ marginTop:1 }}/>{time}
      </div>
    </div>
  );
}

const fData=[12,19,14,28,22,35,31,40,38,52,48,61];
const cData=[88,85,91,87,93,89,95,92,96,90,94,97];
const rData=[5.8,6.1,5.9,6.4,6.2,6.8,6.5,6.2,6.7,6.3,6.5,6.2];

const cats=[
  { label:'Wire Transfer',pct:38,val:'$912K',a:'#F87171',b:'#DC2626' },
  { label:'Card Skimming',pct:27,val:'$648K',a:'#FB923C',b:'#EA580C' },
  { label:'ACH Fraud',    pct:19,val:'$456K',a:'#FCD34D',b:'#D97706' },
  { label:'Check Kiting', pct:10,val:'$240K',a:'#A78BFA',b:'#7C3AED' },
  { label:'Zelle / P2P',  pct:6, val:'$144K',a:'#94A3B8',b:'#64748B' },
];
const alerts=[
  { level:'critical', title:'High-value anomaly — Acct #XX4821', desc:'$18.6K wire · Fraud score 94/100 · Flagged by velocity model', time:'2m ago' },
  { level:'warning',  title:'AML pattern — 3 accounts linked',   desc:'Circular transactions matching typology T-12 · Review required', time:'14m ago' },
  { level:'warning',  title:'CTR threshold approaching — Acct #YY9203', desc:'$9,400 cash deposit · $600 below reporting threshold', time:'31m ago' },
  { level:'info',     title:'Sanctions list updated', desc:'OFAC SDN list refreshed · 12 new entries screened against portfolio', time:'1h ago' },
];

export default function Dashboard() {
  useEffect(() => { const t = setInterval(()=>{},3000); return () => clearInterval(t); },[]);
  return (
    <PageLayout title="Overview" subtitle="Real-time financial intelligence · refreshes every 3s">

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:18 }}>
        <KPI label="Fraud Blocked"    value="$2.4M"  trend="+12%"      trendUp={false} sub="today"           gradA="#F87171" gradB="#DC2626" icon={ShieldCheck}/>
        <KPI label="Credit Approvals" value="1,847"  trend="+8.3%"     trendUp        sub="approval rate"    gradA="#34D399" gradB="#059669" icon={TrendingUp}/>
        <KPI label="Compliance Flags" value="34"     trend="5 pending" trendUp={false} sub="review required" gradA="#FCD34D" gradB="#D97706" icon={AlertTriangle}/>
        <KPI label="Portfolio Risk"   value="6.2/10" trend="+0.4"      trendUp={false} sub="this week"       gradA="#A78BFA" gradB="#7C3AED" icon={Activity}/>
      </div>

      {/* Mid grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* Fraud by Category */}
        <div style={{ ...G, padding:'22px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text)', letterSpacing:'-0.3px' }}>Fraud by Category</span>
            <span style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--mono)', background:'rgba(79,98,232,0.07)', padding:'3px 9px', borderRadius:7 }}>YTD · $2.4M</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
            {cats.map(({ label, pct, val, a, b }) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                  <span style={{ fontSize:12.5, color:'var(--text2)', fontWeight:500, fontFamily:'var(--font-display)' }}>{label}</span>
                  <div style={{ display:'flex', gap:12 }}>
                    <span style={{ fontSize:12.5, color:'var(--text)', fontFamily:'var(--mono)', fontWeight:600 }}>{val}</span>
                    <span style={{ fontSize:11.5, color:'var(--text3)', fontFamily:'var(--mono)', minWidth:30, textAlign:'right' }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height:8, background:'rgba(79,98,232,0.07)', borderRadius:6, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, borderRadius:6, background:`linear-gradient(90deg,${a},${b})`, boxShadow:`0 0 8px ${a}60`, transition:'width 0.9s cubic-bezier(.4,0,.2,1)' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sparklines */}
        <div style={{ ...G, padding:'22px 24px', display:'flex', flexDirection:'column', gap:18 }}>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text)', letterSpacing:'-0.3px' }}>Trend Lines · 12-week</span>
          {[
            { label:'Fraud Volume',         data:fData, color:'#F87171', unit:'cases/wk' },
            { label:'Credit Approval Rate', data:cData, color:'#34D399', unit:'%' },
            { label:'Portfolio Risk Score',  data:rData, color:'#A78BFA', unit:'/10' },
          ].map(({ label,data,color,unit }) => (
            <div key={label} style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:11.5, color:'var(--text3)', fontFamily:'var(--font)' }}>{label}</span>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', fontWeight:600, color, background:`${color}18`, padding:'2px 8px', borderRadius:8 }}>
                  {data[data.length-1]}{unit}
                </span>
              </div>
              <div style={{ height:46 }}><Spark data={data} color={color}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Alerts */}
      <div style={{ ...G, padding:'22px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text)', letterSpacing:'-0.3px' }}>Live Alerts</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.7px', background:'rgba(220,38,38,0.09)', color:'#DC2626', padding:'2px 8px', borderRadius:5, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#DC2626', animation:'pulse-dot 1.4s ease-in-out infinite', display:'inline-block' }}/>
              LIVE
            </span>
          </div>
          <button style={{ fontSize:11.5, color:'var(--cyan)', background:'rgba(79,98,232,0.07)', border:'1px solid rgba(79,98,232,0.15)', borderRadius:9, padding:'5px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontWeight:600, fontFamily:'var(--font)', transition:'all 0.16s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(79,98,232,0.13)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(79,98,232,0.07)'}
          >
            View all <ArrowUpRight size={12}/>
          </button>
        </div>
        {alerts.map((a,i) => <Alert key={i} {...a}/>)}
      </div>
    </PageLayout>
  );
}
