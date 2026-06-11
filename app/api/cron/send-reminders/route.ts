import { prisma } from "@/lib/prisma";
import { isReminderDue, wasSentOnLocalDate } from "@/lib/reminder-time";
import { getWebPush } from "@/lib/web-push";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}` || request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date();
  const reminders = await prisma.reminder.findMany({
    where: { enabled: true, repeatType: "daily", deliveryMethod: "Web Push" },
    include: { user: { include: { pushSubscriptions: true } }, reminderLogs: { where: { createdAt: { gte: new Date(now.getTime() - 36 * 60 * 60 * 1000) } }, orderBy: { createdAt: "desc" } } },
  });
  let sent = 0; let skipped = 0; let failed = 0;

  for (const reminder of reminders) {
    const match = isReminderDue(reminder.time, reminder.timezone, now);
    if (!match.due || reminder.reminderLogs.some(log => log.status === "sent" && wasSentOnLocalDate(log.sentAt, reminder.timezone, match.localDate))) { skipped += 1; continue; }
    if (!reminder.user.pushSubscriptions.length) { skipped += 1; continue; }
    const log = await prisma.reminderLog.create({ data: { reminderId: reminder.id, userId: reminder.userId, partnerId: reminder.partnerId, message: reminder.message, status: "pending" } });
    try {
      const push = getWebPush();
      const results = await Promise.allSettled(reminder.user.pushSubscriptions.map(subscription => push.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
        JSON.stringify({ title: "HydraLove", body: reminder.message, url: "/", tag: `reminder-${reminder.id}-${match.localDate}` }),
      )));
      const successful = results.filter(result => result.status === "fulfilled").length;
      if (!successful) throw new Error("所有 Push 訂閱發送失敗");
      await prisma.reminderLog.update({ where: { id: log.id }, data: { status: "sent", sentAt: now } });
      sent += 1;
      await Promise.all(results.map(async (result, index) => {
        if (result.status === "rejected" && typeof result.reason === "object" && result.reason && "statusCode" in result.reason && [404, 410].includes(Number(result.reason.statusCode))) {
          await prisma.pushSubscription.delete({ where: { id: reminder.user.pushSubscriptions[index].id } });
        }
      }));
    } catch (error) {
      await prisma.reminderLog.update({ where: { id: log.id }, data: { status: "failed", message: `${reminder.message} (${error instanceof Error ? error.message : "發送失敗"})` } });
      failed += 1;
    }
  }
  return NextResponse.json({ checked: reminders.length, sent, skipped, failed, at: now.toISOString() });
}
