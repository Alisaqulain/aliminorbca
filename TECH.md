# AliRail – How the Website Works (Technology & Architecture)

This document explains **how the AliRail railway reservation website works**, which **technologies** are used, and **why** they were chosen.

---

## 1. Overview

**AliRail** is an AI-powered railway reservation system for India. Users can:

- **Search** trains by source, destination, and date  
- **Book** tickets and pay securely  
- **Manage** profile, view **My Tickets**, and get **notifications**  
- Use an **AI chat assistant** for help  

**Admins** can manage trains, bookings, users, and view **reports and analytics**.

The app is a **full-stack web application**: frontend (React/Next.js) and backend (Next.js API routes + MongoDB).

---

## 2. Tech Stack Summary

| Layer        | Technology        | Purpose |
|-------------|--------------------|--------|
| Framework   | **Next.js 14**     | React framework with SSR, API routes, file-based routing |
| UI          | **React 18**       | Components and state |
| Styling     | **Tailwind CSS**   | Utility-first CSS, dark theme |
| Animations  | **Framer Motion**  | Page and component animations |
| Charts      | **Recharts**       | Admin dashboards and reports |
| Database    | **MongoDB**        | Trains, users, bookings, notifications |
| ODM         | **Mongoose**       | Schema, validation, queries |
| Auth        | **JWT (jose)**     | Login/signup, protected routes |
| Passwords   | **bcryptjs**       | Hashing and verification |
| Payments    | **Razorpay-style** | Payment create/verify API |
| PDF/QR      | **jsPDF**, **qrcode** | Ticket download, QR codes |
| Email       | **Nodemailer**     | Optional emails (e.g. booking confirmations) |
| HTTP client | **Axios** (optional) / **fetch** | API calls from client |
| 3D (home)   | **Three.js**, **React Three Fiber**, **Drei** | Hero background on home page |
| Icons       | **Lucide React**   | UI icons |
| Forms       | **React Hook Form** + **Zod** + **@hookform/resolvers** | Validation and form state |

---

## 3. Why Each Technology?

### Next.js 14

- **Single codebase** for frontend and backend (API routes under `app/api/`).
- **File-based routing**: `app/passenger/search/page.tsx` → `/passenger/search`.
- **Server and client components**: API routes run on server; pages can be client-side for interactivity.
- **Built-in optimizations**: bundling, code splitting, env handling (`NEXT_PUBLIC_*`).

### React 18

- **Component-based UI**: reusable pieces (Navbar, Footer, AIChatAssistant, forms).
- **Hooks** for state (`useState`, `useEffect`) and auth (`useAuth`).

### Tailwind CSS

- **Fast styling** with utility classes (`text-white`, `bg-purple-900`, `rounded-xl`).
- **Consistent look** and **dark theme** (purple/indigo gradient) across the site.
- **Responsive** design with `md:`, `lg:` breakpoints.

### Framer Motion

- **Smooth animations** (page load, hover, modals) for a more polished UX.
- **AnimatePresence** for enter/exit (e.g. dropdowns, accordions).

### Recharts

- **Charts** on admin pages: revenue trend, bookings by class, route performance.
- **Declarative** API (Line, Bar, Area, Pie) and **ResponsiveContainer** for different screen sizes.

### MongoDB + Mongoose

- **Document store**: trains, users, bookings, notifications, stations fit naturally as JSON-like documents.
- **Mongoose**: schemas, validation, and easy queries (e.g. `Train.find()`, `Booking.find({ userId })`).
- **No separate backend server**: Next.js API routes connect to MongoDB and return JSON.

### JWT (jose) + Cookies

- **Stateless auth**: after login, server issues a JWT; client sends it (e.g. via cookie or header).
- **jose** is used for signing/verifying tokens on the server.
- **Why JWT**: works well with API routes and avoids server-side sessions; supports roles (passenger vs admin).

### bcryptjs

- **Passwords are never stored in plain text**; only hashes are saved.
- **bcrypt** is a standard, slow-by-design algorithm suitable for password hashing.

### jsPDF + qrcode

- **Ticket PDF**: generate and download ticket with PNR, journey details, passenger info.
- **QR code**: encode PNR or booking ID for quick verification.

### Nodemailer

- **Optional**: send booking confirmation or password-reset emails; can be wired to SMTP in env.

### Three.js / React Three Fiber / Drei

- **Home page hero**: 3D or animated background for a more “advanced” first impression.
- **R3F** and **Drei** make it easier to use Three.js in React.

### React Hook Form + Zod + @hookform/resolvers

- **Less re-renders** than controlled inputs for every keystroke.
- **Zod** defines schema and validation rules; **resolvers** connect Zod to RHF for clear error messages.

---

## 4. How the Website Works (Flow)

### 4.1 Authentication

1. **Signup** (`/signup`): name, email, password (optional phone) → `POST /api/auth/signup` → user created in DB, JWT set (e.g. in HTTP-only cookie).
2. **Login** (`/login` or `/login/admin`): email + password → `POST /api/auth/login` → server verifies with bcrypt, issues JWT.
3. **Session**: `GET /api/auth/me` returns current user if a valid token is sent; **AuthContext** stores `user` and provides `login`, `logout`, `signup`.
4. **Protected routes**: passenger pages (Dashboard, My Tickets, Profile, Notifications) and admin pages check `user`; if not logged in, redirect to login or show only public links (e.g. Search Trains, Login, Signup).

**Profile and Notifications** are shown only when the user is **logged in** (in Navbar and Footer). If not logged in, the footer shows only public links (Home, About, Contact, FAQ, Search Trains); Navbar shows Search Trains + Login/Signup.

