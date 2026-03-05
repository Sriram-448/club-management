'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

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
    { id: 6, icon: '❌', type: 'booking', title: 'Booking Rejected', desc: 'Your booking for Main Auditorium on Mar 8 was rejected.', time: '5 days ago', read: true, color: '#ff6584', bg: 'rgba(255,101,132,0.1)' },
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

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="notifications" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>Notifications 🔔</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{unreadCount} unread</div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', fontWeight: 600, cursor: 'none', flexShrink: 0 }}>✓ Mark all read</button>
            )}
          </div>

          <div style={{ padding: '24px', maxWidth: 720 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {[['all', 'All'], ['unread', 'Unread'], ['booking', 'Bookings'], ['event', 'Events'], ['announcement', 'Announcements']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ padding: '6px 14px', borderRadius: 100, border: '1px solid', borderColor: filter === val ? 'var(--accent)' : 'var(--border)', background: filter === val ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === val ? 'var(--text)' : 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s' }}>{label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeUp 0.6s both' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>🔔</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>All caught up!</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No notifications here.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeUp 0.6s 0.2s both' }}>
                {filtered.map((n, i) => (
                  <div key={n.id} style={{ background: n.read ? 'var(--card)' : 'rgba(108,99,255,0.06)', border: `1px solid ${n.read ? 'var(--border)' : 'rgba(108,99,255,0.2)'}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.3s', position: 'relative', animation: `fadeUp 0.6s ${0.1 + i * 0.05}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = n.read ? 'var(--border)' : 'rgba(108,99,255,0.2)' }}>
                    {!n.read && <div style={{ position: 'absolute', top: 16, right: 16, width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', animation: 'blink 1.5s infinite' }} />}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 3 }}>{n.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 5 }}>{n.desc}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>🕐 {n.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                      {!n.read && <button onClick={() => markRead(n.id)} style={{ padding: '4px 9px', borderRadius: 6, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent)', fontSize: '0.68rem', cursor: 'none', fontWeight: 600 }}>Read</button>}
                      <button onClick={() => deleteNotif(n.id)} style={{ padding: '4px 9px', borderRadius: 6, background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.2)', color: '#ff6584', fontSize: '0.68rem', cursor: 'none', fontWeight: 600 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
        }
      `}</style>
    </>
  )
}