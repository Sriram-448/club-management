'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function Sidebar({ activePage = 'dashboard' }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        // Check localStorage cache first for instant display
        const cached = localStorage.getItem('userProfile')
        if (cached) setProfile(JSON.parse(cached))
        // Always fetch fresh from DB
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) {
          setProfile(data)
          localStorage.setItem('userProfile', JSON.stringify(data))
        }
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('userProfile')
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarLetter = fullName?.[0]?.toUpperCase() || 'U'
  const userRole = profile?.role || 'student'

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { id: 'venues', icon: '🏛️', label: 'Venues', href: '/venues' },
    { id: 'events', icon: '🎉', label: 'Events', href: '/events' },
    { id: 'bookings', icon: '📋', label: 'My Bookings', href: '/bookings' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', href: '/notifications', section: 'Account' },
    { id: 'profile', icon: '👤', label: 'Profile', href: '/profile', section: 'Account' },
    { id: 'admin', icon: '⚙️', label: 'Admin Panel', href: '/admin', section: 'Account' },
  ]

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>⚡</div>
        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.95rem' }}>SRMIST Portal
          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif' }}>Club Management System</span>
        </div>
        {/* Close button on mobile */}
        <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer', display: 'none' }} className="sidebar-close">✕</button>
      </div>

      {/* User card */}
      <div style={{ padding: '12px 16px', margin: '10px 10px 0', background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>{avatarLetter}</div>
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: 'block', fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</strong>
          <span style={{ fontSize: '0.68rem', color: '#43e97b', textTransform: 'capitalize' }}>● {userRole}</span>
        </div>
        <div style={{ marginLeft: 'auto', width: 7, height: 7, background: '#43e97b', borderRadius: '50%', flexShrink: 0, animation: 'blink 1.5s infinite' }} />
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        {['Main', 'Account'].map(section => (
          <div key={section}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '0 10px', margin: '14px 0 6px' }}>{section}</div>
            {navItems.filter(item => section === 'Main' ? !item.section : item.section === section).map(item => (
              <Link key={item.id} href={item.href} onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: activePage === item.id ? 'var(--text)' : 'var(--muted)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', marginBottom: 2, background: activePage === item.id ? 'rgba(108,99,255,0.15)' : 'transparent', borderLeft: activePage === item.id ? '3px solid var(--accent)' : '3px solid transparent', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1rem', width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: '#ff6584', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', width: '100%', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,101,132,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          🚪 Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button onClick={() => setOpen(true)} style={{ display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 200, width: 40, height: 40, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', cursor: 'pointer' }} className="hamburger">☰</button>

      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150, backdropFilter: 'blur(4px)' }} className="mobile-overlay" />
      )}

      {/* Desktop sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: 'var(--card)', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 160, overflowY: 'auto' }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (slide in) */}
      <aside style={{ width: 260, background: 'var(--card)', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: open ? 0 : -280, bottom: 0, zIndex: 160, overflowY: 'auto', transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)' }} className="mobile-sidebar">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.95rem' }}>⚡ SRMIST Portal</div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <SidebarContent />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
          .mobile-overlay { display: none !important; }
          .hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}