'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function TopBar({ title, subtitle, action, user }) {
  const avatarLetter = user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,3,10,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px 0 72px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {action && (
          <Link href={action.href} style={{ padding: '7px 14px', borderRadius: 9, background: 'var(--accent)', color: 'white', fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {action.label}
          </Link>
        )}
        <Link href="/notifications" style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', textDecoration: 'none' }}>
          🔔
          <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: '#ff6584', borderRadius: '50%', border: '2px solid var(--bg)' }} />
        </Link>
        <Link href="/profile" style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#6c63ff,#ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '0.85rem', color: 'white', textDecoration: 'none' }}>
          {avatarLetter}
        </Link>
      </div>
    </div>
  )
}