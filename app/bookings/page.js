'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

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
        const { data, error } = await supabase.from('bookings').select(`*, venues(name, emoji)`).eq('user_id', session.user.id).order('created_at', { ascending: false })
        if (!error && data) setBookings(data)
      }
      setLoading(false)
    }
    getBookings()
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const statusStyle = (status) => ({
    padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
    background: status === 'approved' ? 'rgba(67,233,123,0.12)' : status === 'pending' ? 'rgba(247,201,72,0.12)' : 'rgba(255,101,132,0.12)',
    color: status === 'approved' ? '#43e97b' : status === 'pending' ? '#f7c948' : '#ff6584',
  })

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="bookings" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>My Bookings 📋</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>All your venue requests</div>
            </div>
            <Link href="/venues" style={{ padding: '7px 14px', borderRadius: 9, background: 'var(--accent)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>+ New</Link>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: 100, border: '1px solid', borderColor: filter === s ? 'var(--accent)' : 'var(--border)', background: filter === s ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === s ? 'var(--text)' : 'var(--muted)', fontSize: '0.78rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s', textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                <div style={{ width: 36, height: 36, border: '3px solid rgba(108,99,255,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                Loading your bookings...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeUp 0.6s both' }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>📋</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No bookings yet</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 20 }}>You haven't made any venue booking requests.</div>
                <Link href="/venues" style={{ padding: '9px 20px', borderRadius: 10, background: 'var(--accent)', color: 'white', textDecoration: 'none', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem' }}>Book a Venue →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 0.6s 0.2s both' }}>
                {filtered.map((b, i) => (
                  <div key={b.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.3s', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                      {b.venues?.emoji || '🏛️'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.92rem', marginBottom: 5 }}>{b.venues?.name || 'Venue'}</div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📅 {b.date}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>🕐 {b.time_slot}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>⏱️ {b.duration}</span>
                        {b.club && <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>🏆 {b.club}</span>}
                      </div>
                      {b.purpose && <div style={{ fontSize: '0.78rem', marginTop: 4, color: 'var(--text)' }}>🎯 {b.purpose}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span style={statusStyle(b.status)}>{b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
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
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}