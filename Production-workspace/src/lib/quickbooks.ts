import crypto from "crypto";

import { createAdminClient } from "@/lib/supabase/admin";

const QB_ENVIRONMENTS = {
  sandbox: {
    authBase: "https://appcenter.intuit.com/connect/oauth2",
    tokenEndpoint: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
    apiBase: "https://sandbox-quickbooks.api.intuit.com/v3",
    revokeEndpoint: "https://developer.api.intuit.com/v2/oauth2/tokens/revoke",
  },
  production: {
    authBase: "https://appcenter.intuit.com/connect/oauth2",
    tokenEndpoint: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
    apiBase: "https://quickbooks.api.intuit.com/v3",
    revokeEndpoint: "https://developer.api.intuit.com/v2/oauth2/tokens/revoke",
  },
} as const;

type QBEnvironment = keyof typeof QB_ENVIRONMENTS;

function getQBConfig() {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
  const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI;
  const encryptionKey = process.env.QUICKBOOKS_ENCRYPTION_KEY;
  const environment = (process.env.QUICKBOOKS_ENVIRONMENT ?? "sandbox") as QBEnvironment;

  const missing: string[] = [];
  if (!clientId) missing.push("QUICKBOOKS_CLIENT_ID");
  if (!clientSecret) missing.push("QUICKBOOKS_CLIENT_SECRET");
  if (!redirectUri) missing.push("QUICKBOOKS_REDIRECT_URI");
  if (!encryptionKey) missing.push("QUICKBOOKS_ENCRYPTION_KEY");

  if (missing.length > 0) {
    return { configured: false as const, missing };
  }

  const safeClientId = clientId as string;
  const safeClientSecret = clientSecret as string;
  const safeRedirectUri = redirectUri as string;
  const safeEncryptionKey = encryptionKey as string;

  if (safeEncryptionKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(safeEncryptionKey)) {
    throw new Error(
      "QUICKBOOKS_ENCRYPTION_KEY must be a 64-character hex string (32 bytes for AES-256). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }

  const endpoints = QB_ENVIRONMENTS[environment] ?? QB_ENVIRONMENTS.sandbox;

  return {
    configured: true as const,
    clientId: safeClientId,
    clientSecret: safeClientSecret,
    redirectUri: safeRedirectUri,
    encryptionKey: safeEncryptionKey,
    environment,
    ...endpoints,
  };
}

export function isQBConfigured(): boolean {
  try {
    const config = getQBConfig();
    return config.configured;
  } catch {
    return false;
  }
}

export function getQBConfigStatus(): { configured: boolean; missing?: string[]; environment?: string } {
  try {
    const config = getQBConfig();
    if (!config.configured) {
      return { configured: false, missing: config.missing };
    }

    return { configured: true, environment: config.environment };
  } catch (error) {
    return {
      configured: false,
      missing: [error instanceof Error ? error.message : "Unknown config error"],
    };
  }
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKeyBuffer(): Buffer {
  const config = getQBConfig();
  if (!config.configured) {
    throw new Error("QuickBooks encryption key not configured.");
  }

  return Buffer.from(config.encryptionKey, "hex");
}

export function encryptToken(plaintext: string): string {
  const key = getEncryptionKeyBuffer();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

export function decryptToken(encryptedString: string): string {
  const key = getEncryptionKeyBuffer();
  const parts = encryptedString.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format. Expected iv:authTag:ciphertext.");
  }

  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const ciphertext = parts[2];

  if (iv.length !== IV_LENGTH) {
    throw new Error(`Invalid IV length: expected ${IV_LENGTH}, got ${iv.length}.`);
  }

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH}, got ${authTag.length}.`);
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

const SCOPES = "com.intuit.quickbooks.accounting";

export function initQBOAuth(): { authUrl: string; state: string } {
  const config = getQBConfig();
  if (!config.configured) {
    throw new Error(`QuickBooks not configured. Missing: ${config.missing.join(", ")}`);
  }

  const state = crypto.randomBytes(32).toString("hex");
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: SCOPES,
    state,
  });

  return {
    authUrl: `${config.authBase}?${params.toString()}`,
    state,
  };
}

interface QBTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
  token_type: string;
}

export async function exchangeQBAuthCode(
  code: string,
  realmId: string,
  userId: string,
): Promise<{ success: true; realmId: string; companyName: string | null } | { success: false; error: string }> {
  const config = getQBConfig();
  if (!config.configured) {
    return { success: false, error: `QuickBooks not configured. Missing: ${config.missing.join(", ")}` };
  }

  try {
    const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      return {
        success: false,
        error: `Token exchange failed (${tokenResponse.status}): ${errorBody.slice(0, 200)}`,
      };
    }

    const tokens: QBTokenResponse = await tokenResponse.json();

    let companyName: string | null = null;
    try {
      const companyResponse = await fetch(`${config.apiBase}/company/${realmId}/companyinfo/${realmId}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/json",
        },
      });

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        companyName =
          companyData?.QueryResponse?.CompanyInfo?.[0]?.CompanyName ?? companyData?.CompanyInfo?.CompanyName ?? null;
      }
    } catch {
      companyName = null;
    }

    const accessTokenEncrypted = encryptToken(tokens.access_token);
    const refreshTokenEncrypted = encryptToken(tokens.refresh_token);

    const now = new Date();
    const accessExpiry = new Date(now.getTime() + tokens.expires_in * 1000);
    const refreshExpiry = new Date(now.getTime() + tokens.x_refresh_token_expires_in * 1000);

    const supabase = createAdminClient();
    const { error: upsertError } = await supabase.from("quickbooks_credentials").upsert(
      {
        realm_id: realmId,
        company_name: companyName,
        access_token_encrypted: accessTokenEncrypted,
        refresh_token_encrypted: refreshTokenEncrypted,
        access_token_expires_at: accessExpiry.toISOString(),
        refresh_token_expires_at: refreshExpiry.toISOString(),
        scope: SCOPES,
        is_active: true,
        last_sync_error: null,
        created_by: userId,
      },
      { onConflict: "realm_id" },
    );

    if (upsertError) {
      return { success: false, error: `Failed to store credentials: ${upsertError.message}` };
    }

    return { success: true, realmId, companyName };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during token exchange.",
    };
  }
}

