import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, desc, sql } from "drizzle-orm";
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
} from "@shared/schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, schema });

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Packages
  getPackage(id: string): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined>;

  // User Progress
  getUserProgressByOrder(orderId: string): Promise<UserProgress[]>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Calculator Results
  saveCalculatorResult(result: InsertCalculatorResult): Promise<CalculatorResult>;
  getUserCalculatorResults(userId: string, type?: string): Promise<CalculatorResult[]>;

  // Daily Habits
  getDailyHabit(userId: string, date: Date): Promise<DailyHabit | undefined>;
  getDailyHabits(userId: string, limit?: number): Promise<DailyHabit[]>;
  upsertDailyHabit(habit: InsertDailyHabit): Promise<DailyHabit>;
  getHabitStreak(userId: string): Promise<number>;

  // Body Measurements
  getBodyMeasurements(userId: string, limit?: number): Promise<BodyMeasurement[]>;
  createBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement>;
  getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined>;
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

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(schema.orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(schema.orders).set(updates).where(eq(schema.orders.id, id)).returning();
    return order;
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
}

export const storage = new DatabaseStorage();
