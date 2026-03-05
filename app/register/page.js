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
  const [progress, setProgress] = useState(0)
  const [strength, setStrength] = useState({ width: '0%', color: 'transparent', label: 'Enter a password' })
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', dept: '', password: '', confirmPwd: '', terms: false
  })

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
    const updated = { ...form, [key]: val }
    setForm(updated)
    const filled = ['firstName', 'username', 'email', 'dept', 'password', 'confirmPwd'].filter(k => updated[k]).length
    setProgress((filled / 6) * 100)
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
          full_name: `${form.firstName} ${form.lastName}`,
          username: form.username,
          role: role === 'admin' ? 'student' : role, // force non-admin on signup
          department: form.dept,
        }
      }
    })

    setLoading(false)

    if (error) {
      setErrors({ email: error.message })
      return
    }

    setToast(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 2000)
  }

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 14px 12px 40px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? '#ff6584' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
    outline: 'none', transition: 'all 0.3s', caretColor: 'var(--accent)',
    boxShadow: hasError ? '0 0 0 3px rgba(255,101,132,0.12)' : 'none'
  })

  // Only Student and Club Head — no Admin option
  const roles = [
    { id: 'student', icon: '🎓', label: 'Student' },
    { id: 'club-head', icon: '👑', label: 'Club Head' },
  ]

  const steps = [
    { n: 1, title: 'Create your account', sub: 'Fill in your details' },
    { n: 2, title: 'Verify your email', sub: 'Check your SRM inbox' },
    { n: 3, title: 'Join or create a club', sub: 'Start your journey' },
    { n: 4, title: 'Book venues & events', sub: 'All from the dashboard' },
  ]

  const selectStyle = (hasError) => ({
    width: '100%', padding: '12px 14px 12px 40px',
    background: '#1a1a2e',
    border: `1px solid ${hasError ? '#ff6584' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: '#f0f0ff',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
    outline: 'none', transition: 'all 0.3s',
    WebkitAppearance: 'none', cursor: 'none',
  })

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* Left form */}
        <div style={{ width: 520, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', padding: '48px 52px', position: 'relative', overflowY: 'auto', maxHeight: '100vh' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#43e97b,#6c63ff,#ff6584)' }} />

          <div style={{ marginBottom: 28, animation: 'fadeUp 0.8s 0.2s both' }}>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: -1, marginBottom: 6 }}>Create Account 🚀</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Already have an account? <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link></p>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 28, overflow: 'hidden', animation: 'fadeUp 0.8s 0.3s both' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#6c63ff,#ff6584)', borderRadius: 10, width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role selector — Student and Club Head only */}
            <div style={{ marginBottom: 20, animation: 'fadeUp 0.8s 0.3s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.3px' }}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {roles.map(r => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    style={{ padding: '14px 10px', borderRadius: 12, background: role === r.id ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${role === r.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, color: role === r.id ? 'var(--text)' : 'var(--muted)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, cursor: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.25s', boxShadow: role === r.id ? '0 0 0 3px rgba(108,99,255,0.12)' : 'none' }}>
                    <span style={{ fontSize: '1.3rem' }}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16, animation: 'fadeUp 0.8s 0.38s both' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>✏️</span>
                  <input type="text" placeholder="Sriram" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} style={inputStyle(errors.firstName)}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                    onBlur={e => { if (!errors.firstName) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' } }} />
                </div>
                {errors.firstName && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.firstName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>✏️</span>
                  <input type="text" placeholder="Kumar" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} style={inputStyle(false)}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: 16, animation: 'fadeUp 0.8s 0.46s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>👤</span>
                <input type="text" placeholder="@sriram448" value={form.username} onChange={e => updateField('username', e.target.value)} style={inputStyle(errors.username)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { if (!errors.username) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' } }} />
              </div>
              {errors.username && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.username}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16, animation: 'fadeUp 0.8s 0.5s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>📧</span>
                <input type="email" placeholder="sr1234@srmist.edu.in" value={form.email} onChange={e => updateField('email', e.target.value)} style={inputStyle(errors.email)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { if (!errors.email) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' } }} />
              </div>
              {errors.email && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.email}</div>}
            </div>

            {/* Department */}
            <div style={{ marginBottom: 16, animation: 'fadeUp 0.8s 0.54s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Department</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem', zIndex: 1 }}>🏫</span>
                <select value={form.dept} onChange={e => updateField('dept', e.target.value)} style={selectStyle(errors.dept)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#1e1e3a' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = '#1a1a2e' }}>
                  <option value="" style={{ background: '#1a1a2e', color: '#8888aa' }}>Select your department</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Computer Science Engineering</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Electronics & Communication</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Mechanical Engineering</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Biomedical Engineering</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Civil Engineering</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Information Technology</option>
                  <option style={{ background: '#1a1a2e', color: '#f0f0ff' }}>Other</option>
                </select>
              </div>
              {errors.dept && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.dept}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16, animation: 'fadeUp 0.8s 0.58s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>🔒</span>
                <input type={showPwd ? 'text' : 'password'} placeholder="Create a strong password" value={form.password} onChange={e => updateField('password', e.target.value)} style={{ ...inputStyle(errors.password), paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { if (!errors.password) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' } }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.95rem', cursor: 'none' }}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', borderRadius: 10, background: strength.color, width: strength.width, transition: 'all 0.4s' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: strength.color || 'var(--muted)' }}>{strength.label}</div>
              </div>
              {errors.password && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.password}</div>}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 16, animation: 'fadeUp 0.8s 0.62s both' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}>🔐</span>
                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPwd} onChange={e => updateField('confirmPwd', e.target.value)} style={{ ...inputStyle(errors.confirmPwd), paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)' }}
                  onBlur={e => { if (!errors.confirmPwd) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' } }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.95rem', cursor: 'none' }}>{showConfirm ? '🙈' : '👁️'}</button>
              </div>
              {errors.confirmPwd && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginTop: 5 }}>{errors.confirmPwd}</div>}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, animation: 'fadeUp 0.8s 0.7s both' }}>
              <input type="checkbox" checked={form.terms} onChange={e => updateField('terms', e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--accent)', cursor: 'none', flexShrink: 0 }} />
              <label style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>I agree to the <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a></label>
            </div>
            {errors.terms && <div style={{ fontSize: '0.72rem', color: '#ff6584', marginBottom: 12 }}>{errors.terms}</div>}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', borderRadius: 12, color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', cursor: 'none', transition: 'all 0.3s', animation: 'fadeUp 0.8s 0.75s both' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(67,233,123,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              {loading ? <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#003', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : 'Create Account →'}
            </button>
          </form>
        </div>

        {/* Right deco panel */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#060614,#0d0a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.07) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
          <div style={{ position: 'absolute', width: 450, height: 450, background: 'radial-gradient(circle,rgba(67,233,123,0.2),transparent 70%)', borderRadius: '50%', filter: 'blur(70px)', top: -100, right: -100, animation: 'orbFloat 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 350, height: 350, background: 'radial-gradient(circle,rgba(108,99,255,0.25),transparent 70%)', borderRadius: '50%', filter: 'blur(70px)', bottom: -50, left: -50, animation: 'orbFloat 10s ease-in-out infinite', animationDelay: '-5s' }} />

          <div style={{ position: 'absolute', top: 60, left: 40, zIndex: 3, background: 'rgba(15,15,34,0.92)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite', animationDelay: '-1s' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Registered Members</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>5,200+</div>
          </div>
          <div style={{ position: 'absolute', bottom: 60, right: 40, zIndex: 3, background: 'rgba(15,15,34,0.92)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 14, padding: '12px 16px', backdropFilter: 'blur(12px)', animation: 'badgeFloat 6s ease-in-out infinite', animationDelay: '-4s' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Free Forever</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: '#43e97b' }}>$0 / mo</div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 400, padding: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2.5rem', letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
              Join the<br />
              <span style={{ background: 'linear-gradient(135deg,#43e97b,#6c63ff,#ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SRMIST<br />Community</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 40 }}>Register once. Access everything — venues, events, clubs, and more.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', position: 'relative' }}>
                  {i < steps.length - 1 && <div style={{ position: 'absolute', left: 19, top: 44, width: 2, height: 'calc(100% - 12px)', background: 'linear-gradient(to bottom,#6c63ff,transparent)' }} />}
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)', flexShrink: 0 }}>{s.n}</div>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: 3 }}>{s.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.88rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Account created! Check your email to verify.
        </div>
      )}

      <style>{`
        @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        select option { background: #1a1a2e !important; color: #f0f0ff !important; }
      `}</style>
    </>
  )
}

