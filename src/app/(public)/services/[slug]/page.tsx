import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/public/ServiceDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 60;



export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const row = await prisma.service.findUnique({
    where: { slug, isActive: true },
    include: {
      specialistServices: {
        include: {
          specialist: {
            select: {
              id: true,
              slug: true,
              nameTr: true,
              nameEn: true,
              titleTr: true,
              titleEn: true,
              photoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!row) notFound();

  const service = {
    id: row.id,
    slug: row.slug,
    nameTr: row.nameTr,
    nameEn: row.nameEn,
    descriptionTr: row.descriptionTr,
    descriptionEn: row.descriptionEn,
    shortDescTr: row.shortDescTr,
    shortDescEn: row.shortDescEn,
    iconName: row.iconName,
    durationMinutes: row.durationMinutes,
    imageUrl: row.imageUrl,
    specialistServices: row.specialistServices.map((ss) => ({
      specialist: ss.specialist,
    })),
  };

  return <ServiceDetailClient service={service} />;
}