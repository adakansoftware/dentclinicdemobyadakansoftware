import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRequestFingerprintFromHeaders,
  enforceRateLimitByKey,
  getClientIpFromHeadersSync,
  validateFormAge,
  validateHoneypot,
} from "@/lib/security";

test("getClientIpFromHeadersSync prefers forwarded headers", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.10, 10.0.0.2",
    "x-real-ip": "198.51.100.1",
  });

  assert.equal(getClientIpFromHeadersSync(headers), "203.0.113.10");
});

test("buildRequestFingerprintFromHeaders includes IP and user agent", () => {
  const headers = new Headers({
    "x-real-ip": "198.51.100.1",
    "user-agent": "SmokeTestAgent/1.0",
  });

  assert.equal(buildRequestFingerprintFromHeaders(headers), "198.51.100.1:SmokeTestAgent/1.0");
});

test("validateHoneypot rejects filled bot field", () => {
  const formData = new FormData();
  formData.set("website", "spam");
  assert.equal(validateHoneypot(formData), false);
});

test("validateFormAge accepts sufficiently old forms", () => {
  const formData = new FormData();
  formData.set("formStartedAt", String(Date.now() - 2000));
  assert.equal(validateFormAge(formData), true);
});

test("enforceRateLimitByKey blocks after limit", () => {
  const scope = `unit-test-${Date.now()}`;
  const options = { scope, limit: 2, windowMs: 60_000 };

  assert.equal(enforceRateLimitByKey(options, "same-user"), true);
  assert.equal(enforceRateLimitByKey(options, "same-user"), true);
  assert.equal(enforceRateLimitByKey(options, "same-user"), false);
});
