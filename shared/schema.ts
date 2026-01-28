import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// USERS TABLE
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  address: text("address"),
  fitnessGoal: text("fitness_goal"), // lose, maintain, gain
  role: text("role").notNull().default("user"), // user or admin
  trafficSource: text("traffic_source"), // instagram, google, chatgpt, bing, direct, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// PACKAGES TABLE (koçluk paketleri)
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  weeks: integer("weeks").notNull(), // 8, 12, 16, 24
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  features: text("features").array().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

// ORDERS TABLE (sipariş kaydı)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referenceId: text("reference_id").unique(), // GOK1001, GOK1002, etc. for Shopier display
  userId: varchar("user_id").notNull().references(() => users.id),
  packageId: varchar("package_id").notNull().references(() => packages.id),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, active, completed, cancelled
  paymentMethod: text("payment_method"), // shopier
  paymentId: text("payment_id"), // shopier transaction ID
  source: text("source").notNull().default("shopier"), // shopier, admin_assigned
  adminAssignedBy: varchar("admin_assigned_by").references(() => users.id), // admin who assigned
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// USER PROGRESS TABLE (kullanıcı ilerleme takibi)
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  week: integer("week").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  photos: text("photos").array(),
  notes: text("notes"),
  coachFeedback: text("coach_feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// CALCULATOR RESULTS (hesap makinesi sonuçları - opsiyonel kayıt)
export const calculatorResults = pgTable("calculator_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  calculatorType: text("calculator_type").notNull(), // bmi, calories, tdee, macros
  inputData: text("input_data").notNull(), // JSON string
  resultData: text("result_data").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalculatorResultSchema = createInsertSchema(calculatorResults).omit({
  id: true,
  createdAt: true,
});

export type InsertCalculatorResult = z.infer<typeof insertCalculatorResultSchema>;
export type CalculatorResult = typeof calculatorResults.$inferSelect;

// DAILY HABITS TABLE (günlük alışkanlık takibi)
export const dailyHabits = pgTable("daily_habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  waterGlasses: integer("water_glasses").default(0).notNull(),
  didWorkout: boolean("did_workout").default(false).notNull(),
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyHabitSchema = createInsertSchema(dailyHabits).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyHabit = z.infer<typeof insertDailyHabitSchema>;
export type DailyHabit = typeof dailyHabits.$inferSelect;

// BODY MEASUREMENTS TABLE (vücut ölçüleri)
export const bodyMeasurements = pgTable("body_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bodyFatPercentage: decimal("body_fat_percentage", { precision: 4, scale: 1 }),
  chest: decimal("chest", { precision: 5, scale: 1 }),
  waist: decimal("waist", { precision: 5, scale: 1 }),
  hips: decimal("hips", { precision: 5, scale: 1 }),
  arms: decimal("arms", { precision: 5, scale: 1 }),
  thighs: decimal("thighs", { precision: 5, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBodyMeasurementSchema = createInsertSchema(bodyMeasurements).omit({
  id: true,
  createdAt: true,
});

export type InsertBodyMeasurement = z.infer<typeof insertBodyMeasurementSchema>;
export type BodyMeasurement = typeof bodyMeasurements.$inferSelect;

// DAILY NUTRITION TABLE (günlük beslenme takibi)
export const dailyNutrition = pgTable("daily_nutrition", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  calories: integer("calories").default(0).notNull(),
  protein: decimal("protein", { precision: 5, scale: 1 }).default("0"),
  carbs: decimal("carbs", { precision: 5, scale: 1 }).default("0"),
  fat: decimal("fat", { precision: 5, scale: 1 }).default("0"),
  fiber: decimal("fiber", { precision: 4, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyNutritionSchema = createInsertSchema(dailyNutrition).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyNutrition = z.infer<typeof insertDailyNutritionSchema>;
export type DailyNutrition = typeof dailyNutrition.$inferSelect;

// EMAIL LOGS TABLE (email gönderim kayıtları)
export const emailLogs = pgTable("email_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  templateKey: text("template_key").notNull(), // welcome, order_confirmation, package_expiry, daily_reminder
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  contextData: text("context_data"), // JSON string with template variables
  status: text("status").notNull().default("pending"), // pending, sent, failed
  error: text("error"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;

// COUPONS TABLE (kupon/indirim kodları)
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxUsageCount: integer("max_usage_count"), // null = unlimited
  usedCount: integer("used_count").default(0).notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// COUPON USAGE TABLE (kupon kullanım geçmişi)
export const couponUsage = pgTable("coupon_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponId: varchar("coupon_id").notNull().references(() => coupons.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  orderId: varchar("order_id").references(() => orders.id),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export const insertCouponUsageSchema = createInsertSchema(couponUsage).omit({
  id: true,
  usedAt: true,
});

export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;
export type CouponUsage = typeof couponUsage.$inferSelect;

// SITE SETTINGS TABLE (site ayarları)
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

// SYSTEM LOGS TABLE (sistem logları)
export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // login, logout, create_user, update_order, delete_user, etc.
  entityType: text("entity_type"), // user, order, package, coupon, etc.
  entityId: varchar("entity_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

// ARTICLE CATEGORIES TABLE (makale kategorileri)
export const articleCategories = pgTable("article_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleCategorySchema = createInsertSchema(articleCategories).omit({
  id: true,
  createdAt: true,
});

export type InsertArticleCategory = z.infer<typeof insertArticleCategorySchema>;
export type ArticleCategory = typeof articleCategories.$inferSelect;

// ARTICLES TABLE (makaleler)
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => articleCategories.id),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  heroImage: text("hero_image"),
  content: text("content").notNull(),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  status: text("status").notNull().default("draft"), // draft, published
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// EMAIL CAMPAIGNS TABLE (toplu email kampanyaları)
export const emailCampaigns = pgTable("email_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(), // HTML content
  filter: text("filter").notNull().default("all"), // all, has_package, no_package
  status: text("status").notNull().default("draft"), // draft, sending, completed, failed
  totalRecipients: integer("total_recipients").default(0).notNull(),
  sentCount: integer("sent_count").default(0).notNull(),
  failedCount: integer("failed_count").default(0).notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  sentCount: true,
  failedCount: true,
  startedAt: true,
  completedAt: true,
  createdAt: true,
});

export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

// EXERCISES TABLE (egzersiz akademisi)
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey(), // from the JSON (e.g., "Barbell_Curl")
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  force: text("force"), // pull, push, static
  level: text("level").notNull(), // beginner, intermediate, expert
  mechanic: text("mechanic"), // compound, isolation
  equipment: text("equipment"), // body only, dumbbell, barbell, etc.
  category: text("category").notNull(), // strength, stretching, plyometrics, etc.
  primaryMuscles: text("primary_muscles").array().notNull(),
  secondaryMuscles: text("secondary_muscles").array().notNull(),
  instructionsEn: text("instructions_en").array().notNull(), // English instructions
  instructionsTr: text("instructions_tr").array(), // Turkish instructions
  images: text("images").array().notNull(), // local image paths
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  createdAt: true,
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
