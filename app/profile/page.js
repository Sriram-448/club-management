'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

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
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) { setProfile(data); setForm({ full_name: data.full_name || '', username: data.username || '', department: data.department || '' }) }
      }
    }
    getProfile()
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: form.full_name, username: form.username, department: form.department }).eq('id', user.id)
    setSaving(false)
    if (!error) { setProfile(prev => ({ ...prev, ...form })); setEditing(false); setToast(true); setTimeout(() => setToast(false), 3000) }
  }

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = profile?.role || user?.user_metadata?.role || 'student'
  const roleColors = { admin: '#ff6584', 'club-head': '#f7c948', student: '#43e97b' }

  const inputStyle = { width: '100%', padding: '11px 12px', background: editing ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${editing ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="profile" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>My Profile 👤</div>
          </div>

          <div style={{ padding: '24px', maxWidth: 680 }}>
            {/* Profile card */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 20, animation: 'fadeUp 0.6s 0.1s both' }}>
              <div style={{ height: 100, background: 'linear-gradient(135deg,#6c63ff,#ff6584,#f7c948)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.3) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              </div>
              <div style={{ padding: '0 24px 24px', marginTop: -36 }}>
                <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', border: '4px solid var(--bg)', marginBottom: 14 }}>{avatarLetter}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', marginBottom: 4 }}>{fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>{user?.email}</div>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, background: `${roleColors[userRole]}22`, color: roleColors[userRole], textTransform: 'capitalize' }}>{userRole}</span>
                  </div>
                  <button onClick={() => setEditing(!editing)} style={{ padding: '8px 16px', borderRadius: 9, background: editing ? 'rgba(255,101,132,0.12)' : 'rgba(108,99,255,0.12)', border: `1px solid ${editing ? 'rgba(255,101,132,0.3)' : 'rgba(108,99,255,0.3)'}`, color: editing ? '#ff6584' : 'var(--accent)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}>
                    {editing ? '✕ Cancel' : '✏️ Edit'}
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, animation: 'fadeUp 0.6s 0.2s both' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 18 }}>Account Information</div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Full Name</label>
                  <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} readOnly={!editing} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Username</label>
                  <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} readOnly={!editing} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Email</label>
                <input value={user?.email || ''} readOnly style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: 'var(--muted)' }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Department</label>
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

              <div style={{ marginBottom: editing ? 20 : 0 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Role</label>
                <input value={userRole} readOnly style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: roleColors[userRole], textTransform: 'capitalize' }} />
              </div>

              {editing && (
                <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.92rem', cursor: 'none', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {saving ? <span style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#003', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : '💾 Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 12, padding: '14px 18px', fontSize: '0.85rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Profile updated!
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}