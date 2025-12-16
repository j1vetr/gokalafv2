import cron from "node-cron";
import { 
  checkAndSendPackageExpiryReminders, 
  checkAndSendDailyReminders,
  checkAndSendPurchaseReminders,
  verifySmtpConnection 
} from "./service";
import { storage } from "../storage";

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

  cron.schedule("*/5 * * * *", async () => {
    try {
      const cancelledCount = await storage.cancelStaleOrders(30);
      if (cancelledCount > 0) {
        console.log(`🗑️ Auto-cancelled ${cancelledCount} stale order(s) older than 30 minutes`);
      }
    } catch (error) {
      console.error("❌ Error cancelling stale orders:", error);
    }
  });

  cron.schedule("0 10 */2 * *", async () => {
    console.log("⏰ Running purchase reminder job (every 2 days at 10:00)...");
    await checkAndSendPurchaseReminders();
  }, {
    timezone: "Europe/Istanbul"
  });

  console.log("✅ Email scheduler initialized:");
  console.log("   - Daily reminders: 18:00 (Istanbul)");
  console.log("   - Package expiry check: 09:00 (Istanbul)");
  console.log("   - Purchase reminders: Every 2 days at 10:00 (Istanbul)");
  console.log("   - Stale order cleanup: Every 5 minutes");
}
