# Where to Add MongoDB URL

1. **Create a `.env` file** in the project root (same folder as `package.json`):
   ```
   aliminorbca/
   ├── .env          ← create this file
   ├── .env.example
   ├── package.json
   └── ...
   ```

2. **Add your MongoDB URL** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/railway_reservation
   ```
   - **Local MongoDB:** `mongodb://localhost:27017/railway_reservation`
   - **MongoDB Atlas:** `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/railway_reservation?retryWrites=true&w=majority`

3. **Optional – copy from example:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `MONGODB_URI` (and `JWT_SECRET` for production).

4. **Restart the dev server** after changing `.env`:
   ```bash
   npm run dev
   ```

The app reads `MONGODB_URI` in `lib/db.ts` when connecting to MongoDB.

### Test the connection

- Open **http://localhost:3000/api/db-test** in your browser (with the dev server running).
- You should see `{"connected":true,"message":"MongoDB connected successfully."}` if the URL is correct.
- If your password contains **@** or **#**, encode them in the URI: `@` → `%40`, `#` → `%23` (e.g. `Ali%402003`).
