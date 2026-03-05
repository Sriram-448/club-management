# ⚡ SRMIST Club Portal

A full-stack web application built to digitize and streamline club management at SRM Institute of Science and Technology. Students can book venues, view events, and manage their club activities — all from one platform.

🌐 **Live Demo:** https://srmist-club-portal.vercel.app

---

## 📸 Screenshots

| Dashboard | Venues | Admin Panel |
|---|---|---|
| Real-time stats and upcoming events | Browse and book campus venues | Approve or reject booking requests |

---

## 🚀 Features

- 🔐 **Authentication** — Secure login and registration with Supabase Auth
- 🏛️ **Venue Booking** — Browse all campus venues, check availability, and submit booking requests
- 🎉 **Events** — View upcoming club events and RSVP
- 📋 **My Bookings** — Track all your booking requests and their status
- 👤 **Profile** — Edit your name, username, and department
- 🔔 **Notifications** — Get updates on booking approvals and events
- ⚙️ **Admin Panel** — Approve/reject bookings and manage user roles
- 📱 **Mobile Responsive** — Works on all screen sizes with hamburger menu
- 🔒 **Role-Based Access** — Student, Club Head, and Admin roles with different permissions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (React) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Email | Resend API |
| Deployment | Vercel |
| Version Control | GitHub |

---

## 📁 Project Structure

```
club-management/
├── app/
│   ├── page.js              # Landing / Login page
│   ├── login/page.js        # Login page
│   ├── register/page.js     # Registration page
│   ├── dashboard/page.js    # Main dashboard
│   ├── venues/page.js       # Venue booking
│   ├── events/page.js       # Events listing
│   ├── bookings/page.js     # My bookings
│   ├── profile/page.js      # User profile
│   ├── notifications/page.js# Notifications
│   ├── admin/page.js        # Admin panel
│   └── api/
│       └── notify-booking/  # Email notification API
├── components/
│   ├── Sidebar.js           # Responsive sidebar with hamburger
│   └── TopBar.js            # Top navigation bar
├── proxy.js                 # Route protection middleware
└── .env.local               # Environment variables
```

---

## 🗄️ Database Schema

### `profiles` table
| Column | Type | Description |
|---|---|---|
| id | uuid | Foreign key to auth.users |
| full_name | text | User's full name |
| username | text | Unique username |
| email | text | Email address |
| department | text | Academic department |
| role | text | student / club-head / admin |

### `venues` table
| Column | Type | Description |
|---|---|---|
| id | int | Primary key |
| name | text | Venue name |
| emoji | text | Venue emoji icon |
| capacity | int | Max capacity |
| block | text | Campus block location |

### `bookings` table
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| venue_id | int | FK to venues |
| date | date | Booking date |
| time_slot | text | Selected time slot |
| duration | text | Booking duration |
| purpose | text | Event purpose |
| club | text | Club name |
| attendees | int | Expected attendees |
| status | text | pending / approved / rejected |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account
- A Vercel account (for deployment)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/club-management.git
cd club-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=your_admin_email@gmail.com
RESEND_API_KEY=your_resend_api_key
```

### 4. Set up Supabase
Run these SQL policies in your Supabase SQL editor:

```sql
-- Allow users to insert their own bookings
create policy "Users can insert bookings"
on bookings for insert
with check (auth.uid() = user_id);

-- Allow users to view their own bookings, admins view all
create policy "Admin can view all bookings"
on bookings for select
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
  or auth.uid() = user_id
);

-- Allow admins to update booking status
create policy "Admin can update bookings"
on bookings for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
```

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel auto-deploys in ~2 minutes.

---

## 🔒 Security

- **Row Level Security (RLS)** enforced at the database level in Supabase
- Admin role cannot be set from the registration form — only assignable from the Admin Panel
- All protected routes require authentication via `proxy.js`
- Passwords hashed and managed by Supabase Auth

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **Student** | Book venues, view events, manage own profile |
| **Club Head** | Same as student + manage club events |
| **Admin** | Approve/reject bookings, manage all users and roles |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is built for academic purposes at SRMIST.

---

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) — Backend and authentication
- [Vercel](https://vercel.com) — Deployment platform
- [Resend](https://resend.com) — Email notifications
- [Next.js](https://nextjs.org) — React framework
- [Google Fonts](https://fonts.google.com) — Syne and DM Sans fonts

---

Built with ❤️ for SRMIST
