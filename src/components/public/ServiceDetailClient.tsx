"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { getServiceImage } from "@/lib/service-images";

interface SpecialistItem {
  specialist: {
    id: string;
    slug: string;
    nameTr: string;
    nameEn: string;
    titleTr: string;
    titleEn: string;
    photoUrl: string;
  };
}

interface ServiceDetailData {
  id: string;
  slug: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  shortDescTr: string;
  shortDescEn: string;
  iconName: string;
  durationMinutes: number;
  imageUrl?: string | null;
  specialistServices: SpecialistItem[];
}

interface Props {
  service: ServiceDetailData;
}

export default function ServiceDetailClient({ service }: Props) {
  const { lang } = useLang();

  const name = lang === "tr" ? service.nameTr : service.nameEn;
  const description = lang === "tr" ? service.descriptionTr : service.descriptionEn;

  return (
    <>
      <div
        className="py-16 text-white"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
          <div className="rounded-[32px] overflow-hidden bg-white/10 border border-white/10">
            <img
              src={service.imageUrl || getServiceImage(service.slug)}
              alt={name}
              className="w-full h-[280px] object-cover"
            />
          </div>

          <div>
            <div className="hero-badge mb-5">
              {lang === "tr" ? "Hizmet Detayı" : "Service Detail"}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">{name}</h1>

            <p className="text-white/80 text-lg leading-relaxed mb-6">
              {lang === "tr" ? service.shortDescTr : service.shortDescEn}
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
                {t("services", "duration", lang)}: {service.durationMinutes} {t("services", "minutes", lang)}
              </span>

              <Link href={`/appointment?service=${service.id}`} className="btn-accent">
                {t("services", "bookNow", lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {lang === "tr" ? "Hizmet Açıklaması" : "Service Description"}
                </h2>

                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>

                <div className="mt-8">
                  <Link href={`/appointment?service=${service.id}`} className="btn-primary">
                    {t("services", "bookNow", lang)}
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {service.specialistServices.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-bold text-gray-900 mb-4">
                    {lang === "tr" ? "Bu Hizmeti Veren Uzmanlar" : "Specialists for This Service"}
                  </h3>

                  <ul className="space-y-4">
                    {service.specialistServices.map(({ specialist }) => (
                      <li key={specialist.id}>
                        <Link
                          href={`/specialists/${specialist.slug}`}
                          className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0">
                            {specialist.photoUrl ? (
                              <img
                                src={specialist.photoUrl}
                                alt={lang === "tr" ? specialist.nameTr : specialist.nameEn}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-xl">👨‍⚕️</div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {lang === "tr" ? specialist.nameTr : specialist.nameEn}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lang === "tr" ? specialist.titleTr : specialist.titleEn}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-4">
                  {lang === "tr" ? "Hızlı İşlemler" : "Quick Actions"}
                </h3>

                <div className="flex flex-col gap-3">
                  <Link href={`/appointment?service=${service.id}`} className="btn-primary text-center">
                    {t("services", "bookNow", lang)}
                  </Link>

                  <Link href="/services" className="btn-outline text-center">
                    {lang === "tr" ? "Tüm Hizmetler" : "All Services"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}