"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import type { SiteSettings } from "@/types";

interface Props { settings: SiteSettings; }

export default function PublicFooter({ settings }: Props) {
  const { lang } = useLang();
  const clinicName = lang === "tr" ? settings.clinicName : settings.clinicNameEn;
  const address = lang === "tr" ? settings.address : settings.addressEn;

  const navLinks = [
    { href: "/about", label: t("nav", "about", lang) },
    { href: "/services", label: t("nav", "services", lang) },
    { href: "/specialists", label: t("nav", "specialists", lang) },
    { href: "/faq", label: t("nav", "faq", lang) },
    { href: "/contact", label: t("nav", "contact", lang) },
    { href: "/appointment", label: t("nav", "appointment", lang) },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr_.9fr] gap-10 mb-12">
          <div className="card-soft p-7 text-slate-700">
            <div className="flex items-center gap-3 text-slate-900 font-bold text-xl mb-4">
              <div className="w-12 h-12 rounded-2xl grid place-items-center text-white" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}>
                🦷
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Premium Clinic</p>
                <span>{clinicName}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">{address}</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="rounded-2xl bg-white px-4 py-3 hover:shadow-md transition">
                <div className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-1">Telefon</div>
                <div className="font-semibold text-slate-800">{settings.phone}</div>
              </a>
              <a href={`mailto:${settings.email}`} className="rounded-2xl bg-white px-4 py-3 hover:shadow-md transition">
                <div className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-1">E-posta</div>
                <div className="font-semibold text-slate-800 break-all">{settings.email}</div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer", "quickLinks", lang)}</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{lang === "tr" ? "Dijital Kanallar" : "Digital Channels"}</h3>
            <div className="space-y-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                  Instagram
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                  Facebook
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                  Twitter / X
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 hover:bg-emerald-400/15 transition-colors">
                  WhatsApp ile İletişim
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {clinicName}. {t("footer", "rights", lang)}
          <span className="mx-2">·</span>
          <a href="https://www.instagram.com/adakansoftware" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Adakan Software tarafından yapılmıştır
          </a>
        </div>
      </div>
    </footer>
  );
}