export async function refreshQBTokenFlow(
  realmId: string,
): Promise<{ success: true; accessToken: string } | { success: false; error: string; requiresReauth?: boolean }> {
  const config = getQBConfig();
  if (!config.configured) {
    return { success: false, error: `QuickBooks not configured. Missing: ${config.missing.join(", ")}` };
  }

  const supabase = createAdminClient();
  const { data: creds, error: fetchError } = await supabase
    .from("quickbooks_credentials")
    .select("*")
    .eq("realm_id", realmId)
    .eq("is_active", true)
    .single();

  if (fetchError || !creds) {
    return {
      success: false,
      error: "No active QuickBooks credentials found for this realm.",
      requiresReauth: true,
    };
  }

  if (new Date(creds.refresh_token_expires_at) < new Date()) {
    await supabase
      .from("quickbooks_credentials")
      .update({
        is_active: false,
        last_sync_error: "Refresh token expired. Re-authentication required.",
      })
      .eq("realm_id", realmId);

    return {
      success: false,
      error: "Refresh token expired. Please reconnect QuickBooks.",
      requiresReauth: true,
    };
  }

  try {
    const refreshToken = decryptToken(creds.refresh_token_encrypted);
    const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();

      if (tokenResponse.status === 401) {
        await supabase
          .from("quickbooks_credentials")
          .update({
            is_active: false,
            last_sync_error: "Refresh token rejected by QuickBooks. Re-authentication required.",
          })
          .eq("realm_id", realmId);

        return {
          success: false,
          error: "QuickBooks rejected the refresh token. Please reconnect.",
          requiresReauth: true,
        };
      }

      return {
        success: false,
        error: `Token refresh failed (${tokenResponse.status}): ${errorBody.slice(0, 200)}`,
      };
    }

    const tokens: QBTokenResponse = await tokenResponse.json();
    const now = new Date();
    const accessExpiry = new Date(now.getTime() + tokens.expires_in * 1000);
    const refreshExpiry = new Date(now.getTime() + tokens.x_refresh_token_expires_in * 1000);

    await supabase
      .from("quickbooks_credentials")
      .update({
        access_token_encrypted: encryptToken(tokens.access_token),
        refresh_token_encrypted: encryptToken(tokens.refresh_token),
        access_token_expires_at: accessExpiry.toISOString(),
        refresh_token_expires_at: refreshExpiry.toISOString(),
        last_sync_error: null,
      })
      .eq("realm_id", realmId);

    return { success: true, accessToken: tokens.access_token };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during token refresh.",
    };
  }
}

type RefreshResult =
  | { success: true; accessToken: string }
  | { success: false; error: string; requiresReauth?: boolean };

const refreshInFlight = new Map<string, Promise<RefreshResult>>();

async function getValidAccessToken(realmId: string): Promise<RefreshResult> {
  const supabase = createAdminClient();
  const { data: creds, error: fetchError } = await supabase
    .from("quickbooks_credentials")
    .select("access_token_encrypted, access_token_expires_at")
    .eq("realm_id", realmId)
    .eq("is_active", true)
    .single();

  if (fetchError || !creds) {
    return { success: false, error: "No active QuickBooks credentials found.", requiresReauth: true };
  }

  const expiresAt = new Date(creds.access_token_expires_at);
  const bufferMs = 5 * 60 * 1000;
  if (expiresAt.getTime() - bufferMs > Date.now()) {
    try {
      return { success: true, accessToken: decryptToken(creds.access_token_encrypted) };
    } catch {
      // Fall through to refresh
    }
  }

  const existing = refreshInFlight.get(realmId);
  if (existing) {
    return existing;
  }

  const refreshPromise = refreshQBTokenFlow(realmId).finally(() => {
    refreshInFlight.delete(realmId);
  });

  refreshInFlight.set(realmId, refreshPromise);
  return refreshPromise;
}

