import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertUserSchema, insertOrderSchema } from "@shared/schema";
import "./types"; // Session type augmentation

const PgSession = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Session middleware
const sessionMiddleware = session({
  store: new PgSession({
    pool: pool as any,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "gokalaf-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
      const { email, password, fullName, phone } = insertUserSchema.parse(req.body);
      
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
        role: "user",
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
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

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
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

  return httpServer;
}
