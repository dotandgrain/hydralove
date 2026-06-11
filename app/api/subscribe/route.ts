import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
  subscription: z.object({ endpoint: z.url(), keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }) }),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Push 訂閱資料格式不正確" }, { status: 400 });
  const { userId, subscription } = parsed.data;
  await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, name: "HydraLove User" } });
  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { userId, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, userAgent: request.headers.get("user-agent") },
    create: { userId, endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, userAgent: request.headers.get("user-agent") },
  });
  return NextResponse.json({ success: true });
}
