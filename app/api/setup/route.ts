import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
  partnerName: z.string().trim().min(1).max(50),
  dailyGoalMl: z.number().int().min(500).max(10000),
  timezone: z.string().min(1).default("Asia/Hong_Kong"),
});

const defaults = [
  { time: "11:30", message: "補水時間到啦 💧", deliveryMethod: "Web Push" },
  { time: "15:30", message: "記得飲水休息一下 ☕", deliveryMethod: "Web Push" },
  { time: "21:30", message: "飲啖水啦，晚安好夢 🌙", deliveryMethod: "Manual message" },
];

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "設定資料格式不正確" }, { status: 400 });
  const { userId, partnerName, dailyGoalMl, timezone } = parsed.data;
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({ where: { id: userId }, update: { name: partnerName }, create: { id: userId, name: partnerName } });
    const existing = await tx.partner.findFirst({ where: { userId } });
    const partner = existing
      ? await tx.partner.update({ where: { id: existing.id }, data: { name: partnerName, dailyGoalMl } })
      : await tx.partner.create({ data: { userId, name: partnerName, dailyGoalMl } });
    const count = await tx.reminder.count({ where: { userId } });
    if (!count) await tx.reminder.createMany({ data: defaults.map(item => ({ ...item, userId, partnerId: partner.id, timezone, enabled: true, repeatType: "daily" })) });
    return { user, partner };
  });
  return NextResponse.json(result);
}
