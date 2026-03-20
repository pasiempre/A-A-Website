import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const EMPLOYEE_PREFIX = "/employee";
const AUTH_ADMIN = "/auth/admin";
const AUTH_EMPLOYEE = "/auth/employee";

function isDevPreviewEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEV_PREVIEW_MODE === "true";
}

function getRole(user: {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}) {
  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;

  if (typeof appRole === "string") {
    return appRole;
  }

  if (typeof userRole === "string") {
    return userRole;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (isDevPreviewEnabled()) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const role = user ? getRole(user) : null;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isEmployeeRoute = pathname.startsWith(EMPLOYEE_PREFIX);
  const isAuthAdmin = pathname.startsWith(AUTH_ADMIN);
  const isAuthEmployee = pathname.startsWith(AUTH_EMPLOYEE);

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL(AUTH_ADMIN, request.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL(`${AUTH_ADMIN}?error=role`, request.url));
    }
  }

  if (isEmployeeRoute) {
    if (!user) {
      return NextResponse.redirect(new URL(AUTH_EMPLOYEE, request.url));
    }

    if (role !== "employee" && role !== "admin") {
      return NextResponse.redirect(new URL(`${AUTH_EMPLOYEE}?error=role`, request.url));
    }
  }

  if (isAuthAdmin && user && role === "admin") {
    return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
  }

  if (isAuthEmployee && user && (role === "employee" || role === "admin")) {
    return NextResponse.redirect(new URL(EMPLOYEE_PREFIX, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/auth/:path*"],
};
