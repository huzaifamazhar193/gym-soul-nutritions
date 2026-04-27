# Gym Soul Nutritions â€” Setup Guide (Free: Supabase + Vercel)

## STEP 1 â€” Supabase Setup (Free Database)

1. Go to **https://supabase.com** â†’ Sign Up (Free)
2. Click **New Project** â†’ Give it a name (e.g., "GymSoul") â†’ Set password â†’ Create
3. Wait ~2 minutes for project to be ready
4. Go to **SQL Editor** (left sidebar) â†’ Paste the contents of `supabase/schema.sql` â†’ Click **Run**
5. Go to **Settings â†’ API**:
   - Copy **Project URL** â†’ this is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** â†’ this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role key** â†’ this is your `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 2 â€” Local Development

```bash
cd GymSoul-nextjs

# Copy env file
cp .env.local.example .env.local

# Edit .env.local with your Supabase keys
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
# SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Install dependencies
npm install

# Run locally
npm run dev

# Open http://localhost:3000
```

---

## STEP 3 â€” Deploy to Vercel (Free Hosting)

### Option A â€” GitHub (Recommended)
1. Create a GitHub account â†’ New Repository â†’ Upload all files
2. Go to **https://vercel.com** â†’ Sign Up with GitHub
3. Click **New Project** â†’ Import your GitHub repo
4. Add Environment Variables (same as .env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy** â†’ Done! Your site is live in ~2 minutes

### Option B â€” Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
# Follow the prompts, add env vars when asked
```

---

## STEP 4 â€” Supabase Auth Setup

1. In Supabase Dashboard â†’ **Authentication â†’ URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g., `https://GymSoul.vercel.app`)
3. Add to **Redirect URLs**: `https://GymSoul.vercel.app/**`

---

## Admin Panel Access

- URL: `https://yoursite.vercel.app/admin`
- Email: `admin@GymSoul.in`
- Password: `admin123`

> âš ï¸ Change these in `/app/admin/page.js` before going live!

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, products, testimonials |
| `/products` | All products with filters & search |
| `/product/[slug]` | Product detail page |
| `/cart` | Shopping cart with coupon |
| `/checkout` | Address + payment + order confirmation |
| `/auth` | Login & Register |
| `/profile` | User profile + wishlist |
| `/orders` | Order history & tracking |
| `/admin` | Owner/Admin dashboard |

---

## Coupon Codes (for testing)
- `SOULFIRST` â†’ 10% off
- `SAVE15`   â†’ 15% off

---

## Free Tier Limits
| Service | Free Limit |
|---------|-----------|
| Supabase | 500MB DB, 2GB bandwidth, 50,000 MAU |
| Vercel | 100GB bandwidth, unlimited deploys |

Both are more than enough to start!
