"use client";

import { AppShell } from "@/components/app-shell";
import { PageHeader, PrimaryButton } from "@/components/ui";
import { Toggle } from "@/components/toggle";
import { defaultReminders, type ReminderItem } from "@/lib/types";
import { loadLocal, saveLocal } from "@/lib/local-store";
import { getOrCreateUserId } from "@/lib/push-client";
import { Clock3, Pencil, Plus, Send, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const emptyDraft = { time: "12:00", message: "飲啖水啦 💧", deliveryMethod: "Web Push" as ReminderItem["deliveryMethod"] };

export default function RemindersPage() {
  const [items, setItems] = useState(defaultReminders);
  const [editing, setEditing] = useState<ReminderItem | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");
  useEffect(() => { const timer = window.setTimeout(async () => {
    const fallback = loadLocal("hydralove-reminders", defaultReminders);
    setItems(fallback);
    try {
      const response = await fetch(`/api/reminders?userId=${encodeURIComponent(getOrCreateUserId())}`);
      const result = await response.json();
      if (response.ok && result.reminders.length) {
        const next = result.reminders.map((item: ReminderItem) => ({ ...item, deliveryMethod: item.deliveryMethod || "Web Push" }));
        setItems(next); saveLocal("hydralove-reminders", next);
      }
    } catch { /* Keep local fallback while offline. */ }
  }, 0); return () => window.clearTimeout(timer); }, []);
  const commit = (next: ReminderItem[]) => { setItems(next); saveLocal("hydralove-reminders", next); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    try {
      if (editing) {
        const response = await fetch(`/api/reminders/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || "更新提醒失敗");
        commit(items.map(item => item.id === editing.id ? { ...item, ...result.reminder } : item));
      } else {
        const partnerId = localStorage.getItem("hydralove-partner-id");
        if (!partnerId) throw new Error("請先到設定完成伴侶資料");
        const response = await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draft, userId: getOrCreateUserId(), partnerId, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Hong_Kong", enabled: true, repeatType: "daily" }) });
        const result = await response.json(); if (!response.ok) throw new Error(result.error || "新增提醒失敗");
        commit([...items, result.reminder]);
      }
      setOpen(false); setEditing(null); setDraft(emptyDraft);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "提醒儲存失敗"); }
  };
  const toggle = async (item: ReminderItem, enabled: boolean) => { commit(items.map(row => row.id === item.id ? { ...row, enabled } : row)); await fetch(`/api/reminders/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled }) }).catch(() => undefined); };
  const remove = async (item: ReminderItem) => { const previous = items; commit(items.filter(row => row.id !== item.id)); const response = await fetch(`/api/reminders/${item.id}`, { method: "DELETE" }).catch(() => null); if (!response?.ok) { commit(previous); setError("刪除提醒失敗，請稍後再試"); } };
  const edit = (item: ReminderItem) => { setEditing(item); setDraft({ time: item.time, message: item.message, deliveryMethod: item.deliveryMethod }); setOpen(true); };

  return <AppShell>
    <PageHeader title="提醒時間" action={<button onClick={() => setOpen(true)} className="focus-ring grid size-11 place-items-center rounded-2xl bg-[var(--primary)] text-white" aria-label="新增提醒"><Plus /></button>} />
    <div className="space-y-4 px-5">
      <p className="text-[15px] leading-6 text-[var(--muted)]">提醒時間會按裝置時區發送，實際時間受部署排程頻率影響。</p>
      {error && <p role="alert" className="rounded-2xl border border-[#FFD7D2] bg-[#FFF5F3] p-3 text-sm font-semibold text-[#B94137]">{error}</p>}
      <div className="space-y-3">{items.map(item => <article key={item.id} className="card p-4">
        <div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#E4F7F9] text-[var(--primary-dark)]"><Clock3 size={20} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><time className="text-xl font-extrabold tracking-[-0.03em]">{item.time}</time><span className="rounded-lg bg-[#EDF8F9] px-2 py-1 text-[10px] font-extrabold text-[var(--primary-dark)]">每日</span></div><p className="mt-1 truncate text-sm text-[var(--muted)]">{item.message}</p></div><Toggle checked={item.enabled} onChange={enabled => void toggle(item, enabled)} label={`${item.time}提醒`} /></div>
        <div className="mt-4 flex items-center border-t border-[var(--border)] pt-3"><span className="flex flex-1 items-center gap-1.5 text-xs font-bold text-[var(--muted)]"><Send size={13} />{item.deliveryMethod}</span><button onClick={() => edit(item)} className="focus-ring tap px-3 text-[var(--primary-dark)]" aria-label="編輯提醒"><Pencil size={17} /></button><button onClick={() => void remove(item)} className="focus-ring tap px-2 text-[var(--accent)]" aria-label="刪除提醒"><Trash2 size={17} /></button></div>
      </article>)}</div>
      <PrimaryButton onClick={() => setOpen(true)}><Plus size={18} />新增提醒</PrimaryButton>
    </div>
    {open && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102A43]/35 p-0 sm:items-center sm:p-5"><form onSubmit={submit} className="w-full max-w-[430px] rounded-t-[30px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[30px]"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold">{editing ? "編輯提醒" : "新增提醒"}</h2><button type="button" onClick={() => { setOpen(false); setEditing(null); }} className="focus-ring grid size-10 place-items-center rounded-full bg-slate-100" aria-label="關閉"><X size={20} /></button></div><label className="block text-sm font-bold">時間<input required type="time" value={draft.time} onChange={e => setDraft({ ...draft, time: e.target.value })} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-lg font-bold" /></label><label className="mt-4 block text-sm font-bold">訊息<textarea required value={draft.message} onChange={e => setDraft({ ...draft, message: e.target.value })} className="focus-ring mt-2 min-h-24 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5" /></label><label className="mt-4 block text-sm font-bold">發送方式<select value={draft.deliveryMethod} onChange={e => setDraft({ ...draft, deliveryMethod: e.target.value as ReminderItem["deliveryMethod"] })} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5"><option>Web Push</option><option>Manual message</option></select></label><PrimaryButton className="mt-5" type="submit">儲存提醒</PrimaryButton></form></div>}
  </AppShell>;
}
