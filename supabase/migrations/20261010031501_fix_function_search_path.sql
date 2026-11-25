/*
# Fix set_updated_at function search_path

1. Changes
- Drops the trigger first, then the function, then recreates the function with
  an explicit `search_path = public` and re-attaches the trigger.
- Resolves the Supabase linter warning about mutable search_path.
- No data changes, no policy changes.
*/

DROP TRIGGER IF EXISTS set_updated_at ON site_content;
DROP FUNCTION IF EXISTS public.set_updated_at();

CREATE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
