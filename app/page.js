'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Login() {
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
    if (!username) { setError('Please enter your username'); return }
    if (!password) { setError('Please enter your password'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setToast(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 1800)
  }

  const pills = [
    { icon: '🏛️', title: 'Venue Booking', sub: 'Check availability & reserve instantly', bg: 'rgba(108,99,255,0.15)' },
    { icon: '🎉', title: 'Event Management', sub: 'Create & publish club events', bg: 'rgba(255,101,132,0.15)' },
    { icon: '👥', title: 'Member Directory', sub: 'Connect with club members', bg: 'rgba(67,233,123,0.15)' },
  ]

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* Left decorative panel */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, overflow: 'hidden', background: 'linear-gradient(135deg,#060614,#0d0a2e)' }}>
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.07) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
          {/* Orbs */}
          <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(108,99,255,0.3),transparent 70%)', borderRadius: '50%', filter: 'blur(70px)', top: -100, left: -100, animation: 'orbFloat 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,101,132,0.2),transparent 70%)', borderRadius: '50%', filter: 'blur(70px)', bottom: 0, right: -50, animation: 'orbFloat 10s ease-in-out infinite', animationDelay: '-5s' }} />

          {/* Floating badges */}
          <div style={{ position: 'absolute', top: 80, right: 40, zIndex: 3, background: 'rgba(15,15,34,0.9)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Active Clubs</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>50+</div>
          </div>
          <div style={{ position: 'absolute', bottom: 80, left: 40, zIndex: 3, background: 'rgba(15,15,34,0.9)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite', animationDelay: '-3s' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Events Live</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent3)' }}>12 Live</div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 420 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', textDecoration: 'none', color: 'var(--text)', marginBottom: 48 }}>
              <span style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 8px 32px rgba(108,99,255,0.4)' }}>⚡</span>
              SRMIST Portal
            </Link>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2.8rem', lineHeight: 1.05, letterSpacing: -2, marginBottom: 16, animation: 'fadeUp 0.8s 0.35s both' }}>
              Welcome<br />back to<br />
              <span style={{ background: 'linear-gradient(135deg,#6c63ff,#ff6584,#f7c948)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your hub.</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 48, animation: 'fadeUp 0.8s 0.5s both' }}>Sign in to manage bookings, events, and your club.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.8s 0.65s both' }}>
              {pills.map(p => (
                <div key={p.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '14px 18px', textAlign: 'left', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = '' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{p.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div style={{ width: 480, flexShrink: 0, background: 'var(--card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 52px', position: 'relative', overflowY: 'auto' }}>
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6c63ff,#ff6584,#f7c948)' }} />

          <div style={{ marginBottom: 36, animation: 'fadeUp 0.8s 0.2s both' }}>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.9rem', letterSpacing: -1, marginBottom: 8 }}>Sign in 👋</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Don't have an account? <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one free</Link></p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 10, fontSize: '0.84rem', color: 'var(--accent2)', marginBottom: 20, animation: 'shakeX 0.4s both' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Username */}
            <div style={{ marginBottom: 20, animation: 'fadeUp 0.8s 0.3s both' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>👤</span>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username"
                  style={{ width: '100%', padding: '13px 14px 13px 44px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', caretColor: 'var(--accent)', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12, animation: 'fadeUp 0.8s 0.4s both' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔒</span>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', caretColor: 'var(--accent)', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1rem', cursor: 'none' }}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, animation: 'fadeUp 0.8s 0.55s both' }}>
              <a href="#" style={{ fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: 'none', borderRadius: 12, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', cursor: 'none', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.8s 0.6s both' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(108,99,255,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', animation: 'fadeUp 0.8s 0.7s both' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.8s 0.75s both' }}>
            {[{ icon: '🌐', label: 'Google' }, { icon: '🐙', label: 'GitHub' }].map(s => (
              <button key={s.label} style={{ flex: 1, padding: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = '' }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.88rem', color: 'var(--accent3)', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Logged in! Redirecting...
        </div>
      )}

      <style>{`
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}