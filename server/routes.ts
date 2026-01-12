import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { insertUserSchema, insertOrderSchema } from "@shared/schema";
import "./types"; // Session type augmentation
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendAdminNewUserNotification, sendAdminNewOrderNotification } from "./email/service";
import { Shopier } from "shopier-api";
import { sanitizeString } from "./utils/sanitize";

function verifyShopierSignature(postData: any, apiSecret: string): boolean {
  try {
    const { signature, random_nr, platform_order_id, total_order_value, currency } = postData;
    if (!signature || !random_nr || !platform_order_id || !total_order_value || !currency) {
      console.error("Shopier signature verification: Missing required fields", { 
        hasSignature: !!signature, 
        hasRandomNr: !!random_nr, 
        hasOrderId: !!platform_order_id, 
        hasValue: !!total_order_value, 
        hasCurrency: !!currency 
      });
      return false;
    }
    const dataString = `${random_nr}${platform_order_id}${total_order_value}${currency}`;
    const expectedSignatureBuffer = crypto.createHmac('sha256', apiSecret).update(dataString).digest();
    const receivedSignature = signature.replace(/ /g, '+');
    let receivedSignatureBuffer: Buffer;
    try {
      receivedSignatureBuffer = Buffer.from(receivedSignature, 'base64');
    } catch {
      console.error("Shopier signature verification: Invalid base64 signature");
      return false;
    }
    if (expectedSignatureBuffer.length !== receivedSignatureBuffer.length) {
      console.error("Shopier signature verification: Length mismatch");
      return false;
    }
    const isValid = crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);
    console.log("Shopier signature verification:", { dataString, isValid });
    return isValid;
  } catch (error) {
    console.error("Shopier signature verification error:", error);
    return false;
  }
}

const MemoryStore = createMemoryStore(session);

