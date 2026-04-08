"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import { t } from "@/lib/translations";
import { getServiceImage } from "@/lib/service-images";
import PageHero from "@/components/shared/PageHero";

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
  const shortDescription = lang === "tr" ? service.shortDescTr : service.shortDescEn;
  const notes = [
    lang === "tr" ? "Tedavi kapsami muayene sonrasinda netlestirilir." : "The exact treatment scope is clarified after consultation.",
    lang === "tr" ? "Sure ve planlama hasta ihtiyacina gore sekillenir." : "Duration and planning are shaped around patient needs.",
    lang === "tr" ? "Randevu oncesi on bilgi icin klinikle iletisime gecebilirsiniz." : "You can contact the clinic for preliminary information before booking.",
  ];

  return (
    <>
      <PageHero kicker={lang === "tr" ? "Hizmet Detayi" : "Service Detail"} title={name} subtitle={shortDescription}>
        <div className="hero-panel p-3 md:p-4">
          <div className="media-frame">
            <Image
              src={service.imageUrl || getServiceImage(service.slug)}
              alt={name}
              width={1600}
              height={760}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="h-[360px] w-full object-cover"
              unoptimized={Boolean(service.imageUrl?.startsWith("data:"))}
            />
          </div>
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(19rem,0.94fr)]">
            <div className="space-y-8">
              <div className="editorial-panel p-8 md:p-10">
                <SectionIntro title={lang === "tr" ? `${name} hakkinda genel bilgi` : `General information about ${name}`} />
                <p className="whitespace-pre-line text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">{description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {notes.map((note, index) => (
                  <div key={note} className="card p-6">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                      {`0${index + 1}`}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="editorial-panel p-6">
                <div className="space-y-3">
                  <div className="summary-row">
                    <span className="text-[color:var(--text-secondary)]">{lang === "tr" ? "Tahmini sure" : "Estimated duration"}</span>
                    <strong className="text-[color:var(--text-primary)]">
                      {service.durationMinutes} {t("services", "minutes", lang)}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span className="text-[color:var(--text-secondary)]">{lang === "tr" ? "Planlama" : "Planning"}</span>
                    <span className="text-[color:var(--text-primary)]">
                      {lang === "tr" ? "Muayene ve degerlendirme sonrasinda" : "After consultation and evaluation"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/appointment?service=${service.id}`} className="btn-primary">
                    {lang === "tr" ? "Online Randevu" : "Book Appointment"}
                  </Link>
                  <Link href="/contact" className="btn-ghost">
                    {lang === "tr" ? "Iletisim" : "Contact"}
                  </Link>
                </div>
              </div>

              {service.specialistServices.length > 0 ? (
                <div className="surface-panel p-6">
                  <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                    {lang === "tr" ? "Ilgili Uzmanlar" : "Related Specialists"}
                  </div>
                  <div className="space-y-4">
                    {service.specialistServices.map(({ specialist }) => (
                      <Link key={specialist.id} href={`/specialists/${specialist.slug}`} className="contact-line">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[color:var(--surface-muted)]">
                          {specialist.photoUrl ? (
                            <Image
                              src={specialist.photoUrl}
                              alt={lang === "tr" ? specialist.nameTr : specialist.nameEn}
                              width={56}
                              height={56}
                              sizes="56px"
                              className="h-full w-full object-cover"
                              unoptimized={specialist.photoUrl.startsWith("data:")}
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-semibold text-[color:var(--text-primary)]">{lang === "tr" ? specialist.nameTr : specialist.nameEn}</div>
                          <div className="mt-1 text-sm text-[color:var(--text-secondary)]">{lang === "tr" ? specialist.titleTr : specialist.titleEn}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
