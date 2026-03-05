'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Bookings() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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

    const getBookings = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data, error } = await supabase
          .from('bookings')
          .select(`*, venues(name, emoji)`)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        if (!error && data) setBookings(data)
      }
      setLoading(false)
    }
    getBookings()

    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const statusStyle = (status) => ({
    padding: '4px 12px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
    background: status === 'approved' ? 'rgba(67,233,123,0.12)' : status === 'pending' ? 'rgba(247,201,72,0.12)' : 'rgba(255,101,132,0.12)',
    color: status === 'approved' ? '#43e97b' : status === 'pending' ? '#f7c948' : '#ff6584',
  })

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🏛️', label: 'Venues', href: '/venues' },
    { icon: '🎉', label: 'Events', href: '/events' },
    { icon: '📋', label: 'My Bookings', href: '/bookings', active: true },
    { icon: '👤', label: 'Profile', href: '/profile' },
    { icon: '⚙️', label: 'Admin Panel', href: '/admin' },
  ]

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = user?.user_metadata?.role || 'student'

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
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 36px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>My Bookings 📋</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>All your venue booking requests</div>
            </div>
            <Link href="/venues" style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 10, background: 'var(--accent)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none' }}>+ New Booking</Link>
          </div>

          <div style={{ padding: '28px 36px' }}>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, animation: 'fadeUp 0.6s 0.1s both' }}>
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid', borderColor: filter === s ? 'var(--accent)' : 'var(--border)', background: filter === s ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === s ? 'var(--text)' : 'var(--muted)', fontSize: '0.82rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s', textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(108,99,255,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                Loading your bookings...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeUp 0.6s both' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📋</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No bookings yet</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 24 }}>You haven't made any venue booking requests.</div>
                <Link href="/venues" style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--accent)', color: 'white', textDecoration: 'none', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem' }}>Book a Venue →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.6s 0.2s both' }}>
                {filtered.map((b, i) => (
                  <div key={b.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                      {b.venues?.emoji || '🏛️'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{b.venues?.name || 'Venue'}</div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>📅 {b.date}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>🕐 {b.time_slot}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>⏱️ {b.duration}</span>
                        {b.club && <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>🏆 {b.club}</span>}
                      </div>
                      {b.purpose && <div style={{ fontSize: '0.82rem', marginTop: 6, color: 'var(--text)' }}>🎯 {b.purpose}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={statusStyle(b.status)}>{b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
    </>
  )
}