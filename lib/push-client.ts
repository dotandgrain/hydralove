"use client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function getVapidPublicKey() {
  const response = await fetch("/api/push-public-key", { cache: "no-store" });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.publicKey) {
    throw new Error(result?.error || "尚未設定 VAPID 公開金鑰，請先完成環境變數設定。");
  }

  return result.publicKey as string;
}

export function getOrCreateUserId() {
  const existing = localStorage.getItem("hydralove-user-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem("hydralove-user-id", id);
  return id;
}

export function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

export function pushSupportMessage() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "此瀏覽器不支援 Web Push 通知。";
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isiOS && !isStandalone()) return "請先用 Safari 將 HydraLove 加至主畫面，再從主畫面開啟。";
  return null;
}

export async function subscribeToPush() {
  const unsupported = pushSupportMessage();
  if (unsupported) throw new Error(unsupported);
  const publicKey = await getVapidPublicKey();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("通知權限未允許，請在系統設定中開啟通知。");
  const registration = await navigator.serviceWorker.register("/service-worker.js");
  await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
  const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: subscription.toJSON(), userId: getOrCreateUserId() }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "無法儲存 Push 訂閱。");
  return subscription;
}

export async function getPushState() {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  return Boolean(await registration?.pushManager.getSubscription());
}

export async function sendTestNotification() {
  const response = await fetch("/api/send-test-notification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: getOrCreateUserId() }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "測試通知發送失敗。");
  return result;
}
