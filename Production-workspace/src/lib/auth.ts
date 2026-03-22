/**
 * Shared authorization helpers for API routes.
 *
 * Consolidates the duplicated authorizeAdmin() pattern found across
 * admin-protected routes into a single source of truth.
 *
 * Usage:
 *   const auth = await authorizeAdmin();
 *   if (!auth.ok) {
 *     return NextResponse.json({ error: auth.error }, { status: auth.status });
 *   }
 *   // auth.userId is available
 */

import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403; error: string };

export type AuthResultWithoutId =
  | { ok: true }
  | { ok: false; status: 401 | 403; error: string };

// ---------------------------------------------------------------------------
// Admin authorization
// ---------------------------------------------------------------------------

/**
 * Verify the current request is from an authenticated admin user.
 *
 * Returns `{ ok: true, userId }` on success.
 * Returns `{ ok: false, status, error }` on failure — caller should
 * return this directly as a NextResponse.
 *
 * This replaces the inline `authorizeAdmin()` functions previously
 * duplicated across every admin-protected API route.
 */
export async function authorizeAdmin(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      error: authError?.message ?? "Unauthorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      ok: false,
      status: 403,
      error: profileError?.message ?? "Admin role required.",
    };
  }

  return { ok: true, userId: user.id };
}

/**
 * Lightweight admin check without returning userId.
 *
 * Used by routes like assignment-notify that need admin verification
 * but don't use the userId in their business logic.
 */
export async function authorizeAdminBasic(): Promise<AuthResultWithoutId> {
  const result = await authorizeAdmin();
  if (!result.ok) {
    return result;
  }
  return { ok: true };
}

/**
 * Verify admin role from an already-known user ID.
 *
 * Used by callback routes (like quickbooks-callback) where
 * the user is already retrieved via a different code path.
 */
export async function verifyAdminRole(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}