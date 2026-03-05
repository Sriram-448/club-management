import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { venue, date, timeSlot, purpose, club, userEmail } = body

    // Send email via Supabase edge function or just log for now
    // We'll use a simple fetch to a free email service (Resend)
    const adminEmail = process.env.ADMIN_EMAIL

    if (!process.env.RESEND_API_KEY) {
      // No email service configured yet — just log
      console.log('📧 New booking notification:', {
        venue, date, timeSlot, purpose, club, userEmail
      })
      return NextResponse.json({ success: true, message: 'Booking saved (email not configured)' })
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SRMIST Portal <noreply@srmist-portal.com>',
        to: adminEmail,
        subject: `🏛️ New Venue Booking Request — ${venue}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #f0f0ff; padding: 32px; border-radius: 16px;">
            <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 3px; border-radius: 12px; margin-bottom: 24px;">
              <div style="background: #0a0a1a; border-radius: 10px; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 1.4rem;">⚡ SRMIST Club Portal</h1>
                <p style="margin: 4px 0 0; color: #8888aa; font-size: 0.85rem;">New Venue Booking Request</p>
              </div>
            </div>

            <h2 style="color: #6c63ff; margin-bottom: 16px;">📋 Booking Details</h2>

            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ['🏛️ Venue', venue],
                ['📅 Date', date],
                ['🕐 Time Slot', timeSlot],
                ['🎯 Purpose', purpose],
                ['🏆 Club', club || 'Not specified'],
                ['👤 Requested By', userEmail],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding: 10px 0; color: #8888aa; font-size: 0.85rem; border-bottom: 1px solid #1a1a2e;">${label}</td>
                  <td style="padding: 10px 0; font-weight: 600; font-size: 0.85rem; border-bottom: 1px solid #1a1a2e;">${value}</td>
                </tr>
              `).join('')}
            </table>

            <div style="margin-top: 24px; padding: 16px; background: rgba(108,99,255,0.1); border-radius: 10px; border: 1px solid rgba(108,99,255,0.2);">
              <p style="margin: 0; font-size: 0.85rem; color: #a89cff;">
                ⚡ Login to your admin panel to approve or reject this booking:
              </p>
              <a href="https://srmist-club-portal.vercel.app/admin" 
                style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: linear-gradient(135deg, #6c63ff, #9b55ff); color: white; text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
                Go to Admin Panel →
              </a>
            </div>

            <p style="margin-top: 24px; font-size: 0.75rem; color: #555577; text-align: center;">
              SRMIST Club Management Portal • Auto-generated notification
            </p>
          </div>
        `
      })
    })

    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text())
      return NextResponse.json({ success: true, message: 'Booking saved but email failed' })
    }

    return NextResponse.json({ success: true, message: 'Booking saved and admin notified!' })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}