'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Admin() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [activeTab, setActiveTab] = useState('bookings')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' })
  const [counters, setCounters] = useState({ users: 0, approved: 0, pending: 0, clubs: 0, events: 0 })

  const [bookings, setBookings] = useState([
    { id: 1, user: 'Sriram', av: 'S', avClass: 'p', club: 'IEEE Club', venue: 'Faraday Hall', date: 'Mar 15', purpose: 'Workshop', status: 'pending' },
    { id: 2, user: 'Priya', av: 'P', avClass: 'g', club: 'Cultural Club', venue: 'Mini Hall - 1', date: 'Mar 12', purpose: 'Cultural Fest', status: 'approved' },
    { id: 3, user: 'Rahul', av: 'R', avClass: 'r', club: 'Sports Club', venue: 'Main Auditorium', date: 'Mar 20', purpose: 'Sports Meet', status: 'pending' },
    { id: 4, user: 'Ananya', av: 'A', avClass: 'y', club: 'Coding Club', venue: 'J.C. Bose Hall', date: 'Mar 8', purpose: 'Hackathon', status: 'approved' },
    { id: 5, user: 'Kiran', av: 'K', avClass: 'c', club: 'Music Club', venue: 'Hippocrates Aud.', date: 'Mar 10', purpose: 'Concert', status: 'rejected' },
    { id: 6, user: 'Divya', av: 'D', avClass: 'p', club: 'Dance Club', venue: 'G.D. Naidu Hall', date: 'Mar 22', purpose: 'Dance Show', status: 'pending' },
  ])

  const [approvals, setApprovals] = useState([
    { id: 1, icon: '🏛️', venue: 'Faraday Hall', meta: 'Sriram · Mar 15 · Workshop', bg: 'rgba(108,99,255,0.15)' },
    { id: 2, icon: '🏟️', venue: 'Main Auditorium', meta: 'Rahul · Mar 20 · Sports', bg: 'rgba(255,101,132,0.15)' },
    { id: 3, icon: '🏗️', venue: 'G.D. Naidu Hall', meta: 'Divya · Mar 22 · Dance', bg: 'rgba(247,201,72,0.15)' },
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

    // Counters
    const targets = { users: 248, approved: 9, pending: 5, clubs: 50, events: 12 }
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1200, 1), e = 1 - Math.pow(1 - p, 4)
      setCounters({ users: Math.floor(e * targets.users), approved: Math.floor(e * targets.approved), pending: Math.floor(e * targets.pending), clubs: Math.floor(e * targets.clubs), events: Math.floor(e * targets.events) })
      if (p < 1) requestAnimationFrame(step); else setCounters(targets)
    }
    setTimeout(() => requestAnimationFrame(step), 300)

    // Health bars
    setTimeout(() => {
      ['hb1', 'hb2', 'hb3', 'hb4'].forEach((id, i) => {
        const el = document.getElementById(id)
        if (el) el.style.width = ['98%', '95%', '67%', '100%'][i]
      })
    }, 600)

    return () => document.removeEventListener('mousemove', move)
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000)
  }

  const approveBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b))
    showToast('✅ Booking approved!')
  }

  const rejectBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b))
    showToast('❌ Booking rejected.', 'error')
  }

  const quickApprove = (id) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
    showToast('✅ Approved!')
  }

  const quickReject = (id) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
    showToast('❌ Rejected.', 'error')
  }

  const avColors = {
    p: { bg: 'rgba(108,99,255,0.2)', color: '#6c63ff' },
    g: { bg: 'rgba(67,233,123,0.2)', color: '#43e97b' },
    r: { bg: 'rgba(255,101,132,0.2)', color: '#ff6584' },
    y: { bg: 'rgba(247,201,72,0.2)', color: '#f7c948' },
    c: { bg: 'rgba(0,210,255,0.2)', color: '#00d2ff' },
  }

  const statusBadge = (status) => ({
    padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
    background: status === 'approved' ? 'rgba(67,233,123,0.12)' : status === 'pending' ? 'rgba(247,201,72,0.12)' : 'rgba(255,101,132,0.12)',
    color: status === 'approved' ? '#43e97b' : status === 'pending' ? '#f7c948' : '#ff6584',
  })

  const filteredBookings = bookings.filter(b => filterStatus === 'all' || b.status === filterStatus)

  const tabs = [
    { id: 'bookings', label: '📋 Bookings', count: bookings.length },
    { id: 'users', label: '👥 Users', count: 248 },
    { id: 'clubs', label: '🏆 Clubs', count: 50 },
    { id: 'venues', label: '🏛️ Venues', count: 6 },
    { id: 'events', label: '🎉 Events', count: 12 },
  ]

  const stats = [
    { icon: '👥', bg: 'rgba(108,99,255,0.15)', value: counters.users, label: 'Total Users', trend: '↑ 28', tUp: true, delay: '0.1s' },
    { icon: '✅', bg: 'rgba(67,233,123,0.15)', value: counters.approved, label: 'Approved Today', trend: '↑ 3', tUp: true, delay: '0.15s' },
    { icon: '⏳', bg: 'rgba(255,101,132,0.15)', value: counters.pending, label: 'Pending Approvals', trend: 'Action needed', tUp: false, delay: '0.2s' },
    { icon: '🏆', bg: 'rgba(247,201,72,0.15)', value: counters.clubs, label: 'Active Clubs', trend: '↑ 2 new', tUp: true, delay: '0.25s' },
    { icon: '🎉', bg: 'rgba(0,210,255,0.15)', value: counters.events, label: 'Upcoming Events', trend: 'This month', tUp: true, delay: '0.3s' },
  ]

  const users = [
    { av: 'S', avClass: 'p', name: 'Sriram', email: 'sr1234@srmist.edu.in', role: 'Club Head', club: 'IEEE', joined: 'Jan 2024' },
    { av: 'P', avClass: 'g', name: 'Priya', email: 'pr5678@srmist.edu.in', role: 'Student', club: 'Cultural', joined: 'Feb 2024' },
    { av: 'R', avClass: 'r', name: 'Rahul', email: 'rk9012@srmist.edu.in', role: 'Club Head', club: 'Sports', joined: 'Jan 2024' },
    { av: 'A', avClass: 'y', name: 'Ananya', email: 'an3456@srmist.edu.in', role: 'Admin', club: 'Coding', joined: 'Dec 2023' },
    { av: 'K', avClass: 'c', name: 'Kiran', email: 'ki7890@srmist.edu.in', role: 'Student', club: 'Music', joined: 'Mar 2024' },
  ]

  const roleBadge = (role) => ({
    padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600,
    background: role === 'Admin' ? 'rgba(0,210,255,0.12)' : role === 'Club Head' ? 'rgba(255,101,132,0.12)' : 'rgba(108,99,255,0.12)',
    color: role === 'Admin' ? '#00d2ff' : role === 'Club Head' ? '#ff6584' : '#6c63ff',
  })

  const venuesList = [
    { emoji: '🏟️', name: 'Main Auditorium', cap: '2,000', status: 'Occupied', bookings: 12 },
    { emoji: '🎭', name: 'Mini Hall - 1', cap: '500', status: 'Available', bookings: 8 },
    { emoji: '🔬', name: 'J.C. Bose Hall', cap: '800', status: 'Available', bookings: 5 },
    { emoji: '⚡', name: 'Faraday Hall', cap: '600', status: 'Available', bookings: 7 },
    { emoji: '🏗️', name: 'G.D. Naidu Hall', cap: '1,000', status: 'Occupied', bookings: 9 },
    { emoji: '🏥', name: 'Hippocrates Aud.', cap: '1,200', status: 'Occupied', bookings: 11 },
  ]

  const thStyle = { padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid var(--border)' }
  const tdStyle = { padding: '13px 14px', fontSize: '0.83rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }
  const actBtn = (color, hoverBg) => ({ width: 28, height: 28, borderRadius: 7, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', cursor: 'none', transition: 'all 0.2s', background: `${color}22`, color })

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto' }}>
          <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem' }}>SRMIST Portal<span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif' }}>Club Management System</span></div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.25)', borderRadius: 100, fontSize: '0.65rem', color: '#ff6584', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', margin: '12px 20px 0' }}>⚙️ Admin Mode</div>
          <div style={{ padding: '14px 18px', margin: 12, background: 'rgba(255,101,132,0.07)', border: '1px solid rgba(255,101,132,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#ff6584,#f7c948)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, flexShrink: 0 }}>A</div>
            <div><strong style={{ display: 'block', fontSize: '0.85rem' }}>Admin</strong><span style={{ fontSize: '0.72rem', color: '#ff6584' }}>● Super Admin</span></div>
          </div>
          <nav style={{ padding: '16px 12px', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '0 12px', margin: '8px 0 8px' }}>Admin</div>
            {[
              { icon: '⚙️', label: 'Admin Panel', href: '/admin', active: true },
              { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
              { icon: '👥', label: 'All Users', href: '#' },
              { icon: '📋', label: 'All Bookings', href: '#' },
              { icon: '🏛️', label: 'Venues', href: '/venues' },
              { icon: '🎉', label: 'Events', href: '#' },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: item.active ? 'var(--text)' : 'var(--muted)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', marginBottom: 2, background: item.active ? 'rgba(255,101,132,0.12)' : 'transparent', borderLeft: item.active ? '3px solid #ff6584' : '3px solid transparent', transition: 'all 0.25s' }}>
                <span style={{ fontSize: '1.05rem', width: 20, textAlign: 'center' }}>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => window.location.href = '/login'} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, color: 'var(--muted)', fontSize: '0.88rem', cursor: 'none', background: 'none', border: 'none', width: '100%', fontFamily: 'DM Sans,sans-serif' }}>🚪 Logout</button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 36px', height: 68, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem' }}>Admin Panel ⚙️</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Full system control — SRMIST Club Portal</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ color: 'var(--muted)' }}>🔍</span>
                <input type="text" placeholder="Search users, bookings..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', width: 180, caretColor: 'var(--accent)' }} />
              </div>
              <button onClick={() => setModal(true)} style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', fontWeight: 600, cursor: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>➕ Add User</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '20px 36px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: '10px 10px 0 0', fontFamily: 'DM Sans,sans-serif', fontSize: '0.85rem', fontWeight: 600, color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)', background: activeTab === tab.id ? 'rgba(255,101,132,0.08)' : 'none', border: 'none', cursor: 'none', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 8, borderBottom: activeTab === tab.id ? '2px solid #ff6584' : '2px solid transparent' }}>
                {tab.label} <span style={{ padding: '2px 7px', borderRadius: 100, fontSize: '0.68rem', background: 'rgba(255,101,132,0.2)', color: '#ff6584' }}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: '28px 36px', flex: 1 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'all 0.35s', animation: `fadeUp 0.6s ${s.delay} both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{s.icon}</div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: s.tUp ? 'rgba(67,233,123,0.12)' : 'rgba(255,101,132,0.12)', color: s.tUp ? '#43e97b' : '#ff6584' }}>{s.trend}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: -1, marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Panel grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

              {/* Left - tables */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.2s both' }}>

                {/* Bookings tab */}
                {activeTab === 'bookings' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>📋 Venue Bookings</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['all', 'pending', 'approved'].map(s => (
                          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '7px 14px', borderRadius: 8, background: filterStatus === s ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${filterStatus === s ? 'var(--accent)' : 'var(--border)'}`, color: filterStatus === s ? 'var(--text)' : 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', cursor: 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr>
                          {['Club / User', 'Venue', 'Date', 'Purpose', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {filteredBookings.map(b => (
                            <tr key={b.id} style={{ transition: 'background 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                              onMouseLeave={e => e.currentTarget.style.background = ''}>
                              <td style={tdStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: 8, background: avColors[b.avClass].bg, color: avColors[b.avClass].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-syne)', flexShrink: 0 }}>{b.av}</div>
                                  <div><div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{b.user}</div><div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{b.club}</div></div>
                                </div>
                              </td>
                              <td style={tdStyle}>{b.venue}</td>
                              <td style={tdStyle}>{b.date}</td>
                              <td style={tdStyle}>{b.purpose}</td>
                              <td style={tdStyle}><span style={statusBadge(b.status)}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                              <td style={tdStyle}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  {b.status === 'pending' && <>
                                    <button onClick={() => approveBooking(b.id)} style={actBtn('#43e97b')} title="Approve">✓</button>
                                    <button onClick={() => rejectBooking(b.id)} style={actBtn('#ff6584')} title="Reject">✗</button>
                                  </>}
                                  <button style={actBtn('#6c63ff')} title="View">👁</button>
                                  {b.status !== 'pending' && <button style={actBtn('#f7c948')} title="Edit">✏️</button>}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Users tab */}
                {activeTab === 'users' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>👥 All Users</div>
                      <button onClick={() => setModal(true)} style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', fontWeight: 600, cursor: 'none' }}>➕ Add User</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>{['User', 'Email', 'Role', 'Club', 'Joined', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.name} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: avColors[u.avClass].bg, color: avColors[u.avClass].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-syne)', flexShrink: 0 }}>{u.av}</div><strong style={{ fontSize: '0.83rem' }}>{u.name}</strong></div></td>
                            <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: '0.78rem' }}>{u.email}</td>
                            <td style={tdStyle}><span style={roleBadge(u.role)}>{u.role}</span></td>
                            <td style={tdStyle}>{u.club}</td>
                            <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: '0.78rem' }}>{u.joined}</td>
                            <td style={tdStyle}><div style={{ display: 'flex', gap: 6 }}><button style={actBtn('#f7c948')}>✏️</button><button style={actBtn('#ff6584')}>🗑</button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Venues tab */}
                {activeTab === 'venues' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem' }}>🏛️ Manage Venues</div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>{['Venue', 'Capacity', 'Status', 'Bookings', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                      <tbody>
                        {venuesList.map(v => (
                          <tr key={v.name} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: '1.2rem' }}>{v.emoji}</span><strong style={{ fontSize: '0.83rem' }}>{v.name}</strong></div></td>
                            <td style={tdStyle}>{v.cap}</td>
                            <td style={tdStyle}><span style={{ ...statusBadge(v.status === 'Available' ? 'approved' : 'rejected') }}>{v.status}</span></td>
                            <td style={tdStyle}>{v.bookings} total</td>
                            <td style={tdStyle}><div style={{ display: 'flex', gap: 6 }}><button style={actBtn('#6c63ff')}>👁</button><button style={actBtn('#f7c948')}>✏️</button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Clubs & Events placeholder */}
                {(activeTab === 'clubs' || activeTab === 'events') && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>{activeTab === 'clubs' ? '🏆' : '🎉'}</div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--text)' }}>{activeTab === 'clubs' ? 'Clubs Management' : 'Events Management'}</div>
                    <div style={{ fontSize: '0.88rem' }}>Coming soon — connect Supabase to load live data!</div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Pending approvals */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.3s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>⏳ Pending Approvals</div>
                  {approvals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '0.85rem' }}>✅ All caught up!</div>
                  ) : approvals.map(a => (
                    <div key={a.id} style={{ display: 'flex', gap: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 10, transition: 'all 0.25s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.06)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{a.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.83rem', marginBottom: 2 }}>{a.venue}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{a.meta}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <button onClick={() => quickApprove(a.id)} style={{ padding: '4px 10px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 6, color: '#43e97b', fontSize: '0.7rem', fontWeight: 600, cursor: 'none', transition: 'all 0.2s' }}>✓ Yes</button>
                        <button onClick={() => quickReject(a.id)} style={{ padding: '4px 10px', background: 'rgba(255,101,132,0.12)', border: '1px solid rgba(255,101,132,0.2)', borderRadius: 6, color: '#ff6584', fontSize: '0.7rem', fontWeight: 600, cursor: 'none', transition: 'all 0.2s' }}>✗ No</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* System health */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: 22, animation: 'fadeUp 0.6s 0.35s both' }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>🖥️ System Health</div>
                  {[
                    { label: 'Database', id: 'hb1', color: '#43e97b', val: '98%' },
                    { label: 'API Server', id: 'hb2', color: '#43e97b', val: '95%' },
                    { label: 'Storage', id: 'hb3', color: '#f7c948', val: '67%' },
                    { label: 'Auth Service', id: 'hb4', color: '#43e97b', val: '100%' },
                  ].map(h => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.78rem', flex: 1 }}>{h.label}</div>
                      <div style={{ width: 90, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                        <div id={h.id} style={{ height: '100%', borderRadius: 10, background: h.color, width: '0%', transition: 'width 1.5s cubic-bezier(0.16,1,0.3,1)' }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, width: 36, textAlign: 'right', color: h.color }}>{h.val}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {modal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setModal(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s both' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: 460, maxWidth: '90vw', animation: 'popIn 0.35s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.2rem', marginBottom: 6 }}>➕ Add New User</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: 24 }}>Fill in the details to create a new account.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[['First Name', 'First name'], ['Last Name', 'Last name']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                </div>
              ))}
            </div>
            {[['Email', 'email', 'user@srmist.edu.in'], ['Role', 'select', ''], ['Department', 'select', '']].map(([label, type, ph]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</label>
                {type === 'select' ? (
                  <select style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none', WebkitAppearance: 'none', cursor: 'none' }}>
                    {label === 'Role' ? <><option>Student</option><option>Club Head</option><option>Admin</option></> : <><option>Computer Science</option><option>Electronics</option><option>Mechanical</option></>}
                  </select>
                ) : (
                  <input type={type} placeholder={ph} style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', outline: 'none' }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', cursor: 'none' }}>Cancel</button>
              <button onClick={() => { setModal(false); showToast('✅ User created successfully!') }} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--accent)', border: 'none', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.88rem', cursor: 'none', transition: 'all 0.25s' }}>Create User →</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, padding: '14px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', zIndex: 1000, animation: 'fadeUp 0.5s both', background: toast.type === 'success' ? 'rgba(67,233,123,0.15)' : 'rgba(255,101,132,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(67,233,123,0.3)' : 'rgba(255,101,132,0.3)'}`, color: toast.type === 'success' ? '#43e97b' : '#ff6584' }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.9) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
      `}</style>
    </>
  )
}