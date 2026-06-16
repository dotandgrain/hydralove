# Vercel Push Notification Setup

部署到 Vercel 後，推播提醒需要同時完成以下設定。

## Environment Variables

在 Vercel Project Settings -> Environment Variables 加入：

- `DATABASE_URL`
- `VAPID_PUBLIC_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_EMAIL`
- `CRON_SECRET`

本機 `.env` 已經產生 VAPID keys。部署時請把同一組 VAPID values 填到 Vercel，否則手機已訂閱的 push endpoint 會和伺服器金鑰不一致。

## Cron

`vercel.json` 已設定每 5 分鐘呼叫：

```txt
/api/cron/send-reminders
```

Vercel 會在 cron request 自動帶上 `Authorization: Bearer <CRON_SECRET>`，API 會用它防止外部隨便觸發提醒。

## iPhone 使用條件

- 必須用 Safari 開啟網站。
- 必須加到主畫面，並從主畫面圖示開啟。
- 必須允許通知。
- 設定頁按「啟用通知」後，才會把這部手機的 push subscription 存到資料庫。

以上都完成後，手機關屏仍可收到 Web Push 提醒。
