/*
# Create site content table, storage bucket, and realtime publication

## Overview
This migration sets up everything needed for a one-page metal-selling website with a real-time admin panel.
The admin can edit hero text, images, section colors, logo, contact info, about text, and more —
all changes appear instantly on the live site via Supabase Realtime.

## New Tables
- `site_content`
  - `id` (int, primary key, always 1 — single row design)
  - `data` (jsonb, holds the entire editable site content as a JSON object)
  - `updated_at` (timestamptz, auto-updated on every change)

## Storage
- Creates a public bucket `site-assets` for uploaded images (logo, hero image, about image)
- Adds a public read policy and an authenticated write policy

## Security (RLS)
- `site_content`: single-tenant, no auth — anon + authenticated can SELECT (the public site needs to read it).
  Only authenticated users can INSERT/UPDATE/DELETE (the admin panel will use anon key for simplicity in this demo,
  so anon is also allowed to write).
- Storage: public read, anon + authenticated write.

## Realtime
- Adds `site_content` to the realtime publication so the frontend can subscribe to changes.
*/

-- ============================================================
-- 1. site_content table (single-row design)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_site_content" ON site_content;
CREATE POLICY "read_site_content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "write_site_content" ON site_content;
CREATE POLICY "write_site_content"
  ON site_content FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "update_site_content" ON site_content;
CREATE POLICY "update_site_content"
  ON site_content FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_site_content" ON site_content;
CREATE POLICY "delete_site_content"
  ON site_content FOR DELETE
  TO anon, authenticated
  USING (true);

-- Auto-update updated_at on every row change
DROP TRIGGER IF EXISTS set_updated_at ON site_content;
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 2. Seed default content
-- ============================================================
INSERT INTO site_content (id, data) VALUES (1, '{
  "brand": {
    "name": "FORGEWELL",
    "nameSecond": "METAL CO.",
    "logoUrl": null
  },
  "colors": {
    "primary": "#f5781a",
    "primaryHover": "#f9993a",
    "secondary": "#1a1d21",
    "accent": "#e6e8eb"
  },
  "hero": {
    "image": "https://images.pexels.com/photos/36397935/pexels-photo-36397935.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "eyebrow": "Industrial Metal Suppliers",
    "titleLine1": "Steel, Aluminum & Copper",
    "titleLine2": "Delivered to Your Door",
    "description": "For over three decades, Forgewell Metal Co. has supplied fabricators, builders, and manufacturers with premium-grade metal — cut to spec, delivered on time, every time.",
    "button1Text": "Request a Quote",
    "button2Text": "About Us",
    "stats": [
      {"value": "30+", "label": "Years in Business"},
      {"value": "500+", "label": "Active Clients"},
      {"value": "24h", "label": "Delivery Window"}
    ]
  },
  "about": {
    "image": "https://images.pexels.com/photos/37598393/pexels-photo-37598393.png?auto=compress&cs=tinysrgb&w=1200",
    "badge": "Est. 1992",
    "badgeLabel": "Family Owned",
    "eyebrow": "About Forgewell",
    "title": "Built on Strength,",
    "titleAccent": "Forged by Trust",
    "paragraph1": "Forgewell Metal Co. started as a single warehouse on the east side of town with a truck and a simple promise: quality metal, fair prices, no excuses. Three decades later we operate a 40,000 sq ft facility, serve hundreds of active clients, and still honor that same promise every single day.",
    "paragraph2": "Our team knows metal. Whether you need a single sheet of aluminum or a truckload of structural steel, we source it, cut it, and get it to your shop floor — fast.",
    "tags": ["ISO 9001 Certified", "Same-Day Pickup"],
    "cards": [
      {"name": "Steel", "desc": "Hot-rolled, cold-rolled, and galvanized sheet, bar, and tube."},
      {"name": "Aluminum", "desc": "Lightweight grades for fabrication, aerospace, and architectural use."},
      {"name": "Copper", "desc": "Pure copper rod, sheet, and bar for electrical and plumbing trades."},
      {"name": "Custom Cutting", "desc": "Precision plasma and waterjet cutting to your exact specifications."}
    ]
  },
  "contact": {
    "eyebrow": "Get in Touch",
    "title": "Request a Quote",
    "description": "Tell us what you need — grade, dimensions, quantity — and we will get back to you within one business day with a competitive quote.",
    "phone": "(555) 284-9100",
    "email": "sales@forgewellmetal.com",
    "address": "1842 Foundry Road, Eastgate Industrial Park",
    "hours": "Mon–Fri 6:00 AM – 5:00 PM · Sat 7:00 AM – 12:00 PM",
    "buttonText": "Send Request",
    "backgroundColor": "#1a1d21"
  },
  "footer": {
    "description": "Premium industrial metal suppliers. Family owned since 1992.",
    "copyright": "Forgewell Metal Co. All rights reserved."
  }
}') ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Storage bucket for images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy for site-assets bucket
DROP POLICY IF EXISTS "public_read_site_assets" ON storage.objects;
CREATE POLICY "public_read_site_assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- Write policy for site-assets bucket
DROP POLICY IF EXISTS "anon_write_site_assets" ON storage.objects;
CREATE POLICY "anon_write_site_assets"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "anon_update_site_assets" ON storage.objects;
CREATE POLICY "anon_update_site_assets"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "anon_delete_site_assets" ON storage.objects;
CREATE POLICY "anon_delete_site_assets"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- ============================================================
-- 4. Realtime publication
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE site_content;
