import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOptionalEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const env = getOptionalEnv();

    return NextResponse.json(
      {
        ok: true,
        database: "up",
        smsEnabled: env.SMS_ENABLED === "true",
        appUrlConfigured: Boolean(env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL),
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "down",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
