# Deployment Guide – Railway Reservation System

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Razorpay/Stripe for live payments
- (Optional) SMTP for email

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/railway_reservation
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/railway_reservation

JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRE=7d

NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional – email (booking confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Optional – Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Local Development

1. **Install dependencies**
   ```bash
   cd aliminorbca
   npm install
   ```

2. **Start MongoDB** (if local)
   ```bash
   # macOS/Linux: mongod
   # Windows: start MongoDB service
   ```

3. **Default admin account**
   - On first API request that uses the DB, a default admin is created automatically.
   - **Email:** `ali@gmail.com` | **Password:** `Ali@2003`
   - Log in at `/admin/login` to access the admin panel.

4. **Seed stations and sample trains (recommended)**
   - **Stations** (for search autocomplete): `POST /api/stations/seed` (e.g. from browser console or Postman).
   - **Sample trains** (for search results): `POST /api/seed/trains` (adds trains only if none exist).
   - Example from browser (while logged in as admin): `fetch('/api/stations/seed', { method: 'POST' }).then(r => r.json()).then(console.log)`

5. **Run dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push repo to GitHub.
2. In Vercel: New Project → Import repo.
3. Set **Root Directory** to `aliminorbca` if the app lives in a subfolder.
4. Add environment variables (MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_APP_URL).
5. Deploy.

MongoDB must be reachable from Vercel (use MongoDB Atlas with a public IP or Vercel’s allowed IPs).

## Deploy to Railway / Render / Other Node hosts

- **Build:** `npm run build`
- **Start:** `npm start`
- Set env vars in the host’s dashboard.
- Use a production MongoDB URI (e.g. Atlas).

## Security Checklist

- [ ] Strong `JWT_SECRET` (min 32 chars)
- [ ] `NEXT_PUBLIC_APP_URL` matches actual domain
- [ ] MongoDB not exposed to public; use IP allowlist or VPC
- [ ] HTTPS only in production
- [ ] Rate limiting enabled (included in API routes)

## Seed Users (after first deploy)

Create admin and test user via signup or a one-off seed:

- **Admin:** Sign up with email e.g. `admin@yourdomain.com`, then set `role: 'admin'` in MongoDB for that user.
- Or run the seed script against production DB once (with production `MONGODB_URI` in `.env`).
