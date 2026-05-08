-- 0027_fix_handle_new_user_role_cast.sql
-- Auth trigger hardening: validate app_metadata.role before inserting into profiles.role.
--
-- Current remote/bootstrap schema uses profiles.role as TEXT with a check constraint
-- ('admin', 'owner', 'employee', 'crew_lead'), not the older public.app_role enum
-- from 0001_mvp_core.sql.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  requested_role text;
  profile_role text;
BEGIN
  requested_role := COALESCE(NEW.raw_app_meta_data->>'role', 'employee');

  IF requested_role IN ('admin', 'owner', 'employee', 'crew_lead') THEN
    profile_role := requested_role;
  ELSE
    profile_role := 'employee';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    profile_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
