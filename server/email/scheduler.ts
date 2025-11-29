import cron from "node-cron";
import { 
  checkAndSendPackageExpiryReminders, 
  checkAndSendDailyReminders,
  verifySmtpConnection 
} from "./service";

export function initEmailScheduler() {
  console.log("📧 Initializing email scheduler...");

  verifySmtpConnection().then((connected) => {
    if (!connected) {
      console.warn("⚠️ SMTP connection failed. Emails may not be sent.");
    }
  });

  cron.schedule("0 18 * * *", async () => {
    console.log("⏰ Running daily reminder job (18:00)...");
    await checkAndSendDailyReminders();
  }, {
    timezone: "Europe/Istanbul"
  });

  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running package expiry check job (09:00)...");
    await checkAndSendPackageExpiryReminders();
  }, {
    timezone: "Europe/Istanbul"
  });

  console.log("✅ Email scheduler initialized:");
  console.log("   - Daily reminders: 18:00 (Istanbul)");
  console.log("   - Package expiry check: 09:00 (Istanbul)");
}
