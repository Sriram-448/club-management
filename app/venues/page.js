'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Venues() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [purpose, setPurpose] = useState('')
  const [step, setStep] = useState(1)

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
    setBookDate(new Date().toISOString().split('T')[0])
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const venues = [
    { emoji: '🏟️', name: 'Main Auditorium', cap: '2,000', block: 'Block A', status: 'busy', next: 'Mar 10', tags: ['Conferences', 'Hackathons', 'Convocation'], bg: 'linear-gradient(135deg,#1a1a3e,#2d1b69)', slots: 0 },
    { emoji: '🎭', name: 'Mini Hall - 1', cap: '500', block: 'Block B', status: 'free', tags: ['Seminars', 'Cultural', 'Workshops'], bg: 'linear-gradient(135deg,#1a2e1a,#1b4d2d)', slots: 3 },
    { emoji: '🔬', name: 'Sir J.C. Bose Hall', cap: '800', block: 'Block C', status: 'free', tags: ['Tech Events', 'Lectures'], bg: 'linear-gradient(135deg,#2e1a1a,#4d1b1b)', slots: 5 },
    { emoji: '⚡', name: 'Faraday Hall', cap: '600', block: 'Block D', status: 'free', tags: ['Workshops', 'Competitions'], bg: 'linear-gradient(135deg,#1a2a2e,#1b3d4d)', slots: 4 },
    { emoji: '🏗️', name: 'G.D. Naidu Hall', cap: '1,000', block: 'Block E', status: 'busy', next: 'Mar 12', tags: ['Annual Events', 'Fests'], bg: 'linear-gradient(135deg,#2a1a2e,#3d1b4d)', slots: 0 },
    { emoji: '🏥', name: 'Hippocrates Aud.', cap: '1,200', block: 'Block F', status: 'busy', next: 'Mar 15', tags: ['Medical Events', 'Symposiums'], bg: 'linear-gradient(135deg,#2e2a1a,#4d3d1b)', slots: 0 },
  ]

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
  const takenSlots = ['11:00 AM', '2:00 PM']

  const filtered = venues.filter(v => {
    const matchFilter = filter === 'all' || v.status === filter
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const openBooking = (venue) => {
    if (venue.status === 'busy') return
    setSelectedVenue(venue)
    setSelectedSlot('')
    setPurpose('')
    setStep(1)
    setModal(true)
  }

  const submitBooking = () => {
    if (!bookDate || !selectedSlot) { alert('Please select a date and time slot!'); return }
    setStep(2)
  }

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '🏛️', label: 'Venues', href: '/venues', active: true },
    { icon: '🎉', label: 'Events', href: '#' },
    { icon: '👥', label: 'Members', href: '#' },
    { icon: '📋', label: 'My Bookings', href: '#' },
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
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 6px 20px rgba(108,99,255,0.35)', flexShrink: 0 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem' }}>SRMIST Portal<span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif' }}>Club Management System</span></div>
          </div>
          <div style={{ padding: '14px 18px', margin: 12, background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, flexShrink: 0 }}>S</div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem' }}>Sriram</strong><span style={{ fontSize: '0.72rem', color: '#43e97b' }}>● Club Head</span></div>
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
            <button onClick={() => window.location.href = '/login'} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: '#ff6584', fontSize: '0.88rem', cursor: 'none', background: 'none', border: 'none', width: '100%', fontFamily: 'DM Sans,sans-serif' }}>🚪 Logout</button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 36px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>Venue Booking 🏛️</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>6 venues available — book your slot now</div>
            </div>
            <Link href="/dashboard" style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.83rem', textDecoration: 'none' }}>← Back to Dashboard</Link>
          </div>

          <div style={{ padding: '28px 36px' }}>
            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {[['all', 'All Venues'], ['free', '✅ Available'], ['busy', '🔴 Occupied']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid', borderColor: filter === val ? 'var(--accent)' : 'var(--border)', background: filter === val ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === val ? 'var(--text)' : 'var(--muted)', fontSize: '0.82rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s' }}>{label}</button>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ color: 'var(--muted)' }}>🔍</span>
                <input type="text" placeholder="Search venues..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.83rem', width: 160, caretColor: 'var(--accent)' }} />
              </div>
            </div>

            {/* Venues grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, animation: 'fadeUp 0.6s 0.2s both' }}>
              {filtered.map((v, i) => (
                <div key={v.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', animation: `fadeUp 0.6s ${0.2 + i * 0.07}s both`, position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 32px 64px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>
                  <div style={{ height: 160, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative' }}>
                    {v.emoji}
                    <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: v.status === 'free' ? 'rgba(67,233,123,0.2)' : 'rgba(255,101,132,0.2)', color: v.status === 'free' ? '#43e97b' : '#ff6584', border: `1px solid ${v.status === 'free' ? 'rgba(67,233,123,0.3)' : 'rgba(255,101,132,0.3)'}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', animation: 'blink 1.5s infinite' }} />
                      {v.status === 'free' ? 'Available' : 'Occupied'}
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{v.name}</div>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>👥 {v.cap} seats</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📍 {v.block}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                      {v.tags.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: 'rgba(108,99,255,0.1)', color: '#a89cff' }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {v.status === 'free' ? <><strong style={{ color: '#43e97b' }}>{v.slots} slots</strong> today</> : <>Next free: <strong>{v.next}</strong></>}
                      </div>
                      <button onClick={() => openBooking(v)} style={{ padding: '9px 20px', borderRadius: 10, background: v.status === 'free' ? 'linear-gradient(135deg,#6c63ff,#9b55ff)' : 'rgba(255,255,255,0.08)', border: 'none', color: v.status === 'free' ? 'white' : 'var(--muted)', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.82rem', cursor: v.status === 'free' ? 'none' : 'not-allowed', transition: 'all 0.25s' }}
                        onMouseEnter={e => { if (v.status === 'free') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(108,99,255,0.4)' } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                        {v.status === 'free' ? 'Book Now →' : 'Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {modal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) { setModal(false) } }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s both' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: 36, width: 500, maxWidth: '92vw', position: 'relative', maxHeight: '90vh', overflowY: 'auto', animation: 'popIn 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6c63ff,#ff6584,#f7c948)', borderRadius: '24px 24px 0 0' }} />

            {step === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{selectedVenue?.emoji}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.2rem' }}>{selectedVenue?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Capacity: {selectedVenue?.cap} seats</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Date</label>
                  <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Select Time Slot</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {timeSlots.map(slot => {
                      const taken = takenSlots.includes(slot)
                      const selected = selectedSlot === slot
                      return (
                        <button key={slot} onClick={() => !taken && setSelectedSlot(slot)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid', borderColor: selected ? 'var(--accent)' : taken ? 'rgba(255,101,132,0.2)' : 'var(--border)', background: selected ? 'rgba(108,99,255,0.2)' : taken ? 'rgba(255,101,132,0.08)' : 'rgba(255,255,255,0.04)', fontSize: '0.78rem', color: selected ? 'var(--text)' : taken ? 'rgba(255,101,132,0.5)' : 'var(--muted)', cursor: taken ? 'not-allowed' : 'none', fontWeight: selected ? 600 : 400, textDecoration: taken ? 'line-through' : 'none', transition: 'all 0.2s' }}>
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Duration</label>
                    <select style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                      <option>1 Hour</option><option>2 Hours</option><option>3 Hours</option><option>Half Day</option><option>Full Day</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Attendees</label>
                    <input type="number" placeholder="e.g. 200" style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Purpose / Event Name</label>
                  <input type="text" placeholder="e.g. IEEE Workshop on AI" value={purpose} onChange={e => setPurpose(e.target.value)} style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Club Name</label>
                  <select style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                    <option>IEEE Club</option><option>Cultural Club</option><option>Sports Club</option><option>Coding Club</option><option>Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setModal(false)} style={{ flex: 1, padding: 13, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.9rem', cursor: 'none', transition: 'all 0.2s' }}>Cancel</button>
                  <button onClick={submitBooking} style={{ flex: 2, padding: 13, borderRadius: 12, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: 'none', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', cursor: 'none', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(108,99,255,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                    Submit Request →
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16, animation: 'popIn 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>🎉</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>Booking Submitted!</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24 }}>Your venue booking request has been sent to the admin. You'll be notified once it's approved.</div>
                <div style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 14, padding: 16, marginBottom: 24, textAlign: 'left' }}>
                  {[['Venue', selectedVenue?.name], ['Date', bookDate], ['Time', selectedSlot || 'Not selected'], ['Purpose', purpose || 'Not specified'], ['Status', '⏳ Pending Admin Approval']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: label === 'Status' ? '#f7c948' : 'var(--text)' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModal(false)} style={{ width: '100%', padding: 13, borderRadius: 12, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', cursor: 'none', transition: 'all 0.3s' }}>Back to Venues ✓</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.9) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
      `}</style>
    </>
  )
}