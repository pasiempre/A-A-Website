import { createClient } from "@supabase/supabase-js";

import { getPublicEnv, requireServerEnv } from "@/lib/env";

export function createAdminClient() {
  const { supabaseUrl } = getPublicEnv();
  const serviceRoleKey = requireServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
