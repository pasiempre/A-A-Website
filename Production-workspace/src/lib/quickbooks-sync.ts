import { createHash } from "crypto";

import { qbApiRequest, type QBApiError } from "@/lib/quickbooks";
import { createAdminClient } from "@/lib/supabase/admin";

const SYNC_CONFIG = {
  maxBatchSize: 50,
  maxInvoiceAmount: 10_000,
  minInvoiceAmount: 1,
  defaultPaymentTermDays: 30,
} as const;

export interface SyncPreview {
  action: "create" | "update" | "skip";
  reason?: string;
  local: Record<string, unknown>;
  remote?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  mode: "dry_run" | "confirmed";
  processed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  details: SyncItemResult[];
}

export interface SyncItemResult {
  localId: string;
  action: "created" | "updated" | "skipped" | "error";
  qbId?: string;
  error?: string;
  data?: Record<string, unknown>;
}

interface QBCustomer {
  Id?: string;
  DisplayName: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryPhone?: { FreeFormNumber: string };
  PrimaryEmailAddr?: { Address: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
  Active?: boolean;
  SyncToken?: string;
}

interface QBVendor {
  Id?: string;
  DisplayName: string;
  GivenName?: string;
  FamilyName?: string;
  PrimaryPhone?: { FreeFormNumber: string };
  PrimaryEmailAddr?: { Address: string };
  Active?: boolean;
  SyncToken?: string;
}

interface QBQueryResponse<T> {
  QueryResponse: {
    Customer?: T[];
    Vendor?: T[];
    startPosition?: number;
    maxResults?: number;
    totalCount?: number;
  };
}

interface SyncMapping {
  id: string;
  entity_type: string;
  local_id: string;
  qb_id: string;
  qb_sync_token: string;
  last_synced_at: string;
  sync_hash: string;
}

async function getSyncMapping(entityType: string, localId: string): Promise<SyncMapping | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("quickbooks_sync_mappings")
    .select("*")
    .eq("entity_type", entityType)
    .eq("local_id", localId)
    .maybeSingle();

  return (data as SyncMapping | null) ?? null;
}

async function upsertSyncMapping(
  entityType: string,
  localId: string,
  qbId: string,
  syncToken: string,
  syncHash: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("quickbooks_sync_mappings").upsert(
    {
      entity_type: entityType,
      local_id: localId,
      qb_id: qbId,
      qb_sync_token: syncToken,
      sync_hash: syncHash,
      last_synced_at: new Date().toISOString(),
    },
    { onConflict: "entity_type,local_id" },
  );
}

function computeSyncHash(data: Record<string, unknown>): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

async function logSyncAudit(entry: {
  entity_type: string;
  entity_id: string;
  action: string;
  qb_id?: string;
  request_payload?: Record<string, unknown>;
  response_payload?: Record<string, unknown>;
  error?: string;
  triggered_by: string;
}): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("quickbooks_sync_audit").insert({
    ...entry,
    created_at: new Date().toISOString(),
  });
}

async function fetchQBCustomers(realmId: string): Promise<Map<string, QBCustomer>> {
  const customers = new Map<string, QBCustomer>();
  let startPosition = 1;
  const pageSize = 100;

  while (true) {
    const result = await qbApiRequest<QBQueryResponse<QBCustomer>>(realmId, "/query", {
      query: {
        query: `SELECT * FROM Customer STARTPOSITION ${startPosition} MAXRESULTS ${pageSize}`,
        minorversion: "65",
      },
    });

    if (!result.success) {
      console.warn("[QB Sync] Failed to fetch customers page:", (result as QBApiError).error);
      break;
    }

    const page = result.data.QueryResponse?.Customer ?? [];
    if (page.length === 0) break;

    for (const customer of page) {
      if (customer.DisplayName) {
        customers.set(customer.DisplayName.toLowerCase().trim(), customer);
      }
    }

    startPosition += page.length;
    if (page.length < pageSize) break;
  }

  return customers;
}

