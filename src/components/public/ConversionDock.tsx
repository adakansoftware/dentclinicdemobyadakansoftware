"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

export default function ConversionDock({ settings }: Props) {
  const { lang } = useLang();
  const phoneHref = `tel:${settings.phone.replace(/\s/g, "")}`;
  const whatsappHref = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <div className="conversion-dock">
      <div className="conversion-dock__inner">
        <a
          href={whatsappHref ?? phoneHref}
          className="conversion-dock__secondary"
          target={whatsappHref ? "_blank" : undefined}
          rel={whatsappHref ? "noopener noreferrer" : undefined}
        >
          {whatsappHref ? "WhatsApp" : lang === "tr" ? "Telefon" : "Call"}
        </a>
        <Link href="/appointment" className="conversion-dock__primary">
          {lang === "tr" ? "Online Randevu" : "Book Appointment"}
        </Link>
      </div>
    </div>
  );
}
