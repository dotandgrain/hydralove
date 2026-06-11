"use client";

import { AppShell } from "@/components/app-shell";
import { Brand, PrimaryButton } from "@/components/ui";
import { BellRing, ChevronRight, Clock3, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { sendTestNotification } from "@/lib/push-client";

const reminders = [
  ["11:30", "補水時間到啦 💧"],
  ["15:30", "記得飲水休息一下 ☕"],
  ["21:30", "飲啖水啦，晚安好夢 🌙"],
];

export default function HomePage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const sendNow = async () => { setError(""); try { await sendTestNotification(); setSent(true); setTimeout(() => setSent(false), 2200); } catch (reason) { setError(reason instanceof Error ? reason.message : "提醒發送失敗"); } };
  return <AppShell>
    <header className="flex items-center justify-between px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]"><Brand /><button aria-label="通知" className="focus-ring tap grid size-11 place-items-center rounded-2xl border border-[var(--border)] bg-white text-[var(--primary-dark)]"><BellRing size={20} /></button></header>
    <div className="space-y-5 px-5">
      <section className="overflow-hidden rounded-3xl border border-[#42B7C4] bg-[linear-gradient(145deg,#087D8D,#0EA5B7)] p-6 text-white shadow-[0_14px_32px_rgba(8,125,141,.18)]">
        <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-white/75">Hi, 寶貝</p><h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-[-0.04em]">今日記得飲夠水</h1></div><Sparkles className="text-[#A8EEF3]" /></div>
        <div className="mt-7 flex items-center gap-6">
          <div className="relative grid size-28 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#fff 0 62.5%, rgba(255,255,255,.2) 62.5% 100%)" }}><div className="grid size-[88px] place-items-center rounded-full bg-[#0B8E9D] text-center"><div><b className="block text-xl">63%</b><span className="text-[11px] text-white/70">今日進度</span></div></div></div>
          <div><p className="text-3xl font-extrabold tracking-[-0.05em]">1,250 <span className="text-sm font-semibold text-white/70">ml</span></p><p className="mt-1 text-sm text-white/70">目標 2,000 ml</p><div className="mt-4 h-1.5 w-full rounded-full bg-white/20"><div className="h-full w-[63%] rounded-full bg-white" /></div></div>
        </div>
      </section>
      <PrimaryButton onClick={sendNow}><Send size={18} />{sent ? "提醒已送出" : "立即發送提醒"}</PrimaryButton>
      {error && <p role="alert" className="-mt-2 rounded-2xl border border-[#FFD7D2] bg-[#FFF5F3] p-3 text-sm font-semibold text-[#B94137]">{error}</p>}
      <section>
        <div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--primary)]">Today</p><h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em]">今日提醒</h2></div><a href="/reminders" className="flex items-center text-sm font-bold text-[var(--primary-dark)]">全部 <ChevronRight size={16} /></a></div>
        <div className="card divide-y divide-[var(--border)] overflow-hidden">
          {reminders.map(([time, message], index) => <div key={time} className="flex items-center gap-3 p-4"><span className={`grid size-10 place-items-center rounded-2xl ${index === 2 ? "bg-[#FFF0EE] text-[var(--accent)]" : "bg-[#E4F7F9] text-[var(--primary-dark)]"}`}><Clock3 size={18} /></span><div className="min-w-0 flex-1"><time className="text-sm font-extrabold">{time}</time><p className="truncate text-sm text-[var(--muted)]">{message}</p></div><span className="size-2 rounded-full bg-[var(--success)]" /></div>)}
        </div>
      </section>
    </div>
  </AppShell>;
}
