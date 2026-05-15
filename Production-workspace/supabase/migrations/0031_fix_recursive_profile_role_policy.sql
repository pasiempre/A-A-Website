-- Migration: 0031_fix_recursive_profile_role_policy.sql
-- Purpose: Stop RLS recursion caused by role policies reading public.profiles
--          through normal invoker privileges.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.role::text
  FROM public.profiles p
  WHERE p.id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO service_role;

DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;
CREATE POLICY profiles_admin_all
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.current_user_role() IN ('admin', 'owner'))
  WITH CHECK (public.current_user_role() IN ('admin', 'owner'));

NOTIFY pgrst, 'reload schema';
