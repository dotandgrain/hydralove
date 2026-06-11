"use client";

import { Brand, PrimaryButton } from "@/components/ui";
import { loadLocal, saveLocal } from "@/lib/local-store";
import { BellRing, Check, Download, ExternalLink, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToPush } from "@/lib/push-client";
import { saveProfile } from "@/lib/profile-client";

const steps = [[Smartphone, "用 iPhone Safari 開啟", "請勿使用 App 內置瀏覽器"], [ExternalLink, "加入主畫面", "分享 → 加入主畫面"], [Download, "從主畫面開啟", "點擊 HydraLove 圖示"], [BellRing, "啟用通知", "允許接收飲水提醒"]] as const;

export default function SetupPage() {
  const router = useRouter(); const [name, setName] = useState(""); const [goal, setGoal] = useState(2000); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { setName(loadLocal("hydralove-partner", "")); setGoal(loadLocal("hydralove-goal", 2000)); }, 0); return () => window.clearTimeout(timer); }, []);
  const finish = async () => { setBusy(true); setError(""); const partnerName = name || "寶貝"; saveLocal("hydralove-partner", partnerName); saveLocal("hydralove-goal", goal); try { await saveProfile(partnerName, goal); await subscribeToPush(); router.push("/"); } catch (reason) { setError(reason instanceof Error ? reason.message : "設定失敗"); } finally { setBusy(false); } };
  return <main className="min-h-dvh px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"><Brand /><section className="pb-7 pt-8"><p className="text-sm font-bold text-[var(--primary)]">貼心的飲水提醒</p><h1 className="mt-2 text-[34px] font-extrabold leading-[1.12] tracking-[-0.05em]">一起養成飲水的<br />小習慣</h1><p className="mt-4 text-[15px] leading-6 text-[var(--muted)]">完成簡單設定，讓 HydraLove 在適當時間提醒你關心的人。</p></section><section className="card p-5"><label className="block text-sm font-bold">伴侶名稱<input value={name} onChange={e => setName(e.target.value)} placeholder="例如：寶貝" className="focus-ring mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5" /></label><label className="mt-4 block text-sm font-bold">每日目標<div className="relative"><input type="number" min={500} step={100} value={goal} onChange={e => setGoal(Number(e.target.value))} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 pr-14" /><span className="absolute right-4 top-[23px] text-sm font-bold text-[var(--muted)]">ml</span></div></label></section><section className="py-7"><h2 className="text-lg font-extrabold">在 iPhone 啟用通知</h2><div className="mt-4 space-y-4">{steps.map(([Icon, title, note], index) => <div key={title} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#E4F7F9] text-[var(--primary-dark)]"><Icon size={19} /></span><div className="flex-1"><div className="flex items-center gap-2"><b className="text-sm">{index + 1}. {title}</b>{index < 3 && <Check size={14} className="text-[var(--success)]" />}</div><p className="mt-0.5 text-xs text-[var(--muted)]">{note}</p></div></div>)}</div></section>{error && <p role="alert" className="mb-4 rounded-2xl border border-[#FFD7D2] bg-[#FFF5F3] p-3 text-sm font-semibold leading-5 text-[#B94137]">{error}</p>}<PrimaryButton disabled={busy} onClick={finish}><BellRing size={18} />{busy ? "設定中..." : "啟用通知"}</PrimaryButton><button onClick={() => router.push("/")} className="focus-ring tap mt-2 w-full text-sm font-bold text-[var(--muted)]">稍後再設定</button></main>;
}
