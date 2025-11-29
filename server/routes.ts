import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertUserSchema, insertOrderSchema } from "@shared/schema";
import "./types"; // Session type augmentation
import { sendWelcomeEmail, sendOrderConfirmationEmail } from "./email/service";

const PgSession = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Session middleware
const sessionMiddleware = session({
  store: new PgSession({
    pool: pool as any,
    tableName: 'session',
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET || "gokalaf-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Giriş yapmanız gerekiyor" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId || req.session?.userRole !== "admin") {
    return res.status(403).json({ error: "Bu işlem için yetkiniz yok" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(sessionMiddleware);

  // ===== AUTH ROUTES =====
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName, phone, address } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Bu email adresi zaten kullanılıyor" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName,
        phone: phone || null,
        address: address || null,
        role: "user",
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      sendWelcomeEmail({ id: user.id, email: user.email, fullName: user.fullName })
        .catch(err => console.error("Welcome email error:", err));
      
      // Explicitly save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Oturum kaydedilemedi" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri", details: error.errors });
      }
      res.status(500).json({ error: "Kayıt işlemi başarısız" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string(),
      }).parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Email veya şifre hatalı" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Email veya şifre hatalı" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      // Explicitly save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Oturum kaydedilemedi" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Giriş işlemi başarısız" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Çıkış işlemi başarısız" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Giriş yapılmamış" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // ===== PACKAGE ROUTES =====
  
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getActivePackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ error: "Paketler yüklenemedi" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await storage.getPackage(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }
      res.json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Paket yüklenemedi" });
    }
  });

  // ===== ORDER ROUTES =====
  
  // Create order (sepete ekle)
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const { packageId } = z.object({
        packageId: z.string(),
      }).parse(req.body);

      const pkg = await storage.getPackage(packageId);
      if (!pkg) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }

      const order = await storage.createOrder({
        userId: req.session.userId!,
        packageId: pkg.id,
        totalPrice: pkg.price,
        status: "pending",
        paymentMethod: null,
        paymentId: null,
        startDate: null,
        endDate: null,
      });

      res.json({ order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Sipariş oluşturulamadı" });
    }
  });

  // Get user orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.session.userId!);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Siparişler yüklenemedi" });
    }
  });

  // Get specific order
  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
      }

      if (order.userId !== req.session.userId && req.session.userRole !== "admin") {
        return res.status(403).json({ error: "Bu siparişi görüntüleme yetkiniz yok" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ error: "Sipariş yüklenemedi" });
    }
  });

  // Update order (ödeme sonrası)
  app.patch("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
      }

      if (order.userId !== req.session.userId && req.session.userRole !== "admin") {
        return res.status(403).json({ error: "Bu siparişi güncelleme yetkiniz yok" });
      }

      const updateData = z.object({
        status: z.string().optional(),
        paymentMethod: z.string().optional(),
        paymentId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).parse(req.body);

      const updates: any = { ...updateData };
      if (updates.startDate) updates.startDate = new Date(updates.startDate);
      if (updates.endDate) updates.endDate = new Date(updates.endDate);

      const updatedOrder = await storage.updateOrder(req.params.id, updates);
      res.json({ order: updatedOrder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Sipariş güncellenemedi" });
    }
  });

  // ===== ADMIN ROUTES =====
  
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Siparişler yüklenemedi" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error) {
      res.status(500).json({ error: "Kullanıcılar yüklenemedi" });
    }
  });

  app.get("/api/admin/packages", requireAdmin, async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ error: "Paketler yüklenemedi" });
    }
  });

  // Admin Dashboard Stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json({ stats });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "İstatistikler yüklenemedi" });
    }
  });

  // Monthly Revenue
  app.get("/api/admin/revenue", requireAdmin, async (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const revenue = await storage.getMonthlyRevenue(year);
      res.json({ revenue });
    } catch (error) {
      console.error("Revenue error:", error);
      res.status(500).json({ error: "Gelir verileri yüklenemedi" });
    }
  });

  // Recent Activity
  app.get("/api/admin/activity", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activity = await storage.getRecentActivity(limit);
      res.json({ activity });
    } catch (error) {
      res.status(500).json({ error: "Aktiviteler yüklenemedi" });
    }
  });

  // Calculator Usage Stats
  app.get("/api/admin/calculator-stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getCalculatorUsageStats();
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: "Hesaplayıcı istatistikleri yüklenemedi" });
    }
  });

  // Get User with Details
  app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const details = await storage.getUserWithDetails(req.params.id);
      if (!details) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }
      const { password, ...userWithoutPassword } = details.user;
      res.json({ 
        user: userWithoutPassword, 
        orders: details.orders,
        measurements: details.measurements,
        habits: details.habits
      });
    } catch (error) {
      res.status(500).json({ error: "Kullanıcı detayları yüklenemedi" });
    }
  });

  // Update User (Admin)
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        role: z.enum(["user", "admin"]).optional(),
      }).parse(req.body);

      const updatedUser = await storage.updateUser(req.params.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Kullanıcı güncellenemedi" });
    }
  });

  // Delete User (Admin)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Kullanıcı silinemedi" });
    }
  });

  // Update Order (Admin)
  app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = z.object({
        status: z.enum(["pending", "paid", "active", "completed", "cancelled"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        paymentMethod: z.string().optional(),
        paymentId: z.string().optional(),
      }).parse(req.body);

      const updates: any = { ...updateData };
      if (updates.startDate) updates.startDate = new Date(updates.startDate);
      if (updates.endDate) updates.endDate = new Date(updates.endDate);

      const updatedOrder = await storage.updateOrder(req.params.id, updates);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
      }

      res.json({ order: updatedOrder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Sipariş güncellenemedi" });
    }
  });

  // Update Package (Admin)
  app.patch("/api/admin/packages/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = z.object({
        name: z.string().optional(),
        weeks: z.number().optional(),
        price: z.string().optional(),
        features: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      }).parse(req.body);

      const updatedPackage = await storage.updatePackage(req.params.id, updateData);
      if (!updatedPackage) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }

      res.json({ package: updatedPackage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Paket güncellenemedi" });
    }
  });

  // Admin Assign Package to User
  app.post("/api/admin/assign-package", requireAdmin, async (req, res) => {
    try {
      const data = z.object({
        userId: z.string(),
        packageId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        notes: z.string().optional(),
      }).parse(req.body);

      const user = await storage.getUser(data.userId);
      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      const pkg = await storage.getPackage(data.packageId);
      if (!pkg) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }

      const order = await storage.createOrder({
        userId: data.userId,
        packageId: data.packageId,
        totalPrice: pkg.price,
        status: "active",
        source: "admin_assigned",
        adminAssignedBy: req.session.userId!,
        paymentMethod: "admin",
        paymentId: null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });

      sendOrderConfirmationEmail(
        { id: user.id, email: user.email, fullName: user.fullName },
        { totalPrice: pkg.price, startDate: order.startDate, endDate: order.endDate },
        { name: pkg.name, weeks: pkg.weeks }
      ).catch(err => console.error("Order confirmation email error:", err));

      res.json({ order, message: "Paket başarıyla atandı" });
    } catch (error) {
      console.error("Assign package error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri", details: error.errors });
      }
      res.status(500).json({ error: "Paket atanamadı" });
    }
  });

  // ===== CALCULATOR ROUTES =====
  
  app.post("/api/calculator/save", async (req, res) => {
    try {
      const { calculatorType, inputData, resultData } = z.object({
        calculatorType: z.string(),
        inputData: z.any(),
        resultData: z.any(),
      }).parse(req.body);

      const result = await storage.saveCalculatorResult({
        userId: req.session?.userId || null,
        calculatorType,
        inputData: JSON.stringify(inputData),
        resultData: JSON.stringify(resultData),
      });

      res.json({ result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Hesaplama kaydedilemedi" });
    }
  });

  app.get("/api/calculator/results", requireAuth, async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const results = await storage.getUserCalculatorResults(req.session.userId!, type);
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: "Sonuçlar yüklenemedi" });
    }
  });

  // ===== DAILY HABITS ROUTES =====
  
  app.get("/api/habits/today", requireAuth, async (req, res) => {
    try {
      const today = new Date();
      const habit = await storage.getDailyHabit(req.session.userId!, today);
      const streak = await storage.getHabitStreak(req.session.userId!);
      res.json({ habit, streak });
    } catch (error) {
      res.status(500).json({ error: "Alışkanlık verileri yüklenemedi" });
    }
  });

  app.get("/api/habits", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const habits = await storage.getDailyHabits(req.session.userId!, limit);
      const streak = await storage.getHabitStreak(req.session.userId!);
      res.json({ habits, streak });
    } catch (error) {
      res.status(500).json({ error: "Alışkanlık verileri yüklenemedi" });
    }
  });

  app.post("/api/habits", requireAuth, async (req, res) => {
    try {
      const data = z.object({
        date: z.string().optional(),
        waterGlasses: z.number().min(0).max(20).optional(),
        didWorkout: z.boolean().optional(),
        sleepHours: z.number().min(0).max(24).optional(),
        notes: z.string().optional(),
      }).parse(req.body);

      const habit = await storage.upsertDailyHabit({
        userId: req.session.userId!,
        date: data.date ? new Date(data.date) : new Date(),
        waterGlasses: data.waterGlasses ?? 0,
        didWorkout: data.didWorkout ?? false,
        sleepHours: data.sleepHours?.toString() ?? null,
        notes: data.notes ?? null,
      });

      const streak = await storage.getHabitStreak(req.session.userId!);
      res.json({ habit, streak });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Alışkanlık kaydedilemedi" });
    }
  });

  // ===== BODY MEASUREMENTS ROUTES =====
  
  app.get("/api/measurements", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const measurements = await storage.getBodyMeasurements(req.session.userId!, limit);
      res.json({ measurements });
    } catch (error) {
      res.status(500).json({ error: "Ölçümler yüklenemedi" });
    }
  });

  app.get("/api/measurements/latest", requireAuth, async (req, res) => {
    try {
      const measurement = await storage.getLatestBodyMeasurement(req.session.userId!);
      res.json({ measurement });
    } catch (error) {
      res.status(500).json({ error: "Ölçüm yüklenemedi" });
    }
  });

  app.post("/api/measurements", requireAuth, async (req, res) => {
    try {
      const data = z.object({
        date: z.string().optional(),
        weight: z.number().positive().optional(),
        chest: z.number().positive().optional(),
        waist: z.number().positive().optional(),
        hips: z.number().positive().optional(),
        arms: z.number().positive().optional(),
        thighs: z.number().positive().optional(),
        notes: z.string().optional(),
      }).parse(req.body);

      const measurement = await storage.createBodyMeasurement({
        userId: req.session.userId!,
        date: data.date ? new Date(data.date) : new Date(),
        weight: data.weight?.toString() ?? null,
        chest: data.chest?.toString() ?? null,
        waist: data.waist?.toString() ?? null,
        hips: data.hips?.toString() ?? null,
        arms: data.arms?.toString() ?? null,
        thighs: data.thighs?.toString() ?? null,
        notes: data.notes ?? null,
      });

      res.json({ measurement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Ölçüm kaydedilemedi" });
    }
  });

  // ===== USER ACTIVE ORDER (for dashboard) =====
  
  app.get("/api/orders/active", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.session.userId!);
      const activeOrder = orders.find(o => o.status === "active" || o.status === "paid");
      
      if (activeOrder) {
        const pkg = await storage.getPackage(activeOrder.packageId);
        res.json({ order: activeOrder, package: pkg });
      } else {
        res.json({ order: null, package: null });
      }
    } catch (error) {
      res.status(500).json({ error: "Aktif sipariş yüklenemedi" });
    }
  });

  return httpServer;
}
