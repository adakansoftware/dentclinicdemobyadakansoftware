"use client";

import { useActionState, startTransition } from "react";
import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import { t } from "@/lib/translations";
import { submitContactAction } from "@/actions/contact";
import SpamProtectionFields from "@/components/shared/SpamProtectionFields";
import PageHero from "@/components/shared/PageHero";
import type { ActionResult, SiteSettings, WorkingHourData } from "@/types";

interface Props {
  settings: SiteSettings;
  workingHours: WorkingHourData[];
}

const initialState: ActionResult = { success: false };

export default function ContactClient({ settings, workingHours }: Props) {
  const { lang } = useLang();
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);

  const address = lang === "tr" ? settings.address : settings.addressEn;
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const hoursMap: Record<number, WorkingHourData> = {};
  for (const workingHour of workingHours) hoursMap[workingHour.dayOfWeek] = workingHour;

  const days: Record<number, { tr: string; en: string }> = {
    0: { tr: "Pazar", en: "Sunday" },
    1: { tr: "Pazartesi", en: "Monday" },
    2: { tr: "Sali", en: "Tuesday" },
    3: { tr: "Carsamba", en: "Wednesday" },
    4: { tr: "Persembe", en: "Thursday" },
    5: { tr: "Cuma", en: "Friday" },
    6: { tr: "Cumartesi", en: "Saturday" },
  };

  return (
    <>
      <PageHero
        kicker={lang === "tr" ? "Iletisim" : "Contact"}
        title={t("contact", "title", lang)}
        subtitle={t("contact", "subtitle", lang)}
        minimal
      >
        <div className="hero-panel hero-panel--compact p-6">
          <div className="space-y-3 text-sm text-[color:var(--text-secondary)]">
            <div>{settings.phone}</div>
            <div>{settings.email}</div>
          </div>
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="editorial-panel p-8 md:p-10">
              <SectionIntro
                title={lang === "tr" ? "Ekibimizle dogrudan iletisime gecin" : "Contact our team directly"}
                subtitle={
                  lang === "tr"
                    ? "Randevu oncesi bilgi almak, tedavi sureciyle ilgili soru iletmek veya genel konularda bize yazmak icin formu kullanabilirsiniz."
                    : "Use the form to request information before an appointment, ask about treatment, or reach us for general questions."
                }
              />

              {state.success ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center text-green-800">
                  {t("contact", "success", lang)}
                </div>
              ) : (
                <form
                  action={(formData) => {
                    startTransition(() => {
                      void formAction(formData);
                    });
                  }}
                  className="space-y-4"
                >
                  <SpamProtectionFields />

                  {state.error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div> : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label">{t("contact", "name", lang)} *</label>
                      <input name="name" className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">{t("contact", "phone", lang)} *</label>
                      <input name="phone" type="tel" className="form-input" required />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">{t("contact", "email", lang)}</label>
                    <input name="email" type="email" className="form-input" />
                  </div>

                  <div>
                    <label className="form-label">{t("contact", "subject", lang)} *</label>
                    <input name="subject" className="form-input" required />
                  </div>

                  <div>
                    <label className="form-label">{t("contact", "message", lang)} *</label>
                    <textarea name="message" className="form-input min-h-[160px]" required />
                  </div>

                  <button type="submit" disabled={isPending} className="btn-primary w-full md:w-auto">
                    {isPending ? t("common", "loading", lang) : t("contact", "send", lang)}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="surface-panel p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                  {lang === "tr" ? "Iletisim kanallari" : "Contact channels"}
                </h3>

                <div className="mt-5 space-y-3">
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="contact-line">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                        {lang === "tr" ? "Telefon" : "Phone"}
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--text-primary)]">{settings.phone}</div>
                    </div>
                  </a>
                  <a href={`mailto:${settings.email}`} className="contact-line">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">E-posta</div>
                      <div className="mt-2 break-all text-sm text-[color:var(--text-primary)]">{settings.email}</div>
                    </div>
                  </a>
                  <div className="contact-line">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">
                        {t("contact", "address", lang)}
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-[color:var(--text-primary)]">{address}</div>
                    </div>
                  </div>
                  {settings.whatsapp ? (
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-line"
                    >
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">WhatsApp</div>
                        <div className="mt-2 text-sm text-[color:var(--text-primary)]">{settings.whatsapp}</div>
                      </div>
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="surface-panel p-6">
                <h3 className="mb-4 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{t("contact", "workingHours", lang)}</h3>
                <div className="space-y-2.5">
                  {dayOrder.map((day) => {
                    const workingHour = hoursMap[day];
                    const dayName = days[day]?.[lang] ?? "";

                    return (
                      <div key={day} className="summary-row">
                        <span className="font-medium text-[color:var(--text-secondary)]">{dayName}</span>
                        {workingHour && workingHour.isOpen ? (
                          <span className="font-semibold text-[color:var(--text-primary)]">
                            {workingHour.startTime} - {workingHour.endTime}
                          </span>
                        ) : (
                          <span className="text-[color:var(--accent-main)]">{t("contact", "closed", lang)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {settings.mapEmbedUrl ? (
                <div className="editorial-panel overflow-hidden p-3">
                  <iframe
                    src={settings.mapEmbedUrl}
                    className="h-72 w-full rounded-[1.35rem]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
