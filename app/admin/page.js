'use client'
import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

export default function Admin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [activeTab, setActiveTab] = useState('bookings')
  const [toast, setToast] = useState(null)
  const [updating, setUpdating] = useState(null)

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

    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)

        // Fetch profiles first
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, full_name, email, username, role, department')
        if (usersData) setUsers(usersData)

        // Fetch bookings with venue info
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, venues(name, emoji)')
          .order('created_at', { ascending: false })

        // Merge bookings with profile data
        if (bookingsData) {
          const profileMap = {}
          if (usersData) usersData.forEach(p => { profileMap[p.id] = p })
          const enriched = bookingsData.map(b => ({
            ...b,
            profiles: profileMap[b.user_id] || null
          }))
          setBookings(enriched)
        }
      }
      setLoading(false)
    }
    getData()

    return () => document.removeEventListener('mousemove', move)
  }, [])

  const updateBookingStatus = async (bookingId, status) => {
    setUpdating(bookingId)
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b))
      setToast({ message: `Booking ${status}!`, color: status === 'approved' ? '#43e97b' : '#ff6584' })
      setTimeout(() => setToast(null), 3000)
    }
    setUpdating(null)
  }

  const updateUserRole = async (userId, role) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
      setToast({ message: `Role updated to ${role}!`, color: '#43e97b' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const stats = [
    { icon: '⏳', label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f7c948', bg: 'rgba(247,201,72,0.15)' },
    { icon: '✅', label: 'Approved', value: bookings.filter(b => b.status === 'approved').length, color: '#43e97b', bg: 'rgba(67,233,123,0.15)' },
    { icon: '❌', label: 'Rejected', value: bookings.filter(b => b.status === 'rejected').length, color: '#ff6584', bg: 'rgba(255,101,132,0.15)' },
    { icon: '👥', label: 'Total Users', value: users.length, color: '#6c63ff', bg: 'rgba(108,99,255,0.15)' },
  ]

  const statusStyle = (status) => ({
    padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
    background: status === 'approved' ? 'rgba(67,233,123,0.12)' : status === 'pending' ? 'rgba(247,201,72,0.12)' : 'rgba(255,101,132,0.12)',
    color: status === 'approved' ? '#43e97b' : status === 'pending' ? '#f7c948' : '#ff6584',
  })

  const roleColors = { admin: '#ff6584', 'club-head': '#f7c948', student: '#43e97b' }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="admin" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>Admin Panel ⚙️</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Manage bookings and users</div>
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(255,101,132,0.12)', color: '#ff6584', fontSize: '0.72rem', fontWeight: 700 }}>👑 Admin</div>
          </div>

          <div style={{ padding: '24px' }}>

            {/* Stats */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24, animation: 'fadeUp 0.6s 0.1s both' }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', color: s.color, marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, animation: 'fadeUp 0.6s 0.2s both' }}>
              {[['bookings', '📋 Bookings'], ['users', '👥 Users']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid', borderColor: activeTab === tab ? 'var(--accent)' : 'var(--border)', background: activeTab === tab ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: activeTab === tab ? 'var(--text)' : 'var(--muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}>{label}</button>
              ))}
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div style={{ animation: 'fadeUp 0.6s 0.25s both' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {['pending', 'approved', 'rejected', 'all'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 100, border: '1px solid', borderColor: filter === s ? 'var(--accent)' : 'var(--border)', background: filter === s ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === s ? 'var(--text)' : 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s', textTransform: 'capitalize' }}>
                      {s === 'pending' ? `⏳ ${s}` : s === 'approved' ? `✅ ${s}` : s === 'rejected' ? `❌ ${s}` : 'All'}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    <div style={{ width: 36, height: 36, border: '3px solid rgba(108,99,255,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                    Loading bookings...
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>📋</div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No {filter} bookings</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Nothing to show here.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.map((b, i) => (
                      <div key={b.id} style={{ background: 'var(--card)', border: `1px solid ${b.status === 'pending' ? 'rgba(247,201,72,0.2)' : 'var(--border)'}`, borderRadius: 16, padding: 20, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.05}s both` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = b.status === 'pending' ? 'rgba(247,201,72,0.2)' : 'var(--border)'; e.currentTarget.style.transform = '' }}>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                              {b.venues?.emoji || '🏛️'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{b.venues?.name || 'Venue'}</div>
                              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📅 {b.date}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>🕐 {b.time_slot}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>⏱️ {b.duration}</span>
                                {b.attendees && <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>👥 {b.attendees} attendees</span>}
                              </div>
                              {b.purpose && <div style={{ fontSize: '0.78rem', color: 'var(--text)', marginBottom: 4 }}>🎯 {b.purpose}</div>}
                              {b.club && <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>🏆 {b.club}</div>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                            <span style={statusStyle(b.status)}>{b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Requested by */}
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.8rem', color: '#6c63ff' }}>
                              {b.profiles?.full_name?.[0]?.toUpperCase() || b.profiles?.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                                {b.profiles?.full_name || b.profiles?.email?.split('@')[0] || 'Unknown User'}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                                {b.profiles?.email || b.user_id}
                              </div>
                            </div>
                          </div>

                          {b.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => updateBookingStatus(b.id, 'rejected')} disabled={updating === b.id}
                                style={{ padding: '7px 16px', borderRadius: 9, background: 'rgba(255,101,132,0.12)', border: '1px solid rgba(255,101,132,0.3)', color: '#ff6584', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,101,132,0.2)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,101,132,0.12)' }}>
                                {updating === b.id ? '...' : '❌ Reject'}
                              </button>
                              <button onClick={() => updateBookingStatus(b.id, 'approved')} disabled={updating === b.id}
                                style={{ padding: '7px 16px', borderRadius: 9, background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.3)', color: '#43e97b', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(67,233,123,0.2)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(67,233,123,0.12)' }}>
                                {updating === b.id ? '...' : '✅ Approve'}
                              </button>
                            </div>
                          )}

                          {b.status !== 'pending' && (
                            <button onClick={() => updateBookingStatus(b.id, 'pending')}
                              style={{ padding: '6px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.75rem', cursor: 'none', transition: 'all 0.25s' }}>
                              ↩ Reset to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div style={{ animation: 'fadeUp 0.6s 0.25s both' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    <div style={{ width: 36, height: 36, border: '3px solid rgba(108,99,255,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                    Loading users...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {users.map((u, i) => (
                      <div key={u.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.05}s both`, flexWrap: 'wrap' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                          {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>{u.full_name || 'No name'}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 2 }}>{u.email}</div>
                          {u.department && <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>🏫 {u.department}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, background: `${roleColors[u.role] || '#6c63ff'}22`, color: roleColors[u.role] || '#6c63ff', textTransform: 'capitalize' }}>{u.role || 'student'}</span>
                          {u.id !== user?.id && (
                            <select value={u.role || 'student'} onChange={e => updateUserRole(u.id, e.target.value)} style={{ padding: '5px 10px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f0f0ff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.75rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                              <option value="student">Student</option>
                              <option value="club-head">Club Head</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                          {u.id === user?.id && <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>(you)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: `${toast.color}22`, border: `1px solid ${toast.color}44`, borderRadius: 12, padding: '14px 20px', fontSize: '0.88rem', color: toast.color, zIndex: 1000, animation: 'fadeUp 0.5s both', fontWeight: 600 }}>
          {toast.color === '#43e97b' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      `}</style>
    </>
  )
}