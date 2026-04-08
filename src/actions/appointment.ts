"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { checkSlotAvailabilityWithDb, getAvailableSlots } from "@/lib/slots";
import { verifyTurnstileToken } from "@/lib/bot-protection";
import { getSiteSettings } from "@/lib/settings";
import { sendSms, buildConfirmationMessage, buildCancellationMessage } from "@/lib/sms";
import { dateOnlyToDbDate, dateToIsoDate, getTodayDateInTurkey, compareDateStrings } from "@/lib/date";
import { enforceRateLimit, validateFormAge, validateHoneypot } from "@/lib/security";
import { revalidatePath } from "next/cache";
import type { ActionResult, TimeSlot } from "@/types";

const SLOT_UNAVAILABLE_ERROR = "SLOT_UNAVAILABLE_ERROR";

const createAppointmentSchema = z
  .object({
    serviceId: z.string().min(1, "Hizmet seçimi gerekli"),
    specialistId: z.string().min(1, "Uzman seçimi gerekli"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli tarih girin"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Geçerli saat girin"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Geçerli bitiş saati girin"),
    patientName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı").max(120),
    patientPhone: z.string().trim().min(10, "Geçerli telefon numarası girin").max(30).regex(/^[\d\s\+\-\(\)]+$/),
    patientEmail: z.string().trim().email().or(z.literal("")),
    patientNote: z.string().trim().max(500).optional(),
    patientLanguage: z.enum(["TR", "EN"]).default("TR"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Bitiş saati başlangıç saatinden sonra olmalı",
    path: ["endTime"],
  });

export async function createAppointmentAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (!validateHoneypot(formData) || !validateFormAge(formData)) {
    return { success: false, error: "İstek doğrulanamadı. Lütfen formu tekrar gönderin." };
  }

  const turnstileValid = await verifyTurnstileToken(formData.get("cf-turnstile-response"));
  if (!turnstileValid) {
    return { success: false, error: "Bot doğrulaması başarısız oldu. Lütfen tekrar deneyin." };
  }

  const allowed = await enforceRateLimit({
    scope: "appointment-create",
    limit: 6,
    windowMs: 15 * 60 * 1000,
  });

  if (!allowed) {
    return { success: false, error: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." };
  }

  const parsed = createAppointmentSchema.safeParse({
    serviceId: formData.get("serviceId"),
    specialistId: formData.get("specialistId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    patientName: formData.get("patientName"),
    patientPhone: formData.get("patientPhone"),
    patientEmail: formData.get("patientEmail") ?? "",
    patientNote: formData.get("patientNote") ?? "",
    patientLanguage: formData.get("patientLanguage") ?? "TR",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Hata" };
  }

  const { serviceId, specialistId, date, startTime, endTime, patientLanguage } = parsed.data;

  if (compareDateStrings(date, getTodayDateInTurkey()) < 0) {
    return {
      success: false,
      error: patientLanguage === "EN" ? "Please choose a future date." : "Lütfen ileri bir tarih seçin.",
    };
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const lockKey = `appointment:${specialistId}:${date}:${startTime}:${endTime}`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      const available = await checkSlotAvailabilityWithDb(tx, specialistId, date, startTime, endTime);
      if (!available) {
        throw new Error(SLOT_UNAVAILABLE_ERROR);
      }

      return tx.appointment.create({
        data: {
          serviceId,
          specialistId,
          date: dateOnlyToDbDate(date),
          startTime,
          endTime,
          patientName: parsed.data.patientName,
          patientPhone: parsed.data.patientPhone,
          patientEmail: parsed.data.patientEmail ?? "",
          patientNote: parsed.data.patientNote ?? "",
          patientLanguage: parsed.data.patientLanguage,
          status: "PENDING",
        },
      });
    });

    void (async () => {
      try {
        const settings = await getSiteSettings();
        const message = buildConfirmationMessage(
          parsed.data.patientLanguage,
          parsed.data.patientName,
          date,
          startTime,
          settings.clinicName,
          settings.phone
        );
        await sendSms({
          phone: parsed.data.patientPhone,
          message,
          appointmentId: appointment.id,
          type: "CONFIRMATION",
        });
      } catch {
        // SMS failures should not block the booking flow.
      }
    })();

    return { success: true, data: { id: appointment.id } };
  } catch (error) {
    if (error instanceof Error && error.message === SLOT_UNAVAILABLE_ERROR) {
      return {
        success: false,
        error:
          patientLanguage === "EN"
            ? "This time slot is no longer available. Please choose another time."
            : "Bu zaman dilimi artık uygun değil. Lütfen başka bir saat seçin.",
      };
    }

    return {
      success: false,
      error: patientLanguage === "EN" ? "An unexpected error occurred." : "Beklenmeyen bir hata oluştu.",
    };
  }
}

const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  adminNote: z.string().max(1000).optional(),
});

export async function updateAppointmentStatusAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updateStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Hata" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: parsed.data.id },
    include: { service: true, specialist: true },
  });

  if (!appointment) {
    return { success: false, error: "Randevu bulunamadı" };
  }

  await prisma.appointment.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote ?? appointment.adminNote,
    },
  });

  if (parsed.data.status === "CANCELLED" && appointment.status !== "CANCELLED") {
    void (async () => {
      try {
        const settings = await getSiteSettings();
        const dateStr = dateToIsoDate(appointment.date);
        const message = buildCancellationMessage(
          appointment.patientLanguage,
          appointment.patientName,
          dateStr,
          appointment.startTime,
          settings.clinicName,
          settings.phone
        );
        await sendSms({
          phone: appointment.patientPhone,
          message,
          appointmentId: appointment.id,
          type: "CANCELLATION",
        });
      } catch {
        // SMS failures should not block the admin flow.
      }
    })();
  }

  revalidatePath("/admin/appointments");
  return { success: true };
}

export async function getAvailableSlotsAction(
  specialistId: string,
  date: string
): Promise<TimeSlot[]> {
  const allowed = await enforceRateLimit({
    scope: "slots-action",
    limit: 24,
    windowMs: 60 * 1000,
    keySuffix: `${specialistId}:${date}`,
  });

  if (!allowed) {
    return [];
  }

  return getAvailableSlots(specialistId, date);
}
