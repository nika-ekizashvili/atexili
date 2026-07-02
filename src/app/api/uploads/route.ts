import { randomUUID } from "crypto";
import { error, handler, json, requireUser } from "@/server/http";
import { isStorageConfigured, presignUpload } from "@/server/storage";

/**
 * Presign a direct-to-S3 upload. Body: { contentType, folder? }.
 * Returns { uploadUrl, publicUrl, key } — the client PUTs the file to
 * uploadUrl, then stores publicUrl. 503 when storage isn't configured, so the
 * client can fall back to placeholder photos.
 */
export const POST = handler(async (req: Request) => {
  const user = await requireUser();
  if (!isStorageConfigured()) return error("storage not configured", 503);

  const { contentType, folder } = await req.json();
  const safeFolder = folder === "docs" ? "docs" : "pets";
  const result = await presignUpload(contentType, safeFolder, user.id, randomUUID());
  if (!result) return error("unsupported file type", 415);
  return json(result);
});
