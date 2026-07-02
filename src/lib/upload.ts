import { api, ApiError } from "./api";
import type { PhotoPlaceholder } from "./types";

interface PresignResult {
  key: string;
  uploadUrl: string;
  publicUrl: string;
}

/**
 * Upload a photo to S3 via a presigned PUT and return a photo object carrying
 * its URL. If storage isn't configured (503), resolves to `fallback` so the
 * flow still works in dev with placeholder art.
 */
export async function uploadPhoto(
  file: File,
  fallback: PhotoPlaceholder,
  folder: "pets" | "docs" = "pets",
): Promise<PhotoPlaceholder> {
  let presign: PresignResult;
  try {
    presign = await api<PresignResult>("/api/uploads", {
      method: "POST",
      body: { contentType: file.type, folder },
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 503) return fallback; // storage off
    throw e;
  }

  const res = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`upload failed (${res.status})`);

  return { ...fallback, url: presign.publicUrl };
}
