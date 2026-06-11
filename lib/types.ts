export type ReminderItem = {
  id: string;
  time: string;
  message: string;
  enabled: boolean;
  repeatType: "daily";
  deliveryMethod: "Web Push" | "Manual message";
};

export type ServerReminder = ReminderItem & { userId: string; partnerId: string; timezone: string };

export const defaultReminders: ReminderItem[] = [
  { id: "default-1130", time: "11:30", message: "補水時間到啦 💧", enabled: true, repeatType: "daily", deliveryMethod: "Web Push" },
  { id: "default-1530", time: "15:30", message: "記得飲水休息一下 ☕", enabled: true, repeatType: "daily", deliveryMethod: "Web Push" },
  { id: "default-2130", time: "21:30", message: "飲啖水啦，晚安好夢 🌙", enabled: true, repeatType: "daily", deliveryMethod: "Manual message" },
];

export const defaultMessages = [
  "飲啖水啦 💧", "補水時間到啦 💙", "記得飲水休息一下 ☕", "多喝水對身體好喔 😊",
  "喝水讓妳更健康 ✨", "今日都要照顧自己呀 💧", "飲水時間到，休息一分鐘啦 🌿",
];
