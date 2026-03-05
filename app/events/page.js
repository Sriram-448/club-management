'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

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

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="events" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>Events 🎉</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{events.length} upcoming events</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 12px' }}>
              <span style={{ color: 'var(--muted)' }}>🔍</span>
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', width: 120, caretColor: 'var(--accent)' }} />
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {tags.map(tag => (
                <button key={tag} onClick={() => setFilter(tag)} style={{ padding: '7px 16px', borderRadius: 100, border: '1px solid', borderColor: filter === tag ? 'var(--accent)' : 'var(--border)', background: filter === tag ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === tag ? 'var(--text)' : 'var(--muted)', fontSize: '0.8rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s' }}>{tag === 'all' ? 'All Events' : tag}</button>
              ))}
            </div>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {filtered.map((ev, i) => (
                <div key={ev.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 20, transition: 'all 0.35s', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: ev.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{ev.emoji}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.92rem', marginBottom: 2 }}>{ev.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{ev.club}</div>
                      </div>
                    </div>
                    <span style={{ padding: '2px 9px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, background: ev.tagBg, color: ev.tagColor, flexShrink: 0 }}>{ev.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>{ev.desc}</p>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📅 {ev.day} {ev.month} {ev.year}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>🏛️ {ev.venue}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>👥 {ev.rsvpCount + (rsvp[ev.id] ? 1 : 0)} going</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ height: 3, flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: ev.tagColor, borderRadius: 10, width: `${Math.min((ev.rsvpCount / 500) * 100, 100)}%` }} />
                    </div>
                    <button onClick={() => setRsvp(prev => ({ ...prev, [ev.id]: !prev[ev.id] }))} style={{ padding: '7px 16px', borderRadius: 9, background: rsvp[ev.id] ? 'rgba(67,233,123,0.15)' : 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: rsvp[ev.id] ? '1px solid rgba(67,233,123,0.3)' : 'none', color: rsvp[ev.id] ? '#43e97b' : 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', cursor: 'none', transition: 'all 0.25s', flexShrink: 0 }}>
                      {rsvp[ev.id] ? '✓ Going!' : 'RSVP →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}