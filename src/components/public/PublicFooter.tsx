"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

export default function PublicFooter({ settings }: Props) {
  const { lang } = useLang();
  const clinicName = lang === "tr" ? settings.clinicName : settings.clinicNameEn;
  const address = lang === "tr" ? settings.address : settings.addressEn;

  const navLinks = [
    { href: "/about", label: t("nav", "about", lang) },
    { href: "/services", label: t("nav", "services", lang) },
    { href: "/specialists", label: t("nav", "specialists", lang) },
    { href: "/reviews", label: t("nav", "reviews", lang) },
    { href: "/contact", label: t("nav", "contact", lang) },
  ];

  const socials = [
    settings.instagram ? { href: settings.instagram, label: "Instagram" } : null,
    settings.facebook ? { href: settings.facebook, label: "Facebook" } : null,
    settings.twitter ? { href: settings.twitter, label: "X" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-[rgba(217,210,200,0.84)] bg-[rgba(248,246,241,0.92)]">
      <div className="section-shell py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="mb-5 flex items-center gap-3">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt={clinicName}
                  width={44}
                  height={44}
                  sizes="44px"
                  className="h-11 w-auto rounded-2xl object-contain"
                  unoptimized={settings.logoUrl.startsWith("data:")}
                />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(217,210,200,0.9)] bg-[rgba(239,233,225,0.82)] text-sm font-semibold text-[color:var(--accent-main)]">
                  DC
                </div>
              )}
              <div className="text-lg font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">{clinicName}</div>
            </div>

            <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {lang === "tr"
                ? "Sakin, acik ve guven veren bir klinik deneyimi sunmak icin calisiyoruz."
                : "We focus on a calm, clear, and reassuring clinical experience."}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-main)]">
              {t("footer", "quickLinks", lang)}
            </h3>
            <div className="space-y-3 text-sm text-[color:var(--text-secondary)]">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block transition-colors hover:text-[color:var(--text-primary)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-main)]">
              {lang === "tr" ? "Iletisim" : "Contact"}
            </h3>
            <div className="space-y-3 text-sm text-[color:var(--text-secondary)]">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="block transition-colors hover:text-[color:var(--text-primary)]">
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="block break-all transition-colors hover:text-[color:var(--text-primary)]">
                {settings.email}
              </a>
              <div>{address}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-main)]">
              {lang === "tr" ? "Sosyal" : "Social"}
            </h3>
            <div className="space-y-3 text-sm text-[color:var(--text-secondary)]">
              {socials.length > 0 ? (
                socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors hover:text-[color:var(--text-primary)]"
                  >
                    {social.label}
                  </a>
                ))
              ) : (
                <div>{lang === "tr" ? "Yakinda" : "Coming soon"}</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[rgba(217,210,200,0.84)] pt-6 text-xs text-[color:var(--text-secondary)] md:flex-row md:items-center md:justify-between">
          <div>
            (c) {new Date().getFullYear()} {clinicName}. {t("footer", "rights", lang)}
          </div>
          <div>
            Design by{" "}
            <a
              href="https://www.instagram.com/adakansoftware"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--accent-main)]"
            >
              Adakan Software
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
