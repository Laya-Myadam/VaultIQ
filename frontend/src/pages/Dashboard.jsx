import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Activity, DollarSign, ArrowUpRight, Clock } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

const KPI = ({ label, value, sub, trend, trendUp, color = 'var(--cyan)', icon: Icon }) => (
  <div style={{
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    animation: 'fade-in 0.3s ease forwards',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        <Icon size={13} strokeWidth={2} />
      </div>
    </div>
    <div style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      color: 'var(--text)',
      letterSpacing: '-0.5px',
      lineHeight: 1,
    }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        display: 'flex', alignItems: 'center', gap: 3,
        fontSize: 11, fontWeight: 500,
        color: trendUp ? 'var(--green)' : 'var(--red)',
        background: trendUp ? 'var(--green-dim)' : 'var(--red-dim)',
        padding: '2px 7px', borderRadius: 10,
      }}>
        {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {trend}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{sub}</span>
    </div>
  </div>
);

const MiniSparkline = ({ data, color }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const min = Math.min(...data), max = Math.max(...data);
    const xStep = W / (data.length - 1);
    const pts = data.map((v, i) => [i * xStep, H - ((v - min) / (max - min)) * (H - 4) - 2]);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `${color}40`);
    grad.addColorStop(1, `${color}00`);
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }, [data, color]);
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

const Alert = ({ level, title, desc, time }) => {
  const colors = { critical: 'var(--red)', warning: 'var(--amber)', info: 'var(--cyan)' };
  const bgs    = { critical: 'var(--red-dim)', warning: 'var(--amber-dim)', info: 'var(--cyan-dim)' };
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '11px 0',
      borderBottom: '1px solid var(--border)',
      animation: 'slide-in 0.25s ease forwards',
    }}>
      <div style={{
        width: 3, borderRadius: 4, flexShrink: 0,
        background: colors[level],
        alignSelf: 'stretch',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--text)', flex: 1 }}>{title}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.6px',
            padding: '1px 6px', borderRadius: 4,
            background: bgs[level], color: colors[level],
            textTransform: 'uppercase',
          }}>{level}</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{desc}</div>
      </div>
      <div style={{
        fontSize: 10, color: 'var(--text3)',
        display: 'flex', alignItems: 'flex-start', gap: 3, flexShrink: 0, paddingTop: 2,
        fontFamily: 'var(--mono)',
      }}>
        <Clock size={9} style={{ marginTop: 1 }} />{time}
      </div>
    </div>
  );
};

const fraudData  = [12, 19, 14, 28, 22, 35, 31, 40, 38, 52, 48, 61];
const creditData = [88, 85, 91, 87, 93, 89, 95, 92, 96, 90, 94, 97];
const riskData   = [5.8, 6.1, 5.9, 6.4, 6.2, 6.8, 6.5, 6.2, 6.7, 6.3, 6.5, 6.2];

const fraudCategories = [
  { label: 'Wire Transfer', pct: 38, val: '$912K', color: 'var(--red)' },
  { label: 'Card Skimming', pct: 27, val: '$648K', color: 'var(--orange)' },
  { label: 'ACH Fraud',     pct: 19, val: '$456K', color: 'var(--amber)' },
  { label: 'Check Kiting',  pct: 10, val: '$240K', color: 'var(--indigo)' },
  { label: 'Zelle / P2P',   pct: 6,  val: '$144K', color: 'var(--text3)' },
];

const alerts = [
  { level: 'critical', title: 'High-value anomaly — Acct #XX4821', desc: '$18.6K wire · Fraud score 94/100 · Flagged by velocity model', time: '2m ago' },
  { level: 'warning',  title: 'AML pattern — 3 accounts linked', desc: 'Circular transactions matching typology T-12 · Review required', time: '14m ago' },
  { level: 'warning',  title: 'CTR threshold approaching — Acct #YY9203', desc: '$9,400 cash deposit · $600 below reporting threshold', time: '31m ago' },
  { level: 'info',     title: 'Sanctions list updated', desc: 'OFAC SDN list refreshed · 12 new entries screened against portfolio', time: '1h ago' },
];

export default function Dashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <PageLayout title="Overview" subtitle="Real-time financial intelligence · refreshes every 3s">
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KPI label="Fraud Blocked" value="$2.4M" trend="+12%" trendUp={false} sub="today" color="var(--red)" icon={ShieldCheck} />
        <KPI label="Credit Approvals" value="1,847" trend="+8.3%" trendUp sub="approval rate" color="var(--green)" icon={TrendingUp} />
        <KPI label="Compliance Flags" value="34" trend="5 pending" trendUp={false} sub="review required" color="var(--amber)" icon={AlertTriangle} />
        <KPI label="Portfolio Risk" value="6.2/10" trend="+0.4" trendUp={false} sub="this week" color="var(--orange)" icon={Activity} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Fraud by Category */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Fraud by Category</span>
            <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>YTD · $2.4M total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {fraudCategories.map(({ label, pct, val, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{val}</span>
                    <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 4,
                    background: color,
                    animation: 'tick 0.6s ease forwards',
                    transformOrigin: 'left',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Sparklines */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Trend Lines · 12-week</span>
          {[
            { label: 'Fraud Volume', data: fraudData, color: '#f87171', unit: 'cases/wk' },
            { label: 'Credit Approval Rate', data: creditData, color: '#34d399', unit: '%' },
            { label: 'Portfolio Risk Score', data: riskData, color: '#fbbf24', unit: '/10' },
          ].map(({ label, data, color, unit }) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: color }}>
                  {data[data.length - 1]}{unit}
                </span>
              </div>
              <div style={{ height: 42, width: '100%' }}>
                <MiniSparkline data={data} color={color} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Live Alerts</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.6px',
              background: 'var(--red-dim)', color: 'var(--red)',
              padding: '1px 6px', borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--red)', animation: 'pulse-dot 1.4s ease-in-out infinite' }} />
              LIVE
            </span>
          </div>
          <button style={{
            fontSize: 11, color: 'var(--cyan)', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
          }}>
            View all <ArrowUpRight size={11} />
          </button>
        </div>
        {alerts.map((a, i) => <Alert key={i} {...a} />)}
      </div>
    </PageLayout>
  );
}