"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { getServiceImage } from "@/lib/service-images";
import type { SiteSettings, ServiceData, SpecialistData, ReviewData } from "@/types";

interface Props {
  settings: SiteSettings;
  services: ServiceData[];
  specialists: SpecialistData[];
  reviews: ReviewData[];
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= stars ? "text-amber-400" : "text-gray-200"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function HomeClient({ settings, services, specialists, reviews }: Props) {
  const { lang } = useLang();

  const heroTitle = lang === "tr" ? settings.heroTitleTr : settings.heroTitleEn;
  const heroSubtitle = lang === "tr" ? settings.heroSubtitleTr : settings.heroSubtitleEn;

  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)" }}
      >
        <div className="absolute inset-0 premium-grid opacity-40" />
        <div className="absolute inset-y-0 left-0 w-72 bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative section-shell py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="hero-badge mb-6">🦷 {lang === "tr" ? settings.clinicName : settings.clinicNameEn}</div>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-[-0.04em] max-w-3xl">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mt-6 max-w-2xl leading-relaxed">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/appointment" className="btn-accent text-base px-8 py-4">
                  {t("home", "ctaButton", lang)}
                </Link>
                <Link href="/services" className="btn-outline text-base px-8 py-4">
                  {t("home", "viewAll", lang)} →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-3xl">
                {[
                  { value: "10+", label: lang === "tr" ? "Yıl Deneyim" : "Years Experience" },
                  { value: "500+", label: lang === "tr" ? "Mutlu Hasta" : "Happy Patients" },
                  { value: "24/7", label: lang === "tr" ? "Hızlı İletişim" : "Fast Support" },
                ].map((item) => (
                  <div key={item.label} className="stat-card">
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-sm text-white/72 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glow-ring">
              <div className="rounded-[34px] overflow-hidden shadow-[0_28px_60px_rgba(0,0,0,0.18)]">
                <img src="/images/hero.jpg" alt="Dental clinic hero" className="image-cover min-h-[340px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[linear-gradient(180deg,#f7fbfc_0%,#ffffff_100%)]">
        <div className="section-shell">
          <div className="text-center mb-12">
            <h2 className="section-title">{t("home", "servicesTitle", lang)}</h2>
            <p className="section-subtitle">{t("home", "servicesSubtitle", lang)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((svc) => (
              <Link key={svc.id} href={`/services/${svc.slug}`} className="card group">
                <div className="h-52 overflow-hidden bg-slate-100">
                  <img
                         src={svc.imageUrl || getServiceImage(svc.slug)}
                         alt={lang === "tr" ? svc.nameTr : svc.nameEn}
                       className="image-cover transition duration-500 group-hover:scale-105"
                   />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {lang === "tr" ? svc.nameTr : svc.nameEn}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {lang === "tr" ? svc.shortDescTr : svc.shortDescEn}
                  </p>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                    {t("home", "learnMore", lang)} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="btn-outline">
              {t("home", "viewAll", lang)}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="section-shell">
          <div className="text-center mb-12">
            <h2 className="section-title">{t("home", "specialistsTitle", lang)}</h2>
            <p className="section-subtitle">{t("home", "specialistsSubtitle", lang)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialists.map((sp) => (
              <Link key={sp.id} href={`/specialists/${sp.slug}`} className="card overflow-hidden group">
                <div className="h-72 bg-slate-100 overflow-hidden">
                  {sp.photoUrl ? (
                    <img
                      src={sp.photoUrl}
                      alt={lang === "tr" ? sp.nameTr : sp.nameEn}
                      className="image-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-6xl">👨‍⚕️</div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {lang === "tr" ? sp.nameTr : sp.nameEn}
                  </h3>
                  <p className="text-sm font-medium mb-4" style={{ color: "var(--color-primary)" }}>
                    {lang === "tr" ? sp.titleTr : sp.titleEn}
                  </p>
                  <span className="btn-outline text-sm px-4 py-2">
                    {t("specialists", "bookWith", lang)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/specialists" className="btn-outline">
              {t("home", "viewAll", lang)}
            </Link>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="py-20" style={{ background: "var(--color-primary-light)" }}>
          <div className="section-shell">
            <div className="text-center mb-12">
              <h2 className="section-title">{t("home", "reviewsTitle", lang)}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="card p-7">
                  <StarRating stars={r.ratingStars} />
                  <p className="text-gray-700 mt-4 leading-relaxed italic">
                    “{lang === "tr" ? r.contentTr : r.contentEn}”
                  </p>
                  <p className="mt-5 font-semibold text-gray-900 text-sm">{r.patientName}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/reviews" className="btn-primary">
                {t("home", "viewAll", lang)}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="hero-badge mb-5">{lang === "tr" ? "Online Randevu" : "Online Booking"}</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.03em]">
            {t("home", "ctaTitle", lang)}
          </h2>
          <p className="text-white/70 text-lg mb-8">{t("home", "ctaSubtitle", lang)}</p>
          <Link href="/appointment" className="btn-accent text-base px-10 py-4 rounded-xl font-bold shadow-xl">
            {t("home", "ctaButton", lang)}
          </Link>
        </div>
      </section>
    </>
  );
}