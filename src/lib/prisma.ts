import { PrismaClient } from "@prisma/client";
import { getEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const env = getEnv();

function getRuntimeDatabaseUrl() {
  const databaseUrl = env.DATABASE_URL;

  if (process.env.NODE_ENV === "production") {
    return databaseUrl;
  }

  try {
    const url = new URL(databaseUrl);
    const host = url.hostname.toLowerCase();
    const isManagedPostgres = host.includes("neon.tech") || host.includes("pooler.");
    const sslMode = url.searchParams.get("sslmode");
    const sslAccept = url.searchParams.get("sslaccept");

    if (isManagedPostgres && sslMode === "require" && !sslAccept) {
      url.searchParams.set("sslaccept", "accept_invalid_certs");
      return url.toString();
    }
  } catch {
    return databaseUrl;
  }

  return databaseUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getRuntimeDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
