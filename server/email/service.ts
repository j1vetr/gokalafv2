import nodemailer from "nodemailer";
import { emailTemplates, EmailTemplate } from "./templates";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import { emailLogs, users, orders, packages, dailyHabits, bodyMeasurements } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

const isLocalDb = process.env.DATABASE_URL?.includes("localhost") || process.env.DATABASE_URL?.includes("127.0.0.1");

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isLocalDb) {
  const pool = new PgPool({ connectionString: process.env.DATABASE_URL! });
  db = drizzlePg({ client: pool });
} else {
  const pool = new NeonPool({ connectionString: process.env.DATABASE_URL! });
  db = drizzleNeon({ client: pool });
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.toov.com.tr",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "no-reply@toov.com.tr",
    pass: process.env.SMTP_PASS,
  },
});

async function logEmail(data: {
  userId?: string;
  templateKey: string;
  toEmail: string;
  subject: string;
  contextData?: string;
  status: string;
  error?: string;
  scheduledFor?: Date;
  sentAt?: Date;
}) {
  try {
    await db.insert(emailLogs).values({
      userId: data.userId,
      templateKey: data.templateKey,
      toEmail: data.toEmail,
      subject: data.subject,
      contextData: data.contextData,
      status: data.status,
      error: data.error,
      scheduledFor: data.scheduledFor,
      sentAt: data.sentAt,
    });
  } catch (error) {
    console.error("Email log error:", error);
  }
}

export async function sendEmail(
  to: string,
  template: EmailTemplate,
  templateKey: string,
  userId?: string,
  contextData?: any
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: '"Gokalaf Coaching" <no-reply@toov.com.tr>',
      to,
      subject: template.subject,
      html: template.html,
    });

    await logEmail({
      userId,
      templateKey,
      toEmail: to,
      subject: template.subject,
      contextData: contextData ? JSON.stringify(contextData) : undefined,
      status: "sent",
      sentAt: new Date(),
    });

    console.log(`✉️ Email sent: ${templateKey} to ${to}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Email failed: ${templateKey} to ${to}`, error.message);
    
    await logEmail({
      userId,
      templateKey,
      toEmail: to,
      subject: template.subject,
      contextData: contextData ? JSON.stringify(contextData) : undefined,
      status: "failed",
      error: error.message,
    });

    return false;
  }
}

export async function sendWelcomeEmail(user: { id: string; email: string; fullName: string }) {
  const template = emailTemplates.welcome({
    fullName: user.fullName,
    email: user.email,
  });
  return sendEmail(user.email, template, "welcome", user.id, { fullName: user.fullName });
}

export async function sendOrderConfirmationEmail(
  user: { id: string; email: string; fullName: string },
  order: { totalPrice: string; startDate: Date | null; endDate: Date | null },
  pkg: { name: string; weeks: number }
) {
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const template = emailTemplates.orderConfirmation({
    fullName: user.fullName,
    packageName: pkg.name,
    weeks: pkg.weeks,
    totalPrice: order.totalPrice,
    startDate: formatDate(order.startDate),
    endDate: formatDate(order.endDate),
  });

  return sendEmail(user.email, template, "order_confirmation", user.id, {
    packageName: pkg.name,
    weeks: pkg.weeks,
    totalPrice: order.totalPrice,
  });
}

export async function sendPackageExpiryReminder(
  user: { id: string; email: string; fullName: string },
  pkg: { name: string },
  daysRemaining: number,
  endDate: Date
) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("tr-TR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const template = emailTemplates.packageExpiry({
    fullName: user.fullName,
    packageName: pkg.name,
    daysRemaining,
    endDate: formatDate(endDate),
  });

  return sendEmail(user.email, template, "package_expiry", user.id, {
    packageName: pkg.name,
    daysRemaining,
  });
}

export async function sendDailyReminderEmail(
  user: { id: string; email: string; fullName: string },
  streak?: number,
  lastWeight?: string
) {
  const template = emailTemplates.dailyReminder({
    fullName: user.fullName,
    streak,
    lastWeight,
  });

  return sendEmail(user.email, template, "daily_reminder", user.id, { streak, lastWeight });
}

export async function checkAndSendPackageExpiryReminders() {
  console.log("🔍 Checking for package expiry reminders...");
  
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeOrders = await db
      .select({
        orderId: orders.id,
        userId: orders.userId,
        packageId: orders.packageId,
        endDate: orders.endDate,
        userEmail: users.email,
        userFullName: users.fullName,
        packageName: packages.name,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(packages, eq(orders.packageId, packages.id))
      .where(
        and(
          eq(orders.status, "active"),
          gte(orders.endDate, now),
          lte(orders.endDate, sevenDaysLater)
        )
      );

    for (const order of activeOrders) {
      if (!order.endDate) continue;

      const alreadySent = await db
        .select()
        .from(emailLogs)
        .where(
          and(
            eq(emailLogs.userId, order.userId),
            eq(emailLogs.templateKey, "package_expiry"),
            gte(emailLogs.createdAt, sevenDaysAgo)
          )
        )
        .limit(1);

      if (alreadySent.length === 0) {
        const daysRemaining = Math.ceil(
          (new Date(order.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        await sendPackageExpiryReminder(
          { id: order.userId, email: order.userEmail, fullName: order.userFullName },
          { name: order.packageName },
          daysRemaining,
          new Date(order.endDate)
        );
      }
    }
    
    console.log(`✅ Package expiry check complete. Found ${activeOrders.length} orders.`);
  } catch (error) {
    console.error("❌ Package expiry reminder error:", error);
  }
}

export async function checkAndSendDailyReminders() {
  console.log("🔍 Checking for daily reminders...");
  
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const usersWithActivePackages = await db
      .select({
        userId: orders.userId,
        userEmail: users.email,
        userFullName: users.fullName,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(
        and(
          eq(orders.status, "active"),
          lte(orders.startDate, now),
          gte(orders.endDate, now)
        )
      )
      .groupBy(orders.userId, users.email, users.fullName);

    for (const user of usersWithActivePackages) {
      const alreadySentToday = await db
        .select()
        .from(emailLogs)
        .where(
          and(
            eq(emailLogs.userId, user.userId),
            eq(emailLogs.templateKey, "daily_reminder"),
            gte(emailLogs.createdAt, todayStart)
          )
        )
        .limit(1);

      if (alreadySentToday.length === 0) {
        const habits = await db
          .select()
          .from(dailyHabits)
          .where(eq(dailyHabits.userId, user.userId))
          .orderBy(sql`${dailyHabits.date} DESC`)
          .limit(30);

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < habits.length; i++) {
          const habitDate = new Date(habits[i].date);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (habitDate.toDateString() === expectedDate.toDateString()) {
            if (habits[i].didWorkout || habits[i].waterGlasses > 0) {
              streak++;
            } else {
              break;
            }
          } else {
            break;
          }
        }

        const lastMeasurement = await db
          .select()
          .from(bodyMeasurements)
          .where(eq(bodyMeasurements.userId, user.userId))
          .orderBy(sql`${bodyMeasurements.date} DESC`)
          .limit(1);

        const lastWeight = lastMeasurement[0]?.weight?.toString();

        await sendDailyReminderEmail(
          { id: user.userId, email: user.userEmail, fullName: user.userFullName },
          streak > 0 ? streak : undefined,
          lastWeight
        );
      }
    }
    
    console.log(`✅ Daily reminder check complete. Found ${usersWithActivePackages.length} active users.`);
  } catch (error) {
    console.error("❌ Daily reminder error:", error);
  }
}

export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    return false;
  }
}
