# HydraLove

iPhone-first 飲水提醒 PWA，使用 Next.js App Router、TypeScript、Tailwind CSS、Prisma、Postgres 與 Web Push。

## 本機啟動

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:deploy
npm run dev
```

產生 VAPID keys 後，把公開及私人金鑰分別填入 `.env` 的 `NEXT_PUBLIC_VAPID_PUBLIC_KEY` 與 `VAPID_PRIVATE_KEY`。通知必須在 HTTPS 或 localhost 下使用；iPhone 需先以 Safari 加至主畫面，再從主畫面開啟並授權通知。

## 排程

排程服務每 15 分鐘呼叫 `/api/cron/send-reminders`。端點要求 `Authorization: Bearer <CRON_SECRET>`。Vercel Hobby 只支援每日 Cron，因此 Hobby 部署需使用外部排程服務；Vercel Pro 可在 `vercel.json` 使用 `*/15 * * * *`。本機伺服器運行時可執行：

```bash
npm run cron:local
```

提醒時間精度取決於 Vercel 方案與 Cron 執行頻率，不保證精確到分鐘。

## 部署注意

正式部署使用 Postgres，例如 Vercel Marketplace 的 Neon。先設定 `DATABASE_URL`，再執行 `npm run db:deploy`，並在 Vercel 設定所有 `.env.example` 變數。
