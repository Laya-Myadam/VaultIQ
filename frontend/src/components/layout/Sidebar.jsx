import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShieldAlert, CreditCard, Scale,
  Activity, FileText, Settings, LogOut, Zap,
  ScanSearch, FileBarChart2, Landmark
} from 'lucide-react';

const GROUPS = [
  [
    { to: '/',           icon: LayoutDashboard, label: 'Overview'      },
    { to: '/fraud',      icon: ShieldAlert,     label: 'Fraud Intel'   },
  ],
  [
    { to: '/credit',     icon: CreditCard,      label: 'Credit'        },
    { to: '/compliance', icon: Scale,           label: 'Compliance'    },
    { to: '/risk',       icon: Activity,        label: 'Risk'          },
    { to: '/loans',      icon: Landmark,        label: 'Loan Monitor'  },
  ],
  [
    { to: '/documents',  icon: FileText,        label: 'Doc AI'        },
    { to: '/aml',        icon: ScanSearch,      label: 'AML Intel'     },
    { to: '/reports',    icon: FileBarChart2,   label: 'Report Studio' },
  ],
];

function NavItem({ to, icon: Icon, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 2 }}>
      <NavLink
        to={to}
        end={to === '/'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: 12,
          textDecoration: 'none',
          transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
          background: isActive
            ? 'linear-gradient(140deg, #3B82F6 0%, #2563EB 100%)'
            : hovered ? 'rgba(37,99,235,0.07)' : 'transparent',
          color: isActive ? '#fff' : hovered ? 'var(--cyan)' : 'var(--text3)',
          boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.28)' : 'none',
          transform: hovered && !isActive ? 'scale(1.08)' : 'scale(1)',
        })}
      >
        <Icon size={17} strokeWidth={isActive => isActive ? 2.2 : 1.8} />
      </NavLink>

      {/* Floating label tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          left: 52,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--text)',
          color: '#fff',
          fontSize: 11.5,
          fontWeight: 500,
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.15px',
          padding: '5px 11px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: 'var(--shadow)',
          animation: 'float-in 0.14s ease forwards',
        }}>
          {label}
          <span style={{
            position: 'absolute',
            left: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: '5px solid var(--text)',
          }} />
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('vaultiq_auth');
    navigate('/login', { replace: true });
  };

  return (
    <aside style={{
      width: 68,
      minWidth: 68,
      background: '#FFFFFF',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      padding: '18px 0 16px',
      position: 'relative',
      zIndex: 100,
      boxShadow: '2px 0 16px rgba(11,29,66,0.04)',
    }}>

      {/* Logo mark */}
      <div style={{
        width: 38,
        height: 38,
        background: 'linear-gradient(140deg, #3B82F6 0%, #1D4ED8 100%)',
        borderRadius: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 26,
        boxShadow: '0 4px 14px rgba(37,99,235,0.32)',
        flexShrink: 0,
      }}>
        <Zap size={17} color="#fff" strokeWidth={2.5} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {GROUPS.map((group, gi) => (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {group.map(item => <NavItem key={item.to} {...item} />)}
            {gi < GROUPS.length - 1 && (
              <div style={{
                width: 22,
                height: 1,
                background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
                margin: '10px 0',
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {[
          { icon: Settings, title: 'Settings', to: '/settings' },
          { icon: LogOut,   title: 'Logout',   red: true },
        ].map(({ icon: Icon, title, to, red }) => (
          <button key={title} title={title}
            onClick={() => to ? navigate(to) : logout()}
            style={{
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: 12,
              cursor: 'pointer',
              color: red ? 'var(--red)' : 'var(--text3)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = red ? 'var(--red-dim)' : 'var(--bg3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={17} strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </aside>
  );
}
