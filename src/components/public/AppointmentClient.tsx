"use client";

import Image from "next/image";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createAppointmentAction, getAvailableSlotsAction } from "@/actions/appointment";
import SpamProtectionFields from "@/components/shared/SpamProtectionFields";
import PageHero from "@/components/shared/PageHero";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import type { ActionResult, ServiceData, TimeSlot } from "@/types";

interface SpecialistItem {
  id: string;
  nameTr: string;
  nameEn: string;
  titleTr: string;
  titleEn: string;
  photoUrl: string;
  specialistServices: { serviceId: string }[];
}

interface Props {
  services: ServiceData[];
  specialists: SpecialistItem[];
  preselectedServiceId?: string;
  preselectedSpecialistId?: string;
}

const STEP_LABELS = ["step1", "step2", "step3", "step4"] as const;
const initialState: ActionResult = { success: false };

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AppointmentClient({
  services,
  specialists,
  preselectedServiceId,
  preselectedSpecialistId,
}: Props) {
  const { lang } = useLang();

  const [step, setStep] = useState(preselectedServiceId ? (preselectedSpecialistId ? 3 : 2) : 1);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(
    services.find((service) => service.id === preselectedServiceId) ?? null
  );
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistItem | null>(
    specialists.find((specialist) => specialist.id === preselectedSpecialistId) ?? null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [state, formAction, isPending] = useActionState(createAppointmentAction, initialState);

  const availableSpecialists = selectedService
    ? specialists.filter((specialist) =>
        specialist.specialistServices.some((specialistService) => specialistService.serviceId === selectedService.id)
      )
    : specialists;

  useEffect(() => {
    if (!selectedSpecialist || !selectedDate) {
      setSlots([]);
      return;
    }

    setSlotsLoading(true);
    void getAvailableSlotsAction(selectedSpecialist.id, selectedDate).then((availableSlots) => {
      setSlots(availableSlots);
      setSelectedSlot(null);
      setSlotsLoading(false);
    });
  }, [selectedDate, selectedSpecialist]);

  const today = new Date().toISOString().split("T")[0] ?? "";
  const stepLabels = STEP_LABELS.map((key) => t("appointment", key, lang));

  const summaryRows = [
    selectedService
      ? { label: t("appointment", "service", lang), value: lang === "tr" ? selectedService.nameTr : selectedService.nameEn }
      : null,
    selectedSpecialist
      ? {
          label: t("appointment", "specialist", lang),
          value: lang === "tr" ? selectedSpecialist.nameTr : selectedSpecialist.nameEn,
        }
      : null,
    selectedDate
      ? {
          label: t("appointment", "date", lang),
          value: new Date(selectedDate).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
      : null,
    selectedSlot ? { label: t("appointment", "time", lang), value: `${selectedSlot.startTime} - ${selectedSlot.endTime}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (state.success) {
    return (
      <section className="section-block">
        <div className="section-shell">
          <div className="success-panel mx-auto max-w-xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
              {lang === "tr" ? "Randevu talebiniz alindi" : "Your appointment request has been received"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[color:var(--text-secondary)]">{t("appointment", "success", lang)}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker={lang === "tr" ? "Online Randevu" : "Online Appointment"}
        title={t("appointment", "title", lang)}
        subtitle={
          lang === "tr"
            ? "Hizmet, uzman, tarih ve saat secimini net, duzenli ve sakin bir akisla tamamlayabilirsiniz."
            : "Choose service, specialist, date, and time through a clear, structured, and calm booking flow."
        }
        minimal
      >
        <div className="hero-panel hero-panel--compact p-5">
          <div className="space-y-3">
            {stepLabels.map((label, index) => {
              const active = index + 1 === step;
              const done = index + 1 < step;

              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                    active
                      ? "bg-[rgba(239,233,225,0.9)] text-[color:var(--text-primary)]"
                      : done
                        ? "bg-[rgba(248,246,241,0.9)] text-[color:var(--text-primary)]"
                        : "bg-[rgba(251,250,247,0.7)] text-[color:var(--text-secondary)]"
                  }`}
                >
                  <span className="step-badge">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              {state.error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div> : null}

              {step === 1 ? (
                <div className="step-shell p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="step-badge">01</div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{t("appointment", "step1", lang)}</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service);
                          setSelectedSpecialist(null);
                          setSelectedDate("");
                          setSelectedSlot(null);
                          setStep(2);
                        }}
                        className={`selection-card flex min-h-[172px] w-full flex-col items-start overflow-hidden p-5 text-left ${selectedService?.id === service.id ? "selection-card--active" : ""}`}
                      >
                        <div className="service-chip w-fit">
                          {service.durationMinutes} {t("services", "minutes", lang)}
                        </div>
                        <div className="mt-4 text-[1.05rem] font-semibold leading-tight text-[color:var(--text-primary)] md:text-[1.12rem]">
                          {lang === "tr" ? service.nameTr : service.nameEn}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)] break-words">
                          {lang === "tr" ? service.shortDescTr : service.shortDescEn}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="step-shell p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="step-badge">02</div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{t("appointment", "step2", lang)}</h2>
                  </div>

                  {availableSpecialists.length === 0 ? (
                    <p className="text-[color:var(--text-secondary)]">{t("appointment", "noSpecialists", lang)}</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {availableSpecialists.map((specialist) => (
                        <button
                          key={specialist.id}
                          onClick={() => {
                            setSelectedSpecialist(specialist);
                            setSelectedDate("");
                            setSelectedSlot(null);
                            setStep(3);
                          }}
                          className={`selection-card flex min-h-[112px] w-full items-center gap-4 overflow-hidden p-5 text-left ${selectedSpecialist?.id === specialist.id ? "selection-card--active" : ""}`}
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[color:var(--surface-muted)]">
                            {specialist.photoUrl ? (
                              <Image
                                src={specialist.photoUrl}
                                alt={lang === "tr" ? specialist.nameTr : specialist.nameEn}
                                width={64}
                                height={64}
                                sizes="64px"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent-main)]">
                                {getInitials(lang === "tr" ? specialist.nameTr : specialist.nameEn)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[1.02rem] font-semibold leading-tight text-[color:var(--text-primary)]">
                              {lang === "tr" ? specialist.nameTr : specialist.nameEn}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)] break-words">
                              {lang === "tr" ? specialist.titleTr : specialist.titleEn}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setStep(1)} className="mt-6 text-sm text-[color:var(--text-secondary)]">
                    {"<-"} {t("appointment", "back", lang)}
                  </button>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="step-shell p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="step-badge">03</div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{t("appointment", "step3", lang)}</h2>
                  </div>

                  <div className="mb-6 max-w-xs">
                    <label className="form-label">{t("appointment", "date", lang)}</label>
                    <input type="date" min={today} value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="form-input" />
                  </div>

                  {selectedDate ? (
                    <div>
                      <label className="form-label">{t("appointment", "time", lang)}</label>
                      {slotsLoading ? (
                        <p className="text-sm text-[color:var(--text-secondary)]">{t("common", "loading", lang)}</p>
                      ) : slots.length === 0 ? (
                        <p className="text-sm text-[color:var(--text-secondary)]">{t("appointment", "noSlots", lang)}</p>
                      ) : (
                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          {slots.map((slot) => (
                            <button
                              key={slot.startTime}
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot)}
                              className={`slot-card ${
                                !slot.available
                                  ? "slot-card--disabled"
                                  : selectedSlot?.startTime === slot.startTime
                                    ? "slot-card--active"
                                    : ""
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button onClick={() => setStep(2)} className="text-sm text-[color:var(--text-secondary)]">
                      {"<-"} {t("appointment", "back", lang)}
                    </button>
                    <button onClick={() => setStep(4)} disabled={!selectedSlot} className="btn-primary sm:ml-auto disabled:cursor-not-allowed disabled:opacity-50">
                      {t("appointment", "next", lang)} {"->"}
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 4 && selectedService && selectedSpecialist && selectedSlot ? (
                <div className="step-shell p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="step-badge">04</div>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{t("appointment", "step4", lang)}</h2>
                  </div>

                  <form
                    action={(formData) => {
                      startTransition(() => {
                        void formAction(formData);
                      });
                    }}
                    className="space-y-4"
                  >
                    <SpamProtectionFields />
                    <input type="hidden" name="serviceId" value={selectedService.id} />
                    <input type="hidden" name="specialistId" value={selectedSpecialist.id} />
                    <input type="hidden" name="date" value={selectedDate} />
                    <input type="hidden" name="startTime" value={selectedSlot.startTime} />
                    <input type="hidden" name="endTime" value={selectedSlot.endTime} />
                    <input type="hidden" name="patientLanguage" value={lang.toUpperCase()} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="form-label">{t("appointment", "name", lang)} *</label>
                        <input name="patientName" className="form-input" required minLength={2} />
                      </div>
                      <div>
                        <label className="form-label">{t("appointment", "phone", lang)} *</label>
                        <input name="patientPhone" type="tel" className="form-input" required />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">{t("appointment", "email", lang)}</label>
                      <input name="patientEmail" type="email" className="form-input" />
                    </div>

                    <div>
                      <label className="form-label">{t("appointment", "note", lang)}</label>
                      <textarea name="patientNote" className="form-input min-h-[110px]" />
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                      <button type="button" onClick={() => setStep(3)} className="text-sm text-[color:var(--text-secondary)]">
                        {"<-"} {t("appointment", "back", lang)}
                      </button>
                      <button type="submit" disabled={isPending} className="btn-primary sm:ml-auto">
                        {isPending ? t("common", "loading", lang) : t("appointment", "confirm", lang)}
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="surface-panel p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                  {lang === "tr" ? "Secimleriniz" : "Your selections"}
                </h3>
                {summaryRows.length === 0 ? (
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                    {lang === "tr" ? "Secimleriniz burada ozet olarak gorunecektir." : "Your selections will appear here as a summary."}
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {summaryRows.map((row) => (
                      <div key={row.label} className="summary-row">
                        <span className="text-[color:var(--text-secondary)]">{row.label}</span>
                        <span className="ml-6 text-right font-semibold text-[color:var(--text-primary)]">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="surface-panel p-6">
                <h3 className="mb-4 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                  {lang === "tr" ? "Bilgilendirme" : "Information"}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                  <p>
                    {lang === "tr"
                      ? "Online form bir randevu talebi olusturur. Klinik ekibi degerlendirme sonrasinda sizinle iletisime gecer."
                      : "The online form creates an appointment request. Our team will contact you after review."}
                  </p>
                  <p>
                    {lang === "tr"
                      ? "Uygun saatler, uzmanın calisma planina gore otomatik olarak listelenir."
                      : "Available time slots are listed automatically based on the specialist's schedule."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
