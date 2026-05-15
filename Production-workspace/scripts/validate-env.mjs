import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";

const checks = [];

function add(name, status, detail = "") {
  checks.push({ name, status, detail });
}

function has(key) {
  return Boolean(process.env[key]);
}

function maskedPresence(key) {
  const value = process.env[key] ?? "";
  return value ? `present (${value.length} chars)` : "missing";
}

async function checkRequired() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_FROM_NUMBER",
    "CRON_SECRET",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ];

  for (const key of required) {
    add(`env:${key}`, has(key) ? "pass" : "fail", maskedPresence(key));
  }

  if (!has("TWILIO_FROM_NUMBER") && has("TWILIO_PHONE_NUMBER")) {
    add(
      "env:TWILIO_PHONE_NUMBER_ALIAS",
      "fail",
      "Vercel has TWILIO_PHONE_NUMBER, but app code expects TWILIO_FROM_NUMBER.",
    );
  }

  const optional = [
    "NEXT_PUBLIC_APP_URL",
    "SENTRY_DSN",
    "SENTRY_AUTH_TOKEN",
    "ADMIN_ALERT_PHONE",
    "ANTHROPIC_API_KEY",
  ];
  for (const key of optional) {
    add(`env:${key}`, has(key) ? "pass" : "warn", maskedPresence(key));
  }
}

async function checkSupabase() {
  if (!has("NEXT_PUBLIC_SUPABASE_URL") || !has("SUPABASE_SERVICE_ROLE_KEY")) {
    add("supabase:service-role", "skip", "Missing URL or service-role key.");
    return;
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    add("supabase:service-role", "pass", `profiles count readable (${count ?? 0}).`);
  } catch (error) {
    add("supabase:service-role", "fail", error instanceof Error ? error.message : String(error));
  }
}

async function checkUpstash() {
  if (!has("UPSTASH_REDIS_REST_URL") || !has("UPSTASH_REDIS_REST_TOKEN")) {
    add("upstash:read-write", "skip", "Missing REST URL or token.");
    return;
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const key = `env-verify:${Date.now()}`;
    await redis.set(key, "ok", { ex: 30 });
    const value = await redis.get(key);
    await redis.del(key);
    add("upstash:read-write", value === "ok" ? "pass" : "fail", "Temporary key write/read/delete.");
  } catch (error) {
    add("upstash:read-write", "fail", error instanceof Error ? error.message : String(error));
  }
}

async function checkTwilio() {
  if (!has("TWILIO_ACCOUNT_SID") || !has("TWILIO_AUTH_TOKEN")) {
    add("twilio:account", "skip", "Missing SID or auth token.");
    return;
  }

  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body.slice(0, 160)}`);
    }
    const payload = await response.json();
    add("twilio:account", "pass", `Account status: ${payload.status ?? "unknown"}.`);
  } catch (error) {
    add("twilio:account", "fail", error instanceof Error ? error.message : String(error));
  }

  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    add("twilio:from-number", "skip", "TWILIO_FROM_NUMBER missing.");
    return;
  }

  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const params = new URLSearchParams({ PhoneNumber: fromNumber });
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/IncomingPhoneNumbers.json?${params}`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body.slice(0, 160)}`);
    }
    const payload = await response.json();
    const found = Array.isArray(payload.incoming_phone_numbers) && payload.incoming_phone_numbers.length > 0;
    add("twilio:from-number", found ? "pass" : "warn", found ? "Sender number belongs to account." : "Sender number was not found in account incoming numbers.");
  } catch (error) {
    add("twilio:from-number", "fail", error instanceof Error ? error.message : String(error));
  }
}

async function checkResend() {
  if (!has("RESEND_API_KEY")) {
    add("resend:api", "skip", "Missing API key.");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body.slice(0, 160)}`);
    }
    const payload = await response.json();
    const domains = Array.isArray(payload.data) ? payload.data.length : 0;
    add("resend:api", "pass", `${domains} domain(s) visible to API key.`);
  } catch (error) {
    add("resend:api", "fail", error instanceof Error ? error.message : String(error));
  }
}

await checkRequired();
await checkSupabase();
await checkUpstash();
await checkTwilio();
await checkResend();

const width = Math.max(...checks.map((check) => check.name.length), 10);
for (const check of checks) {
  const label = check.status.toUpperCase().padEnd(4);
  console.log(`${label} ${check.name.padEnd(width)} ${check.detail}`);
}

const failures = checks.filter((check) => check.status === "fail");
if (failures.length > 0) {
  process.exitCode = 1;
}
