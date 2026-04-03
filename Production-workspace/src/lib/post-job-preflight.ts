/**
 * Preflight checks for F-07 automation validation.
 *
 * Run: npx tsx src/lib/post-job-preflight.ts
 */

import { promises as dns } from "node:dns";
import fs from "node:fs";
import path from "node:path";

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const idx = trimmed.indexOf("=");
    if (idx <= 0) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

async function checkHttps(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    return {
      ok: true,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  loadDotEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let failed = false;

  console.log("\nF-07 Preflight\n");

  if (!supabaseUrl) {
    failed = true;
    console.log("FAIL env: NEXT_PUBLIC_SUPABASE_URL missing");
  } else {
    console.log("PASS env: NEXT_PUBLIC_SUPABASE_URL present");
  }

  if (!serviceRole) {
    failed = true;
    console.log("FAIL env: SUPABASE_SERVICE_ROLE_KEY missing");
  } else {
    console.log("PASS env: SUPABASE_SERVICE_ROLE_KEY present");
  }

  if (!supabaseUrl) {
    console.log("\nPreflight failed before network checks.");
    process.exit(1);
  }

  const host = hostFromUrl(supabaseUrl);
  if (!host) {
    failed = true;
    console.log("FAIL parse: NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
    process.exit(1);
  }

  try {
    const resolved = await dns.lookup(host);
    console.log(`PASS dns: ${host} -> ${resolved.address}`);
  } catch (error) {
    failed = true;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`FAIL dns: unable to resolve ${host} (${message})`);
  }

  if (!failed) {
    const httpsResult = await checkHttps(supabaseUrl);
    if (httpsResult.ok) {
      console.log(`PASS https: reachable (${httpsResult.status})`);
    } else {
      failed = true;
      console.log(`FAIL https: ${httpsResult.error}`);
    }
  }

  if (failed) {
    console.log("\nPreflight failed. Remediation:");
    console.log("1. Confirm network access or VPN route to Supabase.");
    console.log("2. Verify NEXT_PUBLIC_SUPABASE_URL host is correct.");
    console.log("3. Retry preflight, then run npm run smoke:f07.");
    process.exit(1);
  }

  console.log("\nPreflight passed. Safe to run: npm run smoke:f07");
}

void run();
