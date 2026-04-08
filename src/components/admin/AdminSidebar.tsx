"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { startTransition } from "react";

interface Props {
  adminName: string;
}

const navItems = [
  { href: "/admin", label: "Genel Bakis", badge: "GB", exact: true },
  { href: "/admin/appointments", label: "Randevular", badge: "RN" },
  { href: "/admin/services", label: "Hizmetler", badge: "HZ" },
  { href: "/admin/specialists", label: "Uzmanlar", badge: "UZ" },
  { href: "/admin/working-hours", label: "Calisma Saatleri", badge: "CS" },
  { href: "/admin/blocked-slots", label: "Bloke Slotlar", badge: "BS" },
  { href: "/admin/faq", label: "SSS", badge: "SS" },
  { href: "/admin/reviews", label: "Yorumlar", badge: "YR" },
  { href: "/admin/contact-requests", label: "Iletisim", badge: "IL" },
  { href: "/admin/settings", label: "Site Ayarlari", badge: "AY" },
];

export default function AdminSidebar({ adminName }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 shrink-0 flex-col border-r border-[rgba(217,210,200,0.84)] bg-[rgba(248,246,241,0.92)]">
      <div className="border-b border-[rgba(217,210,200,0.84)] p-6">
        <div className="rounded-[28px] border border-[rgba(217,210,200,0.84)] bg-[rgba(251,250,247,0.92)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(239,233,225,0.92)] text-sm font-semibold tracking-[0.12em] text-[color:var(--accent-main)]">
              DC
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">Admin Panel</p>
              <p className="text-xs text-[color:var(--text-secondary)]">{adminName}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">
            Klinik operasyonlarini daha sakin ve duzenli bir panelden yonetin.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className={`admin-sidebar-link ${active ? "active" : ""}`}>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[rgba(239,233,225,0.9)] text-[10px] font-semibold tracking-[0.12em] text-[color:var(--accent-main)]">
                {item.badge}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-[rgba(217,210,200,0.84)] p-4">
        <Link href="/" target="_blank" className="admin-sidebar-link text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[rgba(239,233,225,0.9)] text-[10px] font-semibold tracking-[0.12em] text-[color:var(--accent-main)]">
            WS
          </span>
          <span>Siteyi Ac</span>
        </Link>
        <form
          action={() => {
            startTransition(() => {
              void logoutAction();
            });
          }}
        >
          <button type="submit" className="admin-sidebar-link w-full text-red-600 hover:bg-red-50">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-[10px] font-semibold tracking-[0.12em] text-red-500">
              CK
            </span>
            <span>Cikis Yap</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
