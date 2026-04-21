import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    localStorage.setItem('vaultiq_auth', JSON.stringify({ email: email.trim(), loggedAt: Date.now() }));
    nav('/', { replace: true });
  };

  const inputStyle = (extra = {}) => ({
    width: '100%',
    background: 'rgba(248,249,255,0.92)',
    border: '1.5px solid rgba(224,228,255,0.85)',
    borderRadius: 11,
    padding: '12px 15px',
    color: '#0E1225',
    fontSize: 13.5,
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxSizing: 'border-box',
    ...extra,
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      backgroundImage:
        'radial-gradient(ellipse 42% 40% at 6% 10%, rgba(255,255,255,0.82) 0%, rgba(167,139,250,0.55) 28%, rgba(109,40,217,0.22) 56%, transparent 74%),' +
        'radial-gradient(ellipse 38% 36% at 94% 8%, rgba(255,255,255,0.78) 0%, rgba(96,165,250,0.50) 26%, rgba(37,99,235,0.18) 54%, transparent 72%),' +
        'radial-gradient(ellipse 36% 40% at 90% 92%, rgba(255,255,255,0.72) 0%, rgba(52,211,153,0.44) 27%, rgba(5,150,105,0.16) 54%, transparent 72%),' +
        'radial-gradient(ellipse 38% 34% at 8% 90%, rgba(255,255,255,0.72) 0%, rgba(129,140,248,0.46) 26%, rgba(67,56,202,0.16) 52%, transparent 70%),' +
        'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(238,240,255,0.50) 0%, transparent 75%),' +
        'linear-gradient(180deg, #EBEDFF 0%, #E8ECFF 100%)',
      backgroundColor: '#ECEEFF',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(80,102,232,0.07) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }} />

      {/* White floating card */}
      <div style={{
        position: 'relative', width: 440,
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.90)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow:
          '0 0 0 1px rgba(80,102,232,0.08),' +
          '0 8px 32px rgba(0,0,0,0.06),' +
          '0 24px 64px rgba(80,102,232,0.14),' +
          'inset 0 1px 0 #fff',
        animation: 'fade-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
      }}>
        {/* Top gradient accent */}
        <div style={{ height: 3.5, background: 'linear-gradient(90deg, #6474F0, #8B5CF6, #5066E8)' }} />

        <div style={{ padding: '40px 42px 36px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 42, height: 42, flexShrink: 0,
              background: 'linear-gradient(145deg, #6474F0 0%, #4152D8 100%)',
              borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(80,102,232,0.38), inset 0 1px 0 rgba(255,255,255,0.28)',
            }}>
              <Zap size={19} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.7px', color: '#0E1225', lineHeight: 1 }}>
                Vault<span style={{
                  background: 'linear-gradient(135deg, #6474F0, #8B5CF6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>IQ</span>
              </div>
              <div style={{ fontSize: 8.5, color: '#A0ABCC', letterSpacing: '1.3px', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>AI Banking Intelligence</div>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.6px', color: '#0E1225', marginBottom: 6 }}>
              Welcome back
            </div>
            <div style={{ fontSize: 13.5, color: '#8D97C2', lineHeight: 1.55 }}>Sign in to your intelligence platform</div>
          </div>

          {/* Demo pills */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#C0CADF', letterSpacing: '0.9px', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase' }}>
              Quick Demo Access
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { role: 'Analyst', email: 'analyst@vaultiq.demo', pw: 'demo1234' },
                { role: 'Manager', email: 'manager@vaultiq.demo', pw: 'demo1234' },
                { role: 'Auditor', email: 'auditor@vaultiq.demo', pw: 'demo1234' },
              ].map(d => (
                <button key={d.role} type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.pw); setError(''); }}
                  style={{
                    flex: 1, padding: '9px 6px',
                    border: '1.5px solid rgba(224,228,255,0.85)',
                    borderRadius: 11,
                    background: 'rgba(248,249,255,0.80)',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 2px 8px rgba(80,102,232,0.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(80,102,232,0.38)';
                    e.currentTarget.style.background = 'rgba(80,102,232,0.07)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(80,102,232,0.14)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(224,228,255,0.85)';
                    e.currentTarget.style.background = 'rgba(248,249,255,0.80)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(80,102,232,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0E1225', fontFamily: 'var(--font-display)', letterSpacing: '-0.1px' }}>{d.role}</div>
                  <div style={{ fontSize: 9.5, color: '#8D97C2', marginTop: 2, fontFamily: 'var(--mono)' }}>{d.email.split('@')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#8D97C2', letterSpacing: '0.9px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Email address
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@bank.com" autoComplete="email"
                style={inputStyle()}
                onFocus={e => { e.target.style.borderColor = 'rgba(80,102,232,0.50)'; e.target.style.boxShadow = '0 0 0 3.5px rgba(80,102,232,0.11)'; }}
                onBlur={e =>  { e.target.style.borderColor = 'rgba(224,228,255,0.85)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#8D97C2', letterSpacing: '0.9px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••" autoComplete="current-password"
                  style={inputStyle({ paddingRight: 46 })}
                  onFocus={e => { e.target.style.borderColor = 'rgba(80,102,232,0.50)'; e.target.style.boxShadow = '0 0 0 3.5px rgba(80,102,232,0.11)'; }}
                  onBlur={e =>  { e.target.style.borderColor = 'rgba(224,228,255,0.85)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#8D97C2', cursor: 'pointer', padding: 0,
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '11px 14px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 10, fontSize: 12.5, color: '#DC2626' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(248,249,255,0.92)' : 'linear-gradient(135deg, #6474F0 0%, #4556E0 100%)',
              border: loading ? '1.5px solid rgba(224,228,255,0.85)' : 'none',
              borderRadius: 12,
              color: loading ? '#8D97C2' : '#fff',
              fontWeight: 700, fontSize: 14.5,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-display)', letterSpacing: '-0.2px',
              boxShadow: loading ? 'none' : '0 6px 22px rgba(80,102,232,0.38), inset 0 1px 0 rgba(255,255,255,0.22)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 10px 30px rgba(80,102,232,0.48), inset 0 1px 0 rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 22px rgba(80,102,232,0.38), inset 0 1px 0 rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              {loading
                ? <><span style={{ animation: 'pulse-dot 1s infinite' }}>●</span> Signing in...</>
                : <>Sign in <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{
            marginTop: 22, padding: '11px 14px',
            background: 'rgba(248,249,255,0.80)',
            border: '1px solid rgba(224,228,255,0.70)',
            borderRadius: 11,
            display: 'flex', alignItems: 'center', gap: 9,
          }}>
            <Shield size={14} color="#8D97C2" />
            <span style={{ fontSize: 11.5, color: '#8D97C2', lineHeight: 1.5 }}>
              256-bit encryption · SOC 2 Type II · FFIEC compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