// Session middleware with memory store (auto-cleans expired sessions)
const sessionMiddleware = session({
  store: new MemoryStore({
    checkPeriod: 86400000, // Clean up expired sessions every 24h
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

  // ===== SEO SITEMAP =====
  app.get("/sitemap.xml", async (req, res) => {
    const baseUrl = "https://gokalaf.com";
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/paketler", priority: "0.95", changefreq: "weekly" },
      { loc: "/hakkimizda", priority: "0.9", changefreq: "monthly" },
      { loc: "/yazilar", priority: "0.9", changefreq: "daily" },
      { loc: "/araclar", priority: "0.9", changefreq: "weekly" },
      { loc: "/araclar/boy-kilo-endeksi", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/vki", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/kalori", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/tdee", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/makro", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/ideal-kilo", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/vucut-yagi", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/bir-tekrar-max", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/su-tuketimi", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/kalp-atisi", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/protein", priority: "0.95", changefreq: "monthly" },
      { loc: "/araclar/dinlenme", priority: "0.95", changefreq: "monthly" },
      { loc: "/egzersiz-akademisi", priority: "0.8", changefreq: "weekly" },
      { loc: "/giris", priority: "0.5", changefreq: "monthly" },
      { loc: "/kayit", priority: "0.5", changefreq: "monthly" },
      { loc: "/gizlilik-politikasi", priority: "0.3", changefreq: "yearly" },
      { loc: "/kvkk", priority: "0.3", changefreq: "yearly" },
      { loc: "/iptal-iade", priority: "0.3", changefreq: "yearly" },
      { loc: "/mesafeli-satis-sozlesmesi", priority: "0.3", changefreq: "yearly" },
    ];

    try {
      const articles = await storage.getPublishedArticles();
      const articlePages = articles.map(a => ({
          loc: `/yazilar/${a.slug}`,
          priority: "0.95",
          changefreq: "monthly",
        }));

      const exercises = await storage.getAllExerciseSlugs();
      const exercisePages = exercises.map(slug => ({
        loc: `/egzersiz-akademisi/${slug}`,
        priority: "0.7",
        changefreq: "monthly",
      }));

      const allPages = [...staticPages, ...articlePages, ...exercisePages];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`).join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`).join("\n")}
</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.send(sitemap);
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /gokadmin
Disallow: /panel
Disallow: /odeme
Disallow: /api/

# AI Crawlers - Welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Cohere-ai
Allow: /

User-agent: YouBot
Allow: /

Sitemap: https://gokalaf.com/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // ===== AUTH ROUTES =====
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName, phone, address, trafficSource } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Bu email adresi zaten kullanılıyor" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName: sanitizeString(fullName) || fullName,
        phone: sanitizeString(phone) || null,
        address: sanitizeString(address) || null,
        role: "user",
        trafficSource: trafficSource || null,
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      sendWelcomeEmail({ id: user.id, email: user.email, fullName: user.fullName })
        .catch(err => console.error("Welcome email error:", err));
      
      sendAdminNewUserNotification({ id: user.id, email: user.email, fullName: user.fullName, phone: user.phone || undefined })
        .catch(err => console.error("Admin new user notification error:", err));
      
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

  // Update user fitness goal
  app.patch("/api/users/me/goal", requireAuth, async (req, res) => {
    try {
      const { goal } = z.object({
        goal: z.enum(["lose", "maintain", "gain"]),
      }).parse(req.body);

      const updatedUser = await storage.updateUser(req.session.userId!, {
        fitnessGoal: goal,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz hedef" });
      }
      res.status(500).json({ error: "Hedef güncellenemedi" });
    }
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

  app.get("/api/orders/:id/public", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(403).json({ error: "Geçersiz erişim" });
      }

      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
      }
      if (order.status !== "paid") {
        return res.status(403).json({ error: "Bu siparişe erişim yetkiniz yok" });
      }

      const storedToken = await storage.getSiteSetting(`payment_token_${req.params.id}`);
      if (!storedToken || storedToken !== token) {
        return res.status(403).json({ error: "Geçersiz token" });
      }

      const pkg = await storage.getPackage(order.packageId);
      res.json({ 
        order: {
          id: order.id,
          totalPrice: order.totalPrice,
          status: order.status,
          startDate: order.startDate,
          endDate: order.endDate,
        },
        package: pkg ? {
          name: pkg.name,
          weeks: pkg.weeks,
        } : null
      });
    } catch (error) {
      res.status(500).json({ error: "Sipariş yüklenemedi" });
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

  // Update order - ADMIN ONLY for security (status, payment fields restricted)
  app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
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

      await storage.createSystemLog({
        userId: req.session?.userId,
        action: "order_updated_by_admin",
        entityType: "order",
        entityId: req.params.id,
        details: JSON.stringify({ updates: updateData }),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      const updatedOrder = await storage.updateOrder(req.params.id, updates);
      res.json({ order: updatedOrder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Sipariş güncellenemedi" });
    }
  });

  // ===== SHOPIER PAYMENT INITIATION =====
  
  app.post("/api/shopier/initiate", requireAuth, async (req, res) => {
    try {
      const { orderId } = req.body;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı" });
      }
      
      if (order.userId !== req.session.userId) {
        return res.status(403).json({ error: "Bu siparişe erişim yetkiniz yok" });
      }
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }
      
      const pkg = await storage.getPackage(order.packageId);
      if (!pkg) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }

      const apiKey = process.env.SHOPIER_API_KEY;
      const apiSecret = process.env.SHOPIER_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        console.error("Shopier API credentials not configured");
        return res.status(500).json({ error: "Ödeme sistemi yapılandırılmamış" });
      }

      const shopier = new Shopier(apiKey, apiSecret);
      
      const buyerName = user.fullName?.split(" ")[0] || "Müşteri";
      const buyerSurname = user.fullName?.split(" ").slice(1).join(" ") || "Kullanıcı";
      const productPrice = parseFloat(order.totalPrice.toString());

      const referenceId = order.referenceId || order.id.split("-")[0].slice(-4);
      const shopierOrderId = `${referenceId} - ${pkg.weeks} Haftalık`;
      const productName = `${pkg.name} - ${pkg.weeks} Hafta`;
      
      shopier.setBuyer({
        buyer_id_nr: shopierOrderId,
        product_name: productName,
        buyer_name: buyerName,
        buyer_surname: buyerSurname,
        buyer_email: user.email,
        buyer_phone: user.phone || "5000000000"
      });

      shopier.setOrderBilling({
        billing_address: user.address || "Türkiye",
        billing_city: "İstanbul",
        billing_country: "Türkiye",
        billing_postcode: "34000"
      });

      shopier.setOrderShipping({
        shipping_address: user.address || "Türkiye",
        shipping_city: "İstanbul",
        shipping_country: "Türkiye",
        shipping_postcode: "34000"
      });

      const paymentHTML = shopier.generatePaymentHTML(productPrice);
      
      res.send(paymentHTML);
    } catch (error) {
      console.error("Shopier initiate error:", error);
      res.status(500).json({ error: "Ödeme başlatılamadı" });
    }
  });

  // ===== SHOPIER PAYMENT CALLBACK =====
  
  app.post("/api/shopier/callback", async (req, res) => {
    try {
      const apiKey = process.env.SHOPIER_API_KEY;
      const apiSecret = process.env.SHOPIER_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Shopier API credentials not configured");
        return res.redirect("/odeme-basarisiz");
      }

      console.log("Shopier callback received:", JSON.stringify(req.body, null, 2));

      const shopier = new Shopier(apiKey, apiSecret);
      const callbackResult = shopier.callback(req.body);
      
      if (!callbackResult || !callbackResult.order_id) {
        console.error("Shopier callback: Invalid callback data");
        await storage.createSystemLog({
          userId: null,
          action: "shopier_callback_invalid",
          entityType: "payment",
          details: JSON.stringify({ body: req.body }),
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        });
        return res.redirect("/odeme-basarisiz");
      }

      const rawOrderId = String(callbackResult.order_id);
      // Extract just the GOKxxxx part if it contains package info (e.g., "GOK1001 - 8 Haftalık" -> "GOK1001")
      const referenceId = rawOrderId.trim().split(" - ")[0].trim();
      const payment_id = String(callbackResult.payment_id);
      const installment = callbackResult.installment;

      if (referenceId) {
        let order = await storage.getOrderByReferenceId(referenceId);
        if (!order) {
          order = await storage.getOrder(referenceId);
        }
        if (order) {
          const pkg = await storage.getPackage(order.packageId);
          const weeks = pkg?.weeks || 12;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + (weeks * 7));

          await storage.updateOrder(order.id, {
            status: "paid",
            paymentMethod: "shopier",
            paymentId: payment_id,
            startDate,
            endDate,
          });

          const user = await storage.getUser(order.userId);
          if (user && pkg) {
            try {
              await sendOrderConfirmationEmail(
                { id: user.id, email: user.email, fullName: user.fullName },
                { totalPrice: order.totalPrice, startDate, endDate },
                { name: pkg.name, weeks: pkg.weeks }
              );
              
              await sendAdminNewOrderNotification(
                { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone || undefined },
                { id: order.id, totalPrice: order.totalPrice },
                { name: pkg.name, weeks: pkg.weeks }
              );
            } catch (emailError) {
              console.error("Order confirmation email failed:", emailError);
            }
          }

          await storage.createSystemLog({
            userId: order.userId,
            action: "payment_success",
            entityType: "order",
            entityId: order.id,
            details: JSON.stringify({ paymentId: payment_id, installment, amount: order.totalPrice }),
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
          });

          const successToken = crypto.createHmac('sha256', apiSecret)
            .update(`${order.id}${payment_id}${Date.now()}`)
            .digest('hex')
            .substring(0, 32);

          await storage.setSiteSetting(`payment_token_${order.id}`, successToken);

          console.log(`✅ Order ${order.referenceId || order.id} marked as paid`);
          return res.redirect(`/odeme-basarili?order=${order.id}&token=${successToken}`);
        } else {
          console.error(`Shopier callback: Order not found - ${referenceId}`);
          return res.redirect("/odeme-basarisiz");
        }
      }
      
      return res.redirect("/odeme-basarisiz");
    } catch (error) {
      console.error("Shopier callback error:", error);
      return res.redirect("/odeme-basarisiz");
    }
  });

  // ===== SITE SETTINGS ROUTES =====
  
  app.get("/api/maintenance", async (req, res) => {
    try {
      const isEnabled = await storage.isMaintenanceMode();
      res.json({ maintenanceMode: isEnabled });
    } catch (error) {
      console.error("Maintenance check error:", error);
      res.json({ maintenanceMode: false });
    }
  });

  app.post("/api/admin/maintenance", requireAdmin, async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ error: "enabled parametresi boolean olmalı" });
      }
      await storage.setMaintenanceMode(enabled);
      
      await storage.createSystemLog({
        userId: req.session?.userId,
        action: enabled ? "maintenance_enabled" : "maintenance_disabled",
        entityType: "settings",
        details: JSON.stringify({ enabled }),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      
      res.json({ success: true, maintenanceMode: enabled });
    } catch (error) {
      console.error("Maintenance toggle error:", error);
      res.status(500).json({ error: "Bakım modu değiştirilemedi" });
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

  // Comprehensive Analytics Endpoint
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [users, orders, calculatorResults, dailyHabits, bodyMeasurements, dailyNutrition, systemLogs] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllOrders(),
        storage.getAllCalculatorResults(),
        storage.getAllDailyHabits(),
        storage.getAllBodyMeasurements(),
        storage.getAllDailyNutrition(),
        storage.getSystemLogs(1000),
      ]);

      const filteredUsers = users.filter(u => new Date(u.createdAt) >= startDate);
      const activeUserIds = new Set([
        ...calculatorResults.filter(c => new Date(c.createdAt) >= startDate).map(c => c.userId),
        ...dailyHabits.filter(h => new Date(h.date) >= startDate).map(h => h.userId),
        ...systemLogs.filter(l => l.action === 'login' && new Date(l.createdAt) >= startDate).map(l => l.userId),
      ].filter(Boolean));

      const calcStats: Record<string, { count: number; users: Set<string> }> = {};
      calculatorResults.forEach(c => {
        if (!calcStats[c.calculatorType]) calcStats[c.calculatorType] = { count: 0, users: new Set() };
        calcStats[c.calculatorType].count++;
        if (c.userId) calcStats[c.calculatorType].users.add(c.userId);
      });

      const trafficSourceCounts: Record<string, number> = {};
      users.forEach(u => {
        const src = u.trafficSource || 'Bilinmiyor';
        trafficSourceCounts[src] = (trafficSourceCounts[src] || 0) + 1;
      });

      const habitStats = {
        avgWaterGlasses: dailyHabits.length > 0 ? dailyHabits.reduce((sum, h) => sum + (h.waterGlasses || 0), 0) / dailyHabits.length : 0,
        workoutDays: dailyHabits.filter(h => h.didWorkout).length,
        avgSleepHours: dailyHabits.filter(h => h.sleepHours).length > 0 
          ? dailyHabits.filter(h => h.sleepHours).reduce((sum, h) => sum + parseFloat(h.sleepHours?.toString() || '0'), 0) / dailyHabits.filter(h => h.sleepHours).length 
          : 0,
        totalHabitEntries: dailyHabits.length,
      };

      const loginCount = systemLogs.filter(l => l.action === 'login' && new Date(l.createdAt) >= startDate).length;
      const weeksInPeriod = Math.max(1, days / 7);

      const userEngagementMap: Record<string, any> = {};
      users.forEach(u => {
        userEngagementMap[u.id] = { userId: u.id, email: u.email, fullName: u.fullName, calculations: 0, habits: 0, measurements: 0, lastActive: u.createdAt };
      });
      calculatorResults.forEach(c => {
        if (c.userId && userEngagementMap[c.userId]) {
          userEngagementMap[c.userId].calculations++;
          if (new Date(c.createdAt) > new Date(userEngagementMap[c.userId].lastActive)) {
            userEngagementMap[c.userId].lastActive = c.createdAt;
          }
        }
      });
      dailyHabits.forEach(h => {
        if (userEngagementMap[h.userId]) {
          userEngagementMap[h.userId].habits++;
          if (new Date(h.date) > new Date(userEngagementMap[h.userId].lastActive)) {
            userEngagementMap[h.userId].lastActive = h.date;
          }
        }
      });
      bodyMeasurements.forEach(m => {
        if (userEngagementMap[m.userId]) userEngagementMap[m.userId].measurements++;
      });

      const userEngagement = Object.values(userEngagementMap)
        .sort((a: any, b: any) => (b.calculations + b.habits + b.measurements) - (a.calculations + a.habits + a.measurements))
        .slice(0, 50);

      const weeklyTrends: { week: string; newUsers: number; calculations: number; habitEntries: number }[] = [];
      for (let i = 0; i < Math.min(12, Math.ceil(days / 7)); i++) {
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 7);
        weeklyTrends.unshift({
          week: `H${Math.ceil(days / 7) - i}`,
          newUsers: users.filter(u => new Date(u.createdAt) >= weekStart && new Date(u.createdAt) < weekEnd).length,
          calculations: calculatorResults.filter(c => new Date(c.createdAt) >= weekStart && new Date(c.createdAt) < weekEnd).length,
          habitEntries: dailyHabits.filter(h => new Date(h.date) >= weekStart && new Date(h.date) < weekEnd).length,
        });
      }

      const userActivity: { date: string; logins: number; calculations: number; habits: number }[] = [];
      for (let i = Math.min(14, days); i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        userActivity.push({
          date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          logins: systemLogs.filter(l => l.action === 'login' && l.createdAt.toISOString().split('T')[0] === dateStr).length,
          calculations: calculatorResults.filter(c => c.createdAt.toISOString().split('T')[0] === dateStr).length,
          habits: dailyHabits.filter(h => h.date.toISOString().split('T')[0] === dateStr).length,
        });
      }

      res.json({
        overview: {
          totalUsers: users.length,
          activeUsers: activeUserIds.size,
          totalCalculations: calculatorResults.length,
          totalHabitDays: dailyHabits.length,
          totalMeasurements: bodyMeasurements.length,
          totalNutritionLogs: dailyNutrition.length,
          avgLoginFrequency: loginCount / weeksInPeriod,
        },
        calculatorUsage: Object.entries(calcStats).map(([type, data]) => ({
          type,
          count: data.count,
          uniqueUsers: data.users.size,
        })).sort((a, b) => b.count - a.count),
        userActivity,
        habitStats,
        trafficSources: Object.entries(trafficSourceCounts).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
        userEngagement,
        weeklyTrends,
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Analytics verileri yüklenemedi" });
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
        fullName: z.string().max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().max(20).optional(),
        role: z.enum(["user", "admin"]).optional(),
      }).parse(req.body);

      const sanitizedData = {
        ...updateData,
        fullName: updateData.fullName ? (sanitizeString(updateData.fullName) ?? updateData.fullName) : undefined,
        phone: updateData.phone ? (sanitizeString(updateData.phone) ?? updateData.phone) : undefined,
      };

      const updatedUser = await storage.updateUser(req.params.id, sanitizedData);
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
      console.log(`🗑️ Deleting user: ${req.params.id}`);
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }
      console.log(`✅ User deleted: ${req.params.id}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error(`❌ Delete user error:`, error?.message || error);
      res.status(500).json({ error: "Kullanıcı silinemedi", details: error?.message });
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
        notes: z.string().max(500).optional(),
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
        notes: z.string().max(500).optional(),
      }).parse(req.body);

      const habit = await storage.upsertDailyHabit({
        userId: req.session.userId!,
        date: data.date ? new Date(data.date) : new Date(),
        waterGlasses: data.waterGlasses ?? 0,
        didWorkout: data.didWorkout ?? false,
        sleepHours: data.sleepHours?.toString() ?? null,
        notes: sanitizeString(data.notes),
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
        bodyFatPercentage: z.number().min(1).max(60).optional(),
        chest: z.number().positive().optional(),
        waist: z.number().positive().optional(),
        hips: z.number().positive().optional(),
        arms: z.number().positive().optional(),
        thighs: z.number().positive().optional(),
        notes: z.string().max(500).optional(),
      }).parse(req.body);

      const measurement = await storage.createBodyMeasurement({
        userId: req.session.userId!,
        date: data.date ? new Date(data.date) : new Date(),
        weight: data.weight?.toString() ?? null,
        bodyFatPercentage: data.bodyFatPercentage?.toString() ?? null,
        chest: data.chest?.toString() ?? null,
        waist: data.waist?.toString() ?? null,
        hips: data.hips?.toString() ?? null,
        arms: data.arms?.toString() ?? null,
        thighs: data.thighs?.toString() ?? null,
        notes: sanitizeString(data.notes),
      });

      res.json({ measurement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Ölçüm kaydedilemedi" });
    }
  });

  // ===== DAILY NUTRITION ROUTES =====

  app.get("/api/nutrition/today", requireAuth, async (req, res) => {
    try {
      const nutrition = await storage.getDailyNutrition(req.session.userId!, new Date());
      const summary = await storage.getWeeklyNutritionSummary(req.session.userId!);
      res.json({ nutrition, summary });
    } catch (error) {
      res.status(500).json({ error: "Beslenme verisi yüklenemedi" });
    }
  });

  app.get("/api/nutrition", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const nutritionHistory = await storage.getDailyNutritionHistory(req.session.userId!, limit);
      res.json({ nutrition: nutritionHistory });
    } catch (error) {
      res.status(500).json({ error: "Beslenme geçmişi yüklenemedi" });
    }
  });

  app.post("/api/nutrition", requireAuth, async (req, res) => {
    try {
      const data = z.object({
        date: z.string().optional(),
        calories: z.number().int().min(0).optional(),
        protein: z.number().min(0).optional(),
        carbs: z.number().min(0).optional(),
        fat: z.number().min(0).optional(),
        fiber: z.number().min(0).optional(),
        notes: z.string().max(500).optional(),
      }).parse(req.body);

      const nutrition = await storage.upsertDailyNutrition({
        userId: req.session.userId!,
        date: data.date ? new Date(data.date) : new Date(),
        calories: data.calories ?? 0,
        protein: data.protein?.toString() ?? "0",
        carbs: data.carbs?.toString() ?? "0",
        fat: data.fat?.toString() ?? "0",
        fiber: data.fiber?.toString() ?? null,
        notes: sanitizeString(data.notes),
      });

      const summary = await storage.getWeeklyNutritionSummary(req.session.userId!);
      res.json({ nutrition, summary });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Beslenme kaydedilemedi" });
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

  // ===== COUPON ROUTES =====

  app.get("/api/admin/coupons", requireAdmin, async (req, res) => {
    try {
      const coupons = await storage.getAllCoupons();
      res.json({ coupons });
    } catch (error) {
      res.status(500).json({ error: "Kuponlar yüklenemedi" });
    }
  });

  app.post("/api/admin/coupons", requireAdmin, async (req, res) => {
    try {
      const data = z.object({
        code: z.string().min(3).max(20),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.string(),
        minOrderAmount: z.string().optional().nullable(),
        maxUsageCount: z.number().int().positive().optional().nullable(),
        validFrom: z.string(),
        validUntil: z.string(),
        isActive: z.boolean().default(true),
      }).parse(req.body);

      const coupon = await storage.createCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount || null,
        maxUsageCount: data.maxUsageCount || null,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        isActive: data.isActive,
        createdBy: req.session.userId!,
      });

      await storage.createSystemLog({
        userId: req.session.userId!,
        action: "create_coupon",
        entityType: "coupon",
        entityId: coupon.id,
        details: JSON.stringify({ code: coupon.code, discountType: data.discountType, discountValue: data.discountValue }),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ coupon });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      console.error("Coupon create error:", error);
      res.status(500).json({ error: "Kupon oluşturulamadı" });
    }
  });

  app.patch("/api/admin/coupons/:id", requireAdmin, async (req, res) => {
    try {
      const data = z.object({
        code: z.string().min(3).max(20).optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        discountValue: z.string().optional(),
        minOrderAmount: z.string().optional().nullable(),
        maxUsageCount: z.number().int().positive().optional().nullable(),
        validFrom: z.string().optional(),
        validUntil: z.string().optional(),
        isActive: z.boolean().optional(),
      }).parse(req.body);

      const updates: any = {};
      if (data.code) updates.code = data.code;
      if (data.discountType) updates.discountType = data.discountType;
      if (data.discountValue) updates.discountValue = data.discountValue;
      if (data.minOrderAmount !== undefined) updates.minOrderAmount = data.minOrderAmount;
      if (data.maxUsageCount !== undefined) updates.maxUsageCount = data.maxUsageCount;
      if (data.validFrom) updates.validFrom = new Date(data.validFrom);
      if (data.validUntil) updates.validUntil = new Date(data.validUntil);
      if (data.isActive !== undefined) updates.isActive = data.isActive;

      const coupon = await storage.updateCoupon(req.params.id, updates);

      await storage.createSystemLog({
        userId: req.session.userId!,
        action: "update_coupon",
        entityType: "coupon",
        entityId: req.params.id,
        details: JSON.stringify(updates),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ coupon });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Kupon güncellenemedi" });
    }
  });

  app.delete("/api/admin/coupons/:id", requireAdmin, async (req, res) => {
    try {
      const coupon = await storage.getCoupon(req.params.id);
      await storage.deleteCoupon(req.params.id);

      await storage.createSystemLog({
        userId: req.session.userId!,
        action: "delete_coupon",
        entityType: "coupon",
        entityId: req.params.id,
        details: JSON.stringify({ code: coupon?.code }),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Kupon silinemedi" });
    }
  });

  app.get("/api/admin/coupons/:id/usage", requireAdmin, async (req, res) => {
    try {
      const usage = await storage.getCouponUsage(req.params.id);
      res.json({ usage });
    } catch (error) {
      res.status(500).json({ error: "Kullanım geçmişi yüklenemedi" });
    }
  });

  app.post("/api/coupons/validate", requireAuth, async (req, res) => {
    try {
      const { code, orderAmount } = z.object({
        code: z.string(),
        orderAmount: z.number().positive(),
      }).parse(req.body);

      const coupon = await storage.getCouponByCode(code);

      if (!coupon) {
        return res.status(404).json({ error: "Kupon bulunamadı" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ error: "Bu kupon aktif değil" });
      }

      const now = new Date();
      if (new Date(coupon.validFrom) > now) {
        return res.status(400).json({ error: "Kupon henüz geçerli değil" });
      }
      if (new Date(coupon.validUntil) < now) {
        return res.status(400).json({ error: "Kuponun süresi dolmuş" });
      }

      if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
        return res.status(400).json({ error: "Kupon kullanım limiti dolmuş" });
      }

      if (coupon.minOrderAmount && orderAmount < parseFloat(coupon.minOrderAmount)) {
        return res.status(400).json({ 
          error: `Minimum sipariş tutarı ₺${parseFloat(coupon.minOrderAmount).toLocaleString("tr-TR")} olmalıdır` 
        });
      }

      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = orderAmount * (parseFloat(coupon.discountValue) / 100);
      } else {
        discountAmount = parseFloat(coupon.discountValue);
      }

      discountAmount = Math.min(discountAmount, orderAmount);

      res.json({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        discountAmount,
        finalAmount: orderAmount - discountAmount,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Geçersiz veri" });
      }
      res.status(500).json({ error: "Kupon doğrulanamadı" });
    }
  });

  // ===== SYSTEM LOGS ROUTES =====

  app.get("/api/admin/system-logs", requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const action = req.query.action as string;
      const userId = req.query.userId as string;

      let logs;
      if (userId) {
        logs = await storage.getSystemLogsByUser(userId, limit);
      } else if (action) {
        logs = await storage.getSystemLogsByAction(action, limit);
      } else {
        logs = await storage.getSystemLogs(limit, offset);
      }

      const total = await storage.getSystemLogsCount();

      res.json({ logs, total });
    } catch (error) {
      res.status(500).json({ error: "Loglar yüklenemedi" });
    }
  });

  // ===== BACKUP ROUTES =====

  app.get("/api/admin/backup/tables", requireAdmin, async (req, res) => {
    try {
      const tables = [
        { name: "users", label: "Kullanıcılar" },
        { name: "packages", label: "Paketler" },
        { name: "orders", label: "Siparişler" },
        { name: "coupons", label: "Kuponlar" },
        { name: "user_progress", label: "Kullanıcı İlerlemesi" },
        { name: "daily_habits", label: "Günlük Alışkanlıklar" },
        { name: "body_measurements", label: "Vücut Ölçüleri" },
        { name: "calculator_results", label: "Hesaplayıcı Sonuçları" },
        { name: "email_logs", label: "Email Logları" },
        { name: "system_logs", label: "Sistem Logları" },
      ];
      res.json({ tables });
    } catch (error) {
      res.status(500).json({ error: "Tablo listesi yüklenemedi" });
    }
  });

  app.get("/api/admin/backup/:table", requireAdmin, async (req, res) => {
    try {
      const tableName = req.params.table;
      const validTables = ["users", "packages", "orders", "coupons", "user_progress", "daily_habits", "body_measurements", "calculator_results", "email_logs", "system_logs", "coupon_usage"];
      
      if (!validTables.includes(tableName)) {
        return res.status(400).json({ error: "Geçersiz tablo adı" });
      }

      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
      
      const result = await pool.query(`SELECT * FROM ${tableName}`);
      
      await storage.createSystemLog({
        userId: req.session.userId!,
        action: "backup_table",
        entityType: "backup",
        entityId: tableName,
        details: JSON.stringify({ rowCount: result.rows.length }),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=${tableName}_backup_${new Date().toISOString().split("T")[0]}.json`);
      res.json({
        table: tableName,
        exportedAt: new Date().toISOString(),
        rowCount: result.rows.length,
        data: result.rows,
      });

      await pool.end();
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).json({ error: "Yedekleme başarısız" });
    }
  });

  app.get("/api/admin/backup/full/download", requireAdmin, async (req, res) => {
    try {
      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

      const tables = ["users", "packages", "orders", "coupons", "coupon_usage", "user_progress", "daily_habits", "body_measurements", "calculator_results", "email_logs", "system_logs"];
      
      const backup: any = {
        exportedAt: new Date().toISOString(),
        tables: {},
      };

      for (const table of tables) {
        try {
          const result = await pool.query(`SELECT * FROM ${table}`);
          backup.tables[table] = {
            rowCount: result.rows.length,
            data: result.rows,
          };
        } catch (e) {
          backup.tables[table] = { rowCount: 0, data: [], error: "Tablo bulunamadı" };
        }
      }

      await storage.createSystemLog({
        userId: req.session.userId!,
        action: "backup_full",
        entityType: "backup",
        entityId: "full",
        details: JSON.stringify({ tables: Object.keys(backup.tables) }),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=gokalaf_full_backup_${new Date().toISOString().split("T")[0]}.json`);
      res.json(backup);

      await pool.end();
    } catch (error) {
      console.error("Full backup error:", error);
      res.status(500).json({ error: "Tam yedekleme başarısız" });
    }
  });

  // ===== ARTICLES API (PUBLIC) =====
  app.get("/api/articles", async (req, res) => {
    try {
      let categoryId = req.query.category as string | undefined;
      
      if (categoryId) {
        const categories = await storage.getAllArticleCategories();
        const category = categories.find(c => c.slug === categoryId || c.id === categoryId);
        categoryId = category?.id;
      }
      
      const articles = await storage.getPublishedArticles(categoryId);
      res.json(articles);
    } catch (error) {
      console.error("Articles fetch error:", error);
      res.status(500).json({ error: "Makaleler yüklenemedi" });
    }
  });

  app.get("/api/articles/categories", async (req, res) => {
    try {
      const categories = await storage.getAllArticleCategories();
      res.json(categories);
    } catch (error) {
      console.error("Categories fetch error:", error);
      res.status(500).json({ error: "Kategoriler yüklenemedi" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article || article.status !== "published") {
        return res.status(404).json({ error: "Makale bulunamadı" });
      }
      res.json(article);
    } catch (error) {
      console.error("Article fetch error:", error);
      res.status(500).json({ error: "Makale yüklenemedi" });
    }
  });

  // ===== ADMIN ARTICLES API =====
  app.get("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("Admin articles fetch error:", error);
      res.status(500).json({ error: "Makaleler yüklenemedi" });
    }
  });

  app.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const article = await storage.createArticle(req.body);
      res.json(article);
    } catch (error) {
      console.error("Article create error:", error);
      res.status(500).json({ error: "Makale oluşturulamadı" });
    }
  });

  app.put("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateArticle(req.params.id, req.body);
      if (!article) {
        return res.status(404).json({ error: "Makale bulunamadı" });
      }
      res.json(article);
    } catch (error) {
      console.error("Article update error:", error);
      res.status(500).json({ error: "Makale güncellenemedi" });
    }
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteArticle(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Article delete error:", error);
      res.status(500).json({ error: "Makale silinemedi" });
    }
  });

  // ===== ADMIN ARTICLE CATEGORIES API =====
  app.get("/api/admin/article-categories", requireAdmin, async (req, res) => {
    try {
      const categories = await storage.getAllArticleCategories();
      res.json(categories);
    } catch (error) {
      console.error("Categories fetch error:", error);
      res.status(500).json({ error: "Kategoriler yüklenemedi" });
    }
  });

  app.post("/api/admin/article-categories", requireAdmin, async (req, res) => {
    try {
      const category = await storage.createArticleCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Category create error:", error);
      res.status(500).json({ error: "Kategori oluşturulamadı" });
    }
  });

  app.put("/api/admin/article-categories/:id", requireAdmin, async (req, res) => {
    try {
      const category = await storage.updateArticleCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Kategori bulunamadı" });
      }
      res.json(category);
    } catch (error) {
      console.error("Category update error:", error);
      res.status(500).json({ error: "Kategori güncellenemedi" });
    }
  });

  app.delete("/api/admin/article-categories/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteArticleCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Category delete error:", error);
      res.status(500).json({ error: "Kategori silinemedi" });
    }
  });

  // ===== EXERCISES API (Egzersiz Akademisi) =====
  app.get("/api/exercises", async (req, res) => {
    try {
      const { muscle, equipment, level, category, search, limit, offset } = req.query;
      const filters = {
        muscle: muscle as string | undefined,
        equipment: equipment as string | undefined,
        level: level as string | undefined,
        category: category as string | undefined,
        search: search as string | undefined,
        limit: limit ? parseInt(limit as string) : 24,
        offset: offset ? parseInt(offset as string) : 0,
      };
      const result = await storage.getExercisesByFilters(filters);
      res.json(result);
    } catch (error) {
      console.error("Exercises fetch error:", error);
      res.status(500).json({ error: "Egzersizler yüklenemedi" });
    }
  });

  app.get("/api/exercises/filters", async (req, res) => {
    try {
      const filters = await storage.getExerciseFilters();
      res.json(filters);
    } catch (error) {
      console.error("Exercise filters fetch error:", error);
      res.status(500).json({ error: "Filtreler yüklenemedi" });
    }
  });

  app.get("/api/exercises/:slug", async (req, res) => {
    try {
      const exercise = await storage.getExerciseBySlug(req.params.slug);
      if (!exercise) {
        return res.status(404).json({ error: "Egzersiz bulunamadı" });
      }
      res.json(exercise);
    } catch (error) {
      console.error("Exercise fetch error:", error);
      res.status(500).json({ error: "Egzersiz yüklenemedi" });
    }
  });

  return httpServer;
}
