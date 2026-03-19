"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";

import { createClient } from "@/lib/supabase/client";

type UploadResult = {
  path: string;
  metadata: {
    capturedAt: string;
    latitude: number | null;
    longitude: number | null;
    originalSizeBytes: number;
    compressedSizeBytes: number;
    mimeType: string;
  };
};

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.82;

function getCurrentPosition(): Promise<GeolocationPosition | null> {
  if (!navigator.geolocation) {
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

async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/webp" || file.type === "image/jpeg") {
    const image = await loadImage(file);
    const scale = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not initialize canvas context for compression.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression produced an empty file."));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    });
  }

  return file;
}

export default function CameraSpikePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setError(null);
    setStatus(null);
    setUploadResult(null);
    setIsUploading(true);

    try {
      const capturedAt = new Date().toISOString();
      const position = await getCurrentPosition();

      setStatus("Compressing image...");
      const compressed = await compressImage(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const nextPreview = URL.createObjectURL(compressed);
      setPreviewUrl(nextPreview);

      setStatus("Uploading to Supabase Storage...");
      const supabase = createClient();

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;
      const filePath = `camera-spike/${fileName}`;

      const metadata = {
        capturedAt,
        latitude: position?.coords.latitude ?? null,
        longitude: position?.coords.longitude ?? null,
        originalSizeBytes: file.size,
        compressedSizeBytes: compressed.size,
        mimeType: "image/jpeg",
      };

      const { error: uploadError } = await supabase.storage
        .from("job-photos-spike")
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
          metadata,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadResult({
        path: filePath,
        metadata,
      });
      setStatus("Upload complete.");
    } catch (uploadErr) {
      const message = uploadErr instanceof Error ? uploadErr.message : "Failed to upload image.";
      setError(message);
      setStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sprint 0 Camera Gate</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Camera + Upload Spike</h1>
          <p className="mt-2 text-sm text-slate-600">
            Captures from mobile camera, compresses client-side, captures GPS/timestamp metadata, and uploads to Supabase Storage bucket
            <span className="font-mono"> job-photos-spike</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPickImage}
            disabled={isUploading}
            className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? "Processing..." : "Capture / Select Photo"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) {
                void handleFile(selected);
              }
              event.currentTarget.value = "";
            }}
          />
        </div>

        {status ? <p className="text-sm text-blue-700">{status}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {previewUrl ? (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Preview</h2>
            <div className="relative h-[420px] w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100">
              <NextImage src={previewUrl} alt="Camera spike preview" fill className="object-contain" unoptimized />
            </div>
          </div>
        ) : null}

        {uploadResult ? (
          <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Upload Result</h2>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Path:</span> <span className="font-mono">{uploadResult.path}</span>
            </p>
            <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
{JSON.stringify(uploadResult.metadata, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </main>
  );
}
