import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, desc, sql, lte } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Package,
  InsertPackage,
  Order,
  InsertOrder,
  UserProgress,
  InsertUserProgress,
  CalculatorResult,
  InsertCalculatorResult,
  DailyHabit,
  InsertDailyHabit,
  BodyMeasurement,
  InsertBodyMeasurement,
  Coupon,
  InsertCoupon,
  CouponUsage,
  InsertCouponUsage,
  SystemLog,
  InsertSystemLog,
  ArticleCategory,
  InsertArticleCategory,
  Article,
  InsertArticle,
  Exercise,
  InsertExercise,
} from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

export interface RevenueData {
  month: string;
  year: number;
  revenue: number;
  orderCount: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  newUsersThisMonth: number;
}

export interface UserWithDetails {
  user: User;
  orders: Order[];
  measurements: BodyMeasurement[];
  habits: DailyHabit[];
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  getUserWithDetails(id: string): Promise<UserWithDetails | undefined>;

  // Packages
  getPackage(id: string): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByReferenceId(referenceId: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  cancelStaleOrders(minutesOld: number): Promise<number>;
  getNextReferenceId(): Promise<string>;

  // User Progress
  getUserProgressByOrder(orderId: string): Promise<UserProgress[]>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Calculator Results
  saveCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;
  getUserCalculatorResults(userId: string, type?: string): Promise<CalculatorResult[]>;
  getCalculatorUsageStats(): Promise<{ type: string; count: number }[]>;

  // Daily Habits
  getDailyHabit(userId: string, date: Date): Promise<DailyHabit | undefined>;
  getDailyHabits(userId: string, limit?: number): Promise<DailyHabit[]>;
  upsertDailyHabit(habit: InsertDailyHabit): Promise<DailyHabit>;
  getHabitStreak(userId: string): Promise<number>;

  // Body Measurements
  getBodyMeasurements(userId: string, limit?: number): Promise<BodyMeasurement[]>;
  createBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement>;
  getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined>;

  // Admin Analytics
  getDashboardStats(): Promise<DashboardStats>;
  getMonthlyRevenue(year?: number): Promise<RevenueData[]>;
  getRecentActivity(limit?: number): Promise<{ type: string; message: string; date: Date; userId?: string }[]>;

  // Coupons
  getCoupon(id: string): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getAllCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: string): Promise<boolean>;
  incrementCouponUsage(id: string): Promise<void>;
  getCouponUsage(couponId: string): Promise<CouponUsage[]>;
  createCouponUsage(usage: InsertCouponUsage): Promise<CouponUsage>;

  // System Logs
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(limit?: number, offset?: number): Promise<SystemLog[]>;
  getSystemLogsByUser(userId: string, limit?: number): Promise<SystemLog[]>;
  getSystemLogsByAction(action: string, limit?: number): Promise<SystemLog[]>;
  getSystemLogsCount(): Promise<number>;

  // Site Settings
  getSiteSetting(key: string): Promise<string | null>;
  setSiteSetting(key: string, value: string): Promise<void>;
  isMaintenanceMode(): Promise<boolean>;
  setMaintenanceMode(enabled: boolean): Promise<void>;

  // Article Categories
  getArticleCategory(id: string): Promise<ArticleCategory | undefined>;
  getArticleCategoryBySlug(slug: string): Promise<ArticleCategory | undefined>;
  getAllArticleCategories(): Promise<ArticleCategory[]>;
  createArticleCategory(category: InsertArticleCategory): Promise<ArticleCategory>;
  updateArticleCategory(id: string, updates: Partial<InsertArticleCategory>): Promise<ArticleCategory | undefined>;
  deleteArticleCategory(id: string): Promise<boolean>;

