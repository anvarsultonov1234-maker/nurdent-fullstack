-- ==============================================================================
-- NurDent Dental Store - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (supabase.com -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    telegram_username TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Yangi', -- 'Yangi', 'Bog‘lanildi', 'Yetkazilmoqda', 'Yakunlandi', 'Bekor qilindi'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- 'equipment', 'sets', 'surgery', 'therapy', 'consumables'
    name_uz TEXT NOT NULL,
    name_ru TEXT,
    desc_uz TEXT,
    desc_ru TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    price_display_uz TEXT,
    price_display_ru TEXT,
    status TEXT NOT NULL DEFAULT 'in_stock', -- 'in_stock', 'on_order', 'out_of_stock'
    badge_uz TEXT,
    badge_ru TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for category search
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);

-- 3. Row Level Security (RLS) setup
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
    ON public.products FOR SELECT
    USING (true);

-- Products: Authenticated admin can insert/update/delete
DROP POLICY IF EXISTS "Authenticated admins can manage products" ON public.products;
CREATE POLICY "Authenticated admins can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Orders: Anyone can insert orders (e.g. from /api/order or public web client)
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Orders: Authenticated admin can view, update, delete orders
DROP POLICY IF EXISTS "Authenticated admins can view orders" ON public.orders;
CREATE POLICY "Authenticated admins can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated admins can update orders" ON public.orders;
CREATE POLICY "Authenticated admins can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can delete orders" ON public.orders;
CREATE POLICY "Authenticated admins can delete orders"
    ON public.orders FOR DELETE
    TO authenticated
    USING (true);

-- 4. Supabase Storage Bucket setup for product-images
-- Note: Create bucket 'product-images' with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for product-images
DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can upload to product-images" ON storage.objects;
CREATE POLICY "Authenticated users can upload to product-images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
CREATE POLICY "Authenticated users can update product-images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can delete product-images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product-images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
