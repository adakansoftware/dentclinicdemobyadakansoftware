import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import AdminFAQClient from "@/components/admin/AdminFAQClient";
import type { FAQData } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminFAQPage() {
  await requireAdmin();
  const rows = await safeQuery("admin faq items", () => prisma.fAQItem.findMany({ orderBy: { order: "asc" } }), []);
  const faqs: FAQData[] = rows.map((f) => ({
    id: f.id, questionTr: f.questionTr, questionEn: f.questionEn,
    answerTr: f.answerTr, answerEn: f.answerEn,
    order: f.order, isActive: f.isActive,
  }));
  return <AdminFAQClient faqs={faqs} />;
}
