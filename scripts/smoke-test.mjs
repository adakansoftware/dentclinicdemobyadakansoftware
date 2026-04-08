import { spawn } from "node:child_process";
import process from "node:process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const defaultPort = 3200 + Math.floor(Math.random() * 400);
const port = Number(process.env.SMOKE_PORT || defaultPort);
const cwd = process.cwd();
const nextBin = path.join(cwd, "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForServer(baseUrl, timeoutMs = 45_000) {
  const startedAt = Date.now();
  let lastStatus = "no-response";

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      });

      if (response.ok) {
        return;
      }

      lastStatus = `status-${response.status}`;
    } catch {}

    await delay(500);
  }

  throw new Error(`Server did not become ready within ${timeoutMs}ms (last: ${lastStatus})`);
}

async function request(pathname, init) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    ...init,
  });

  const text = await response.text();
  return { status: response.status, text, headers: response.headers };
}

function startServer() {
  if (process.platform === "win32") {
    return spawn("cmd.exe", ["/c", nextBin, "start", "-p", String(port)], {
      cwd,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  }

  return spawn(nextBin, ["start", "-p", String(port)], {
    cwd,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function stopServer(server) {
  if (process.platform === "win32") {
    await new Promise((resolve) => {
      const killer = spawn("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });

      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }

  server.kill("SIGTERM");
  await delay(500);
  if (!server.killed) {
    server.kill("SIGKILL");
  }
}

async function main() {
  const server = startServer();
  let serverExited = false;
  let stdout = "";
  let stderr = "";

  server.on("exit", () => {
    serverExited = true;
  });

  server.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  server.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(`http://127.0.0.1:${port}`);

    const routes = ["/", "/about", "/services", "/appointment", "/admin/login", "/robots.txt", "/sitemap.xml"];
    for (const route of routes) {
      const response = await request(route);
      assert(response.status === 200, `${route} expected 200, got ${response.status}`);
    }

    const health = await request("/api/health");
    assert(health.status === 200, `/api/health expected 200, got ${health.status}`);
    assert(health.text.includes('"ok":true'), "/api/health did not report ok");
    assert(health.text.includes('"appUrlConfigured":true'), "/api/health did not report appUrlConfigured");

    const home = await request("/");
    const configuredSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    if (configuredSiteUrl) {
      assert(
        home.text.includes(configuredSiteUrl.replace(/\/$/, "")),
        "Homepage metadata did not include configured site URL"
      );
    }

    const cronUnauthorized = await request("/api/cron/reminders");
    assert(cronUnauthorized.status === 401, `/api/cron/reminders expected 401, got ${cronUnauthorized.status}`);

    const invalidSlots = await request("/api/slots");
    assert(invalidSlots.status === 400, `/api/slots without params expected 400, got ${invalidSlots.status}`);

    const malformedDateSlots = await request("/api/slots?specialistId=test&date=07-04-2026");
    assert(malformedDateSlots.status === 400, `/api/slots malformed date expected 400, got ${malformedDateSlots.status}`);

    const validSlots = await request("/api/slots?specialistId=test&date=2026-04-07");
    assert(validSlots.status === 200, `/api/slots valid request expected 200, got ${validSlots.status}`);

    const cronWrongSecret = await request("/api/cron/reminders", {
      headers: { authorization: "Bearer definitely-wrong" },
    });
    assert(cronWrongSecret.status === 401, `/api/cron/reminders wrong secret expected 401, got ${cronWrongSecret.status}`);

    let rateLimited = 0;
    for (let i = 0; i < 65; i += 1) {
      const response = await request("/api/slots?specialistId=test&date=2026-04-07");
      if (response.status === 429) {
        rateLimited += 1;
      }
    }

    assert(rateLimited > 0, "Expected slots API to trigger rate limiting");
    console.log("Smoke test passed");
  } finally {
    if (!serverExited) {
      await stopServer(server);
    }
  }

  if (stderr.trim()) {
    console.error(stderr.trim());
  }

  if (stdout.trim()) {
    console.log(stdout.trim());
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
