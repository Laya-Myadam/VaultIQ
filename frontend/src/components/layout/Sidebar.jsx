import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, CreditCard, Scale, Activity, FileText,
  Settings, LogOut, Zap, ScanSearch, FileBarChart2, Landmark,
  Users, BarChart2, Package, Cpu, TrendingUp,
} from 'lucide-react';

const GROUPS = [
  { label: 'Core', items: [
    { to: '/',      icon: LayoutDashboard, label: 'Overview'    },
    { to: '/fraud', icon: ShieldAlert,     label: 'Fraud Intel' },
  ]},
  { label: 'Risk & Lending', items: [
    { to: '/credit-suite', icon: CreditCard, label: 'Credit Suite'  },
    { to: '/risk',         icon: Activity,   label: 'Risk'          },
    { to: '/loans',        icon: Landmark,   label: 'Loan Monitor'  },
    { to: '/treasury',     icon: TrendingUp, label: 'Treasury'      },
  ]},
  { label: 'Compliance', items: [
    { to: '/compliance-hub', icon: Scale,     label: 'Compliance Hub' },
    { to: '/aml',            icon: ScanSearch, label: 'AML Intel'     },
    { to: '/model-risk',     icon: Cpu,        label: 'Model Risk'    },
  ]},
  { label: 'Intelligence', items: [
    { to: '/customer-intel', icon: Users,    label: 'Customer Intel' },
    { to: '/benchmarking',   icon: BarChart2, label: 'Benchmarking'  },
    { to: '/risk-assets',    icon: Package,  label: 'Risk Assets'   },
  ]},
  { label: 'Tools', items: [
    { to: '/reports',   icon: FileBarChart2, label: 'Report Studio' },
    { to: '/documents', icon: FileText,      label: 'Doc AI'        },
  ]},
];

function NavItem({ to, icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <NavLink to={to} end={to === '/'}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '7px 11px', borderRadius: 10,
        textDecoration: 'none', marginBottom: 1,
        transition: 'all 0.17s cubic-bezier(.4,0,.2,1)',
        fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500,
        letterSpacing: '-0.1px',
        background: isActive
          ? 'linear-gradient(135deg,#5B73F2 0%,#4152DC 100%)'
          : hov ? 'rgba(79,98,232,0.08)' : 'transparent',
        color: isActive ? '#fff' : hov ? '#4F62E8' : '#5E6E9E',
        boxShadow: isActive
          ? '0 4px 14px rgba(79,98,232,0.28), inset 0 1px 0 rgba(255,255,255,0.20)'
          : 'none',
      })}>
      <Icon size={14} strokeWidth={1.9} style={{ flexShrink: 0 }} />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('vaultiq_auth'); navigate('/login', { replace: true }); };

  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderRight: '1px solid rgba(255,255,255,0.90)',
      boxShadow: '4px 0 28px rgba(79,98,232,0.07)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', padding: '18px 10px 14px',
      position: 'relative', zIndex: 100,
    }}>

      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, paddingLeft:3 }}>
        <div style={{
          width:36, height:36, flexShrink:0,
          background:'linear-gradient(140deg,#6474F0,#4152D8)',
          borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 14px rgba(79,98,232,0.34), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          <Zap size={15} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16.5, letterSpacing:'-0.5px', color:'#0C1128', lineHeight:1 }}>
            Vault<span style={{ background:'linear-gradient(135deg,#5B73F2,#8B5CF6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IQ</span>
          </div>
          <div style={{ fontSize:8, color:'#A0ABCC', letterSpacing:'1.2px', marginTop:4, fontWeight:600, textTransform:'uppercase', fontFamily:'var(--font)' }}>
            AI Banking OS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto' }}>
        {GROUPS.map((g, gi) => (
          <div key={gi} style={{ marginBottom:4 }}>
            <div style={{ fontSize:8.5, fontWeight:700, color:'#C0CADF', letterSpacing:'0.8px', textTransform:'uppercase', padding: gi===0 ? '0 6px 5px' : '10px 6px 5px', fontFamily:'var(--font)' }}>
              {g.label}
            </div>
            {g.items.map(i => <NavItem key={i.to} {...i} />)}
          </div>
        ))}
      </nav>

      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(79,98,232,0.12),transparent)', margin:'8px 4px' }} />

      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        {[
          { icon:Settings, label:'Settings', to:'/settings' },
          { icon:LogOut,   label:'Sign Out',  red:true },
        ].map(({ icon:Icon, label, to, red }) => (
          <button key={label} onClick={() => to ? navigate(to) : logout()} style={{
            display:'flex', alignItems:'center', gap:9, padding:'7px 11px',
            borderRadius:10, border:'none', background:'transparent', cursor:'pointer',
            color: red ? '#E53E3E' : '#5E6E9E', transition:'all 0.17s',
            fontFamily:'var(--font)', fontSize:13, fontWeight:500,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = red ? 'rgba(229,62,62,0.08)' : 'rgba(79,98,232,0.08)'; e.currentTarget.style.color = red ? '#C53030' : '#4F62E8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = red ? '#E53E3E' : '#5E6E9E'; }}
          >
            <Icon size={14} strokeWidth={1.9} style={{ flexShrink:0 }} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
