export type PendingPhotoUpload = {
  id: string;
  type: "completion" | "issue";
  assignmentId: string;
  jobId: string;
  file: Blob;
  fileName: string;
  description?: string;
  createdAt: string;
  status?: "pending" | "syncing" | "failed";
  retryCount?: number;
  lastAttemptAt?: string;
  nextRetryAt?: string;
  dedupSignature?: string;
};

const DB_NAME = "aa-cleaning-photo-queue";
const STORE_NAME = "pending-photo-uploads";
const DB_VERSION = 2;
const MAX_RETRIES = 8;
const BASE_RETRY_DELAY_MS = 15_000;
const MAX_RETRY_DELAY_MS = 15 * 60_000;
const STALE_ITEM_MS = 7 * 24 * 60 * 60_000;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("nextRetryAt", "nextRetryAt", { unique: false });
        store.createIndex("dedupSignature", "dedupSignature", { unique: false });
      } else {
        const store = request.transaction?.objectStore(STORE_NAME);
        if (store && !store.indexNames.contains("status")) {
          store.createIndex("status", "status", { unique: false });
        }
        if (store && !store.indexNames.contains("nextRetryAt")) {
          store.createIndex("nextRetryAt", "nextRetryAt", { unique: false });
        }
        if (store && !store.indexNames.contains("dedupSignature")) {
          store.createIndex("dedupSignature", "dedupSignature", { unique: false });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable."));
  });
}

function normalizeUpload(upload: PendingPhotoUpload): PendingPhotoUpload {
  const nowIso = new Date().toISOString();

  return {
    ...upload,
    createdAt: upload.createdAt || nowIso,
    status: upload.status ?? "pending",
    retryCount: upload.retryCount ?? 0,
    dedupSignature: upload.dedupSignature ?? createDedupSignature(upload),
  };
}

function createDedupSignature(upload: PendingPhotoUpload): string {
  return [upload.type, upload.assignmentId, upload.jobId, upload.fileName, upload.description ?? ""]
    .join("::")
    .toLowerCase();
}

function computeNextRetryAt(retryCount: number): string {
  const exponential = BASE_RETRY_DELAY_MS * 2 ** Math.max(0, retryCount - 1);
  const bounded = Math.min(exponential, MAX_RETRY_DELAY_MS);
  const jitter = Math.floor(Math.random() * 5_000);
  return new Date(Date.now() + bounded + jitter).toISOString();
}

async function runInTransaction<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T> | T): Promise<T> {
  const db = await openDb();

  return await new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    Promise.resolve(fn(store))
      .then((value) => {
        transaction.oncomplete = () => resolve(value);
        transaction.onerror = () => reject(transaction.error ?? new Error("Queue transaction failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("Queue transaction aborted."));
      })
      .catch((error) => reject(error));
  });
}

export async function enqueuePendingPhotoUpload(upload: PendingPhotoUpload) {
  const normalized = normalizeUpload(upload);

  await runInTransaction("readwrite", async (store) => {
    const existingBySignature = await new Promise<PendingPhotoUpload | undefined>((resolve, reject) => {
      if (!store.indexNames.contains("dedupSignature") || !normalized.dedupSignature) {
        resolve(undefined);
        return;
      }

      const indexRequest = store.index("dedupSignature").get(normalized.dedupSignature);
      indexRequest.onsuccess = () => resolve(indexRequest.result as PendingPhotoUpload | undefined);
      indexRequest.onerror = () => reject(indexRequest.error ?? new Error("Unable to check duplicate uploads."));
    });

    if (existingBySignature && existingBySignature.status !== "failed") {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const putRequest = store.put(normalized);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error ?? new Error("Unable to queue upload."));
    });
  });
}

export async function listPendingPhotoUploads() {
  return await runInTransaction("readonly", (store) => {
    return new Promise<PendingPhotoUpload[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const rows = ((request.result as PendingPhotoUpload[]) ?? []).filter((row) => {
          if (!row.createdAt) {
            return true;
          }

          const createdMs = new Date(row.createdAt).getTime();
          return Number.isFinite(createdMs) && Date.now() - createdMs < STALE_ITEM_MS;
        });

        rows.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        resolve(rows);
      };
      request.onerror = () => reject(request.error ?? new Error("Unable to read queued uploads."));
    });
  });
}

export async function removePendingPhotoUpload(id: string) {
  await runInTransaction("readwrite", (store) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error("Unable to remove queued upload."));
    });
  });
}

export async function markPendingPhotoUploadAttempt(id: string, success: boolean): Promise<void> {
  await runInTransaction("readwrite", async (store) => {
    const existing = await new Promise<PendingPhotoUpload | undefined>((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as PendingPhotoUpload | undefined);
      request.onerror = () => reject(request.error ?? new Error("Unable to load queued upload."));
    });

    if (!existing) {
      return;
    }

    const retryCount = success ? 0 : (existing.retryCount ?? 0) + 1;
    const updated: PendingPhotoUpload = {
      ...existing,
      status: success ? "pending" : retryCount >= MAX_RETRIES ? "failed" : "pending",
      retryCount,
      lastAttemptAt: new Date().toISOString(),
      nextRetryAt: success ? undefined : computeNextRetryAt(retryCount),
    };

    await new Promise<void>((resolve, reject) => {
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error ?? new Error("Unable to update queued upload state."));
    });
  });
}

export async function getPendingPhotoUploadStats(): Promise<{
  total: number;
  pending: number;
  failed: number;
  retrying: number;
}> {
  const items = await listPendingPhotoUploads();

  let pending = 0;
  let failed = 0;
  let retrying = 0;

  for (const item of items) {
    if (item.status === "failed") {
      failed += 1;
      continue;
    }

    pending += 1;
    if ((item.retryCount ?? 0) > 0) {
      retrying += 1;
    }
  }

  return {
    total: items.length,
    pending,
    failed,
    retrying,
  };
}

export async function clearStalePendingPhotoUploads(): Promise<number> {
  const staleCutoff = Date.now() - STALE_ITEM_MS;
  const items = await listPendingPhotoUploads();
  const staleIds = items
    .filter((item) => {
      const createdMs = new Date(item.createdAt).getTime();
      return !Number.isFinite(createdMs) || createdMs < staleCutoff;
    })
    .map((item) => item.id);

  for (const id of staleIds) {
    await removePendingPhotoUpload(id);
  }

  return staleIds.length;
}
