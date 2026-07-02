import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/*
 * S3 photo/document storage.
 *
 * Uploads go browser → S3 directly via a presigned PUT URL (the Next server
 * only signs, never proxies the bytes). Works with AWS S3 and any
 * S3-compatible service — Cloudflare R2, MinIO, DigitalOcean Spaces — by
 * setting S3_ENDPOINT. When the env isn't configured the whole feature
 * degrades: the client keeps using the gradient placeholders, so dev needs
 * zero setup.
 *
 * Required env: S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 * Optional: S3_ENDPOINT (S3-compatible), S3_PUBLIC_URL (CDN/read base),
 *           S3_FORCE_PATH_STYLE ("true" for MinIO).
 */

const {
  S3_BUCKET,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_PUBLIC_URL,
  S3_FORCE_PATH_STYLE,
} = process.env;

export function isStorageConfigured(): boolean {
  return Boolean(S3_BUCKET && S3_REGION && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);
}

let client: S3Client | null = null;
function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT || undefined,
      forcePathStyle: S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID!,
        secretAccessKey: S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Public read URL for a stored object. */
export function publicUrl(key: string): string {
  if (S3_PUBLIC_URL) return `${S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  if (S3_ENDPOINT) {
    const base = S3_ENDPOINT.replace(/\/$/, "");
    return S3_FORCE_PATH_STYLE === "true" ? `${base}/${S3_BUCKET}/${key}` : `${base}/${key}`;
  }
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

export interface PresignResult {
  key: string;
  uploadUrl: string;
  publicUrl: string;
}

/**
 * Presign a PUT for a new object. `folder` scopes the key (e.g. "pets",
 * "docs"); `userId` namespaces uploads per owner. Returns null on a bad type.
 */
export async function presignUpload(
  contentType: string,
  folder: string,
  userId: string,
  rand: string,
): Promise<PresignResult | null> {
  if (!ALLOWED.has(contentType)) return null;
  const ext = EXT[contentType];
  const key = `${folder}/${userId}/${rand}.${ext}`;
  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );
  return { key, uploadUrl, publicUrl: publicUrl(key) };
}