export async function syncCustomersToQB(realmId: string, userId: string, confirm = false): Promise<SyncResult> {
  const supabase = createAdminClient();
  const { data: localCustomers, error: fetchError } = await supabase
    .from("jobs")
    .select("id, customer_name, customer_email, customer_phone, address")
    .not("customer_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(SYNC_CONFIG.maxBatchSize * 10);

  if (fetchError) {
    return {
      success: false,
      mode: confirm ? "confirmed" : "dry_run",
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 1,
      details: [{ localId: "fetch", action: "error", error: fetchError.message }],
    };
  }

  const uniqueCustomers = new Map<
    string,
    {
      name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
      localId: string;
    }
  >();

  for (const job of localCustomers ?? []) {
    const record = job as {
      id: string;
      customer_name: string | null;
      customer_email: string | null;
      customer_phone: string | null;
      address: string | null;
    };
    if (!record.customer_name) continue;

    const key = record.customer_name.toLowerCase().trim();
    if (!uniqueCustomers.has(key)) {
      uniqueCustomers.set(key, {
        name: record.customer_name,
        email: record.customer_email,
        phone: record.customer_phone,
        address: record.address,
        localId: record.id,
      });
    }
  }

  const batch = Array.from(uniqueCustomers.values()).slice(0, SYNC_CONFIG.maxBatchSize);

  let existingQBCustomers = new Map<string, QBCustomer>();
  if (confirm) {
    existingQBCustomers = await fetchQBCustomers(realmId);
  }

  const result: SyncResult = {
    success: true,
    mode: confirm ? "confirmed" : "dry_run",
    processed: batch.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };

  for (const customer of batch) {
    const nameKey = customer.name.toLowerCase().trim();
    const nameParts = customer.name.trim().split(/\s+/);
    const givenName = nameParts[0] ?? customer.name;
    const familyName = nameParts.slice(1).join(" ") || undefined;

    const existingMapping = await getSyncMapping("customer", customer.localId);
    const syncData: Record<string, unknown> = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };
    const currentHash = computeSyncHash(syncData);

    if (existingMapping && existingMapping.sync_hash === currentHash) {
      result.skipped++;
      result.details.push({
        localId: customer.localId,
        action: "skipped",
        qbId: existingMapping.qb_id,
        data: { reason: "No changes since last sync" },
      });
      continue;
    }

    const qbCustomerData: QBCustomer = {
      DisplayName: customer.name.trim(),
      GivenName: givenName,
      FamilyName: familyName,
    };

    if (customer.phone) qbCustomerData.PrimaryPhone = { FreeFormNumber: customer.phone };
    if (customer.email) qbCustomerData.PrimaryEmailAddr = { Address: customer.email };
    if (customer.address) qbCustomerData.BillAddr = { Line1: customer.address };

    const existingQB = existingQBCustomers.get(nameKey);

    if (!confirm) {
      result.details.push({
        localId: customer.localId,
        action: existingQB || existingMapping ? "updated" : "created",
        data: {
          wouldSend: qbCustomerData as unknown as Record<string, unknown>,
          existingQBId: existingQB?.Id ?? existingMapping?.qb_id ?? null,
        },
      });
      if (existingQB || existingMapping) result.updated++;
      else result.created++;
      continue;
    }

    try {
      let qbResponse: QBCustomer;

      if (existingQB?.Id) {
        const updatePayload = {
          ...qbCustomerData,
          Id: existingQB.Id,
          SyncToken: existingQB.SyncToken,
          sparse: true,
        };
        const updateResult = await qbApiRequest<{ Customer: QBCustomer }>(realmId, "/customer", {
          method: "POST",
          body: updatePayload as unknown as Record<string, unknown>,
        });
        if (!updateResult.success) throw new Error((updateResult as QBApiError).error);

        qbResponse = updateResult.data.Customer;
        await logSyncAudit({
          entity_type: "customer",
          entity_id: customer.localId,
          action: "update",
          qb_id: qbResponse.Id,
          request_payload: updatePayload as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.updated++;
        result.details.push({ localId: customer.localId, action: "updated", qbId: qbResponse.Id });
      } else if (existingMapping?.qb_id) {
        const fetchResult = await qbApiRequest<{ Customer: QBCustomer }>(realmId, `/customer/${existingMapping.qb_id}`, {
          query: { minorversion: "65" },
        });
        if (!fetchResult.success) {
          throw new Error(`Could not fetch existing QB customer ${existingMapping.qb_id}: ${(fetchResult as QBApiError).error}`);
        }

        const updatePayload = {
          ...qbCustomerData,
          Id: existingMapping.qb_id,
          SyncToken: fetchResult.data.Customer.SyncToken,
          sparse: true,
        };
        const updateResult = await qbApiRequest<{ Customer: QBCustomer }>(realmId, "/customer", {
          method: "POST",
          body: updatePayload as unknown as Record<string, unknown>,
        });
        if (!updateResult.success) throw new Error((updateResult as QBApiError).error);

        qbResponse = updateResult.data.Customer;
        await logSyncAudit({
          entity_type: "customer",
          entity_id: customer.localId,
          action: "update",
          qb_id: qbResponse.Id,
          request_payload: updatePayload as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.updated++;
        result.details.push({ localId: customer.localId, action: "updated", qbId: qbResponse.Id });
      } else {
        const createResult = await qbApiRequest<{ Customer: QBCustomer }>(realmId, "/customer", {
          method: "POST",
          body: qbCustomerData as unknown as Record<string, unknown>,
        });
        if (!createResult.success) throw new Error((createResult as QBApiError).error);

        qbResponse = createResult.data.Customer;
        await logSyncAudit({
          entity_type: "customer",
          entity_id: customer.localId,
          action: "create",
          qb_id: qbResponse.Id,
          request_payload: qbCustomerData as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.created++;
        result.details.push({ localId: customer.localId, action: "created", qbId: qbResponse.Id });
      }

      await upsertSyncMapping(
        "customer",
        customer.localId,
        qbResponse.Id ?? "",
        qbResponse.SyncToken ?? "0",
        currentHash,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await logSyncAudit({
        entity_type: "customer",
        entity_id: customer.localId,
        action: existingQB || existingMapping ? "update" : "create",
        error: errorMessage,
        triggered_by: userId,
      });
      result.errors++;
      result.details.push({ localId: customer.localId, action: "error", error: errorMessage });
    }
  }

  result.success = result.errors === 0;
  return result;
}

async function fetchQBVendors(realmId: string): Promise<Map<string, QBVendor>> {
  const vendors = new Map<string, QBVendor>();
  let startPosition = 1;
  const pageSize = 100;

  while (true) {
    const result = await qbApiRequest<QBQueryResponse<QBVendor>>(realmId, "/query", {
      query: {
        query: `SELECT * FROM Vendor STARTPOSITION ${startPosition} MAXRESULTS ${pageSize}`,
        minorversion: "65",
      },
    });

    if (!result.success) {
      console.warn("[QB Sync] Failed to fetch vendors page:", (result as QBApiError).error);
      break;
    }

    const page = result.data.QueryResponse?.Vendor ?? [];
    if (page.length === 0) break;

    for (const vendor of page) {
      if (vendor.DisplayName) vendors.set(vendor.DisplayName.toLowerCase().trim(), vendor);
    }

    startPosition += page.length;
    if (page.length < pageSize) break;
  }

  return vendors;
}

export async function syncVendorsToQB(realmId: string, userId: string, confirm = false): Promise<SyncResult> {
  const supabase = createAdminClient();
  const { data: employees, error: fetchError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .in("role", ["employee", "crew_lead"])
    .order("full_name")
    .limit(SYNC_CONFIG.maxBatchSize);

  if (fetchError) {
    return {
      success: false,
      mode: confirm ? "confirmed" : "dry_run",
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 1,
      details: [{ localId: "fetch", action: "error", error: fetchError.message }],
    };
  }

  let existingQBVendors = new Map<string, QBVendor>();
  if (confirm) {
    existingQBVendors = await fetchQBVendors(realmId);
  }

  const result: SyncResult = {
    success: true,
    mode: confirm ? "confirmed" : "dry_run",
    processed: (employees ?? []).length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };

  for (const employeeRaw of employees ?? []) {
    const employee = employeeRaw as {
      id: string;
      full_name: string | null;
      email: string | null;
      phone: string | null;
    };
    const displayName = employee.full_name?.trim();
    if (!displayName) {
      result.skipped++;
      result.details.push({ localId: employee.id, action: "skipped", data: { reason: "Missing full_name" } });
      continue;
    }

    const nameKey = displayName.toLowerCase();
    const nameParts = displayName.split(/\s+/);
    const givenName = nameParts[0] ?? displayName;
    const familyName = nameParts.slice(1).join(" ") || undefined;

    const existingMapping = await getSyncMapping("vendor", employee.id);
    const syncData: Record<string, unknown> = {
      name: displayName,
      email: employee.email,
      phone: employee.phone,
    };
    const currentHash = computeSyncHash(syncData);

    if (existingMapping && existingMapping.sync_hash === currentHash) {
      result.skipped++;
      result.details.push({
        localId: employee.id,
        action: "skipped",
        qbId: existingMapping.qb_id,
        data: { reason: "No changes since last sync" },
      });
      continue;
    }

    const qbVendorData: QBVendor = {
      DisplayName: displayName,
      GivenName: givenName,
      FamilyName: familyName,
    };
    if (employee.phone) qbVendorData.PrimaryPhone = { FreeFormNumber: employee.phone };
    if (employee.email) qbVendorData.PrimaryEmailAddr = { Address: employee.email };

    const existingQB = existingQBVendors.get(nameKey);

    if (!confirm) {
      result.details.push({
        localId: employee.id,
        action: existingQB || existingMapping ? "updated" : "created",
        data: {
          wouldSend: qbVendorData as unknown as Record<string, unknown>,
          existingQBId: existingQB?.Id ?? existingMapping?.qb_id ?? null,
        },
      });
      if (existingQB || existingMapping) result.updated++;
      else result.created++;
      continue;
    }

    try {
      let qbResponse: QBVendor;

      if (existingQB?.Id) {
        const updatePayload = {
          ...qbVendorData,
          Id: existingQB.Id,
          SyncToken: existingQB.SyncToken,
          sparse: true,
        };
        const updateResult = await qbApiRequest<{ Vendor: QBVendor }>(realmId, "/vendor", {
          method: "POST",
          body: updatePayload as unknown as Record<string, unknown>,
        });
        if (!updateResult.success) throw new Error((updateResult as QBApiError).error);

        qbResponse = updateResult.data.Vendor;
        await logSyncAudit({
          entity_type: "vendor",
          entity_id: employee.id,
          action: "update",
          qb_id: qbResponse.Id,
          request_payload: updatePayload as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.updated++;
        result.details.push({ localId: employee.id, action: "updated", qbId: qbResponse.Id });
      } else if (existingMapping?.qb_id) {
        const fetchResult = await qbApiRequest<{ Vendor: QBVendor }>(realmId, `/vendor/${existingMapping.qb_id}`, {
          query: { minorversion: "65" },
        });
        if (!fetchResult.success) {
          throw new Error(`Could not fetch existing QB vendor ${existingMapping.qb_id}: ${(fetchResult as QBApiError).error}`);
        }

        const updatePayload = {
          ...qbVendorData,
          Id: existingMapping.qb_id,
          SyncToken: fetchResult.data.Vendor.SyncToken,
          sparse: true,
        };
        const updateResult = await qbApiRequest<{ Vendor: QBVendor }>(realmId, "/vendor", {
          method: "POST",
          body: updatePayload as unknown as Record<string, unknown>,
        });
        if (!updateResult.success) throw new Error((updateResult as QBApiError).error);

        qbResponse = updateResult.data.Vendor;
        await logSyncAudit({
          entity_type: "vendor",
          entity_id: employee.id,
          action: "update",
          qb_id: qbResponse.Id,
          request_payload: updatePayload as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.updated++;
        result.details.push({ localId: employee.id, action: "updated", qbId: qbResponse.Id });
      } else {
        const createResult = await qbApiRequest<{ Vendor: QBVendor }>(realmId, "/vendor", {
          method: "POST",
          body: qbVendorData as unknown as Record<string, unknown>,
        });
        if (!createResult.success) throw new Error((createResult as QBApiError).error);

        qbResponse = createResult.data.Vendor;
        await logSyncAudit({
          entity_type: "vendor",
          entity_id: employee.id,
          action: "create",
          qb_id: qbResponse.Id,
          request_payload: qbVendorData as unknown as Record<string, unknown>,
          response_payload: qbResponse as unknown as Record<string, unknown>,
          triggered_by: userId,
        });
        result.created++;
        result.details.push({ localId: employee.id, action: "created", qbId: qbResponse.Id });
      }

      await upsertSyncMapping(
        "vendor",
        employee.id,
        qbResponse.Id ?? "",
        qbResponse.SyncToken ?? "0",
        currentHash,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await logSyncAudit({
        entity_type: "vendor",
        entity_id: employee.id,
        action: existingQB || existingMapping ? "update" : "create",
        error: errorMessage,
        triggered_by: userId,
      });
      result.errors++;
      result.details.push({ localId: employee.id, action: "error", error: errorMessage });
    }
  }

  result.success = result.errors === 0;
  return result;
}

export interface SyncStatusSummary {
  customers: { total: number; synced: number; lastSyncAt: string | null };
  vendors: { total: number; synced: number; lastSyncAt: string | null };
  invoices: { total: number; synced: number; lastSyncAt: string | null };
  recentAudit: Array<{
    entity_type: string;
    action: string;
    qb_id: string | null;
    error: string | null;
    created_at: string;
  }>;
}

export async function getSyncStatus(): Promise<SyncStatusSummary> {
  const supabase = createAdminClient();

  const [{ count: customerCount }, { count: vendorCount }, { count: invoiceCount }] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }).not("customer_name", "is", null),
    supabase.from("profiles").select("id", { count: "exact", head: true }).in("role", ["employee", "crew_lead"]),
    supabase.from("completion_reports").select("id", { count: "exact", head: true }),
  ]);

  const [{ count: syncedCustomers }, { count: syncedVendors }, { count: syncedInvoices }] = await Promise.all([
    supabase.from("quickbooks_sync_mappings").select("id", { count: "exact", head: true }).eq("entity_type", "customer"),
    supabase.from("quickbooks_sync_mappings").select("id", { count: "exact", head: true }).eq("entity_type", "vendor"),
    supabase.from("quickbooks_sync_mappings").select("id", { count: "exact", head: true }).eq("entity_type", "invoice"),
  ]);

  const [{ data: lastCustomerSync }, { data: lastVendorSync }, { data: lastInvoiceSync }] = await Promise.all([
    supabase
      .from("quickbooks_sync_mappings")
      .select("last_synced_at")
      .eq("entity_type", "customer")
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("quickbooks_sync_mappings")
      .select("last_synced_at")
      .eq("entity_type", "vendor")
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("quickbooks_sync_mappings")
      .select("last_synced_at")
      .eq("entity_type", "invoice")
      .order("last_synced_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const { data: recentAudit } = await supabase
    .from("quickbooks_sync_audit")
    .select("entity_type, action, qb_id, error, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    customers: {
      total: customerCount ?? 0,
      synced: syncedCustomers ?? 0,
      lastSyncAt: (lastCustomerSync as { last_synced_at?: string } | null)?.last_synced_at ?? null,
    },
    vendors: {
      total: vendorCount ?? 0,
      synced: syncedVendors ?? 0,
      lastSyncAt: (lastVendorSync as { last_synced_at?: string } | null)?.last_synced_at ?? null,
    },
    invoices: {
      total: invoiceCount ?? 0,
      synced: syncedInvoices ?? 0,
      lastSyncAt: (lastInvoiceSync as { last_synced_at?: string } | null)?.last_synced_at ?? null,
    },
    recentAudit: (recentAudit as SyncStatusSummary["recentAudit"]) ?? [],
  };
}

interface QBInvoiceLine {
  Amount: number;
  DetailType: "SalesItemLineDetail";
  Description?: string;
  SalesItemLineDetail: {
    Qty: number;
    UnitPrice: number;
    ItemRef?: { value: string; name?: string };
  };
}

interface QBInvoice {
  Id?: string;
  DocNumber?: string;
  TxnDate?: string;
  DueDate?: string;
  CustomerRef: { value: string; name?: string };
  Line: QBInvoiceLine[];
  CustomerMemo?: { value: string };
  PrivateNote?: string;
  EmailStatus?: "NotSet" | "NeedToSend" | "EmailSent";
  BillEmail?: { Address: string };
  Balance?: number;
  TotalAmt?: number;
  SyncToken?: string;
}

interface QBItem {
  Id: string;
  Name: string;
  Type: string;
  UnitPrice?: number;
  Active?: boolean;
}

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface LocalCompletionReport {
  id: string;
  job_id: string;
  total_amount: number | null;
  line_items: LineItem[] | null;
  notes: string | null;
  created_at: string;
  job:
    | {
        id: string;
        customer_name: string | null;
        customer_email: string | null;
        service_type: string | null;
        address: string | null;
        scheduled_date: string | null;
        status: string;
      }
    | Array<{
        id: string;
        customer_name: string | null;
        customer_email: string | null;
        service_type: string | null;
        address: string | null;
        scheduled_date: string | null;
        status: string;
      }>
    | null;
}

export interface InvoicePreview {
  reportId: string;
  jobId: string;
  customerName: string;
  action: "create" | "skip";
  reason?: string;
  totalAmount: number;
  lineItems: LineItem[];
  qbCustomerId?: string;
  existingInvoiceId?: string;
}

export interface InvoiceResult {
  success: boolean;
  mode: "dry_run" | "confirmed";
  processed: number;
  created: number;
  skipped: number;
  errors: number;
  amountWarnings: number;
  details: InvoiceItemResult[];
  totalInvoiced: number;
}

export interface InvoiceItemResult {
  reportId: string;
  jobId: string;
  action: "created" | "skipped" | "error" | "amount_warning";
  qbInvoiceId?: string;
  qbDocNumber?: string;
  amount?: number;
  error?: string;
  reason?: string;
}

function validateInvoiceAmount(amount: number): string | null {
  if (!Number.isFinite(amount)) {
    return `Invalid amount: not a finite number (${amount})`;
  }

  if (amount < SYNC_CONFIG.minInvoiceAmount) {
    return `Amount $${amount.toFixed(2)} is below minimum ($${SYNC_CONFIG.minInvoiceAmount}). Create manually in QuickBooks.`;
  }

  if (amount > SYNC_CONFIG.maxInvoiceAmount) {
    return `Amount $${amount.toFixed(2)} exceeds safety ceiling ($${SYNC_CONFIG.maxInvoiceAmount.toLocaleString()}). Create manually in QuickBooks for verification.`;
  }

  return null;
}

let cachedServiceItemId: string | null = null;

async function getOrCreateServiceItem(
  realmId: string,
): Promise<{ success: true; itemId: string } | { success: false; error: string }> {
  if (cachedServiceItemId) {
    return { success: true, itemId: cachedServiceItemId };
  }

  const searchResult = await qbApiRequest<{ QueryResponse: { Item?: QBItem[] } }>(realmId, "/query", {
    query: {
      query: "SELECT * FROM Item WHERE Name = 'Cleaning Service' AND Type = 'Service'",
      minorversion: "65",
    },
  });

  if (searchResult.success) {
    const existing = searchResult.data.QueryResponse?.Item?.[0];
    if (existing?.Id) {
      cachedServiceItemId = existing.Id;
      return { success: true, itemId: existing.Id };
    }
  }

  const broadSearch = await qbApiRequest<{ QueryResponse: { Item?: QBItem[] } }>(realmId, "/query", {
    query: {
      query: "SELECT * FROM Item WHERE Type = 'Service' AND Active = true MAXRESULTS 50",
      minorversion: "65",
    },
  });

  if (broadSearch.success) {
    const items = broadSearch.data.QueryResponse?.Item ?? [];
    const cleaningItem = items.find((item) => item.Name.toLowerCase().includes("clean"));
    if (cleaningItem?.Id) {
      cachedServiceItemId = cleaningItem.Id;
      return { success: true, itemId: cleaningItem.Id };
    }

    if (items.length > 0 && items[0].Id) {
      cachedServiceItemId = items[0].Id;
      return { success: true, itemId: items[0].Id };
    }
  }

  const createResult = await qbApiRequest<{ Item: QBItem }>(realmId, "/item", {
    method: "POST",
    body: {
      Name: "Cleaning Service",
      Type: "Service",
      IncomeAccountRef: { name: "Services" },
      Description: "Professional cleaning service",
    },
  });

  if (!createResult.success) {
    return {
      success: false,
      error: (createResult as QBApiError).error ?? "Could not create service item",
    };
  }

  cachedServiceItemId = createResult.data.Item.Id;
  return { success: true, itemId: createResult.data.Item.Id };
}

async function resolveQBCustomerId(
  realmId: string,
  customerName: string,
  localJobId: string,
): Promise<{ found: true; qbId: string } | { found: false; reason: string }> {
  const supabase = createAdminClient();

  const { data: mapping } = await supabase
    .from("quickbooks_sync_mappings")
    .select("qb_id")
    .eq("entity_type", "customer")
    .eq("local_id", localJobId)
    .maybeSingle();

  if ((mapping as { qb_id?: string } | null)?.qb_id) {
    return { found: true, qbId: (mapping as { qb_id: string }).qb_id };
  }

  const nameKey = customerName.trim().replace(/'/g, "\\'");
  const searchResult = await qbApiRequest<{
    QueryResponse: { Customer?: Array<{ Id: string; DisplayName: string }> };
  }>(realmId, "/query", {
    query: {
      query: `SELECT Id, DisplayName FROM Customer WHERE DisplayName = '${nameKey}'`,
      minorversion: "65",
    },
  });

  if (searchResult.success) {
    const match = searchResult.data.QueryResponse?.Customer?.[0];
    if (match?.Id) {
      return { found: true, qbId: match.Id };
    }
  }

  const fuzzyResult = await qbApiRequest<{
    QueryResponse: { Customer?: Array<{ Id: string; DisplayName: string }> };
  }>(realmId, "/query", {
    query: {
      query: `SELECT Id, DisplayName FROM Customer WHERE DisplayName LIKE '%${nameKey}%' MAXRESULTS 5`,
      minorversion: "65",
    },
  });

  if (fuzzyResult.success) {
    const fuzzyMatch = fuzzyResult.data.QueryResponse?.Customer?.[0];
    if (fuzzyMatch?.Id) {
      return { found: true, qbId: fuzzyMatch.Id };
    }
  }

  return {
    found: false,
    reason: `Customer "${customerName}" not found in QuickBooks. Sync customers first.`,
  };
}

export async function generateInvoicesFromReports(
  realmId: string,
  userId: string,
  confirm = false,
  reportIds?: string[],
): Promise<InvoiceResult> {
  const supabase = createAdminClient();

  let query = supabase
    .from("completion_reports")
    .select(
      `
      id,
      job_id,
      total_amount,
      line_items,
      notes,
      created_at,
      job:jobs!inner (
        id,
        customer_name,
        customer_email,
        service_type,
        address,
        scheduled_date,
        status
      )
    `,
    )
    .not("total_amount", "is", null)
    .gt("total_amount", 0)
    .order("created_at", { ascending: true })
    .limit(SYNC_CONFIG.maxBatchSize);

  if (reportIds && reportIds.length > 0) {
    query = query.in("id", reportIds);
  }

  const { data: reports, error: fetchError } = await query;
  if (fetchError) {
    return {
      success: false,
      mode: confirm ? "confirmed" : "dry_run",
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 1,
      amountWarnings: 0,
      details: [{ reportId: "fetch", jobId: "", action: "error", error: fetchError.message }],
      totalInvoiced: 0,
    };
  }

  const typedReports = (reports ?? []) as unknown as LocalCompletionReport[];
  const unsyncedReports: LocalCompletionReport[] = [];
  const skippedAlreadySynced: InvoiceItemResult[] = [];

  for (const report of typedReports) {
    const existingMapping = await getSyncMapping("invoice", report.id);
    if (existingMapping) {
      skippedAlreadySynced.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "skipped",
        qbInvoiceId: existingMapping.qb_id,
        reason: "Invoice already synced to QuickBooks",
      });
    } else {
      unsyncedReports.push(report);
    }
  }

  let serviceItemId: string | null = null;
  if (confirm) {
    const itemResult = await getOrCreateServiceItem(realmId);
    if (itemResult.success) serviceItemId = itemResult.itemId;
  }

  const result: InvoiceResult = {
    success: true,
    mode: confirm ? "confirmed" : "dry_run",
    processed: typedReports.length,
    created: 0,
    skipped: skippedAlreadySynced.length,
    errors: 0,
    amountWarnings: 0,
    details: [...skippedAlreadySynced],
    totalInvoiced: 0,
  };

  for (const report of unsyncedReports) {
    const job = Array.isArray(report.job) ? report.job[0] : report.job;
    if (!job) {
      result.errors++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "error",
        error: "Completion report has no associated job.",
      });
      continue;
    }

    const customerName = job.customer_name?.trim();
    if (!customerName) {
      result.errors++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "error",
        error: "Job has no customer name. Cannot create invoice.",
      });
      continue;
    }

    const totalAmount = report.total_amount ?? 0;
    const amountError = validateInvoiceAmount(totalAmount);
    if (amountError) {
      result.amountWarnings++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "amount_warning",
        amount: totalAmount,
        reason: amountError,
      });
      continue;
    }

    let qbCustomerId: string | null = null;
    const customerLookup = await resolveQBCustomerId(realmId, customerName, job.id);
    if (customerLookup.found) {
      qbCustomerId = customerLookup.qbId;
    } else if (!confirm) {
      result.errors++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "error",
        amount: totalAmount,
        error: customerLookup.reason,
      });
      continue;
    } else {
      const autoCreateResult = await qbApiRequest<{
        Customer: { Id: string; DisplayName: string; SyncToken: string };
      }>(realmId, "/customer", {
        method: "POST",
        body: {
          DisplayName: customerName,
          PrimaryEmailAddr: job.customer_email ? { Address: job.customer_email } : undefined,
          BillAddr: job.address ? { Line1: job.address } : undefined,
        },
      });

      if (!autoCreateResult.success) {
        result.errors++;
        result.details.push({
          reportId: report.id,
          jobId: report.job_id,
          action: "error",
          amount: totalAmount,
          error: `Could not auto-create customer "${customerName}" in QB: ${(autoCreateResult as QBApiError).error}`,
        });
        await logSyncAudit({
          entity_type: "invoice",
          entity_id: report.id,
          action: "create",
          error: `Customer auto-create failed: ${(autoCreateResult as QBApiError).error}`,
          triggered_by: userId,
        });
        continue;
      }

      const newCustomer = autoCreateResult.data.Customer;
      await upsertSyncMapping(
        "customer",
        job.id,
        newCustomer.Id,
        newCustomer.SyncToken,
        computeSyncHash({ name: customerName, email: job.customer_email }),
      );
      await logSyncAudit({
        entity_type: "customer",
        entity_id: job.id,
        action: "auto_create",
        qb_id: newCustomer.Id,
        request_payload: { name: customerName, source: "invoice_generation" },
        triggered_by: userId,
      });

      qbCustomerId = newCustomer.Id;
    }

    if (!qbCustomerId) {
      result.errors++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "error",
        amount: totalAmount,
        error: "Could not resolve a QuickBooks customer ID.",
      });
      continue;
    }

    const lineItems: QBInvoiceLine[] = [];
    const reportLineItems = report.line_items ?? [];

    if (reportLineItems.length > 0) {
      for (const item of reportLineItems) {
        const line: QBInvoiceLine = {
          Amount: item.amount,
          DetailType: "SalesItemLineDetail",
          Description: item.description,
          SalesItemLineDetail: {
            Qty: item.quantity,
            UnitPrice: item.unit_price,
          },
        };
        if (serviceItemId) {
          line.SalesItemLineDetail.ItemRef = { value: serviceItemId, name: "Cleaning Service" };
        }
        lineItems.push(line);
      }
    } else {
      const description = [
        job.service_type ? `${job.service_type} cleaning` : "Cleaning service",
        job.address ? `at ${job.address}` : "",
        job.scheduled_date ? `on ${job.scheduled_date}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const line: QBInvoiceLine = {
        Amount: totalAmount,
        DetailType: "SalesItemLineDetail",
        Description: description,
        SalesItemLineDetail: { Qty: 1, UnitPrice: totalAmount },
      };
      if (serviceItemId) {
        line.SalesItemLineDetail.ItemRef = { value: serviceItemId, name: "Cleaning Service" };
      }
      lineItems.push(line);
    }

    const txnDate = job.scheduled_date ?? new Date().toISOString().slice(0, 10);
    const dueDate = new Date(txnDate);
    dueDate.setDate(dueDate.getDate() + SYNC_CONFIG.defaultPaymentTermDays);

    const qbInvoice: QBInvoice = {
      CustomerRef: { value: qbCustomerId },
      TxnDate: txnDate,
      DueDate: dueDate.toISOString().slice(0, 10),
      Line: lineItems,
      PrivateNote: `Auto-generated from completion report ${report.id} for job ${report.job_id}`,
    };

    if (report.notes) {
      qbInvoice.CustomerMemo = { value: report.notes.slice(0, 1000) };
    }
    if (job.customer_email) {
      qbInvoice.BillEmail = { Address: job.customer_email };
      qbInvoice.EmailStatus = "NeedToSend";
    }

    if (!confirm) {
      result.created++;
      result.totalInvoiced += totalAmount;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "created",
        amount: totalAmount,
        reason: `Would create invoice for ${customerName}: $${totalAmount.toFixed(2)} due ${dueDate.toISOString().slice(0, 10)}`,
      });
      continue;
    }

    try {
      const createResult = await qbApiRequest<{ Invoice: QBInvoice }>(realmId, "/invoice", {
        method: "POST",
        body: qbInvoice as unknown as Record<string, unknown>,
      });
      if (!createResult.success) {
        throw new Error((createResult as QBApiError).error);
      }

      const createdInvoice = createResult.data.Invoice;
      await upsertSyncMapping(
        "invoice",
        report.id,
        createdInvoice.Id ?? "",
        createdInvoice.SyncToken ?? "0",
        computeSyncHash({ reportId: report.id, jobId: report.job_id, amount: totalAmount }),
      );

      await logSyncAudit({
        entity_type: "invoice",
        entity_id: report.id,
        action: "create",
        qb_id: createdInvoice.Id,
        request_payload: {
          customerName,
          amount: totalAmount,
          lineCount: lineItems.length,
          dueDate: dueDate.toISOString().slice(0, 10),
        },
        response_payload: createdInvoice as unknown as Record<string, unknown>,
        triggered_by: userId,
      });

      await supabase
        .from("completion_reports")
        .update({
          qb_invoice_id: createdInvoice.Id,
          qb_invoice_number: createdInvoice.DocNumber ?? null,
          invoiced_at: new Date().toISOString(),
        })
        .eq("id", report.id);

      result.created++;
      result.totalInvoiced += totalAmount;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "created",
        qbInvoiceId: createdInvoice.Id,
        qbDocNumber: createdInvoice.DocNumber,
        amount: totalAmount,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await logSyncAudit({
        entity_type: "invoice",
        entity_id: report.id,
        action: "create",
        error: errorMessage,
        request_payload: { customerName, amount: totalAmount },
        triggered_by: userId,
      });

      result.errors++;
      result.details.push({
        reportId: report.id,
        jobId: report.job_id,
        action: "error",
        amount: totalAmount,
        error: errorMessage,
      });
    }
  }

  result.success = result.errors === 0;
  return result;
}

export async function generateSingleInvoice(
  realmId: string,
  userId: string,
  reportId: string,
  confirm = false,
): Promise<InvoiceResult> {
  return generateInvoicesFromReports(realmId, userId, confirm, [reportId]);
}

export async function getInvoiceSyncSummary(): Promise<{
  totalReports: number;
  invoiced: number;
  pending: number;
  totalInvoicedAmount: number;
  recentInvoices: Array<{
    reportId: string;
    jobId: string;
    amount: number;
    qbInvoiceId: string;
    invoicedAt: string;
  }>;
}> {
  const supabase = createAdminClient();

  const { count: totalReports } = await supabase
    .from("completion_reports")
    .select("id", { count: "exact", head: true })
    .not("total_amount", "is", null)
    .gt("total_amount", 0);

  const { count: invoiced } = await supabase
    .from("completion_reports")
    .select("id", { count: "exact", head: true })
    .not("qb_invoice_id", "is", null);

  const { data: invoicedReports } = await supabase
    .from("completion_reports")
    .select("total_amount")
    .not("qb_invoice_id", "is", null);

  const totalInvoicedAmount = (invoicedReports ?? []).reduce((sum, row) => {
    const typed = row as { total_amount: number | null };
    return sum + (typed.total_amount ?? 0);
  }, 0);

  const { data: recent } = await supabase
    .from("completion_reports")
    .select("id, job_id, total_amount, qb_invoice_id, invoiced_at")
    .not("qb_invoice_id", "is", null)
    .order("invoiced_at", { ascending: false })
    .limit(10);

  return {
    totalReports: totalReports ?? 0,
    invoiced: invoiced ?? 0,
    pending: (totalReports ?? 0) - (invoiced ?? 0),
    totalInvoicedAmount,
    recentInvoices: (recent ?? []).map((row) => {
      const typed = row as {
        id: string;
        job_id: string;
        total_amount: number | null;
        qb_invoice_id: string | null;
        invoiced_at: string | null;
      };
      return {
        reportId: typed.id,
        jobId: typed.job_id,
        amount: typed.total_amount ?? 0,
        qbInvoiceId: typed.qb_invoice_id ?? "",
        invoicedAt: typed.invoiced_at ?? "",
      };
    }),
  };
}

export { SYNC_CONFIG };