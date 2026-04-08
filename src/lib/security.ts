import { headers } from "next/headers";
import {
  buildRequestFingerprintFromHeaders,
  enforceRateLimitByKey,
  getClientIpFromHeadersSync,
  type RateLimitOptions,
  validateFormAge,
  validateHoneypot,
} from "./security-core";

export {
  buildRequestFingerprintFromHeaders,
  buildIpRateLimitKeyFromHeaders,
  enforceRateLimitByKey,
  getClientIpFromHeadersSync,
  validateFormAge,
  validateHoneypot,
} from "./security-core";

export async function getRequestFingerprint(): Promise<string> {
  const headerStore = await headers();
  return buildRequestFingerprintFromHeaders(headerStore);
}

export async function enforceRateLimit(options: RateLimitOptions): Promise<boolean> {
  const fingerprint = await getRequestFingerprint();
  return enforceRateLimitByKey(options, fingerprint);
}
