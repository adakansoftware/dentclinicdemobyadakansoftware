"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/bot-protection";
import { enforceRateLimit, validateFormAge, validateHoneypot } from "@/lib/security";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli").max(120),
  phone: z.string().trim().min(10, "Geçerli telefon girin").max(30).regex(/^[\d\s\+\-\(\)]+$/),
  email: z.string().trim().email("Geçerli e-posta girin").or(z.literal("")),
  subject: z.string().trim().min(3, "Konu gerekli").max(160),
  message: z.string().trim().min(10, "Mesaj gerekli").max(2000),
});

export async function submitContactAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!validateHoneypot(formData) || !validateFormAge(formData)) {
    return { success: false, error: "İstek doğrulanamadı. Lütfen tekrar deneyin." };
  }

  const turnstileValid = await verifyTurnstileToken(formData.get("cf-turnstile-response"));
  if (!turnstileValid) {
    return { success: false, error: "Bot doğrulaması başarısız oldu. Lütfen tekrar deneyin." };
  }

  const allowed = await enforceRateLimit({
    scope: "contact-submit",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!allowed) {
    return { success: false, error: "Çok fazla mesaj gönderildi. Lütfen biraz sonra tekrar deneyin." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Hata" };
  }

  await prisma.contactRequest.create({ data: parsed.data });
  revalidatePath("/admin/contact-requests");
  return { success: true };
}

export async function markContactReadAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "ID gerekli" };
  await prisma.contactRequest.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/contact-requests");
  return { success: true };
}

export async function deleteContactRequestAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "ID gerekli" };
  await prisma.contactRequest.delete({ where: { id } });
  revalidatePath("/admin/contact-requests");
  return { success: true };
}