  // Articles
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getAllArticles(): Promise<Article[]>;
  getPublishedArticles(categoryId?: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // USERS
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(schema.users).set(updates).where(eq(schema.users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }

  // PACKAGES
  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(schema.packages).where(eq(schema.packages.id, id)).limit(1);
    return pkg;
  }

  async getAllPackages(): Promise<Package[]> {
    return db.select().from(schema.packages).orderBy(schema.packages.weeks);
  }

  async getActivePackages(): Promise<Package[]> {
    return db.select().from(schema.packages).where(eq(schema.packages.isActive, true)).orderBy(schema.packages.weeks);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const [pkg] = await db.insert(schema.packages).values(insertPackage).returning();
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const [pkg] = await db.update(schema.packages).set(updates).where(eq(schema.packages.id, id)).returning();
    return pkg;
  }

  // ORDERS
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.select().from(schema.orders).where(eq(schema.orders.userId, userId)).orderBy(desc(schema.orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  }

  async getNextReferenceId(): Promise<string> {
    const result = await db
      .select({ referenceId: schema.orders.referenceId })
      .from(schema.orders)
      .where(sql`${schema.orders.referenceId} IS NOT NULL`)
      .orderBy(desc(schema.orders.createdAt))
      .limit(100);
    
    let maxNum = 1000;
    for (const row of result) {
      if (row.referenceId) {
        const match = row.referenceId.match(/GOK(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= maxNum) maxNum = num + 1;
        }
      }
    }
    return `GOK${maxNum}`;
  }

  async getOrderByReferenceId(referenceId: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.referenceId, referenceId));
    return order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const referenceId = await this.getNextReferenceId();
    const [order] = await db.insert(schema.orders).values({ ...insertOrder, referenceId }).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(schema.orders).set(updates).where(eq(schema.orders.id, id)).returning();
    return order;
  }

