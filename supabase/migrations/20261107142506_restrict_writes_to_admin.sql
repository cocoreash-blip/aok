/*
# Restrict site edits to the admin account

## Overview
Until now anyone with the public site address could change or delete site content,
customer reviews and uploaded images. This migration keeps public reading working and
limits every change to a signed-in admin account.

## New Tables
- `admin_users`: one row per admin account (user id from the built-in sign-in system).
  It has no public access; only the admin check below reads it.

## New Functions
- `is_admin()`: returns true when the signed-in user is listed in `admin_users`.

## Modified Tables and Storage
- `site_content`: visitors can still read it. Only the admin can insert, update or delete.
- `customer_reviews`: visitors can read approved reviews only, and see only the name,
  location, rating, text, approval flag and date (emails and internal notes are hidden).
  Anyone can submit a review, but it must start unapproved. Only the admin can
  update or delete reviews, and the admin can read all reviews.
- `site-assets` image bucket: visitors can still view images. Only the admin can upload,
  replace or delete them.

## Important Notes
1. Admin accounts are added to `admin_users` separately after the owner signs up.
2. Signing up alone grants no editing rights.
3. Column-level grants keep reviewer emails and internal notes out of public reads.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON admin_users FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- site_content
REVOKE ALL ON site_content FROM anon, authenticated;
GRANT SELECT ON site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON site_content TO authenticated;

DROP POLICY IF EXISTS "write_site_content" ON site_content;
DROP POLICY IF EXISTS "update_site_content" ON site_content;
DROP POLICY IF EXISTS "delete_site_content" ON site_content;

DROP POLICY IF EXISTS "admin_insert_site_content" ON site_content;
CREATE POLICY "admin_insert_site_content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
CREATE POLICY "admin_update_site_content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_site_content" ON site_content;
CREATE POLICY "admin_delete_site_content"
  ON site_content FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- customer_reviews
REVOKE ALL ON customer_reviews FROM anon, authenticated;
GRANT SELECT (name, location, rating, text, is_approved, created_at) ON customer_reviews TO anon, authenticated;
GRANT INSERT (name, email, location, rating, text, is_approved) ON customer_reviews TO anon, authenticated;
GRANT UPDATE, DELETE ON customer_reviews TO authenticated;

DROP POLICY IF EXISTS "anon_insert_reviews" ON customer_reviews;
DROP POLICY IF EXISTS "anon_select_reviews" ON customer_reviews;
DROP POLICY IF EXISTS "anon_update_reviews" ON customer_reviews;
DROP POLICY IF EXISTS "anon_delete_reviews" ON customer_reviews;

DROP POLICY IF EXISTS "submit_unapproved_reviews" ON customer_reviews;
CREATE POLICY "submit_unapproved_reviews"
  ON customer_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (is_approved = false);

DROP POLICY IF EXISTS "read_approved_reviews" ON customer_reviews;
CREATE POLICY "read_approved_reviews"
  ON customer_reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true OR public.is_admin());

DROP POLICY IF EXISTS "admin_update_reviews" ON customer_reviews;
CREATE POLICY "admin_update_reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_reviews" ON customer_reviews;
CREATE POLICY "admin_delete_reviews"
  ON customer_reviews FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- site-assets storage bucket
DROP POLICY IF EXISTS "anon_write_site_assets" ON storage.objects;
DROP POLICY IF EXISTS "anon_update_site_assets" ON storage.objects;
DROP POLICY IF EXISTS "anon_delete_site_assets" ON storage.objects;

DROP POLICY IF EXISTS "admin_insert_site_assets" ON storage.objects;
CREATE POLICY "admin_insert_site_assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin());
