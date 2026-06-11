"use client";

import { Bell, Home, MessageCircleHeart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "主頁", icon: Home },
  { href: "/reminders", label: "提醒", icon: Bell },
  { href: "/messages", label: "訊息", icon: MessageCircleHeart },
  { href: "/settings", label: "設定", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <main className="safe-bottom">{children}</main>
      <nav aria-label="主要導覽" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-[var(--border)] bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="grid grid-cols-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={`focus-ring tap flex flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${active ? "text-[var(--primary-dark)]" : "text-[var(--muted)]"}`}>
              <span className={`grid h-8 w-12 place-items-center rounded-full transition ${active ? "bg-[#DDF6F8]" : ""}`}><Icon size={20} strokeWidth={active ? 2.5 : 2} /></span>
              {label}
            </Link>;
          })}
        </div>
      </nav>
    </div>
  );
}
