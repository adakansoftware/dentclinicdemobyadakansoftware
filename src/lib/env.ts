import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACE_ID: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  SMS_ENABLED: z.enum(["true", "false"]).optional(),
  NETGSM_USERNAME: z.string().optional(),
  NETGSM_PASSWORD: z.string().optional(),
  NETGSM_HEADER: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function resetEnvCacheForTests() {
  cachedEnv = null;
}

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(issue?.message ?? "Invalid environment configuration");
  }

  if (
    parsed.data.SMS_ENABLED === "true" &&
    (!parsed.data.NETGSM_USERNAME || !parsed.data.NETGSM_PASSWORD || !parsed.data.NETGSM_HEADER)
  ) {
    throw new Error("NETGSM_USERNAME, NETGSM_PASSWORD, and NETGSM_HEADER are required when SMS_ENABLED=true");
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getOptionalEnv() {
  return envSchema.partial().parse(process.env);
}
