'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Login() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [showPwd, setShowPwd] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0
    const move = (e) => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', move)
    const animate = () => {
      if (cursorRef.current) { cursorRef.current.style.left = mx - 5 + 'px'; cursorRef.current.style.top = my - 5 + 'px' }
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (ringRef.current) { ringRef.current.style.left = rx - 16 + 'px'; ringRef.current.style.top = ry - 16 + 'px' }
      requestAnimationFrame(animate)
    }
    animate()
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setToast(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 1000)
  }

  const inputStyle = {
    width: '100%', padding: '13px 14px 13px 42px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem',
    outline: 'none', transition: 'all 0.3s', caretColor: 'var(--accent)',
    boxSizing: 'border-box',
  }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>

        {/* Left decorative panel — hidden on mobile */}
        <div className="login-left" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#060614,#0d0a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.07) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(108,99,255,0.25),transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', top: -80, left: -80, animation: 'orbFloat 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,101,132,0.2),transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', bottom: -40, right: -40, animation: 'orbFloat 10s ease-in-out infinite', animationDelay: '-5s' }} />

          <div style={{ position: 'absolute', top: 40, left: 30, background: 'rgba(15,15,34,0.92)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '10px 14px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Active Clubs</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent)' }}>50+</div>
          </div>

          <div style={{ position: 'absolute', bottom: 40, right: 30, background: 'rgba(15,15,34,0.92)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '10px 14px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite', animationDelay: '-3s' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Events Live</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', color: '#43e97b' }}>12 Live</div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 40, maxWidth: 420 }}>
            <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(108,99,255,0.4)' }}>⚡</div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.4rem)', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
              Welcome back to<br />
              <span style={{ background: 'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your hub.</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>Sign in to manage bookings, events, and your club.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
              {[
                { icon: '🏛️', label: 'Venue Booking', sub: 'Check availability & reserve instantly' },
                { icon: '🎉', label: 'Event Management', sub: 'Create & publish club events' },
                { icon: '👥', label: 'Member Directory', sub: 'Connect with club members' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 14, textAlign: 'left', transition: 'all 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(108,99,255,0.08)'}>
                  <div style={{ width: 38, height: 38, background: 'rgba(108,99,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: 2 }}>{item.label}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-right" style={{ width: 480, flexShrink: 0, background: 'var(--card)', borderLeft: '1px solid var(--border)', padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflowY: 'auto' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6c63ff,#ff6584,#f7c948)' }} />

          {/* Mobile logo — only shown on mobile */}
          <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem' }}>SRMIST Portal</div>
          </div>

          <div style={{ marginBottom: 32, animation: 'fadeUp 0.8s 0.2s both' }}>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: -1, marginBottom: 8 }}>Sign in 👋</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Don't have an account? <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one free</Link></p>
          </div>

          <form onSubmit={handleSubmit} style={{ animation: 'fadeUp 0.8s 0.3s both' }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Username / Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>👤</span>
                <input type="text" placeholder="Enter your email" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.boxShadow = 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔒</span>
                <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.boxShadow = 'none' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1rem', cursor: 'pointer' }}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 22 }}>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.2)', borderRadius: 10, fontSize: '0.82rem', color: '#ff6584', marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: 'none', borderRadius: 12, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(108,99,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              {loading ? <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : 'Sign In →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button type="button" style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                🌐 Google
              </button>
              <button type="button" style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                🐙 GitHub
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 12, padding: '14px 18px', fontSize: '0.88rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Welcome back! Redirecting...
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right {
            width: 100% !important;
            padding: 40px 24px !important;
            border-left: none !important;
            min-height: 100vh;
            justify-content: center !important;
          }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </>
  )
}