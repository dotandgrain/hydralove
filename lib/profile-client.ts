"use client";

import { getOrCreateUserId } from "@/lib/push-client";

export async function saveProfile(partnerName: string, dailyGoalMl: number) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Hong_Kong";
  const response = await fetch("/api/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: getOrCreateUserId(), partnerName, dailyGoalMl, timezone }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "無法儲存設定");
  localStorage.setItem("hydralove-partner-id", result.partner.id);
  return result;
}
