"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import PageHero from "@/components/shared/PageHero";
import { getServiceImage } from "@/lib/service-images";
import { t } from "@/lib/translations";
import type { ServiceData } from "@/types";

interface Props {
  services: ServiceData[];
}

export default function ServicesClient({ services }: Props) {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        title={t("services", "title", lang)}
        subtitle={
          lang === "tr"
            ? "Tedavi alanlari; sure, kapsam ve sonraki adimi sakin bir duzende anlatan editorial bir yapiyla sunulur."
            : "Treatment areas are presented through an editorial structure that calmly explains scope, timing, and the next step."
        }
        minimal
      >
        <div className="hero-panel hero-panel--compact p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="metric-card p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                {lang === "tr" ? "Hizmet sayisi" : "Service count"}
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">{services.length}</div>
            </div>
            <div className="metric-card p-5 text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {lang === "tr"
                ? "Desktopta 3, tablette 2, mobilde 1 kolonluk temiz bir yapi."
                : "A clean 3-column desktop, 2-column tablet, and 1-column mobile structure."}
            </div>
          </div>
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <SectionIntro
            title={
              lang === "tr"
                ? "Her hizmette ayni sakin hiyerarsi korunur"
                : "The same calm hierarchy is preserved across every service"
            }
            subtitle={
              lang === "tr"
                ? "Sure etiketi geri planda kalir; asil vurgu baslik, kisa aciklama ve net yonlendirmelerdedir."
                : "The duration label stays subtle while the headline, short explanation, and links remain the main focus."
            }
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface-muted)]">
                  <Image
                    src={service.imageUrl || getServiceImage(service.slug)}
                    alt={lang === "tr" ? service.nameTr : service.nameEn}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="image-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="service-chip w-fit">
                    {service.durationMinutes} {t("services", "minutes", lang)}
                  </div>
                  <h3 className="mt-4 text-[1.6rem] font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                    {lang === "tr" ? service.nameTr : service.nameEn}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                    {lang === "tr" ? service.shortDescTr : service.shortDescEn}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/services/${service.slug}`} className="btn-ghost">
                      {lang === "tr" ? "Detay Linki" : "Details"}
                    </Link>
                    <Link href={`/appointment?service=${service.id}`} className="btn-outline">
                      {lang === "tr" ? "Randevu" : "Appointment"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
