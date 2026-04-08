const globalStore = globalThis as typeof globalThis & {
  __adakanRateLimitStore?: Map<string, { attempts: number[]; lastSeen: number }>;
  __adakanRateLimitCleanupCounter?: number;
};

const RATE_LIMIT_ENTRY_TTL_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 5000;

const rateLimitStore =
  globalStore.__adakanRateLimitStore ?? new Map<string, { attempts: number[]; lastSeen: number }>();
globalStore.__adakanRateLimitStore = rateLimitStore;
globalStore.__adakanRateLimitCleanupCounter ??= 0;

export interface RateLimitOptions {
  scope: string;
  limit: number;
  windowMs: number;
  keySuffix?: string;
}

export function buildRequestFingerprintFromHeaders(headerStore: Headers): string {
  const ip = getClientIpFromHeadersSync(headerStore);
  const userAgent = headerStore.get("user-agent") || "unknown";
  return `${ip}:${userAgent.slice(0, 120)}`;
}

export function buildIpRateLimitKeyFromHeaders(headerStore: Headers): string {
  return getClientIpFromHeadersSync(headerStore);
}

export function getClientIpFromHeadersSync(headerStore: Headers): string {
  const cfConnectingIp = headerStore.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const forwardedFor = headerStore.get("x-forwarded-for") ?? "";
  return forwardedFor.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
}

function cleanupRateLimitStore(now: number) {
  globalStore.__adakanRateLimitCleanupCounter = (globalStore.__adakanRateLimitCleanupCounter ?? 0) + 1;

  if (
    globalStore.__adakanRateLimitCleanupCounter % 50 !== 0 &&
    rateLimitStore.size <= RATE_LIMIT_MAX_KEYS
  ) {
    return;
  }

  const staleBefore = now - RATE_LIMIT_ENTRY_TTL_MS;

  for (const [key, entry] of rateLimitStore.entries()) {
    const attempts = entry.attempts.filter((ts) => ts >= staleBefore);

    if (attempts.length === 0 && entry.lastSeen < staleBefore) {
      rateLimitStore.delete(key);
      continue;
    }

    if (attempts.length !== entry.attempts.length) {
      rateLimitStore.set(key, { attempts, lastSeen: entry.lastSeen });
    }
  }

  if (rateLimitStore.size <= RATE_LIMIT_MAX_KEYS) {
    return;
  }

  const oldestEntries = [...rateLimitStore.entries()]
    .sort((a, b) => a[1].lastSeen - b[1].lastSeen)
    .slice(0, rateLimitStore.size - RATE_LIMIT_MAX_KEYS);

  for (const [key] of oldestEntries) {
    rateLimitStore.delete(key);
  }
}

export function enforceRateLimitByKey(options: RateLimitOptions, keySuffix: string): boolean {
  const key = `${options.scope}:${options.keySuffix ?? keySuffix}`;
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const entry = rateLimitStore.get(key);
  const attempts = (entry?.attempts ?? []).filter((ts) => ts >= windowStart);

  if (attempts.length >= options.limit) {
    rateLimitStore.set(key, { attempts, lastSeen: now });
    cleanupRateLimitStore(now);
    return false;
  }

  attempts.push(now);
  rateLimitStore.set(key, { attempts, lastSeen: now });
  cleanupRateLimitStore(now);
  return true;
}

export function validateHoneypot(formData: FormData, fieldName = "website"): boolean {
  const value = formData.get(fieldName);
  return typeof value !== "string" || value.trim() === "";
}

export function validateFormAge(formData: FormData, fieldName = "formStartedAt", minAgeMs = 1200): boolean {
  const raw = formData.get(fieldName);
  if (typeof raw !== "string") return false;
  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt)) return false;
  return Date.now() - startedAt >= minAgeMs;
}
