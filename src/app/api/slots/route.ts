import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/slots";
import { buildRequestFingerprintFromHeaders, enforceRateLimitByKey } from "@/lib/security";

export const dynamic = "force-dynamic";

const slotsQuerySchema = z.object({
  specialistId: z.string().trim().min(1).max(64),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = slotsQuerySchema.safeParse({
    specialistId: searchParams.get("specialistId"),
    date: searchParams.get("date"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "specialistId and date required" },
      { status: 400 }
    );
  }

  const fingerprint = buildRequestFingerprintFromHeaders(request.headers);
  const allowed = enforceRateLimitByKey(
    {
      scope: "slots-api",
      limit: 60,
      windowMs: 60 * 1000,
    },
    fingerprint
  );

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const slots = await getAvailableSlots(parsed.data.specialistId, parsed.data.date);
    return NextResponse.json(slots, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to fetch slots" }, { status: 400 });
  }
}
