import { prisma } from "@/lib/prisma";
import { reminderPatchSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const parsed = reminderPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "更新資料格式不正確", details: parsed.error.flatten() }, { status: 400 });
  const existing = await prisma.reminder.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "找不到提醒" }, { status: 404 });
  const reminder = await prisma.reminder.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ reminder });
}

export async function DELETE(_: NextRequest, context: Context) {
  const { id } = await context.params;
  const existing = await prisma.reminder.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "找不到提醒" }, { status: 404 });
  await prisma.reminder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
