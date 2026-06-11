"use client";

import { AppShell } from "@/components/app-shell";
import { PageHeader, PrimaryButton } from "@/components/ui";
import { defaultMessages } from "@/lib/types";
import { loadLocal, saveLocal } from "@/lib/local-store";
import { Heart, MessageCircleHeart, Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState(defaultMessages);
  const [favorites, setFavorites] = useState<string[]>(defaultMessages.slice(0, 2));
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { setMessages(loadLocal("hydralove-messages", defaultMessages)); setFavorites(loadLocal("hydralove-favorites", defaultMessages.slice(0, 2))); }, 0); return () => window.clearTimeout(timer); }, []);
  const submit = (event: FormEvent) => { event.preventDefault(); const next = [draft.trim(), ...messages]; setMessages(next); saveLocal("hydralove-messages", next); setDraft(""); setOpen(false); };
  const toggleFavorite = (message: string) => { const next = favorites.includes(message) ? favorites.filter(item => item !== message) : [...favorites, message]; setFavorites(next); saveLocal("hydralove-favorites", next); };
  return <AppShell><PageHeader title="貼心訊息" action={<button onClick={() => setOpen(true)} className="focus-ring grid size-11 place-items-center rounded-2xl bg-[var(--primary)] text-white" aria-label="新增訊息"><Plus /></button>} /><div className="space-y-4 px-5"><div className="rounded-3xl bg-[#E5F8FA] p-5"><MessageCircleHeart className="text-[var(--primary-dark)]" /><h2 className="mt-3 text-lg font-extrabold">每一句提醒，都有你的關心</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">收藏常用訊息，設定提醒時就能快速選用。</p></div><div className="card divide-y divide-[var(--border)] overflow-hidden">{messages.map((message, index) => <div key={`${message}-${index}`} className="flex min-h-16 items-center gap-3 px-4 py-3"><p className="flex-1 text-[15px] font-semibold leading-6">{message}</p><button onClick={() => toggleFavorite(message)} className={`focus-ring grid size-10 place-items-center rounded-full ${favorites.includes(message) ? "bg-[#FFF0EE] text-[var(--accent)]" : "text-slate-400"}`} aria-label={favorites.includes(message) ? "取消收藏" : "收藏"}><Heart size={19} fill={favorites.includes(message) ? "currentColor" : "none"} /></button></div>)}</div><PrimaryButton onClick={() => setOpen(true)}><Plus size={18} />新增自訂訊息</PrimaryButton></div>{open && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102A43]/35"><form onSubmit={submit} className="w-full max-w-[430px] rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold">新增訊息</h2><button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-slate-100"><X /></button></div><textarea autoFocus required maxLength={100} value={draft} onChange={e => setDraft(e.target.value)} placeholder="寫一句貼心提醒..." className="focus-ring min-h-28 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" /><PrimaryButton className="mt-4" type="submit">儲存訊息</PrimaryButton></form></div>}</AppShell>;
}
