import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyAdminRole } from "@/lib/auth";
import { exchangeQBAuthCode } from "@/lib/quickbooks";
import { createClient } from "@/lib/supabase/server";

const ADMIN_DASHBOARD_URL = "/admin?module=insights";

function errorRedirect(
  origin: string,
  errorCode: string,
): NextResponse {
  const redirectUrl = new URL(ADMIN_DASHBOARD_URL, origin);
  redirectUrl.searchParams.set("qb_error", errorCode);
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const origin = request.nextUrl.origin;

  if (error) {
    return errorRedirect(origin, error);
  }

  if (!code || !realmId || !state) {
    return errorRedirect(origin, "missing_params");
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("qb_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return errorRedirect(origin, "state_mismatch");
  }

  cookieStore.delete("qb_oauth_state");

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorRedirect(origin, "unauthorized");
  }

  const isAdmin = await verifyAdminRole(user.id);
  if (!isAdmin) {
    return errorRedirect(origin, "forbidden");
  }

  const result = await exchangeQBAuthCode(code, realmId, user.id);
  if (!result.success) {
    return errorRedirect(origin, "token_exchange_failed");
  }

  const redirectUrl = new URL(ADMIN_DASHBOARD_URL, origin);
  redirectUrl.searchParams.set("qb_connected", "true");
  if (result.companyName) {
    redirectUrl.searchParams.set("qb_company", result.companyName);
  }

  return NextResponse.redirect(redirectUrl);
}