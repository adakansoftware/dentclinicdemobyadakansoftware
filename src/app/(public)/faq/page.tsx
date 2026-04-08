import type { Metadata } from "next";
import FAQClient from "@/components/public/FAQClient";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import type { FAQData } from "@/types";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildPublicPageMetadata({
    settings,
    title: `Sık Sorulan Sorular | ${settings.clinicName}`,
    description: `${settings.clinicName} hakkında en sık sorulan sorular ve yanıtları.`,
    path: "/faq",
  });
}

export default async function FAQPage() {
  const rows = await safeQuery(
    "faq list",
    () => prisma.fAQItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    []
  );
  const faqs: FAQData[] = rows.map((faq) => ({
    id: faq.id,
    questionTr: faq.questionTr,
    questionEn: faq.questionEn,
    answerTr: faq.answerTr,
    answerEn: faq.answerEn,
    order: faq.order,
    isActive: faq.isActive,
  }));

  return <FAQClient faqs={faqs} />;
}
