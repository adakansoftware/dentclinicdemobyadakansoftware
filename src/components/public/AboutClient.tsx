"use client";

import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import { t } from "@/lib/translations";
import PageHero from "@/components/shared/PageHero";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

export default function AboutClient({ settings }: Props) {
  const { lang } = useLang();

  const title = lang === "tr" ? settings.aboutTitleTr : settings.aboutTitleEn;
  const text = lang === "tr" ? settings.aboutTextTr : settings.aboutTextEn;

  const values = [
    {
      number: "01",
      title: lang === "tr" ? "Kisiye uygun planlama" : "Personal planning",
      desc:
        lang === "tr"
          ? "Muayene bulgulari ve beklentiler birlikte degerlendirilir."
          : "Clinical findings and patient expectations are reviewed together.",
    },
    {
      number: "02",
      title: lang === "tr" ? "Acik iletisim" : "Clear communication",
      desc:
        lang === "tr"
          ? "Surec boyunca duzenli, sakin ve anlasilir bir dil korunur."
          : "Communication remains calm, consistent, and easy to understand throughout the process.",
    },
    {
      number: "03",
      title: lang === "tr" ? "Hasta konforu" : "Patient comfort",
      desc:
        lang === "tr"
          ? "Hijyen, duzen ve psikolojik rahatlik klinik deneyimin bir parcasi olarak ele alinir."
          : "Hygiene, order, and emotional comfort are treated as part of the clinical experience.",
    },
  ];

  return (
    <>
      <PageHero
        kicker={lang === "tr" ? "Hakkimizda" : "About"}
        title={title}
        subtitle={
          lang === "tr"
            ? "Klinigimiz; ozenli iletisim, planli bakim ve guven duygusunu merkeze alan bir anlayisla ilerler."
            : "Our clinic follows an approach centered on attentive communication, structured care, and trust."
        }
        minimal
      >
        <div className="hero-panel hero-panel--compact p-6 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          {lang === "tr" ? "Sadelik, duzen ve klinik ciddiyeti ayni cizgide bulusturan bir yaklasim." : "An approach that brings simplicity, order, and clinical seriousness into the same line."}
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="editorial-panel p-8 md:p-10">
              <SectionIntro
                title={
                  lang === "tr"
                    ? "Guven, duzen ve acik iletisim bakim deneyiminin temeli"
                    : "Trust, structure, and clear communication are the foundation of the care experience"
                }
              />
              <p className="whitespace-pre-line text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">{text}</p>
            </div>

            <div className="grid gap-5">
              {values.map((item) => (
                <article key={item.title} className="card p-7">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">{item.number}</div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="soft-section section-block">
        <div className="section-shell">
          <SectionIntro
            align="center"
            kicker={t("about", "whyUs", lang)}
            title={
              lang === "tr"
                ? "Tedavi surecini sadece islem degil, butunsel bir deneyim olarak ele aliyoruz"
                : "We approach treatment not just as a procedure, but as a complete experience"
            }
            subtitle={
              lang === "tr"
                ? "Klinik akis, bilgilendirme ve hasta konforu ayni tasarim diliyle bir araya gelir."
                : "Clinical flow, communication, and patient comfort are brought together within one coherent design language."
            }
          />
        </div>
      </section>
    </>
  );
}