  async cancelStaleOrders(minutesOld: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - minutesOld * 60 * 1000);
    const result = await db
      .update(schema.orders)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(schema.orders.status, "pending"),
          lte(schema.orders.createdAt, cutoffTime)
        )
      )
      .returning();
    return result.length;
  }

  // USER PROGRESS
  async getUserProgressByOrder(orderId: string): Promise<UserProgress[]> {
    return db.select().from(schema.userProgress).where(eq(schema.userProgress.orderId, orderId)).orderBy(schema.userProgress.week);
  }

  async createProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db.insert(schema.userProgress).values(insertProgress).returning();
    return progress;
  }

  // CALCULATOR RESULTS
  async saveCalculatorResult(insertResult: InsertCalculatorResult): Promise<CalculatorResult> {
    const [result] = await db.insert(schema.calculatorResults).values(insertResult).returning();
    return result;
  }

  async getUserCalculatorResults(userId: string, type?: string): Promise<CalculatorResult[]> {
    if (type) {
      return db.select().from(schema.calculatorResults)
        .where(and(eq(schema.calculatorResults.userId, userId), eq(schema.calculatorResults.calculatorType, type)))
        .orderBy(desc(schema.calculatorResults.createdAt));
    }
    return db.select().from(schema.calculatorResults)
      .where(eq(schema.calculatorResults.userId, userId))
      .orderBy(desc(schema.calculatorResults.createdAt));
  }

  // DAILY HABITS
  async getDailyHabit(userId: string, date: Date): Promise<DailyHabit | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [habit] = await db.select().from(schema.dailyHabits)
      .where(and(
        eq(schema.dailyHabits.userId, userId),
        and(
          sql`${schema.dailyHabits.date} >= ${startOfDay}`,
          sql`${schema.dailyHabits.date} <= ${endOfDay}`
        )
      ))
      .limit(1);
    return habit;
  }

  async getDailyHabits(userId: string, limit: number = 30): Promise<DailyHabit[]> {
    return db.select().from(schema.dailyHabits)
      .where(eq(schema.dailyHabits.userId, userId))
      .orderBy(desc(schema.dailyHabits.date))
      .limit(limit);
  }

  async upsertDailyHabit(habit: InsertDailyHabit): Promise<DailyHabit> {
    const existing = await this.getDailyHabit(habit.userId, habit.date);
    
    if (existing) {
      const [updated] = await db.update(schema.dailyHabits)
        .set(habit)
        .where(eq(schema.dailyHabits.id, existing.id))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(schema.dailyHabits).values(habit).returning();
    return created;
  }

  async getHabitStreak(userId: string): Promise<number> {
    const habits = await this.getDailyHabits(userId, 365);
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const habit = habits.find(h => {
        const habitDate = new Date(h.date);
        habitDate.setHours(0, 0, 0, 0);
        return habitDate.getTime() === checkDate.getTime();
      });

      if (habit && (habit.didWorkout || habit.waterGlasses >= 8)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  // BODY MEASUREMENTS
  async getBodyMeasurements(userId: string, limit: number = 20): Promise<BodyMeasurement[]> {
    return db.select().from(schema.bodyMeasurements)
      .where(eq(schema.bodyMeasurements.userId, userId))
      .orderBy(desc(schema.bodyMeasurements.date))
      .limit(limit);
  }

  async createBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement> {
    const [created] = await db.insert(schema.bodyMeasurements).values(measurement).returning();
    return created;
  }

  async getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined> {
    const [measurement] = await db.select().from(schema.bodyMeasurements)
      .where(eq(schema.bodyMeasurements.userId, userId))
      .orderBy(desc(schema.bodyMeasurements.date))
      .limit(1);
    return measurement;
  }

  // DELETE USER
  async deleteUser(id: string): Promise<boolean> {
    console.log(`[deleteUser] Starting deletion for user: ${id}`);
    
    // Clear references in other tables first
    console.log(`[deleteUser] Clearing adminAssignedBy references...`);
    await db.update(schema.orders).set({ adminAssignedBy: null }).where(eq(schema.orders.adminAssignedBy, id));
    
    console.log(`[deleteUser] Clearing coupon createdBy references...`);
    await db.update(schema.coupons).set({ createdBy: null }).where(eq(schema.coupons.createdBy, id));
    
    // Delete user's own data
    console.log(`[deleteUser] Deleting dailyHabits...`);
    await db.delete(schema.dailyHabits).where(eq(schema.dailyHabits.userId, id));
    
    console.log(`[deleteUser] Deleting bodyMeasurements...`);
    await db.delete(schema.bodyMeasurements).where(eq(schema.bodyMeasurements.userId, id));
    
    console.log(`[deleteUser] Deleting calculatorResults...`);
    await db.delete(schema.calculatorResults).where(eq(schema.calculatorResults.userId, id));
    
    console.log(`[deleteUser] Deleting couponUsage...`);
    await db.delete(schema.couponUsage).where(eq(schema.couponUsage.userId, id));
    
    console.log(`[deleteUser] Deleting systemLogs...`);
    await db.delete(schema.systemLogs).where(eq(schema.systemLogs.userId, id));
    
    console.log(`[deleteUser] Deleting emailLogs...`);
    await db.delete(schema.emailLogs).where(eq(schema.emailLogs.userId, id));
    
    // Delete user's orders and progress
    console.log(`[deleteUser] Finding user orders...`);
    const orders = await db.select().from(schema.orders).where(eq(schema.orders.userId, id));
    console.log(`[deleteUser] Found ${orders.length} orders`);
    
    for (const order of orders) {
      console.log(`[deleteUser] Deleting progress for order: ${order.id}`);
      await db.delete(schema.userProgress).where(eq(schema.userProgress.orderId, order.id));
    }
    
    console.log(`[deleteUser] Deleting orders...`);
    await db.delete(schema.orders).where(eq(schema.orders.userId, id));
    
    // Finally delete the user
    console.log(`[deleteUser] Deleting user...`);
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    console.log(`[deleteUser] User deleted: ${result.length > 0}`);
    return result.length > 0;
  }

  // USER WITH DETAILS
  async getUserWithDetails(id: string): Promise<UserWithDetails | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const orders = await this.getUserOrders(id);
    const measurements = await this.getBodyMeasurements(id, 10);
    const habits = await this.getDailyHabits(id, 30);

    return { user, orders, measurements, habits };
  }

  // CALCULATOR USAGE STATS
  async getCalculatorUsageStats(): Promise<{ type: string; count: number }[]> {
    const results = await db.select({
      type: schema.calculatorResults.calculatorType,
      count: sql<number>`count(*)::int`
    })
    .from(schema.calculatorResults)
    .groupBy(schema.calculatorResults.calculatorType);
    return results;
  }

  // DASHBOARD STATS
  async getDashboardStats(): Promise<DashboardStats> {
    const allUsers = await db.select().from(schema.users);
    const allOrders = await db.select().from(schema.orders);
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalRevenue = allOrders
      .filter(o => o.status !== "cancelled" && o.status !== "pending")
      .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

    const thisMonthOrders = allOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= thisMonthStart && o.status !== "cancelled" && o.status !== "pending";
    });
    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

    const lastMonthOrders = allOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd && o.status !== "cancelled" && o.status !== "pending";
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

    const newUsersThisMonth = allUsers.filter(u => {
      const userDate = new Date(u.createdAt);
      return userDate >= thisMonthStart;
    }).length;

    return {
      totalUsers: allUsers.filter(u => u.role !== "admin").length,
      totalOrders: allOrders.length,
      totalRevenue,
      activeOrders: allOrders.filter(o => o.status === "active").length,
      pendingOrders: allOrders.filter(o => o.status === "pending").length,
      completedOrders: allOrders.filter(o => o.status === "completed").length,
      thisMonthRevenue,
      lastMonthRevenue,
      newUsersThisMonth
    };
  }

  // MONTHLY REVENUE
  async getMonthlyRevenue(year?: number): Promise<RevenueData[]> {
    const targetYear = year || new Date().getFullYear();
    const allOrders = await db.select().from(schema.orders);
    
    const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const monthlyData: RevenueData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getFullYear() === targetYear && 
               orderDate.getMonth() === month && 
               o.status !== "cancelled" && 
               o.status !== "pending";
      });

      monthlyData.push({
        month: monthNames[month],
        year: targetYear,
        revenue: monthOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0),
        orderCount: monthOrders.length
      });
    }

    return monthlyData;
  }

  // RECENT ACTIVITY
  async getRecentActivity(limit: number = 10): Promise<{ type: string; message: string; date: Date; userId?: string }[]> {
    const activities: { type: string; message: string; date: Date; userId?: string }[] = [];

    const recentUsers = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).limit(limit);
    for (const user of recentUsers) {
      activities.push({
        type: "user",
        message: `${user.fullName} kayıt oldu`,
        date: user.createdAt,
        userId: user.id
      });
    }

    const recentOrders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(limit);
    for (const order of recentOrders) {
      const user = await this.getUser(order.userId);
      const pkg = await this.getPackage(order.packageId);
      activities.push({
        type: "order",
        message: `${user?.fullName || "Kullanıcı"} - ${pkg?.name || "Paket"} siparişi (${order.status})`,
        date: order.createdAt,
        userId: order.userId
      });
    }

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // COUPONS
  async getCoupon(id: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(schema.coupons).where(eq(schema.coupons.id, id)).limit(1);
    return coupon;
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(schema.coupons).where(eq(schema.coupons.code, code.toUpperCase())).limit(1);
    return coupon;
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return db.select().from(schema.coupons).orderBy(desc(schema.coupons.createdAt));
  }

  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db.insert(schema.coupons).values({
      ...insertCoupon,
      code: insertCoupon.code.toUpperCase(),
    }).returning();
    return coupon;
  }

  async updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const updateData = updates.code ? { ...updates, code: updates.code.toUpperCase() } : updates;
    const [coupon] = await db.update(schema.coupons).set(updateData).where(eq(schema.coupons.id, id)).returning();
    return coupon;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const result = await db.delete(schema.coupons).where(eq(schema.coupons.id, id));
    return true;
  }

  async incrementCouponUsage(id: string): Promise<void> {
    await db.update(schema.coupons)
      .set({ usedCount: sql`${schema.coupons.usedCount} + 1` })
      .where(eq(schema.coupons.id, id));
  }

  async getCouponUsage(couponId: string): Promise<CouponUsage[]> {
    return db.select().from(schema.couponUsage).where(eq(schema.couponUsage.couponId, couponId));
  }

  async createCouponUsage(usage: InsertCouponUsage): Promise<CouponUsage> {
    const [result] = await db.insert(schema.couponUsage).values(usage).returning();
    return result;
  }

  // SYSTEM LOGS
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [result] = await db.insert(schema.systemLogs).values(log).returning();
    return result;
  }

  async getSystemLogs(limit: number = 100, offset: number = 0): Promise<SystemLog[]> {
    return db.select().from(schema.systemLogs).orderBy(desc(schema.systemLogs.createdAt)).limit(limit).offset(offset);
  }

  async getSystemLogsByUser(userId: string, limit: number = 50): Promise<SystemLog[]> {
    return db.select().from(schema.systemLogs).where(eq(schema.systemLogs.userId, userId)).orderBy(desc(schema.systemLogs.createdAt)).limit(limit);
  }

  async getSystemLogsByAction(action: string, limit: number = 50): Promise<SystemLog[]> {
    return db.select().from(schema.systemLogs).where(eq(schema.systemLogs.action, action)).orderBy(desc(schema.systemLogs.createdAt)).limit(limit);
  }

  async getSystemLogsCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(schema.systemLogs);
    return Number(result[0]?.count || 0);
  }

  // SITE SETTINGS
  async getSiteSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, key)).limit(1);
    return setting?.value || null;
  }

  async setSiteSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSiteSetting(key);
    if (existing !== null) {
      await db.update(schema.siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(schema.siteSettings.key, key));
    } else {
      await db.insert(schema.siteSettings).values({ key, value });
    }
  }

  async isMaintenanceMode(): Promise<boolean> {
    const value = await this.getSiteSetting("maintenance_mode");
    return value === "true";
  }

  async setMaintenanceMode(enabled: boolean): Promise<void> {
    await this.setSiteSetting("maintenance_mode", enabled ? "true" : "false");
  }

  // ARTICLE CATEGORIES
  async getArticleCategory(id: string): Promise<ArticleCategory | undefined> {
    const [category] = await db.select().from(schema.articleCategories).where(eq(schema.articleCategories.id, id)).limit(1);
    return category;
  }

  async getArticleCategoryBySlug(slug: string): Promise<ArticleCategory | undefined> {
    const [category] = await db.select().from(schema.articleCategories).where(eq(schema.articleCategories.slug, slug)).limit(1);
    return category;
  }

  async getAllArticleCategories(): Promise<ArticleCategory[]> {
    return db.select().from(schema.articleCategories).orderBy(schema.articleCategories.name);
  }

  async createArticleCategory(category: InsertArticleCategory): Promise<ArticleCategory> {
    const [result] = await db.insert(schema.articleCategories).values(category).returning();
    return result;
  }

  async updateArticleCategory(id: string, updates: Partial<InsertArticleCategory>): Promise<ArticleCategory | undefined> {
    const [result] = await db.update(schema.articleCategories).set(updates).where(eq(schema.articleCategories.id, id)).returning();
    return result;
  }

  async deleteArticleCategory(id: string): Promise<boolean> {
    const result = await db.delete(schema.articleCategories).where(eq(schema.articleCategories.id, id));
    return true;
  }

  // ARTICLES
  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(schema.articles).where(eq(schema.articles.slug, slug)).limit(1);
    return article;
  }

  async getAllArticles(): Promise<Article[]> {
    return db.select().from(schema.articles).orderBy(desc(schema.articles.createdAt));
  }

  async getPublishedArticles(categoryId?: string): Promise<Article[]> {
    if (categoryId) {
      return db.select().from(schema.articles)
        .where(and(eq(schema.articles.status, "published"), eq(schema.articles.categoryId, categoryId)))
        .orderBy(desc(schema.articles.publishedAt));
    }
    return db.select().from(schema.articles)
      .where(eq(schema.articles.status, "published"))
      .orderBy(desc(schema.articles.publishedAt));
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [result] = await db.insert(schema.articles).values(article).returning();
    return result;
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const [result] = await db.update(schema.articles).set({ ...updates, updatedAt: new Date() }).where(eq(schema.articles.id, id)).returning();
    return result;
  }

  async deleteArticle(id: string): Promise<boolean> {
    await db.delete(schema.articles).where(eq(schema.articles.id, id));
    return true;
  }

  // EXERCISES
  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(schema.exercises).where(eq(schema.exercises.id, id)).limit(1);
    return exercise;
  }

  async getExerciseBySlug(slug: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(schema.exercises).where(eq(schema.exercises.slug, slug)).limit(1);
    return exercise;
  }

  async getAllExercises(): Promise<Exercise[]> {
    return db.select().from(schema.exercises).orderBy(schema.exercises.name);
  }

  async getExercisesByFilters(filters: {
    muscle?: string;
    equipment?: string;
    level?: string;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ exercises: Exercise[]; total: number }> {
    let query = db.select().from(schema.exercises);
    const conditions = [];

    if (filters.muscle) {
      conditions.push(sql`${filters.muscle} = ANY(${schema.exercises.primaryMuscles})`);
    }
    if (filters.equipment) {
      conditions.push(eq(schema.exercises.equipment, filters.equipment));
    }
    if (filters.level) {
      conditions.push(eq(schema.exercises.level, filters.level));
    }
    if (filters.category) {
      conditions.push(eq(schema.exercises.category, filters.category));
    }
    if (filters.search) {
      conditions.push(sql`LOWER(${schema.exercises.name}) LIKE LOWER(${'%' + filters.search + '%'})`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.exercises)
      .where(whereClause);
    const total = Number(countResult[0]?.count || 0);

    let exercisesQuery = db.select().from(schema.exercises).where(whereClause).orderBy(schema.exercises.name);
    
    if (filters.limit) {
      exercisesQuery = exercisesQuery.limit(filters.limit) as typeof exercisesQuery;
    }
    if (filters.offset) {
      exercisesQuery = exercisesQuery.offset(filters.offset) as typeof exercisesQuery;
    }

    const exercises = await exercisesQuery;
    return { exercises, total };
  }

  async getExerciseFilters(): Promise<{
    muscles: string[];
    equipment: string[];
    levels: string[];
    categories: string[];
  }> {
    const musclesResult = await db.selectDistinct({ muscle: sql<string>`unnest(${schema.exercises.primaryMuscles})` }).from(schema.exercises);
    const equipmentResult = await db.selectDistinct({ equipment: schema.exercises.equipment }).from(schema.exercises).where(sql`${schema.exercises.equipment} IS NOT NULL`);
    const levelsResult = await db.selectDistinct({ level: schema.exercises.level }).from(schema.exercises);
    const categoriesResult = await db.selectDistinct({ category: schema.exercises.category }).from(schema.exercises);

    return {
      muscles: musclesResult.map(r => r.muscle).filter(Boolean).sort(),
      equipment: equipmentResult.map(r => r.equipment).filter(Boolean).sort() as string[],
      levels: levelsResult.map(r => r.level).filter(Boolean).sort(),
      categories: categoriesResult.map(r => r.category).filter(Boolean).sort(),
    };
  }

  async updateExerciseTranslation(id: string, instructionsTr: string[]): Promise<Exercise | undefined> {
    const [result] = await db.update(schema.exercises)
      .set({ instructionsTr })
      .where(eq(schema.exercises.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
