/*
# Create customer_reviews table

1. New Tables
- `customer_reviews`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, required — reviewer's name)
  - `email` (text, optional — reviewer's email, not shown publicly)
  - `location` (text, optional — reviewer's city/region shown on public card)
  - `rating` (int, required 1–5, defaults to 5)
  - `text` (text, required — the review message)
  - `is_approved` (boolean, defaults false — admin must approve/star a review for it to appear on the public site)
  - `created_at` (timestamptz, defaults now())
  - `admin_note` (text, optional — internal note for the admin)

2. Security
- Enable RLS on `customer_reviews`.
- Anyone (anon + authenticated) can INSERT a new review (the public review form needs this).
- Only anon + authenticated can SELECT reviews that have been approved (is_approved = true). The admin panel reads through the anon key as well, so we allow SELECT for all rows — the filtering by is_approved happens in the query. Admin reads all reviews; public reads only approved ones.
- UPDATE and DELETE are open to anon + authenticated because there is no sign-in screen on this app (single-tenant). All content management happens through the admin panel which uses the anon key.
- This is a single-tenant app with no authentication, so `TO anon, authenticated` is used throughout. The review submission form and the admin panel both operate via the anon key.

3. Important Notes
- The `is_approved` flag is the "star/pick" mechanism: reviews default to `false` and only appear on the public website when the admin sets them to `true`.
- No `user_id` column is needed since there are no user accounts.
*/

CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  location text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reviews" ON customer_reviews;
CREATE POLICY "anon_insert_reviews"
  ON customer_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_reviews" ON customer_reviews;
CREATE POLICY "anon_select_reviews"
  ON customer_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_update_reviews" ON customer_reviews;
CREATE POLICY "anon_update_reviews"
  ON customer_reviews FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reviews" ON customer_reviews;
CREATE POLICY "anon_delete_reviews"
  ON customer_reviews FOR DELETE
  TO anon, authenticated
  USING (true);
