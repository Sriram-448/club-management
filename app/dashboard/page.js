'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

export default function Dashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [rsvp, setRsvp] = useState({})
  const [counters, setCounters] = useState({ venues: 0, events: 0, members: 0, bookings: 0 })
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

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
      if (session) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) setProfile(data)
      }
    }
    getUser()

    const targets = { venues: 6, events: 12, members: 248, bookings: 5 }
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 1500, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCounters({
        venues: Math.floor(ease * targets.venues),
        events: Math.floor(ease * targets.events),
        members: Math.floor(ease * targets.members),
        bookings: Math.floor(ease * targets.bookings),
      })
      if (progress < 1) requestAnimationFrame(step)
      else setCounters(targets)
    }
    setTimeout(() => requestAnimationFrame(step), 400)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { icon: '🏛️', bg: 'rgba(108,99,255,0.15)', value: counters.venues, label: 'Total Venues', trend: '↑ 2 new', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)' },
    { icon: '🎉', bg: 'rgba(67,233,123,0.15)', value: counters.events, label: 'Upcoming Events', trend: '↑ 4 this week', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)' },
    { icon: '👥', bg: 'rgba(255,101,132,0.15)', value: counters.members, label: 'Club Members', trend: '↑ 28', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)' },
    { icon: '📋', bg: 'rgba(247,201,72,0.15)', value: counters.bookings, label: 'My Bookings', trend: '2 pending', trendColor: '#ff6584', trendBg: 'rgba(255,101,132,0.12)' },
  ]

  const venues = [
    { emoji: '🏟️', name: 'Main Auditorium', cap: '2,000', status: 'busy' },
    { emoji: '🎭', name: 'Mini Hall - 1', cap: '500', status: 'free' },
    { emoji: '🔬', name: 'J.C. Bose Hall', cap: '800', status: 'free' },
    { emoji: '⚡', name: 'Faraday Hall', cap: '600', status: 'free' },
    { emoji: '🏗️', name: 'G.D. Naidu Hall', cap: '1,000', status: 'busy' },
    { emoji: '🏥', name: 'Hippocrates Aud.', cap: '1,200', status: 'busy' },
  ]

  const events = [
    { id: 1, day: '08', month: 'Mar', name: 'Hackathon 2026 — Semicolon', venue: '🏛️ Main Auditorium', tag: 'Tech', tagColor: '#6c63ff', tagBg: 'rgba(108,99,255,0.15)' },
    { id: 2, day: '12', month: 'Mar', name: 'Cultural Fest — Aarohan', venue: '🎭 Mini Hall - 1', tag: 'Cultural', tagColor: '#f7c948', tagBg: 'rgba(247,201,72,0.15)' },
    { id: 3, day: '15', month: 'Mar', name: 'Web Dev Workshop — IEEE', venue: '🔬 J.C. Bose Hall', tag: 'Workshop', tagColor: '#00d2ff', tagBg: 'rgba(0,210,255,0.15)' },
    { id: 4, day: '20', month: 'Mar', name: 'Sports Meet — Invictus', venue: '⚡ Faraday Hall', tag: 'Sports', tagColor: '#43e97b', tagBg: 'rgba(67,233,123,0.15)' },
  ]

  const announcements = [
    { dot: '#ff6584', title: 'Hippocrates Auditorium Occupied', desc: 'Booked till Friday 6PM.', time: '2 hours ago' },
    { dot: '#f7c948', title: 'Booking Window Open', desc: 'April slots are now open! Book early.', time: '2 days ago' },
    { dot: '#43e97b', title: 'New Event Published', desc: 'AI & ML Summit on Mar 25 — RSVP now!', time: '3 days ago' },
  ]

  const bars = [
    { h: '40%', day: 'Mon' }, { h: '65%', day: 'Tue' }, { h: '90%', day: 'Wed', active: true },
    { h: '50%', day: 'Thu' }, { h: '75%', day: 'Fri' }, { h: '30%', day: 'Sat' }, { h: '20%', day: 'Sun' },
  ]

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="dashboard" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px 0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }} className="topbar">
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>Dashboard</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link href="/notifications" style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', textDecoration: 'none' }}>🔔
                <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#ff6584', borderRadius: '50%', border: '2px solid var(--bg)' }} />
              </Link>
              <Link href="/profile" style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.85rem', color: 'white', textDecoration: 'none' }}>{avatarLetter}</Link>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', flex: 1 }}>

            {/* Welcome banner */}
            <div style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(255,101,132,0.08))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 20, padding: '24px', marginBottom: 24, position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.6s 0.1s both' }}>
              <div style={{ position: 'absolute', top: '-60%', right: '-5%', width: 250, height: 250, background: 'radial-gradient(ellipse,rgba(108,99,255,0.15),transparent 70%)', pointerEvents: 'none' }} />
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.1rem,3vw,1.4rem)', letterSpacing: -0.5, marginBottom: 6 }}>{greeting}, {firstName}! 👋</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: 16 }}>You have 2 pending bookings and 3 upcoming events this week.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/venues" style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--accent)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>📅 Book a Venue</Link>
                <Link href="/events" style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>🎉 View Events</Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{s.icon}</div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: s.trendBg, color: s.trendColor }}>{s.trend}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: -1, marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid-main" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
              <div>
                {/* Chart */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20, animation: 'fadeUp 0.6s 0.3s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>📊 Bookings This Week</div>
                    <Link href="/bookings" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
                  </div>
                  <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                    {bars.map((b, i) => (
                      <div key={i} style={{ flex: 1, height: b.h, borderRadius: '5px 5px 0 0', background: b.active ? 'linear-gradient(to top,#6c63ff,#ff6584)' : 'rgba(108,99,255,0.3)', transition: 'all 0.4s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                    {bars.map(b => <div key={b.day} style={{ flex: 1, textAlign: 'center', fontSize: '0.62rem', color: 'var(--muted)' }}>{b.day}</div>)}
                  </div>
                </div>

                {/* Venues */}
                <div style={{ animation: 'fadeUp 0.6s 0.35s both', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>🏛️ Venue Availability</div>
                    <Link href="/venues" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none' }}>See all →</Link>
                  </div>
                  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {venues.map(v => (
                      <div key={v.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10, borderLeft: `3px solid ${v.status === 'free' ? '#43e97b' : '#ff6584'}`, transition: 'all 0.25s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = ''}>
                        <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{v.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                          <div style={{ fontSize: '0.65rem', color: v.status === 'free' ? '#43e97b' : '#ff6584', fontWeight: 600, textTransform: 'uppercase' }}>{v.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events */}
                <div style={{ animation: 'fadeUp 0.6s 0.4s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>🎉 Upcoming Events</div>
                    <Link href="/events" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none' }}>See all →</Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {events.map(ev => (
                      <div key={ev.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,99,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent)' }}>{ev.day}</div>
                          <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{ev.month}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.83rem', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.venue}</span>
                            <span style={{ padding: '1px 7px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 600, background: ev.tagBg, color: ev.tagColor, flexShrink: 0 }}>{ev.tag}</span>
                          </div>
                        </div>
                        <button onClick={() => setRsvp(prev => ({ ...prev, [ev.id]: !prev[ev.id] }))} style={{ padding: '5px 12px', borderRadius: 7, background: rsvp[ev.id] ? 'rgba(67,233,123,0.15)' : 'rgba(108,99,255,0.12)', border: `1px solid ${rsvp[ev.id] ? 'rgba(67,233,123,0.3)' : 'rgba(108,99,255,0.2)'}`, color: rsvp[ev.id] ? '#43e97b' : 'var(--accent)', fontSize: '0.7rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s', flexShrink: 0 }}>
                          {rsvp[ev.id] ? '✓' : 'RSVP'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Quick book */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, animation: 'fadeUp 0.6s 0.25s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>⚡ Quick Book</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <select style={{ width: '100%', padding: '10px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#f0f0ff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                      <option value="">🏛️ Select Venue</option>
                      <option>Mini Hall - 1</option><option>J.C. Bose Hall</option><option>Faraday Hall</option>
                    </select>
                    <input type="date" min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', outline: 'none' }} />
                    <Link href="/venues" style={{ padding: 11, borderRadius: 9, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.3s' }}>Book Now →</Link>
                  </div>
                </div>

                {/* Announcements */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, animation: 'fadeUp 0.6s 0.3s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>📢 Announcements</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {announcements.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.25s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.dot, marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.78rem', marginBottom: 2 }}>{a.title}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{a.desc}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 3 }}>🕐 {a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr 1fr !important; }
          .grid-main { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}