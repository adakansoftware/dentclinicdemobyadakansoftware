import os from "os";
import path from "path";
import type { NextConfig } from "next";

function normalizeOrigin(origin: string) {
  return origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getLanOrigins() {
  const interfaces = os.networkInterfaces();
  const origins = new Set<string>();

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses ?? []) {
      if (address.family !== "IPv4" || address.internal) {
        continue;
      }

      origins.add(`${address.address}:3000`);
    }
  }

  return origins;
}

const allowedOrigins = Array.from(
  new Set([
    "localhost:3000",
    "127.0.0.1:3000",
    ...getLanOrigins(),
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXTAUTH_URL,
  ]
    .filter(Boolean)
    .map((origin) => normalizeOrigin(origin!)))
);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