### 4.2 Passenger Flow (Book a Train)

1. **Search**: `/passenger/search` → source, destination, date → `GET /api/trains?source=...&destination=...&date=...` → list of trains.
2. **Select train**: user picks a train → `/passenger/trains/[id]` → `GET /api/trains/[id]?date=...` → availability (e.g. booked seats).
3. **Booking**: `/passenger/booking` → passenger details, class → `POST /api/bookings` → booking created, amount returned; if payment required → redirect to payment.
4. **Payment**: `/payment` → create order (e.g. Razorpay-style) → `POST /api/payments/create` → user pays → `POST /api/payments/verify` → booking confirmed, notification created.
5. **Ticket**: user sees ticket in **My Tickets** (`/passenger/history`) or `/ticket/[id]`; can download PDF and see QR code.

### 4.3 Admin Flow

1. **Login**: admin logs in at `/login/admin` (or login with admin role).
2. **Dashboard**: `/admin/dashboard` → `GET /api/admin/stats` → overview, AI insights, charts.
3. **Trains**: `/admin/trains` → CRUD via `GET/POST/PUT/DELETE /api/trains` and `/api/trains/[id]`.
4. **Bookings**: `/admin/bookings` → list/filter bookings (data from bookings API or admin endpoints).
5. **Reports**: `/admin/reports` → `GET /api/admin/reports` → revenue, routes, bookings by class.
6. **Users**: `/admin/users` → `GET /api/admin/users`, block/unblock via `PATCH /api/admin/users`.

### 4.4 AI Features

- **AI Chat Assistant** (component): rule-based or API-backed replies for “search train”, “my tickets”, “PNR”, “cancel”, “payment”, etc.; suggests links (Search, My Tickets, Profile).
- **AI suggest** (optional): `POST /api/ai/suggest` with source/destination/preference for smarter train suggestions.

---

## 5. Project Structure (Important Paths)

```
aliminorbca/
├── app/
│   ├── layout.tsx              # Root layout (AuthProvider, ToastProvider, Footer)
│   ├── page.tsx                 # Home
│   ├── about/page.tsx           # About
│   ├── contact/page.tsx         # Contact
│   ├── faq/page.tsx             # FAQ
│   ├── login/page.tsx           # Passenger login
│   ├── login/admin/page.tsx     # Admin login
│   ├── signup/page.tsx          # Signup
│   ├── passenger/
│   │   ├── dashboard/page.tsx
│   │   ├── search/page.tsx
│   │   ├── trains/[id]/page.tsx
│   │   ├── booking/page.tsx
│   │   ├── history/page.tsx     # My Tickets
│   │   └── profile/page.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── trains/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── reports/page.tsx
│   │   └── users/page.tsx
│   ├── payment/page.tsx
│   ├── ticket/[id]/page.tsx
│   ├── notifications/page.tsx
│   └── api/                     # Backend API routes
│       ├── auth/                # login, signup, logout, me, profile, change-password
│       ├── trains/
│       ├── bookings/
│       ├── payments/
│       ├── notifications/
│       ├── stations/
│       ├── ai/
│       └── admin/
├── components/
│   ├── Navbar.tsx               # Nav (links + notifications + profile when logged in)
│   ├── Footer.tsx                # Footer (Profile/Notifications/My Tickets only when logged in)
│   ├── AIChatAssistant.tsx
│   ├── ToastProvider.tsx
│   └── ...
├── contexts/
│   └── AuthContext.tsx          # user, login, logout, signup
├── lib/
│   └── api.ts                   # fetch wrappers (authApi, trainsApi, bookingsApi, ...)
└── .env.local                   # MongoDB, NEXT_PUBLIC_APP_URL, etc.
```

---

## 6. Environment Variables

- **MongoDB**: connection string for database.
- **JWT secret**: used to sign/verify tokens.
- **NEXT_PUBLIC_APP_URL**: base URL for API calls from server (e.g. `http://localhost:3000`).
- **Payment keys** (if using Razorpay): public key for client, secret for server.
- **Email** (optional): SMTP for Nodemailer.

See `.env.example` for a template.

---

## 7. UX: When Profile and Notifications Show

- **Navbar (passenger)**:  
  - **Logged in**: Dashboard, Search Trains, My Tickets, Profile + notification bell + profile dropdown (name, Profile link, Logout).  
  - **Not logged in**: Only **Search Trains** in nav links; **Login** and **Signup** buttons instead of notifications and profile dropdown.

- **Footer**:  
  - **Logged in**: Quick links include **My Tickets**, **Profile**, **Notifications**.  
  - **Not logged in**: Quick links are **Home**, **About**, **Contact**, **FAQ**, **Search Trains** only (no My Tickets, Profile, Notifications).

This avoids showing account-specific options to guests and improves clarity.

---

## 8. Summary

| What           | How / Tech |
|----------------|------------|
| Frontend       | Next.js 14 + React 18 + Tailwind + Framer Motion |
| Backend        | Next.js API routes (same app) |
| Database       | MongoDB + Mongoose |
| Auth           | JWT (jose) + bcryptjs, AuthContext for client state |
| Payments       | Create/verify API (Razorpay-style) |
| Tickets        | jsPDF + qrcode |
| Admin analytics| Recharts, admin API for stats/reports/users |
| AI             | Chat assistant component + optional suggest API |
| Profile/Notif  | Shown only when user is logged in (Navbar + Footer) |

The site is built so that **one codebase** serves both the UI and the API, with a **clear split** between public pages (Home, About, Contact, FAQ, Search) and **login-only** features (Dashboard, My Tickets, Profile, Notifications).
