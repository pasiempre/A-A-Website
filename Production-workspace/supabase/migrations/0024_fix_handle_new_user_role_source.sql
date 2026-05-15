-- 0024_fix_handle_new_user_role_source.sql
-- SB-6 fix: read role from app metadata, never user metadata.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_app_meta_data->>'role', 'employee')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;
