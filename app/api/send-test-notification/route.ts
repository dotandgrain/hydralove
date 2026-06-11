import { prisma } from "@/lib/prisma";
import { getWebPush } from "@/lib/web-push";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ userId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "缺少使用者資料" }, { status: 400 });
  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId: parsed.data.userId } });
  if (!subscriptions.length) return NextResponse.json({ error: "尚未建立 Push 訂閱" }, { status: 404 });
  try {
    const push = getWebPush();
    await Promise.all(subscriptions.map(item => push.sendNotification({ endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } }, JSON.stringify({ title: "HydraLove", body: "測試通知成功，之後就可以收到飲水提醒 💧", url: "/" }))));
    return NextResponse.json({ success: true, sent: subscriptions.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "測試通知發送失敗" }, { status: 500 });
  }
}
