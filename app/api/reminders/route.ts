import { prisma } from "@/lib/prisma";
import { reminderSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const reminders = await prisma.reminder.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { time: "asc" },
  });
  return NextResponse.json({ reminders });
}

export async function POST(request: NextRequest) {
  const parsed = reminderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "提醒資料格式不正確", details: parsed.error.flatten() }, { status: 400 });
  const partner = await prisma.partner.findFirst({ where: { id: parsed.data.partnerId, userId: parsed.data.userId } });
  if (!partner) return NextResponse.json({ error: "找不到對應伴侶資料" }, { status: 404 });
  const reminder = await prisma.reminder.create({ data: parsed.data });
  return NextResponse.json({ reminder }, { status: 201 });
}
