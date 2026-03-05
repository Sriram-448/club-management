'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Notifications() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    { id: 1, icon: '✅', type: 'booking', title: 'Booking Approved', desc: 'Your booking for Faraday Hall on Mar 15 has been approved.', time: '2 hours ago', read: false, color: '#43e97b', bg: 'rgba(67,233,123,0.1)' },
    { id: 2, icon: '🎉', type: 'event', title: 'New Event Published', desc: 'Hackathon 2026 — Semicolon has been published. Register now!', time: '5 hours ago', read: false, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
    { id: 3, icon: '👥', type: 'club', title: 'New Member Joined', desc: 'Priya joined your IEEE Club.', time: 'Yesterday', read: false, color: '#f7c948', bg: 'rgba(247,201,72,0.1)' },
    { id: 4, icon: '📢', type: 'announcement', title: 'New Announcement', desc: 'April venue booking slots are now open. Book early!', time: '2 days ago', read: true, color: '#00d2ff', bg: 'rgba(0,210,255,0.1)' },
    { id: 5, icon: '⏳', type: 'booking', title: 'Booking Pending', desc: 'Your booking for Mini Hall - 1 is pending admin approval.', time: '3 days ago', read: true, color: '#f7c948', bg: 'rgba(247,201,72,0.1)' },
    { id: 6, icon: '🏛️', type: 'venue', title: 'Venue Now Available', desc: 'Mini Hall - 2 is now available for bookings.', time: '4 days ago', read: true, color: '#43e97b', bg: 'rgba(67,233,123,0.1)' },
    { id: 7, icon: '❌', type: 'booking', title: 'Booking Rejected', desc: 'Your booking for Main Auditorium on Mar 8 was rejected.', time: '5 days ago', read: true, color: '#ff6584', bg: 'rgba(255,101,132,0.1)' },
  ])

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
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUser(session.user)
    }
    getUser()
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter)
  const unreadCount = notifications.filter(n => !n.read).length

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = user?.user_metadata?.role || 'student'

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🏛️', label: 'Venues', href: '/venues' },
    { icon: '🎉', label: 'Events', href: '/events' },
    { icon: '📋', label: 'My Bookings', href: '/bookings' },
    { icon: '👤', label: 'Profile', href: '/profile' },
    { icon: '🔔', label: 'Notifications', href: '/notifications', active: true },
    { icon: '⚙️', label: 'Admin Panel', href: '/admin' },
  ]

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
                {item.label === 'Notifications' && unreadCount > 0 && <span style={{ marginLeft: 'auto', padding: '2px 8px', background: 'rgba(255,101,132,0.15)', borderRadius: 100, fontSize: '0.68rem', color: '#ff6584', fontWeight: 600 }}>{unreadCount}</span>}
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
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>Notifications 🔔</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{unreadCount} unread notifications</div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 10, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}>
                ✓ Mark all read
              </button>
            )}
          </div>

          <div style={{ padding: '28px 36px', maxWidth: 760 }}>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {[['all', 'All'], ['unread', 'Unread'], ['booking', 'Bookings'], ['event', 'Events'], ['announcement', 'Announcements']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ padding: '7px 16px', borderRadius: 100, border: '1px solid', borderColor: filter === val ? 'var(--accent)' : 'var(--border)', background: filter === val ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === val ? 'var(--text)' : 'var(--muted)', fontSize: '0.8rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s' }}>{label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeUp 0.6s both' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔔</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>All caught up!</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No notifications here.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 0.6s 0.2s both' }}>
                {filtered.map((n, i) => (
                  <div key={n.id} style={{ background: n.read ? 'var(--card)' : 'rgba(108,99,255,0.06)', border: `1px solid ${n.read ? 'var(--border)' : 'rgba(108,99,255,0.2)'}`, borderRadius: 16, padding: 18, display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.05}s both`, position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = n.read ? 'var(--border)' : 'rgba(108,99,255,0.2)' }}>
                    {!n.read && <div style={{ position: 'absolute', top: 18, right: 18, width: 8, height: 8, borderRadius: '50%', background: '#6c63ff', animation: 'blink 1.5s infinite' }} />}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, color: n.read ? 'var(--text)' : 'white' }}>{n.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>🕐 {n.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {!n.read && <button onClick={() => markRead(n.id)} style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent)', fontSize: '0.7rem', cursor: 'none', fontWeight: 600 }}>Read</button>}
                      <button onClick={() => deleteNotif(n.id)} style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.2)', color: '#ff6584', fontSize: '0.7rem', cursor: 'none', fontWeight: 600 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}