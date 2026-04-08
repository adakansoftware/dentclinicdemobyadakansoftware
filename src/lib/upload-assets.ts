import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

const MIME_EXTENSION_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
} as const;

type AllowedMimeType = keyof typeof MIME_EXTENSION_MAP;

interface PersistOptions {
  category: "branding" | "services" | "specialists";
  value: string;
  existingValue?: string | null;
  allowedMimeTypes: readonly AllowedMimeType[];
  maxBytes: number;
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isLocalUploadPath(value: string) {
  return value.startsWith("/uploads/");
}

function parseDataUrl(value: string) {
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) {
    throw new Error("Gorsel verisi okunamadi.");
  }

  return {
    mimeType: match[1].toLowerCase() as AllowedMimeType,
    base64: match[2].replace(/\s+/g, ""),
  };
}

function normalizeAssetValue(value: string) {
  return value.trim();
}

async function safeDeleteLocalUpload(value?: string | null) {
  if (!value || !isLocalUploadPath(value)) {
    return;
  }

  const relativePath = value.replace(/^\/+/, "");
  const filePath = path.join(PUBLIC_DIR, relativePath);
  const resolvedPath = path.resolve(filePath);
  const resolvedUploadsDir = path.resolve(UPLOADS_DIR);

  if (!resolvedPath.startsWith(resolvedUploadsDir)) {
    return;
  }

  try {
    await unlink(resolvedPath);
  } catch {
    // Ignore missing files and keep the flow resilient.
  }
}

export async function persistImageAsset({
  category,
  value,
  existingValue,
  allowedMimeTypes,
  maxBytes,
}: PersistOptions) {
  const trimmed = normalizeAssetValue(value);

  if (!trimmed) {
    if (existingValue && isLocalUploadPath(existingValue)) {
      await safeDeleteLocalUpload(existingValue);
    }
    return "";
  }

  if (isHttpUrl(trimmed) || trimmed.startsWith("/")) {
    if (existingValue && existingValue !== trimmed && isLocalUploadPath(existingValue)) {
      await safeDeleteLocalUpload(existingValue);
    }
    return trimmed;
  }

  if (!trimmed.startsWith("data:image/")) {
    throw new Error("Gorsel alani yalnizca yuklenen dosya, yerel yol veya gecerli URL kabul eder.");
  }

  const { mimeType, base64 } = parseDataUrl(trimmed);

  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error("Bu dosya turu desteklenmiyor.");
  }

  const buffer = Buffer.from(base64, "base64");

  if (!buffer.length) {
    throw new Error("Bos dosya yuklenemiyor.");
  }

  if (buffer.length > maxBytes) {
    throw new Error("Dosya boyutu siniri asildi.");
  }

  const directory = path.join(UPLOADS_DIR, category);
  await mkdir(directory, { recursive: true });

  const extension = MIME_EXTENSION_MAP[mimeType];
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(directory, fileName);
  await writeFile(filePath, buffer);

  if (existingValue && existingValue !== trimmed && isLocalUploadPath(existingValue)) {
    await safeDeleteLocalUpload(existingValue);
  }

  return `/uploads/${category}/${fileName}`;
}

export const IMAGE_INPUT_SCHEMA_MESSAGE = "Gecerli bir gorsel girin.";

export function isValidAssetInput(value: string) {
  const trimmed = normalizeAssetValue(value);
  return trimmed === "" || trimmed.startsWith("data:image/") || isHttpUrl(trimmed) || trimmed.startsWith("/");
}
