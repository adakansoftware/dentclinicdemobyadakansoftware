import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { buildReminderMessage, sendSms } from "@/lib/sms";
import { getEnv } from "@/lib/env";
import { dateToIsoDate, getTomorrowDateInTurkey, getUtcRangeForTurkeyDate } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const env = getEnv();
  const cronSecret = env.CRON_SECRET;

  if (env.NODE_ENV === "production" && !cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET is required in production" }, { status: 500 });
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrowDate = getTomorrowDateInTurkey();
  const { startUtc: tomorrow, endUtc: tomorrowEnd } = getUtcRangeForTurkeyDate(tomorrowDate);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: tomorrow, lte: tomorrowEnd },
      status: "CONFIRMED",
      smsSent: false,
    },
    include: { service: true, specialist: true },
  });

  const settings = await getSiteSettings();
  let sent = 0;
  let failed = 0;

  for (const apt of appointments) {
    try {
      const dateStr = dateToIsoDate(apt.date);
      const message = buildReminderMessage(
        apt.patientLanguage,
        apt.patientName,
        dateStr,
        apt.startTime,
        settings.clinicName,
        settings.phone
      );

      await sendSms({
        phone: apt.patientPhone,
        message,
        appointmentId: apt.id,
        type: "REMINDER",
      });

      await prisma.appointment.update({
        where: { id: apt.id },
        data: { smsSent: true },
      });

      sent++;
    } catch (err) {
      console.error(`Failed to send reminder for appointment ${apt.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    total: appointments.length,
    sent,
    failed,
    date: tomorrowDate,
  });
}
