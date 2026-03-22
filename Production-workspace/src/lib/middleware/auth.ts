import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ============================================================
// Route constants
// ============================================================

const ADMIN_PREFIX = "/admin";
const EMPLOYEE_PREFIX = "/employee";
const AUTH_ADMIN = "/auth/admin";
const AUTH_EMPLOYEE = "/auth/employee";

// ============================================================
// Types
// ============================================================

export type AuthContext = {
  userId: string | null;
  role: string | null;
  authFailure: boolean;
  authFailureReason?: string;
};

export type AuthResult = {
  context: AuthContext;
  /** If set, middleware should return this response immediately. */
  redirect?: NextResponse;
};

// ============================================================
// Role extraction
// ============================================================

function getRole(user: {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}): string | null {
  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;

  if (typeof appRole === "string") return appRole;
  if (typeof userRole === "string") return userRole;
  return null;
}

// ============================================================
// Main auth evaluation
// ============================================================

/**
 * Evaluates authentication and authorization for the current request.
 *
 * @param request  - The incoming Next.js request
 * @param response - The NextResponse.next() object (needed for Supabase cookie writes)
 *
 * @returns AuthResult containing:
 *   - context: userId, role, and failure details (always present)
 *   - redirect: a NextResponse redirect if the request should be intercepted
 *
 * If redirect is undefined, the request is allowed to proceed with the
 * original response.
 */
export async function evaluateAuth(
  request: NextRequest,
  response: NextResponse,
): Promise<AuthResult> {
  const { pathname } = request.nextUrl;

  const context: AuthContext = {
    userId: null,
    role: null,
    authFailure: false,
  };

  // ----------------------------------------------------------
  // Supabase client setup
  // ----------------------------------------------------------

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Cannot evaluate auth without Supabase credentials.
    // Allow request through — downstream pages will fail more visibly.
    return { context };
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

  // ----------------------------------------------------------
  // User retrieval
  // ----------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  context.userId = user?.id ?? null;
  context.role = user ? getRole(user) : null;

  // ----------------------------------------------------------
  // Route classification
  // ----------------------------------------------------------

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isEmployeeRoute = pathname.startsWith(EMPLOYEE_PREFIX);
  const isAuthAdmin = pathname.startsWith(AUTH_ADMIN);
  const isAuthEmployee = pathname.startsWith(AUTH_EMPLOYEE);

  // ----------------------------------------------------------
  // Admin route guard
  // ----------------------------------------------------------

  if (isAdminRoute) {
    if (!user) {
      context.authFailure = true;
      context.authFailureReason = "unauthenticated_admin_access";
      return {
        context,
        redirect: NextResponse.redirect(new URL(AUTH_ADMIN, request.url)),
      };
    }

    if (context.role !== "admin") {
      context.authFailure = true;
      context.authFailureReason = `wrong_role_admin_access:${context.role}`;
      return {
        context,
        redirect: NextResponse.redirect(
          new URL(`${AUTH_ADMIN}?error=role`, request.url),
        ),
      };
    }
  }

  // ----------------------------------------------------------
  // Employee route guard
  // ----------------------------------------------------------

  if (isEmployeeRoute) {
    if (!user) {
      context.authFailure = true;
      context.authFailureReason = "unauthenticated_employee_access";
      return {
        context,
        redirect: NextResponse.redirect(
          new URL(AUTH_EMPLOYEE, request.url),
        ),
      };
    }

    if (context.role !== "employee" && context.role !== "admin") {
      context.authFailure = true;
      context.authFailureReason = `wrong_role_employee_access:${context.role}`;
      return {
        context,
        redirect: NextResponse.redirect(
          new URL(`${AUTH_EMPLOYEE}?error=role`, request.url),
        ),
      };
    }
  }

  // ----------------------------------------------------------
  // Already-authenticated redirects (away from login pages)
  // ----------------------------------------------------------

  if (isAuthAdmin && user && context.role === "admin") {
    return {
      context,
      redirect: NextResponse.redirect(new URL(ADMIN_PREFIX, request.url)),
    };
  }

  if (
    isAuthEmployee &&
    user &&
    (context.role === "employee" || context.role === "admin")
  ) {
    return {
      context,
      redirect: NextResponse.redirect(
        new URL(EMPLOYEE_PREFIX, request.url),
      ),
    };
  }

  // ----------------------------------------------------------
  // No guard triggered — allow through
  // ----------------------------------------------------------

  return { context };
}
