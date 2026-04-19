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
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700));
    // Store auth in localStorage (replace with Firebase later)
    localStorage.setItem('vaultiq_auth', JSON.stringify({
      email: email.trim(),
      loggedAt: Date.now(),
    }));
    nav('/', { replace: true });
  };

  const inp = (extra = {}) => ({
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: '11px 14px',
    color: 'var(--text)',
    fontSize: 13.5,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
    ...extra,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dot grid inherited from body::before */}

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', width: 420,
        background: '#fff',
        border: '1px solid var(--border2)',
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        animation: 'fade-in 0.4s ease forwards',
      }}>
        {/* Top gradient bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #3B82F6, #6D28D9)' }} />

        <div style={{ padding: '36px 38px 32px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 34 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(140deg, #3B82F6, #1D4ED8)',
              borderRadius: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
            }}>
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-0.5px', color: 'var(--text)' }}>
                Vault<span style={{ color: 'var(--cyan)' }}>IQ</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '1.2px', marginTop: 1 }}>AI BANKING INTELLIGENCE</div>
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, letterSpacing: '-0.4px', color: 'var(--text)', marginBottom: 5 }}>
              Welcome back
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Sign in to your intelligence platform</div>
          </div>

          <form onSubmit={submit} noValidate>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.9px', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@bank.com"
                autoComplete="email"
                style={inp()}
                onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.9px', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  style={inp({ paddingRight: 44 })}
                  onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                  onBlur={e =>  { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{
                  position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0,
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '10px 13px', background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, fontSize: 12.5, color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--bg4)' : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              border: 'none', borderRadius: 10,
              color: loading ? 'var(--text3)' : '#fff',
              fontWeight: 700, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--font-display)', letterSpacing: '-0.2px',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
              transition: 'all 0.2s',
            }}>
              {loading
                ? <><span style={{ animation: 'pulse-dot 1s infinite' }}>●</span> Signing in...</>
                : <>Sign in <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <div style={{
            marginTop: 22, padding: '10px 13px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Shield size={13} color="var(--text3)" />
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              256-bit encryption · SOC 2 Type II · FFIEC compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
