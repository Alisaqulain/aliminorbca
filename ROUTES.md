# Railway Reservation System - All Routes

## 📍 Complete Route List

### 🏠 Public Pages

| Route | Path | Description |
|-------|------|-------------|
| **Home** | `/` | Landing page with hero section, features, and 3D train animation |
| **Login** | `/login` | User login page with animated form |
| **Signup** | `/signup` | User registration page with validation |

---

### 👤 Passenger/User Module

| Route | Path | Description |
|-------|------|-------------|
| **Dashboard** | `/passenger/dashboard` | Personalized dashboard with AI recommendations, upcoming journeys, and booking trends |
| **Search Trains** | `/passenger/search` | Smart train search with AI-powered predictive suggestions and popular routes |
| **Train Details** | `/passenger/trains/[id]` | Train detail page with 3D model, route map, schedule, and booking interface |
| **Booking** | `/passenger/booking` | Multi-step booking form (Passenger Details → Review → Payment) |
| **Ticket History** | `/passenger/history` | View all bookings with AI highlights for urgent journeys |
| **Profile** | `/passenger/profile` | User profile management with editable information |

**Dynamic Route:**
- `/passenger/trains/[id]` - Replace `[id]` with train ID (e.g., `/passenger/trains/1`)

---

### 🔐 Admin Module

| Route | Path | Description |
|-------|------|-------------|
| **Admin Login** | `/admin/login` | Admin authentication page |
| **Admin Dashboard** | `/admin/dashboard` | AI-powered analytics dashboard with revenue predictions and anomaly detection |
| **Manage Trains** | `/admin/trains` | Add, edit, delete trains with AI capacity recommendations |
| **Manage Bookings** | `/admin/bookings` | View and manage all bookings with AI insights and filters |
| **Reports** | `/admin/reports` | Automated reports with AI-generated insights and visualizations |

---

## 🔗 Navigation Flow

### Public Flow
```
Home (/) 
  ├── Login (/login) → Passenger Dashboard (/passenger/dashboard)
  └── Signup (/signup) → Passenger Dashboard (/passenger/dashboard)
```

### Passenger Flow
```
Dashboard (/passenger/dashboard)
  ├── Search Trains (/passenger/search)
  │   └── Train Details (/passenger/trains/[id])
  │       └── Booking (/passenger/booking)
  │           └── Ticket History (/passenger/history)
  ├── Ticket History (/passenger/history)
  └── Profile (/passenger/profile)
```

### Admin Flow
```
Admin Login (/admin/login)
  └── Admin Dashboard (/admin/dashboard)
      ├── Manage Trains (/admin/trains)
      ├── Manage Bookings (/admin/bookings)
      └── Reports (/admin/reports)
```

---

## 🎯 Quick Access Routes

### Most Used Routes
- **Home**: `http://localhost:3000/`
- **User Login**: `http://localhost:3000/login`
- **User Signup**: `http://localhost:3000/signup`
- **Passenger Dashboard**: `http://localhost:3000/passenger/dashboard`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

### Example Dynamic Routes
- **Train Detail**: `http://localhost:3000/passenger/trains/1`
- **Train Detail**: `http://localhost:3000/passenger/trains/2`
- **Train Detail**: `http://localhost:3000/passenger/trains/3`

---

## 📝 Route Structure

```
app/
├── page.tsx                    → / (Home)
├── login/
│   └── page.tsx               → /login
├── signup/
│   └── page.tsx               → /signup
├── passenger/
│   ├── dashboard/
│   │   └── page.tsx           → /passenger/dashboard
│   ├── search/
│   │   └── page.tsx           → /passenger/search
│   ├── trains/
│   │   └── [id]/
│   │       └── page.tsx      → /passenger/trains/[id]
│   ├── booking/
│   │   └── page.tsx           → /passenger/booking
│   ├── history/
│   │   └── page.tsx           → /passenger/history
│   └── profile/
│       └── page.tsx           → /passenger/profile
└── admin/
    ├── login/
    │   └── page.tsx           → /admin/login
    ├── dashboard/
    │   └── page.tsx           → /admin/dashboard
    ├── trains/
    │   └── page.tsx           → /admin/trains
    ├── bookings/
    │   └── page.tsx           → /admin/bookings
    └── reports/
        └── page.tsx           → /admin/reports
```

---

## 🚀 Testing Routes

To test all routes, start the development server:
```bash
npm run dev
```

Then navigate to:
- `http://localhost:3000` - Home page
- `http://localhost:3000/login` - Login page
- `http://localhost:3000/signup` - Signup page
- `http://localhost:3000/passenger/dashboard` - Passenger dashboard
- `http://localhost:3000/passenger/search` - Search trains
- `http://localhost:3000/passenger/trains/1` - Train details (example)
- `http://localhost:3000/admin/login` - Admin login
- `http://localhost:3000/admin/dashboard` - Admin dashboard

---

## 📌 Notes

- All routes are client-side rendered (using 'use client')
- Dynamic routes use `[id]` parameter
- Navigation uses Next.js `useRouter()` for programmatic navigation
- Links use Next.js `Link` component for client-side navigation
- All pages are responsive and mobile-friendly

