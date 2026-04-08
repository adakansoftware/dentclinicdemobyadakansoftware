import { getOptionalEnv } from "@/lib/env";

export function isTurnstileEnabled() {
  const env = getOptionalEnv();
  return Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export function getTurnstileSiteKey() {
  return getOptionalEnv().NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
}

export async function verifyTurnstileToken(token: FormDataEntryValue | null): Promise<boolean> {
  const env = getOptionalEnv();

  if (!env.TURNSTILE_SECRET_KEY || !env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return true;
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return false;
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
