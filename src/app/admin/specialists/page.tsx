import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import AdminSpecialistsClient from "@/components/admin/AdminSpecialistsClient";
import type { ServiceData } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminSpecialistsPage() {
  await requireAdmin();
  const [rows, svcRows] = await Promise.all([
    safeQuery(
      "admin specialists",
      () =>
        prisma.specialist.findMany({
          orderBy: { order: "asc" },
          include: { specialistServices: { include: { service: true } } },
        }),
      []
    ),
    safeQuery("admin active services", () => prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }), []),
  ]);

  const services: ServiceData[] = svcRows.map((s) => ({
    id: s.id, slug: s.slug, nameTr: s.nameTr, nameEn: s.nameEn,
    shortDescTr: s.shortDescTr, shortDescEn: s.shortDescEn,
    descriptionTr: s.descriptionTr, descriptionEn: s.descriptionEn,
    iconName: s.iconName, durationMinutes: s.durationMinutes,
    order: s.order, isActive: s.isActive,
  }));

  const specialists = rows.map((sp) => ({
    id: sp.id, slug: sp.slug, nameTr: sp.nameTr, nameEn: sp.nameEn,
    titleTr: sp.titleTr, titleEn: sp.titleEn,
    biographyTr: sp.biographyTr, biographyEn: sp.biographyEn,
    photoUrl: sp.photoUrl, order: sp.order, isActive: sp.isActive,
    specialistServices: sp.specialistServices.map((ss) => ({
      id: ss.id,
      service: {
        id: ss.service.id, slug: ss.service.slug,
        nameTr: ss.service.nameTr, nameEn: ss.service.nameEn,
        shortDescTr: ss.service.shortDescTr, shortDescEn: ss.service.shortDescEn,
        descriptionTr: ss.service.descriptionTr, descriptionEn: ss.service.descriptionEn,
        iconName: ss.service.iconName, durationMinutes: ss.service.durationMinutes,
        order: ss.service.order, isActive: ss.service.isActive,
      },
    })),
  }));

  return <AdminSpecialistsClient specialists={specialists} services={services} />;
}
