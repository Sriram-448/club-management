'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Events() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState('all')
  const [rsvp, setRsvp] = useState({})
  const [search, setSearch] = useState('')

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

  const events = [
    { id: 1, day: '08', month: 'Mar', year: '2026', name: 'Hackathon 2026 — Semicolon', club: 'IEEE Club', venue: 'Main Auditorium', tag: 'Tech', tagColor: '#6c63ff', tagBg: 'rgba(108,99,255,0.15)', rsvpCount: 142, desc: 'A 24-hour hackathon for students to build innovative solutions.', emoji: '💻' },
    { id: 2, day: '12', month: 'Mar', year: '2026', name: 'Cultural Fest — Aarohan', club: 'Cultural Club', venue: 'Mini Hall - 1', tag: 'Cultural', tagColor: '#f7c948', tagBg: 'rgba(247,201,72,0.15)', rsvpCount: 380, desc: 'Annual cultural extravaganza with dance, music and art.', emoji: '🎭' },
    { id: 3, day: '15', month: 'Mar', year: '2026', name: 'Web Dev Workshop', club: 'IEEE Club', venue: 'J.C. Bose Hall', tag: 'Workshop', tagColor: '#00d2ff', tagBg: 'rgba(0,210,255,0.15)', rsvpCount: 89, desc: 'Hands-on workshop on modern web development with Next.js.', emoji: '🌐' },
    { id: 4, day: '20', month: 'Mar', year: '2026', name: 'Sports Meet — Invictus', club: 'Sports Club', venue: 'Faraday Hall', tag: 'Sports', tagColor: '#43e97b', tagBg: 'rgba(67,233,123,0.15)', rsvpCount: 210, desc: 'Inter-department sports competition with multiple events.', emoji: '⚽' },
    { id: 5, day: '25', month: 'Mar', year: '2026', name: 'AI & ML Summit', club: 'Coding Club', venue: 'G.D. Naidu Hall', tag: 'Tech', tagColor: '#6c63ff', tagBg: 'rgba(108,99,255,0.15)', rsvpCount: 175, desc: 'Industry experts talk on Artificial Intelligence and Machine Learning.', emoji: '🤖' },
    { id: 6, day: '28', month: 'Mar', year: '2026', name: 'Music Night — Resonance', club: 'Music Club', venue: 'Main Auditorium', tag: 'Cultural', tagColor: '#f7c948', tagBg: 'rgba(247,201,72,0.15)', rsvpCount: 420, desc: 'An evening of live music performances by student bands.', emoji: '🎵' },
  ]

  const tags = ['all', 'Tech', 'Cultural', 'Workshop', 'Sports']

  const filtered = events.filter(e => {
    const matchTag = filter === 'all' || e.tag === filter
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.club.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = user?.user_metadata?.role || 'student'

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🏛️', label: 'Venues', href: '/venues' },
    { icon: '🎉', label: 'Events', href: '/events', active: true },
    { icon: '📋', label: 'My Bookings', href: '/bookings' },
    { icon: '👤', label: 'Profile', href: '/profile' },
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
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>Events 🎉</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{events.length} upcoming events this month</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', width: 160, caretColor: 'var(--accent)' }} />
            </div>
          </div>

          <div style={{ padding: '28px 36px' }}>
            {/* Tag filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, animation: 'fadeUp 0.6s 0.1s both' }}>
              {tags.map(tag => (
                <button key={tag} onClick={() => setFilter(tag)} style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid', borderColor: filter === tag ? 'var(--accent)' : 'var(--border)', background: filter === tag ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === tag ? 'var(--text)' : 'var(--muted)', fontSize: '0.82rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s', textTransform: 'capitalize' }}>{tag === 'all' ? 'All Events' : tag}</button>
              ))}
            </div>

            {/* Events grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
              {filtered.map((ev, i) => (
                <div key={ev.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: ev.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{ev.emoji}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 3 }}>{ev.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{ev.club}</div>
                      </div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: ev.tagBg, color: ev.tagColor, flexShrink: 0 }}>{ev.tag}</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>{ev.desc}</p>

                  <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>📅 {ev.day} {ev.month} {ev.year}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>🏛️ {ev.venue}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>👥 {ev.rsvpCount + (rsvp[ev.id] ? 1 : 0)} going</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ height: 4, flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', marginRight: 14 }}>
                      <div style={{ height: '100%', background: ev.tagColor, borderRadius: 10, width: `${Math.min((ev.rsvpCount / 500) * 100, 100)}%`, transition: 'width 1s' }} />
                    </div>
                    <button onClick={() => setRsvp(prev => ({ ...prev, [ev.id]: !prev[ev.id] }))}
                      style={{ padding: '8px 18px', borderRadius: 10, background: rsvp[ev.id] ? 'rgba(67,233,123,0.15)' : 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: rsvp[ev.id] ? '1px solid rgba(67,233,123,0.3)' : 'none', color: rsvp[ev.id] ? '#43e97b' : 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.8rem', cursor: 'none', transition: 'all 0.25s', flexShrink: 0 }}>
                      {rsvp[ev.id] ? '✓ Going!' : 'RSVP →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}