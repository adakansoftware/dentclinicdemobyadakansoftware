"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import { getServiceImage } from "@/lib/service-images";
import { t } from "@/lib/translations";
import type { ReviewData, ServiceData, SiteSettings, SpecialistData } from "@/types";

interface Props {
  settings: SiteSettings;
  services: ServiceData[];
  specialists: SpecialistData[];
  reviews: ReviewData[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function truncate(text: string, max = 170) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function formatReviewDate(date: string, lang: "tr" | "en") {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1 text-[13px] text-[color:var(--accent-main)]">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= stars ? "opacity-100" : "opacity-25"}>
          *
        </span>
      ))}
    </div>
  );
}

export default function HomeClient({ settings, services, specialists, reviews }: Props) {
  const { lang } = useLang();

  const clinicName = lang === "tr" ? settings.clinicName : settings.clinicNameEn;
  const address = lang === "tr" ? settings.address : settings.addressEn;
  const leadService = services[0];
  const visibleServices = services.slice(0, 6);
  const visibleSpecialists = specialists.slice(0, 3);
  const visibleReviews = reviews.filter((review) => review.isApproved && review.isVisible).slice(0, 3);

  const heroTitle =
    lang === "tr"
      ? "Sakin, acik ve guven veren bir klinik deneyimi"
      : "A calm, clear, and reassuring clinic experience";
  const heroSubtitle =
    lang === "tr"
      ? "Tedaviler, uzman profilleri ve randevu sureci; gereksiz gosteris olmadan, karar vermeyi kolaylastiran rafine bir duzende sunulur."
      : "Treatments, specialist profiles, and the booking flow are presented in a refined structure that supports confident decision-making.";

  const heroMetrics = [
    {
      title: lang === "tr" ? "Uzman hekim profilleri" : "Specialist profiles",
      value: `${specialists.length}+`,
      note: lang === "tr" ? "Duzenli ve okunur sunum" : "Structured, readable presentation",
    },
    {
      title: lang === "tr" ? "Acik tedavi anlatimi" : "Clear treatment guidance",
      value: `${services.length}+`,
      note: lang === "tr" ? "Icerik ve sure bilgisiyle" : "Presented with clear scope and duration",
    },
    {
      title: lang === "tr" ? "Kolay randevu sureci" : "Easy booking flow",
      value: lang === "tr" ? "4 Adim" : "4 Steps",
      note: lang === "tr" ? "Net ve sade akis" : "Simple and guided flow",
    },
  ];

  const trustStrip = [
    lang === "tr" ? "Steril ortam" : "Sterile environment",
    lang === "tr" ? "Uzman ekip" : "Specialist team",
    lang === "tr" ? "Hizli iletisim" : "Responsive communication",
    lang === "tr" ? "Seffaf bilgilendirme" : "Transparent guidance",
  ];

  const promises = [
    {
      number: "01",
      title: lang === "tr" ? "Acik tedavi anlatimi" : "Clear treatment guidance",
      text:
        lang === "tr"
          ? "Tedavi alanlari, surec ve beklentiler sakin bir hiyerarsi ile anlatilir."
          : "Treatment areas, process expectations, and next steps are explained through a calm hierarchy.",
    },
    {
      number: "02",
      title: lang === "tr" ? "Uzman kadro" : "Specialist team",
      text:
        lang === "tr"
          ? "Hekim profilleri; unvan, biyografi ve ilgili tedavilerle birlikte duzenli bir yapida sunulur."
          : "Profiles combine title, biography, and relevant treatments in a clear, trusted structure.",
    },
    {
      number: "03",
      title: lang === "tr" ? "Randevu ve iletisim" : "Booking and contact",
      text:
        lang === "tr"
          ? "Karar aninda gerekli olan bilgiler ve ulasim kanallari one cikar."
          : "The most useful contact and booking information stays close at hand when patients are ready to act.",
    },
  ];

  const contactCards = [
    { label: lang === "tr" ? "Telefon" : "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { label: "E-posta", value: settings.email, href: `mailto:${settings.email}` },
    { label: lang === "tr" ? "Adres" : "Address", value: address },
    settings.whatsapp
      ? {
          label: "WhatsApp",
          value: settings.whatsapp,
          href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
          external: true,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string; href?: string; external?: boolean }[];

  return (
    <>
      <section className="page-hero">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="section-shell section-block relative z-10">
          <div className="grid gap-12 xl:grid-cols-[1fr_0.96fr] xl:items-center">
            <div className="max-w-3xl">
              <div className="reveal-up">
                <h1 className="text-[2.9rem] font-semibold leading-[1.01] text-[color:var(--text-primary)] md:text-[4.7rem]" style={{ letterSpacing: "-0.065em" }}>
                  {heroTitle}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
                  {heroSubtitle}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/appointment" className="btn-primary">
                    {lang === "tr" ? "Online Randevu" : "Book Appointment"}
                  </Link>
                  <Link href="/services" className="btn-outline">
                    {lang === "tr" ? "Tedavileri Incele" : "Explore Treatments"}
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {heroMetrics.map((item, index) => (
                  <div key={item.title} className={`hero-note-card p-5 reveal-up reveal-delay-${Math.min(index + 1, 3)}`}>
                    <div className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">{item.value}</div>
                    <div className="mt-3 text-sm font-medium leading-relaxed text-[color:var(--text-primary)]">{item.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-up reveal-delay-2">
              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(217,210,200,0.88)] bg-[rgba(251,250,247,0.72)] p-3 shadow-[var(--shadow-soft)]">
                <div className="relative min-h-[460px] overflow-hidden rounded-[1.65rem] bg-[color:var(--surface-muted)] md:min-h-[580px]">
                  <Image
                    src="/images/hero.jpg"
                    alt={clinicName}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 48vw"
                    className="image-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,31,27,0.18)] via-transparent to-[rgba(246,243,238,0.06)]" />
                  <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
                    <div className="glass-card max-w-sm p-5">
                      <div className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{clinicName}</div>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">{address}</p>
                      <div className="mt-4 text-sm font-medium text-[color:var(--text-primary)]">{settings.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(217,210,200,0.72)] bg-[rgba(248,246,241,0.82)] py-6">
        <div className="section-shell">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustStrip.map((item, index) => (
              <div key={item} className={`proof-band reveal-up reveal-delay-${Math.min(index, 3)}`}>
                <span className="proof-band__index">{`0${index + 1}`}</span>
                <span className="proof-band__text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell">
          <SectionIntro
            kicker={lang === "tr" ? "Neden Biz" : "Why Us"}
            title={
              lang === "tr"
                ? "Klinik ciddiyetini insani bir sicaklikla dengeleyen duzen"
                : "A structure that balances clinical seriousness with human warmth"
            }
            subtitle={
              lang === "tr"
                ? "Mevcut acik tedavi anlatimi, uzman kadro ve randevu iletisim mantigi korunurken daha rafine bir sunum dili kurulur."
                : "The same logic around clear treatment guidance, specialist presentation, and communication is preserved in a more refined format."
            }
          />

          <div className="grid gap-6 md:grid-cols-3">
            {promises.map((item) => (
              <article key={item.title} className="card flex h-full flex-col p-7">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">{item.number}</div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[color:var(--text-secondary)] md:text-base">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="soft-section section-block">
        <div className="section-shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              kicker={lang === "tr" ? "Hizmetler" : "Services"}
              title={
                lang === "tr"
                  ? "Tedavi secimini kolaylastiran editorial bir hizmet yapisi"
                  : "An editorial treatment structure that makes decisions easier"
              }
              subtitle={
                lang === "tr"
                  ? "Kartlar daha sakin bir hiyerarsi ile sure, aciklama ve yonlendirmeleri birlikte sunar."
                  : "Each card quietly organizes timing, explanation, and next-step links in one place."
              }
            />
            <Link href="/services" className="btn-ghost w-fit">
              {lang === "tr" ? "Tum Hizmetler" : "All Services"}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleServices.map((service) => (
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
                  <h3 className="mt-4 text-[1.65rem] font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                    {lang === "tr" ? service.nameTr : service.nameEn}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[color:var(--text-secondary)] md:text-base">
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

          {leadService ? (
            <div className="mt-10 rounded-[2rem] border border-[rgba(217,210,200,0.9)] bg-[rgba(251,250,247,0.92)] p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
                    {lang === "tr" ? leadService.nameTr : leadService.nameEn}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)]">
                    {lang === "tr" ? leadService.shortDescTr : leadService.shortDescEn}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link href={`/services/${leadService.slug}`} className="btn-ghost">
                    {lang === "tr" ? "Tedavi Detayi" : "Treatment Details"}
                  </Link>
                  <Link href={`/appointment?service=${leadService.id}`} className="btn-primary">
                    {lang === "tr" ? "Online Randevu" : "Book Appointment"}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              kicker={lang === "tr" ? "Uzman Kadro" : "Specialists"}
              title={
                lang === "tr"
                  ? "Profesyonel guveni daha insani bir ritimle sunan uzman profilleri"
                  : "Specialist profiles presented with professional trust and human warmth"
              }
              subtitle={
                lang === "tr"
                  ? "Isim, unvan, kisa biyografi ve profil gecisi daha duzenli hizalanir."
                  : "Name, title, short biography, and profile access are aligned in a cleaner, more refined rhythm."
              }
            />
            <Link href="/specialists" className="btn-ghost w-fit">
              {lang === "tr" ? "Tum Uzmanlar" : "All Specialists"}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleSpecialists.map((specialist) => {
              const bio = lang === "tr" ? specialist.biographyTr : specialist.biographyEn;

              return (
                <article key={specialist.id} className="card flex h-full flex-col overflow-hidden bg-[rgba(248,246,241,0.95)]">
                  <div className="relative aspect-[4/4.4] overflow-hidden bg-[color:var(--surface-muted)]">
                    {specialist.photoUrl ? (
                      <Image
                        src={specialist.photoUrl}
                        alt={lang === "tr" ? specialist.nameTr : specialist.nameEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="image-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm uppercase tracking-[0.2em] text-[color:var(--accent-main)]">
                        Portrait
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                      {lang === "tr" ? specialist.nameTr : specialist.nameEn}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-[color:var(--accent-main)]">
                      {lang === "tr" ? specialist.titleTr : specialist.titleEn}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                      {truncate(bio, 150)}
                    </p>
                    <div className="mt-6">
                      <Link href={`/specialists/${specialist.slug}`} className="btn-ghost">
                        {lang === "tr" ? "Profili Incele" : "View Profile"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="soft-section section-block">
        <div className="section-shell">
          <SectionIntro
            kicker={lang === "tr" ? "Yorumlar" : "Reviews"}
            title={
              lang === "tr"
                ? "Gercek deneyimlerden gelen sakin ve guven veren geri bildirimler"
                : "Calm, trust-building feedback from real patient experiences"
            }
            subtitle={
              lang === "tr"
                ? "Abartisiz ama guven veren bir sosyal kanit alani."
                : "A restrained but credible social proof layer."
            }
          />

          {visibleReviews.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {visibleReviews.map((review) => (
                <article key={review.id} className="card flex h-full flex-col p-7">
                  <StarRating stars={review.ratingStars} />
                  <p className="mt-5 flex-1 text-base leading-relaxed text-[color:var(--text-secondary)]">
                    &quot;{lang === "tr" ? review.contentTr : review.contentEn}&quot;
                  </p>
                  <div className="mt-6 border-t border-[rgba(217,210,200,0.84)] pt-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(239,233,225,0.9)] text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-main)]">
                        {getInitials(review.patientName)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[color:var(--text-primary)]">{review.patientName}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--accent-main)]">
                          {review.sourceLabel ? `${review.sourceLabel} / ` : ""}
                          {formatReviewDate(review.createdAt, lang)}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-panel p-10 text-center text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {lang === "tr"
                ? "Yorumlar burada sakin ve guven veren bir duzende yer alacak."
                : "Reviews will appear here in a calm, trust-building layout."}
            </div>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionIntro
                kicker={lang === "tr" ? "Iletisim" : "Contact"}
                title={
                  lang === "tr"
                    ? "Klinige ulasmanin tum temel yollarini tek bir sakin alanda toplayin"
                    : "Gather the essential clinic contact channels in one calm, organized area"
                }
                subtitle={
                  lang === "tr"
                    ? "Footer tekrarlarindan ayrilan, duzenli ve profesyonel bir iletisim bolumu."
                    : "A dedicated contact section separated from the footer for a cleaner, more professional layout."
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {contactCards.map((item) => {
                  const content = (
                    <div className="card h-full p-6">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                        {item.label}
                      </div>
                      <div className="mt-4 text-base leading-relaxed text-[color:var(--text-primary)]">{item.value}</div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div className="editorial-panel overflow-hidden p-3">
              {settings.mapEmbedUrl ? (
                <iframe
                  src={settings.mapEmbedUrl}
                  className="h-[420px] w-full rounded-[1.4rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic map"
                />
              ) : (
                <div className="grid h-[420px] place-items-center rounded-[1.4rem] bg-[rgba(239,233,225,0.86)] text-center">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-[color:var(--accent-main)]">
                      {lang === "tr" ? "Konum" : "Location"}
                    </div>
                    <div className="mt-3 max-w-sm text-base leading-relaxed text-[color:var(--text-secondary)]">{address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block pt-0">
        <div className="section-shell">
          <div className="quiet-cta-band px-7 py-8 md:px-10 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)] md:text-4xl">
                  {lang === "tr"
                    ? "Tedaviye sakin ve net bir randevu akisiyla baslayin"
                    : "Begin with a calm and clear appointment flow"}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)]">
                  {lang === "tr"
                    ? "Hizmet, uzman, tarih ve saat secimini duzenli adimlarla tamamlayabilir; gerekli on bilgiyi kolayca iletebilirsiniz."
                    : "Select treatment, specialist, date, and time in a structured flow while sharing your preliminary information with ease."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/appointment" className="btn-primary">
                  {lang === "tr" ? "Online Randevu" : "Book Appointment"}
                </Link>
                <Link href="/contact" className="btn-ghost">
                  {lang === "tr" ? "Iletisim" : "Contact"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
