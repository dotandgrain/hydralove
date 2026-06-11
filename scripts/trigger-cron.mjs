const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const secret = process.env.CRON_SECRET;
if (!secret) throw new Error("CRON_SECRET is required");
const response = await fetch(`${baseUrl}/api/cron/send-reminders`, { headers: { Authorization: `Bearer ${secret}` } });
console.log(response.status, await response.text());
if (!response.ok) process.exitCode = 1;
