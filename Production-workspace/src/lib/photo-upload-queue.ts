export type PendingPhotoUpload = {
  id: string;
  type: "completion" | "issue";
  assignmentId: string;
  jobId: string;
  file: Blob;
  fileName: string;
  description?: string;
  createdAt: string;
};

const DB_NAME = "aa-cleaning-photo-queue";
const STORE_NAME = "pending-photo-uploads";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable."));
  });
}

export async function enqueuePendingPhotoUpload(upload: PendingPhotoUpload) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(upload);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Unable to queue upload."));
  });
}

export async function listPendingPhotoUploads() {
  const db = await openDb();
  return new Promise<PendingPhotoUpload[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as PendingPhotoUpload[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error("Unable to read queued uploads."));
  });
}

export async function removePendingPhotoUpload(id: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Unable to remove queued upload."));
  });
}
