import assert from "node:assert/strict";
import {
  compareDateStrings,
  dateOnlyToDbDate,
  dateToIsoDate,
  getCurrentMinutesInTurkey,
  getDayOfWeekFromDate,
  getTodayDateInTurkey,
  getTomorrowDateInTurkey,
  getUtcRangeForTurkeyDate,
} from "../src/lib/date.ts";
import { getEnv, resetEnvCacheForTests } from "../src/lib/env.ts";
import {
  buildRequestFingerprintFromHeaders,
  enforceRateLimitByKey,
  getClientIpFromHeadersSync,
  validateFormAge,
  validateHoneypot,
} from "../src/lib/security-core.ts";

const results: string[] = [];

function run(name: string, fn: () => void) {
  fn();
  results.push(name);
}

function withEnv(patch: Record<string, string | undefined>, fn: () => void) {
  const previous = new Map<string, string | undefined>();

  for (const [key, value] of Object.entries(patch)) {
    previous.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  resetEnvCacheForTests();

  try {
    fn();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }

    resetEnvCacheForTests();
  }
}

run("getTodayDateInTurkey returns Turkey-local date", () => {
  const now = new Date("2026-04-05T00:30:00.000Z");
  assert.equal(getTodayDateInTurkey(now), "2026-04-05");
});

run("getTomorrowDateInTurkey rolls over correctly", () => {
  const now = new Date("2026-12-31T20:30:00.000Z");
  assert.equal(getTomorrowDateInTurkey(now), "2027-01-01");
});

run("getCurrentMinutesInTurkey returns local time in minutes", () => {
  const now = new Date("2026-04-05T06:15:00.000Z");
  assert.equal(getCurrentMinutesInTurkey(now), 555);
});

run("compareDateStrings sorts ISO dates", () => {
  assert.equal(compareDateStrings("2026-04-05", "2026-04-05"), 0);
  assert.equal(compareDateStrings("2026-04-04", "2026-04-05"), -1);
  assert.equal(compareDateStrings("2026-04-06", "2026-04-05"), 1);
});

run("getDayOfWeekFromDate returns UTC-safe weekday", () => {
  assert.equal(getDayOfWeekFromDate("2026-04-05"), 0);
  assert.equal(getDayOfWeekFromDate("2026-04-06"), 1);
});

run("dateOnlyToDbDate and dateToIsoDate preserve date-only values", () => {
  const dbDate = dateOnlyToDbDate("2026-04-05");
  assert.equal(dateToIsoDate(dbDate), "2026-04-05");
});

run("getUtcRangeForTurkeyDate returns expected UTC range", () => {
  const { startUtc, endUtc } = getUtcRangeForTurkeyDate("2026-04-05");
  assert.ok(startUtc < endUtc);
  assert.equal(startUtc.toISOString(), "2026-04-04T21:00:00.000Z");
  assert.equal(endUtc.toISOString(), "2026-04-05T20:59:59.999Z");
});

run("getClientIpFromHeadersSync prefers forwarded headers", () => {
  const headerStore = new Headers({
    "x-forwarded-for": "203.0.113.10, 10.0.0.2",
    "x-real-ip": "198.51.100.1",
  });

  assert.equal(getClientIpFromHeadersSync(headerStore), "203.0.113.10");
});

run("buildRequestFingerprintFromHeaders includes IP and user agent", () => {
  const headerStore = new Headers({
    "x-real-ip": "198.51.100.1",
    "user-agent": "SmokeTestAgent/1.0",
  });

  assert.equal(buildRequestFingerprintFromHeaders(headerStore), "198.51.100.1:SmokeTestAgent/1.0");
});

run("validateHoneypot rejects filled bot field", () => {
  const formData = new FormData();
  formData.set("website", "spam");
  assert.equal(validateHoneypot(formData), false);
});

run("validateFormAge accepts sufficiently old forms", () => {
  const formData = new FormData();
  formData.set("formStartedAt", String(Date.now() - 2000));
  assert.equal(validateFormAge(formData), true);
});

run("enforceRateLimitByKey blocks after limit", () => {
  const scope = `unit-test-${Date.now()}`;
  const options = { scope, limit: 2, windowMs: 60_000 };

  assert.equal(enforceRateLimitByKey(options, "same-user"), true);
  assert.equal(enforceRateLimitByKey(options, "same-user"), true);
  assert.equal(enforceRateLimitByKey(options, "same-user"), false);
});

run("getEnv rejects SMS_ENABLED without provider credentials", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://example",
      SESSION_SECRET: "12345678901234567890123456789012",
      SMS_ENABLED: "true",
      NETGSM_USERNAME: undefined,
      NETGSM_PASSWORD: undefined,
      NETGSM_HEADER: undefined,
      NODE_ENV: "development",
    },
    () => {
      assert.throws(
        () => getEnv(),
        /NETGSM_USERNAME, NETGSM_PASSWORD, and NETGSM_HEADER are required when SMS_ENABLED=true/
      );
    }
  );
});

run("getEnv accepts valid minimal configuration", () => {
  withEnv(
    {
      DATABASE_URL: "postgresql://example",
      SESSION_SECRET: "12345678901234567890123456789012",
      SMS_ENABLED: "false",
      NETGSM_USERNAME: undefined,
      NETGSM_PASSWORD: undefined,
      NETGSM_HEADER: undefined,
      NODE_ENV: "development",
    },
    () => {
      const env = getEnv();
      assert.equal(env.DATABASE_URL, "postgresql://example");
      assert.equal(env.SMS_ENABLED, "false");
    }
  );
});

console.log(`Unit tests passed: ${results.length}`);
for (const result of results) {
  console.log(`- ${result}`);
}
