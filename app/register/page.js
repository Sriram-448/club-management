'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Register() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [role, setRole] = useState('student')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
  const [strength, setStrength] = useState({ width: '0%', color: 'transparent', label: 'Enter a password' })
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', dept: '', password: '', confirmPwd: '', terms: false })

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

  const updateField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (key === 'password') checkStrength(val)
  }

  const checkStrength = (val) => {
    let score = 0
    if (val.length >= 8) score++
    if (val.length >= 12) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    const configs = [
      { width: '0%', color: 'transparent', label: 'Enter a password' },
      { width: '20%', color: '#ff6584', label: 'Very weak' },
      { width: '40%', color: '#ff9a44', label: 'Weak' },
      { width: '60%', color: '#f7c948', label: 'Fair' },
      { width: '80%', color: '#43e97b', label: 'Strong' },
      { width: '100%', color: '#00b894', label: 'Very strong 🔥' },
    ]
    setStrength(configs[score])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.firstName) newErrors.firstName = 'Required'
    if (!form.username) newErrors.username = 'Required'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required'
    if (!form.dept) newErrors.dept = 'Please select your department'
    if (!form.password || form.password.length < 8) newErrors.password = 'Min 8 characters'
    if (form.password !== form.confirmPwd) newErrors.confirmPwd = 'Passwords do not match'
    if (!form.terms) newErrors.terms = 'Please agree to terms'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: `${form.firstName} ${form.lastName}`.trim(),
          username: form.username,
          role: role === 'admin' ? 'student' : role,
          department: form.dept,
        }
      }
    })
    setLoading(false)
    if (error) { setErrors({ email: error.message }); return }
    setToast(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 2000)
  }

  const inputStyle = (hasError) => ({
    width: '100%', padding: '11px 14px 11px 40px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${hasError ? '#ff6584' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 11, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem',
    outline: 'none', transition: 'all 0.3s', caretColor: 'var(--accent)',
    boxSizing: 'border-box',
  })

  const roles = [
    { id: 'student', icon: '🎓', label: 'Student' },
    { id: 'club-head', icon: '👑', label: 'Club Head' },
  ]

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>

        {/* Left form */}
        <div className="register-form" style={{ width: 500, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', padding: '36px 40px', position: 'relative', overflowY: 'auto', maxHeight: '100vh' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#43e97b,#6c63ff,#ff6584)' }} />

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem' }}>SRMIST Portal</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.8rem)', letterSpacing: -1, marginBottom: 6 }}>Create Account 🚀</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>Already have an account? <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {roles.map(r => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    style={{ padding: '12px 10px', borderRadius: 11, background: role === r.id ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${role === r.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, color: role === r.id ? 'var(--text)' : 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.25s' }}>
                    <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>{r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>✏️</span>
                  <input type="text" placeholder="Sriram" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} style={inputStyle(errors.firstName)}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                    onBlur={e => { if (!errors.firstName) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' } }} />
                </div>
                {errors.firstName && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.firstName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>✏️</span>
                  <input type="text" placeholder="Kumar" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} style={inputStyle(false)}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }} />
                </div>
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>👤</span>
                <input type="text" placeholder="@sriram448" value={form.username} onChange={e => updateField('username', e.target.value)} style={inputStyle(errors.username)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                  onBlur={e => { if (!errors.username) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' } }} />
              </div>
              {errors.username && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.username}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>📧</span>
                <input type="email" placeholder="sr1234@srmist.edu.in" value={form.email} onChange={e => updateField('email', e.target.value)} style={inputStyle(errors.email)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                  onBlur={e => { if (!errors.email) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' } }} />
              </div>
              {errors.email && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Department */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Department</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', zIndex: 1 }}>🏫</span>
                <select value={form.dept} onChange={e => updateField('dept', e.target.value)} style={{ ...inputStyle(errors.dept), background: '#1a1a2e', color: form.dept ? '#f0f0ff' : '#8888aa', WebkitAppearance: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ color: '#8888aa', background: '#1a1a2e' }}>Select department</option>
                  {['Computer Science Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Biomedical Engineering', 'Civil Engineering', 'Information Technology', 'Other'].map(d => (
                    <option key={d} style={{ background: '#1a1a2e', color: '#f0f0ff' }}>{d}</option>
                  ))}
                </select>
              </div>
              {errors.dept && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.dept}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🔒</span>
                <input type={showPwd ? 'text' : 'password'} placeholder="Create a strong password" value={form.password} onChange={e => updateField('password', e.target.value)} style={{ ...inputStyle(errors.password), paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                  onBlur={e => { if (!errors.password) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' } }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.9rem', cursor: 'pointer' }}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', marginBottom: 3 }}>
                  <div style={{ height: '100%', borderRadius: 10, background: strength.color, width: strength.width, transition: 'all 0.4s' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: strength.color || 'var(--muted)' }}>{strength.label}</div>
              </div>
              {errors.password && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.password}</div>}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🔐</span>
                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPwd} onChange={e => updateField('confirmPwd', e.target.value)} style={{ ...inputStyle(errors.confirmPwd), paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.08)' }}
                  onBlur={e => { if (!errors.confirmPwd) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' } }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.9rem', cursor: 'pointer' }}>{showConfirm ? '🙈' : '👁️'}</button>
              </div>
              {errors.confirmPwd && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginTop: 4 }}>{errors.confirmPwd}</div>}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
              <input type="checkbox" checked={form.terms} onChange={e => updateField('terms', e.target.checked)} style={{ width: 15, height: 15, marginTop: 2, accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }} />
              <label style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>I agree to the <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a></label>
            </div>
            {errors.terms && <div style={{ fontSize: '0.7rem', color: '#ff6584', marginBottom: 12 }}>{errors.terms}</div>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', borderRadius: 11, color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(67,233,123,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              {loading ? <span style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#003', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : 'Create Account →'}
            </button>
          </form>
        </div>

        {/* Right deco panel — hidden on mobile */}
        <div className="register-right" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#060614,#0d0a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.07) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(67,233,123,0.18),transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', top: -80, right: -80, animation: 'orbFloat 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle,rgba(108,99,255,0.22),transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', bottom: -40, left: -40, animation: 'orbFloat 10s ease-in-out infinite', animationDelay: '-5s' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 380, padding: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.4rem)', letterSpacing: -1.5, marginBottom: 14, lineHeight: 1.1 }}>
              Join the<br />
              <span style={{ background: 'linear-gradient(135deg,#43e97b,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SRMIST<br />Community</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 36 }}>Register once. Access everything — venues, events, clubs, and more.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { n: 1, title: 'Create your account', sub: 'Fill in your details' },
                { n: 2, title: 'Verify your email', sub: 'Check your SRM inbox' },
                { n: 3, title: 'Join or create a club', sub: 'Start your journey' },
                { n: 4, title: 'Book venues & events', sub: 'All from the dashboard' },
              ].map((s, i) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', position: 'relative' }}>
                  {i < 3 && <div style={{ position: 'absolute', left: 17, top: 42, width: 2, height: 'calc(100% - 10px)', background: 'linear-gradient(to bottom,#6c63ff,transparent)' }} />}
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent)', flexShrink: 0 }}>{s.n}</div>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}>{s.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: '14px 20px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 14 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 4 }}>REGISTERED MEMBERS</div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>5,200+</div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 12, padding: '14px 18px', fontSize: '0.88rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Account created! Redirecting...
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }

        @media (max-width: 768px) {
          .register-right { display: none !important; }
          .register-form {
            width: 100% !important;
            padding: 32px 20px !important;
            border-right: none !important;
            max-height: none !important;
          }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </>
  )
}