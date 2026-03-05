'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Profile() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [form, setForm] = useState({ full_name: '', username: '', department: '' })

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

    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (data) {
          setProfile(data)
          setForm({ full_name: data.full_name || '', username: data.username || '', department: data.department || '' })
        }
      }
    }
    getProfile()

    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, username: form.username, department: form.department })
      .eq('id', user.id)

    setSaving(false)
    if (!error) {
      setProfile(prev => ({ ...prev, ...form }))
      setEditing(false)
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = profile?.role || user?.user_metadata?.role || 'student'

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🏛️', label: 'Venues', href: '/venues' },
    { icon: '🎉', label: 'Events', href: '/events' },
    { icon: '📋', label: 'My Bookings', href: '/bookings' },
    { icon: '👤', label: 'Profile', href: '/profile', active: true },
    { icon: '⚙️', label: 'Admin Panel', href: '/admin' },
  ]

  const inputStyle = { width: '100%', padding: '12px 14px', background: editing ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${editing ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s' }

  const roleColors = { admin: '#ff6584', 'club-head': '#f7c948', student: '#43e97b' }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
          <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem' }}>SRMIST Portal<span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif' }}>Club Management System</span></div>
          </div>
          <div style={{ padding: '14px 18px', margin: 12, background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, flexShrink: 0 }}>{avatarLetter}</div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem' }}>{fullName}</strong><span style={{ fontSize: '0.72rem', color: '#43e97b', textTransform: 'capitalize' }}>● {userRole}</span></div>
          </div>
          <nav style={{ padding: '16px 12px', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '0 12px', margin: '8px 0' }}>Main</div>
            {navItems.map(item => (
              <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: item.active ? 'var(--text)' : 'var(--muted)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', marginBottom: 2, background: item.active ? 'rgba(108,99,255,0.15)' : 'transparent', borderLeft: item.active ? '3px solid var(--accent)' : '3px solid transparent', transition: 'all 0.25s' }}>
                <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: '#ff6584', fontSize: '0.88rem', cursor: 'none', background: 'none', border: 'none', width: '100%', fontFamily: 'DM Sans,sans-serif' }}>🚪 Logout</button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 36px', height: 68, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>My Profile 👤</div>
          </div>

          <div style={{ padding: '36px', maxWidth: 700 }}>
            {/* Profile card */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden', marginBottom: 24, animation: 'fadeUp 0.6s 0.1s both' }}>
              <div style={{ height: 120, background: 'linear-gradient(135deg,#6c63ff,#ff6584,#f7c948)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.3) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
              </div>
              <div style={{ padding: '0 28px 28px', marginTop: -40 }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2rem', border: '4px solid var(--bg)', marginBottom: 16 }}>{avatarLetter}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>{fullName}</div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: 8 }}>{user?.email}</div>
                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: `${roleColors[userRole]}22`, color: roleColors[userRole], textTransform: 'capitalize' }}>{userRole}</span>
                  </div>
                  <button onClick={() => setEditing(!editing)} style={{ padding: '9px 20px', borderRadius: 10, background: editing ? 'rgba(255,101,132,0.12)' : 'rgba(108,99,255,0.12)', border: `1px solid ${editing ? 'rgba(255,101,132,0.3)' : 'rgba(108,99,255,0.3)'}`, color: editing ? '#ff6584' : 'var(--accent)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s', marginTop: 8 }}>
                    {editing ? '✕ Cancel' : '✏️ Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Info form */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: 28, animation: 'fadeUp 0.6s 0.2s both' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Account Information</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Full Name</label>
                  <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} readOnly={!editing} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Username</label>
                  <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} readOnly={!editing} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Email Address</label>
                <input value={user?.email || ''} readOnly style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: 'var(--muted)' }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Department</label>
                {editing ? (
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={{ ...inputStyle, background: '#1a1a2e', color: '#f0f0ff', WebkitAppearance: 'none', cursor: 'none' }}>
                    <option value="">Select department</option>
                    <option>Computer Science Engineering</option>
                    <option>Electronics & Communication</option>
                    <option>Mechanical Engineering</option>
                    <option>Biomedical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Information Technology</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <input value={form.department || 'Not set'} readOnly style={inputStyle} />
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Role</label>
                <input value={userRole} readOnly style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: roleColors[userRole], textTransform: 'capitalize' }} />
              </div>

              {editing && (
                <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: 13, borderRadius: 12, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', cursor: 'none', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(67,233,123,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  {saving ? <span style={{ width: 20, height: 20, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#003', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : '💾 Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 14, padding: '16px 20px', fontSize: '0.88rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Profile updated successfully!
        </div>
      )}
      <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
    </>
  )
}