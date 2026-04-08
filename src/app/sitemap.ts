import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, specialists] = await Promise.all([
    safeQuery(
      "sitemap services",
      () => prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      []
    ),
    safeQuery(
      "sitemap specialists",
      () => prisma.specialist.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      []
    ),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/appointment",
    "/contact",
    "/faq",
    "/reviews",
    "/services",
    "/specialists",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: service.updatedAt,
  }));

  const specialistPages: MetadataRoute.Sitemap = specialists.map((specialist) => ({
    url: absoluteUrl(`/specialists/${specialist.slug}`),
    lastModified: specialist.updatedAt,
  }));

  return [...staticPages, ...servicePages, ...specialistPages];
}
