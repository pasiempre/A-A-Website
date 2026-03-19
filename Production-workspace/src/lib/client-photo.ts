export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.82;

export function validatePhoto(file: File) {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_TYPES)[number])) {
    throw new Error("Only JPG, PNG, and WebP images are supported.");
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new Error("Photos must be 10 MB or smaller.");
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    image.src = url;
  });
}

export async function compressPhoto(file: File) {
  validatePhoto(file);

  const image = await loadImage(file);
  const scale = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not initialize image processing.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (!nextBlob) {
          reject(new Error("Image compression failed."));
          return;
        }
        resolve(nextBlob);
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  return {
    blob,
    metadata: {
      originalSizeBytes: file.size,
      compressedSizeBytes: blob.size,
      mimeType: "image/jpeg",
    },
  };
}
