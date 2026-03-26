"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import type { SiteSettings } from "@/types";

interface Props { settings: SiteSettings; }

export default function PublicNavbar({ settings }: Props) {
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);

  const clinicName = lang === "tr" ? settings.clinicName : settings.clinicNameEn;

  const links = [
    { href: "/about", label: t("nav", "about", lang) },
    { href: "/services", label: t("nav", "services", lang) },
    { href: "/specialists", label: t("nav", "specialists", lang) },
    { href: "/reviews", label: t("nav", "reviews", lang) },
    { href: "/faq", label: t("nav", "faq", lang) },
    { href: "/contact", label: t("nav", "contact", lang) },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/70 shadow-[0_8px_24px_rgba(15,52,77,0.06)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[74px]">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl" style={{ color: "var(--color-primary)" }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={clinicName} className="h-10 w-auto" />
            ) : (
              <div className="w-11 h-11 rounded-2xl grid place-items-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}>
                🦷
              </div>
            )}
            <div className="hidden sm:block">
              <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Dental Care</div>
              <span className="block -mt-0.5">{clinicName}</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="hidden sm:inline-flex items-center justify-center h-10 px-3 text-sm font-semibold border rounded-xl transition-colors hover:bg-gray-50"
              style={{ borderColor: "color-mix(in srgb, var(--color-primary) 16%, white)", color: "var(--color-primary)" }}
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
            <Link href="/appointment" className="hidden sm:inline-flex btn-primary text-sm px-4 py-2.5">
              {t("nav", "appointment", lang)}
            </Link>
            <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setOpen(!open)} aria-label="Menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2 flex-wrap">
              <button onClick={toggleLang} className="flex-1 py-2.5 text-sm font-semibold border rounded-xl"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                {lang === "tr" ? "EN" : "TR"}
              </button>
              <Link href="/appointment" onClick={() => setOpen(false)} className="w-full btn-primary text-sm py-2.5 text-center">
                {t("nav", "appointment", lang)}
              </Link>
            </div>
          </div>
        )}
      </header>

      {settings.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp"
        >
          <span className="text-lg">💬</span>
          WhatsApp
        </a>
      )}
    </>
  );
}
