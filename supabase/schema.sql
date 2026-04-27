-- =============================================
-- Gym Soul Nutritions â€” Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  city        TEXT,
  state       TEXT,
  pincode     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id              BIGSERIAL PRIMARY KEY,
  order_id        TEXT UNIQUE NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT,
  customer_phone  TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  pincode         TEXT,
  items           JSONB NOT NULL DEFAULT '[]',
  subtotal        NUMERIC(10,2) DEFAULT 0,
  shipping        NUMERIC(10,2) DEFAULT 0,
  discount        NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  payment_method  TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod','online')),
  payment_id      TEXT,
  status          TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','processing','shipped','delivered','cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders   ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: users can view their own; insert allowed for all (including guests)
CREATE POLICY "Users can view own orders"   ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create orders"    ON public.orders FOR INSERT WITH CHECK (true);

-- Admin: service role bypasses RLS automatically

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Done! âœ…
SELECT 'Schema created successfully!' AS message;