export interface QBApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface QBApiError {
  success: false;
  error: string;
  statusCode?: number;
  requiresReauth?: boolean;
}

export async function qbApiRequest<T = unknown>(
  realmId: string,
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: Record<string, unknown>;
    query?: Record<string, string>;
  } = {},
): Promise<QBApiResponse<T> | QBApiError> {
  const config = getQBConfig();
  if (!config.configured) {
    return { success: false, error: `QuickBooks not configured. Missing: ${config.missing.join(", ")}` };
  }
  const safeConfig = config;

  const { method = "GET", body, query } = options;

  async function attemptRequest(accessToken: string): Promise<Response> {
    let url = `${safeConfig.apiBase}/company/${realmId}${path}`;
    if (query) {
      const params = new URLSearchParams(query);
      url += `?${params.toString()}`;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = { method, headers };
    if (body) {
      headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    }

    return fetch(url, fetchOptions);
  }

  const tokenResult = await getValidAccessToken(realmId);
  if (!tokenResult.success) {
    return tokenResult;
  }

  let response: Response;
  try {
    response = await attemptRequest(tokenResult.accessToken);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      response = await attemptRequest(tokenResult.accessToken);
    } catch (retryError) {
      return {
        success: false,
        error: `Network error after retry: ${retryError instanceof Error ? retryError.message : "Unknown"}`,
      };
    }
  }

  if (response.status === 401) {
    const refreshResult = await refreshQBTokenFlow(realmId);
    if (!refreshResult.success) {
      return refreshResult;
    }

    try {
      response = await attemptRequest(refreshResult.accessToken);
    } catch (retryError) {
      return {
        success: false,
        error: `Network error after token refresh: ${retryError instanceof Error ? retryError.message : "Unknown"}`,
      };
    }
  }

  if (response.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      response = await attemptRequest(tokenResult.accessToken);
    } catch (retryError) {
      return {
        success: false,
        error: `Server error after retry: ${retryError instanceof Error ? retryError.message : "Unknown"}`,
        statusCode: 500,
      };
    }
  }

  if (!response.ok) {
    const errorBody = await response.text();
    return {
      success: false,
      error: `QuickBooks API error (${response.status}): ${errorBody.slice(0, 200)}`,
      statusCode: response.status,
    };
  }

  try {
    const data = (await response.json()) as T;
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Failed to parse QuickBooks API response as JSON.",
      statusCode: response.status,
    };
  }
}

export async function revokeQBTokens(realmId: string): Promise<{ success: boolean; error?: string }> {
  const config = getQBConfig();
  if (!config.configured) {
    return { success: false, error: "QuickBooks not configured." };
  }

  const supabase = createAdminClient();
  const { data: creds, error: fetchError } = await supabase
    .from("quickbooks_credentials")
    .select("refresh_token_encrypted")
    .eq("realm_id", realmId)
    .eq("is_active", true)
    .single();

  if (fetchError || !creds) {
    return { success: true };
  }

  try {
    const refreshToken = decryptToken(creds.refresh_token_encrypted);
    const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

    try {
      await fetch(config.revokeEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });
    } catch {
      // Best effort; continue local disconnect
    }

    await supabase
      .from("quickbooks_credentials")
      .update({ is_active: false, last_sync_error: "Disconnected by admin." })
      .eq("realm_id", realmId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during revocation.",
    };
  }
}

export interface QBConnectionStatus {
  connected: boolean;
  realmId?: string;
  companyName?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  lastSyncAt?: string;
  lastSyncError?: string;
  environment?: string;
}

export async function getQBConnectionStatus(): Promise<QBConnectionStatus> {
  const configStatus = getQBConfigStatus();
  if (!configStatus.configured) {
    return { connected: false };
  }

  const supabase = createAdminClient();
  const { data: creds } = await supabase
    .from("quickbooks_credentials")
    .select("realm_id, company_name, access_token_expires_at, refresh_token_expires_at, last_sync_at, last_sync_error")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!creds) {
    return { connected: false, environment: configStatus.environment };
  }

  return {
    connected: true,
    realmId: creds.realm_id,
    companyName: creds.company_name,
    accessTokenExpiresAt: creds.access_token_expires_at,
    refreshTokenExpiresAt: creds.refresh_token_expires_at,
    lastSyncAt: creds.last_sync_at,
    lastSyncError: creds.last_sync_error,
    environment: configStatus.environment,
  };
}