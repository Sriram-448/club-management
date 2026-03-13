'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from '@/components/Sidebar'

export default function Venues() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [purpose, setPurpose] = useState('')
  const [club, setClub] = useState('')
  const [duration, setDuration] = useState('1 Hour')
  const [attendees, setAttendees] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

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
    const today = new Date().toISOString().split('T')[0]
    setBookDate(today)
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUser(session.user)
    }
    getUser()
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const venues = [
    { id: 1, emoji: '🏟️', name: 'Main Auditorium', cap: '2,000', block: 'Block A', status: 'busy', next: 'Mar 20', tags: ['Conferences', 'Hackathons'], bg: 'linear-gradient(135deg,#1a1a3e,#2d1b69)', slots: 0 },
    { id: 2, emoji: '🎭', name: 'Mini Hall - 1', cap: '500', block: 'Block B', status: 'free', tags: ['Seminars', 'Cultural'], bg: 'linear-gradient(135deg,#1a2e1a,#1b4d2d)', slots: 3 },
    { id: 3, emoji: '🔬', name: 'Sir J.C. Bose Hall', cap: '800', block: 'Block C', status: 'free', tags: ['Tech Events', 'Lectures'], bg: 'linear-gradient(135deg,#2e1a1a,#4d1b1b)', slots: 5 },
    { id: 4, emoji: '⚡', name: 'Faraday Hall', cap: '600', block: 'Block D', status: 'free', tags: ['Workshops'], bg: 'linear-gradient(135deg,#1a2a2e,#1b3d4d)', slots: 4 },
    { id: 5, emoji: '🏗️', name: 'G.D. Naidu Hall', cap: '1,000', block: 'Block E', status: 'busy', next: 'Mar 18', tags: ['Annual Events'], bg: 'linear-gradient(135deg,#2a1a2e,#3d1b4d)', slots: 0 },
    { id: 6, emoji: '🏥', name: 'Hippocrates Aud.', cap: '1,200', block: 'Block F', status: 'busy', next: 'Mar 16', tags: ['Medical Events'], bg: 'linear-gradient(135deg,#2e2a1a,#4d3d1b)', slots: 0 },
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
    setClub('')
    setAttendees('')
    setStep(1)
    setModal(true)
  }

  const submitBooking = async () => {
    if (!bookDate || !selectedSlot || !purpose) {
      alert('Please fill in all required fields!')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from('bookings').insert([{
        user_id: user?.id,
        venue_id: selectedVenue.id,
        date: bookDate,
        time_slot: selectedSlot,
        duration,
        purpose,
        club,
        attendees: attendees ? parseInt(attendees) : null,
        status: 'pending'
      }])
      if (error) { alert('Failed to submit booking.'); setLoading(false); return }
      await fetch('/api/notify-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue: selectedVenue.name, date: bookDate, timeSlot: selectedSlot, purpose, club, userEmail: user?.email })
      })
      setLoading(false)
      setStep(2)
    } catch (err) {
      setLoading(false)
      alert('Something went wrong.')
    }
  }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activePage="venues" />

        <div className="page-content" style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>Venue Booking 🏛️</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>6 venues available</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 12px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>🔍</span>
              <input type="text" placeholder="Search venues..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.8rem', width: 130, caretColor: 'var(--accent)' }} />
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.1s both' }}>
              {[['all', 'All Venues'], ['free', '✅ Available'], ['busy', '🔴 Occupied']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ padding: '7px 16px', borderRadius: 100, border: '1px solid', borderColor: filter === val ? 'var(--accent)' : 'var(--border)', background: filter === val ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)', color: filter === val ? 'var(--text)' : 'var(--muted)', fontSize: '0.8rem', fontWeight: 500, cursor: 'none', transition: 'all 0.25s' }}>{label}</button>
              ))}
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {filtered.map((v, i) => (
                <div key={v.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', animation: `fadeUp 0.6s ${0.1 + i * 0.07}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>
                  <div style={{ height: 130, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
                    {v.emoji}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, background: v.status === 'free' ? 'rgba(67,233,123,0.2)' : 'rgba(255,101,132,0.2)', color: v.status === 'free' ? '#43e97b' : '#ff6584', border: `1px solid ${v.status === 'free' ? 'rgba(67,233,123,0.3)' : 'rgba(255,101,132,0.3)'}` }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                      {v.status === 'free' ? 'Available' : 'Occupied'}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{v.name}</div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>👥 {v.cap}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📍 {v.block}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
                      {v.tags.map(t => <span key={t} style={{ padding: '2px 8px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 600, background: 'rgba(108,99,255,0.1)', color: '#a89cff' }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                        {v.status === 'free' ? <><strong style={{ color: '#43e97b' }}>{v.slots} slots</strong> today</> : <>Next: <strong>{v.next}</strong></>}
                      </div>
                      <button onClick={() => openBooking(v)} style={{ padding: '7px 16px', borderRadius: 9, background: v.status === 'free' ? 'linear-gradient(135deg,#6c63ff,#9b55ff)' : 'rgba(255,255,255,0.08)', border: 'none', color: v.status === 'free' ? 'white' : 'var(--muted)', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', cursor: v.status === 'free' ? 'none' : 'not-allowed', transition: 'all 0.25s' }}>
                        {v.status === 'free' ? 'Book →' : 'Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'fadeIn 0.3s both' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, padding: 28, width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto', animation: 'popIn 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#6c63ff,#ff6584)', borderRadius: '22px 22px 0 0' }} />

            {step === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{selectedVenue?.emoji}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem' }}>{selectedVenue?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Capacity: {selectedVenue?.cap} seats</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Date *</label>
                  <input type="date" value={bookDate} min={new Date().toISOString().split('T')[0]} onChange={e => { setBookDate(e.target.value); setSelectedSlot('') }} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Time Slot *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {timeSlots.map(slot => {
                      const taken = takenSlots.includes(slot)
                      const isToday = bookDate === new Date().toISOString().split('T')[0]
                      const slotHour = parseInt(slot.split(':')[0]) + (slot.includes('PM') && !slot.startsWith('12') ? 12 : 0)
                      const currentHour = new Date().getHours()
                      const isPast = isToday && slotHour <= currentHour
                      const disabled = taken || isPast
                      const selected = selectedSlot === slot
                      return (
                        <button key={slot} onClick={() => !disabled && setSelectedSlot(slot)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid', borderColor: selected ? 'var(--accent)' : disabled ? 'rgba(255,101,132,0.2)' : 'var(--border)', background: selected ? 'rgba(108,99,255,0.2)' : disabled ? 'rgba(255,101,132,0.08)' : 'rgba(255,255,255,0.04)', fontSize: '0.75rem', color: selected ? 'var(--text)' : disabled ? 'rgba(255,101,132,0.4)' : 'var(--muted)', cursor: disabled ? 'not-allowed' : 'none', textDecoration: disabled ? 'line-through' : 'none', transition: 'all 0.2s', position: 'relative' }}
                          title={isPast ? 'This time slot has already passed' : taken ? 'Already booked' : ''}>
                          {slot}{isPast && !taken ? ' ⏰' : ''}
                        </button>
                      )
                    })}
                  </div>
                  {bookDate === new Date().toISOString().split('T')[0] && <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 6 }}>⏰ Crossed out slots have already passed today</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Duration</label>
                    <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0ff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                      <option>1 Hour</option><option>2 Hours</option><option>3 Hours</option><option>Half Day</option><option>Full Day</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Attendees</label>
                    <input type="number" placeholder="e.g. 200" value={attendees} onChange={e => setAttendees(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Purpose *</label>
                  <input type="text" placeholder="e.g. IEEE Workshop on AI" value={purpose} onChange={e => setPurpose(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Club</label>
                  <select value={club} onChange={e => setClub(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0ff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                    <option value="">Select your club</option>
                    <option>IEEE Club</option><option>Cultural Club</option><option>Sports Club</option><option>Coding Club</option><option>Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', cursor: 'none' }}>Cancel</button>
                  <button onClick={submitBooking} disabled={loading} style={{ flex: 2, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: 'none', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.88rem', cursor: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loading ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : 'Submit Request →'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎉</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>Booking Submitted!</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20 }}>Your request has been saved. Admin will review and approve it.</div>
                <div style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'left' }}>
                  {[['Venue', selectedVenue?.name], ['Date', bookDate], ['Time', selectedSlot], ['Duration', duration], ['Purpose', purpose], ['Status', '⏳ Pending']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.78rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: label === 'Status' ? '#f7c948' : 'var(--text)' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModal(false)} style={{ width: '100%', padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#43e97b,#00b894)', border: 'none', color: '#003', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.88rem', cursor: 'none' }}>Done ✓</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .page-content { margin-left: 0 !important; }
          .topbar { padding-left: 60px !important; }
          .grid-3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.9) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}