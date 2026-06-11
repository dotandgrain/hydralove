self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = { body: event.data?.text() }; }
  const title = payload.title || "HydraLove";
  event.waitUntil(self.registration.showNotification(title, {
    body: payload.body || "飲啖水啦，記得照顧自己 💧",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    tag: payload.tag || "hydralove-reminder",
    data: { url: payload.url || "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const client = clients.find((item) => item.url === url);
    return client ? client.focus() : self.clients.openWindow(url);
  }));
});
