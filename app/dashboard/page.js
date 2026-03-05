'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Dashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [notifOpen, setNotifOpen] = useState(false)
  const [rsvp, setRsvp] = useState({})
  const [bookToast, setBookToast] = useState(false)
  const [counters, setCounters] = useState({ venues: 0, events: 0, members: 0, bookings: 0 })
  const [bookVenue, setBookVenue] = useState('')
  const [bookDate, setBookDate] = useState('')
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

    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // Get profile from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profileData) setProfile(profileData)
      }
    }
    getUser()

    // Animate counters
    const targets = { venues: 6, events: 12, members: 248, bookings: 5 }
    const duration = 1500
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
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

    setBookDate(new Date().toISOString().split('T')[0])

    return () => document.removeEventListener('mousemove', move)
  }, [])

  const handleRsvp = (id) => setRsvp(prev => ({ ...prev, [id]: !prev[id] }))

  const handleBooking = () => {
    if (!bookVenue || !bookDate) { alert('Please select a venue and date!'); return }
    setBookToast(true)
    setTimeout(() => setBookToast(false), 3000)
  }

  // Get display name
  const firstName = profile?.full_name?.split(' ')[0]
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there'

  const fullName = profile?.full_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'User'

  const userRole = profile?.role
    || user?.user_metadata?.role
    || 'student'

  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'

  // Get greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { id: 'venues', icon: '🏛️', label: 'Venues', href: '/venues', badge: '4 Free', badgeColor: 'rgba(67,233,123,0.15)', badgeText: '#43e97b' },
    { id: 'events', icon: '🎉', label: 'Events', href: '#', badge: '12', badgeColor: 'rgba(108,99,255,0.2)', badgeText: '#a89cff' },
    { id: 'members', icon: '👥', label: 'Members', href: '#' },
    { id: 'bookings', icon: '📋', label: 'My Bookings', href: '#', badge: '2', badgeColor: 'rgba(255,101,132,0.15)', badgeText: '#ff6584' },
    { id: 'clubs', icon: '🏆', label: 'My Clubs', href: '#', section: 'Club' },
    { id: 'announcements', icon: '📢', label: 'Announcements', href: '#' },
    { id: 'analytics', icon: '📊', label: 'Analytics', href: '#' },
    { id: 'admin', icon: '⚙️', label: 'Admin Panel', href: '/admin', section: 'Account' },
    { id: 'profile', icon: '👤', label: 'Profile', href: '#' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', href: '#', badge: '3', badgeColor: 'rgba(255,101,132,0.15)', badgeText: '#ff6584' },
  ]

  const venues = [
    { emoji: '🏟️', name: 'Main Auditorium', cap: '2,000 seats', status: 'busy' },
    { emoji: '🎭', name: 'Mini Hall - 1', cap: '500 seats', status: 'free' },
    { emoji: '🔬', name: 'J.C. Bose Hall', cap: '800 seats', status: 'free' },
    { emoji: '⚡', name: 'Faraday Hall', cap: '600 seats', status: 'free' },
    { emoji: '🏗️', name: 'G.D. Naidu Hall', cap: '1,000 seats', status: 'busy' },
    { emoji: '🏥', name: 'Hippocrates Aud.', cap: '1,200 seats', status: 'busy' },
  ]

  const events = [
    { id: 1, day: '08', month: 'Mar', name: 'Hackathon 2026 — Semicolon', venue: '🏛️ Main Auditorium', tag: 'Tech', tagColor: '#6c63ff', tagBg: 'rgba(108,99,255,0.15)' },
    { id: 2, day: '12', month: 'Mar', name: 'Cultural Fest — Aarohan', venue: '🎭 Mini Hall - 1', tag: 'Cultural', tagColor: '#f7c948', tagBg: 'rgba(247,201,72,0.15)' },
    { id: 3, day: '15', month: 'Mar', name: 'Web Dev Workshop — IEEE', venue: '🔬 J.C. Bose Hall', tag: 'Workshop', tagColor: '#00d2ff', tagBg: 'rgba(0,210,255,0.15)' },
    { id: 4, day: '20', month: 'Mar', name: 'Sports Meet — Invictus', venue: '⚡ Faraday Hall', tag: 'Sports', tagColor: '#43e97b', tagBg: 'rgba(67,233,123,0.15)' },
  ]

  const announcements = [
    { dot: '#ff6584', title: 'Hippocrates Auditorium Occupied', desc: 'Booked till Friday 6PM for annual function.', time: '2 hours ago' },
    { dot: '#43e97b', title: 'New Venue Available', desc: 'Mini Hall - 2 is now open for bookings.', time: 'Yesterday' },
    { dot: '#f7c948', title: 'Booking Window Open', desc: 'April slots are now open — book early!', time: '2 days ago' },
    { dot: '#6c63ff', title: 'Hackathon 2026 Registration', desc: 'Register by Mar 7 for Semicolon 2026.', time: '3 days ago' },
  ]

  const activity = [
    { av: avatarLetter, avBg: 'rgba(108,99,255,0.2)', avColor: '#6c63ff', text: <><strong>You</strong> booked Faraday Hall for Mar 15</>, time: 'Today, 9:30 AM' },
    { av: 'P', avBg: 'rgba(67,233,123,0.2)', avColor: '#43e97b', text: <><strong>Priya</strong> joined your club</>, time: 'Today, 8:15 AM' },
    { av: 'R', avBg: 'rgba(255,101,132,0.2)', avColor: '#ff6584', text: <><strong>Rahul</strong> created a new event</>, time: 'Yesterday' },
    { av: 'A', avBg: 'rgba(247,201,72,0.2)', avColor: '#f7c948', text: <><strong>Admin</strong> approved your booking</>, time: '2 days ago' },
  ]

  const bars = [
    { h: '40%', day: 'Mon' }, { h: '65%', day: 'Tue' }, { h: '90%', day: 'Wed', active: true },
    { h: '50%', day: 'Thu' }, { h: '75%', day: 'Fri' }, { h: '30%', day: 'Sat' }, { h: '20%', day: 'Sun' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto' }}>
          <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 6px 20px rgba(108,99,255,0.35)', flexShrink: 0 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem' }}>SRMIST Portal <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>Club Management System</span></div>
          </div>

          <div style={{ padding: '14px 18px', margin: 12, background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>{avatarLetter}</div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>{fullName}</strong>
              <span style={{ fontSize: '0.72rem', color: '#43e97b', textTransform: 'capitalize' }}>● {userRole}</span>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, background: '#43e97b', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
          </div>

          <nav style={{ padding: '16px 12px', flex: 1 }}>
            {['Main', 'Club', 'Account'].map(section => (
              <div key={section}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '0 12px', margin: '16px 0 8px' }}>{section}</div>
                {navItems.filter(item => {
                  if (section === 'Main') return !item.section
                  return item.section === section
                }).map(item => (
                  <Link key={item.id} href={item.href}
                    onClick={() => setActiveNav(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: activeNav === item.id ? 'var(--text)' : 'var(--muted)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.25s', marginBottom: 2, background: activeNav === item.id ? 'rgba(108,99,255,0.15)' : 'transparent', borderLeft: activeNav === item.id ? '3px solid var(--accent)' : '3px solid transparent' }}
                    onMouseEnter={e => { if (activeNav !== item.id) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                    onMouseLeave={e => { if (activeNav !== item.id) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' } }}>
                    <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                    {item.badge && <span style={{ marginLeft: 'auto', padding: '2px 8px', background: item.badgeColor, borderRadius: 100, fontSize: '0.68rem', color: item.badgeText, fontWeight: 600 }}>{item.badge}</span>}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: '#ff6584', fontSize: '0.88rem', fontWeight: 500, cursor: 'none', background: 'none', border: 'none', width: '100%', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,132,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <span>🚪</span> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ marginLeft: 260, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 36px', height: 68, display: 'flex', alignItems: 'center', gap: 20, animation: 'slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>Dashboard</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 1 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', width: 220 }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>🔍</span>
                <input type="text" placeholder="Search venues, events..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', width: '100%', caretColor: 'var(--accent)' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'none', transition: 'all 0.25s' }}>🔔
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ff6584', borderRadius: '50%', border: '2px solid var(--bg)', animation: 'blink 1.5s infinite' }} />
                </button>
                {notifOpen && (
                  <div style={{ position: 'absolute', top: 48, right: 0, width: 300, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', zIndex: 200, padding: 20, animation: 'fadeUp 0.3s both' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
                      Notifications <span style={{ fontSize: '0.72rem', color: 'var(--accent)', cursor: 'none' }} onClick={() => setNotifOpen(false)}>Clear all</span>
                    </div>
                    {[
                      { icon: '🏛️', text: 'Booking Approved', sub: 'Main Auditorium confirmed for Mar 10', time: '2 hours ago' },
                      { icon: '🎉', text: 'New Event', sub: 'Hackathon 2026 has been published', time: '5 hours ago' },
                      { icon: '👥', text: 'New Member', sub: 'Someone joined your club', time: 'Yesterday' }
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: 32, height: 32, background: 'rgba(108,99,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}><strong style={{ display: 'block' }}>{n.text}</strong>{n.sub}<span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{n.time}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.9rem' }}>{avatarLetter}</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '32px 36px', flex: 1 }}>

            {/* Welcome banner */}
            <div style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(255,101,132,0.08))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.6s 0.1s both' }}>
              <div style={{ position: 'absolute', top: '-60%', right: '-5%', width: 300, height: 300, background: 'radial-gradient(ellipse,rgba(108,99,255,0.15),transparent 70%)', pointerEvents: 'none' }} />
              <div>
                <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: -0.5, marginBottom: 6 }}>{greeting}, {firstName}! 👋</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>You have 2 pending bookings and 3 upcoming events this week.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
                <Link href="/venues" style={{ padding: '9px 20px', borderRadius: 10, background: 'var(--accent)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.25s' }}>📅 Book a Venue</Link>
                <button style={{ padding: '9px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s' }}>➕ Create Event</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { icon: '🏛️', bg: 'rgba(108,99,255,0.15)', value: counters.venues, label: 'Total Venues', trend: '↑ 2 new', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)', delay: '0.15s' },
                { icon: '🎉', bg: 'rgba(67,233,123,0.15)', value: counters.events, label: 'Upcoming Events', trend: '↑ 4 this week', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)', delay: '0.22s' },
                { icon: '👥', bg: 'rgba(255,101,132,0.15)', value: counters.members, label: 'Club Members', trend: '↑ 28 this month', trendColor: '#43e97b', trendBg: 'rgba(67,233,123,0.12)', delay: '0.29s' },
                { icon: '📋', bg: 'rgba(247,201,72,0.15)', value: counters.bookings, label: 'My Bookings', trend: '2 pending', trendColor: '#ff6584', trendBg: 'rgba(255,101,132,0.12)', delay: '0.36s' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', animation: `fadeUp 0.6s ${s.delay} both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{s.icon}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: s.trendBg, color: s.trendColor }}>{s.trend}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2rem', letterSpacing: -1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
              <div>
                {/* Chart */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, marginBottom: 20, animation: 'fadeUp 0.6s 0.35s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>📊 Bookings This Week</div>
                    <a href="#" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>View report →</a>
                  </div>
                  <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 4px' }}>
                    {bars.map((b, i) => (
                      <div key={i} style={{ flex: 1, height: b.h, borderRadius: '6px 6px 0 0', background: b.active ? 'linear-gradient(to top,#6c63ff,#ff6584)' : 'rgba(108,99,255,0.3)', transition: 'all 0.4s' }}
                        onMouseEnter={e => { if (!b.active) e.currentTarget.style.background = 'var(--accent)' }}
                        onMouseLeave={e => { if (!b.active) e.currentTarget.style.background = 'rgba(108,99,255,0.3)' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, padding: '0 4px' }}>
                    {bars.map(b => <div key={b.day} style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'var(--muted)' }}>{b.day}</div>)}
                  </div>
                </div>

                {/* Venues */}
                <div style={{ animation: 'fadeUp 0.6s 0.4s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>🏛️ Venue Availability</div>
                    <Link href="/venues" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>See all →</Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                    {venues.map(v => (
                      <div key={v.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.3s', borderLeft: `3px solid ${v.status === 'free' ? '#43e97b' : '#ff6584'}` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateX(3px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}>
                        <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{v.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{v.cap}</div>
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.5px', background: v.status === 'free' ? 'rgba(67,233,123,0.12)' : 'rgba(255,101,132,0.12)', color: v.status === 'free' ? '#43e97b' : '#ff6584', flexShrink: 0 }}>{v.status === 'free' ? 'Free' : 'Busy'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events */}
                <div style={{ animation: 'fadeUp 0.6s 0.5s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>🎉 Upcoming Events</div>
                    <a href="#" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>See all →</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {events.map(ev => (
                      <div key={ev.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', lineHeight: 1, color: 'var(--accent)' }}>{ev.day}</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ev.month}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 3 }}>{ev.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{ev.venue}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: ev.tagBg, color: ev.tagColor }}>{ev.tag}</span>
                          </div>
                        </div>
                        <button onClick={() => handleRsvp(ev.id)} style={{ padding: '6px 14px', borderRadius: 8, background: rsvp[ev.id] ? 'rgba(67,233,123,0.15)' : 'rgba(108,99,255,0.12)', border: `1px solid ${rsvp[ev.id] ? 'rgba(67,233,123,0.3)' : 'rgba(108,99,255,0.2)'}`, color: rsvp[ev.id] ? '#43e97b' : 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, cursor: 'none', transition: 'all 0.25s', flexShrink: 0 }}>
                          {rsvp[ev.id] ? '✓ Going' : 'RSVP'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Quick book */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.3s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>⚡ Quick Book</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <select value={bookVenue} onChange={e => setBookVenue(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0ff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                      <option value="">🏛️ Select Venue</option>
                      <option>Mini Hall - 1</option><option>J.C. Bose Hall</option><option>Faraday Hall</option><option>Main Auditorium</option>
                    </select>
                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none' }} />
                    <select style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f0f0ff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                      <option value="">🎯 Purpose</option>
                      <option>Club Meeting</option><option>Hackathon</option><option>Workshop</option><option>Cultural Event</option>
                    </select>
                    <Link href="/venues" style={{ padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#9b55ff)', border: 'none', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', cursor: 'none', transition: 'all 0.3s', textAlign: 'center', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                      Book a Venue →
                    </Link>
                  </div>
                </div>

                {/* Announcements */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.35s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem' }}>📢 Announcements</div>
                    <a href="#" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>See all →</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {announcements.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.25s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.08)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, marginTop: 5, flexShrink: 0 }} />
                        <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                          <strong style={{ display: 'block', marginBottom: 2, fontSize: '0.83rem' }}>{a.title}</strong>
                          {a.desc}
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 3 }}>🕐 {a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.4s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>⚡ Recent Activity</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {activity.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: a.avBg, color: a.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-syne)', flexShrink: 0 }}>{a.av}</div>
                        <div style={{ fontSize: '0.8rem', lineHeight: 1.5, flex: 1 }}>
                          {a.text}
                          <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{a.time}</div>
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

      {bookToast && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.88rem', color: '#43e97b', zIndex: 1000, animation: 'fadeUp 0.5s both' }}>
          ✅ Booking request submitted!
        </div>
      )}

      <style>{`
        @keyframes barGrow { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
      `}</style>
    </>
  )
}