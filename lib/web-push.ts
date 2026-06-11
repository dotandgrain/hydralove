import webPush from "web-push";

let configured = false;

export function getWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL;
  if (!publicKey || !privateKey || !email) throw new Error("伺服器尚未完成 VAPID 設定");
  if (!configured) { webPush.setVapidDetails(email, publicKey, privateKey); configured = true; }
  return webPush;
}
