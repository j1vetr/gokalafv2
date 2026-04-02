import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Calendar,
  Package,
  Clock,
  Star,
  Trophy,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface OrderInfo {
  id: string;
  packageName: string;
  weeks: number;
  totalPrice: string;
  startDate: string | null;
  endDate: string | null;
}

function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: size % 3 === 0 ? "#ccff00" : size % 2 === 0 ? "#39ff14" : "#ffffff",
        opacity: 0,
      }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [0, -80 - Math.random() * 60],
        x: [0, (Math.random() - 0.5) * 40],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 1.8 + Math.random() * 0.8,
        delay,
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 2,
        ease: "easeOut",
      }}
    />
  );
}

const STEPS = [
  {
    icon: CheckCircle,
    title: "Sipariş onaylandı",
    desc: "Ödemeniz başarıyla alındı, sistemimize kaydedildi.",
    done: true,
    color: "#ccff00",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp ile iletişim",
    desc: "24 saat içinde koçunuz sizi WhatsApp'tan arayacak.",
    done: false,
    color: "#25d366",
  },
  {
    icon: Zap,
    title: "Kişisel program hazırlanıyor",
    desc: "Vücudunuza özel antrenman ve beslenme planı oluşturuluyor.",
    done: false,
    color: "#ccff00",
  },
  {
    icon: Trophy,
    title: "Dönüşüm başlıyor",
    desc: "Hedeflerinize giden yolda ilk adımı attınız.",
    done: false,
    color: "#d4a017",
  },
];

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 10 + Math.random() * 80,
  size: 4 + Math.floor(Math.random() * 8),
  delay: i * 0.18,
}));

export default function PaymentSuccess() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order");
      const token = urlParams.get("token");

      if (orderId && token) {
        try {
          const res = await fetch(`/api/orders/${orderId}/public?token=${encodeURIComponent(token)}`);
          if (res.ok) {
            const data = await res.json();
            setOrderInfo({
              id: data.order.id,
              packageName: data.package?.name || "Koçluk Paketi",
              weeks: data.package?.weeks || 12,
              totalPrice: data.order.totalPrice,
              startDate: data.order.startDate,
              endDate: data.order.endDate,
            });
          }
        } catch (error) {
          console.error("Order info fetch error:", error);
        }
      }
      setIsLoading(false);
    };
    fetchOrderInfo();
    const t = setTimeout(() => setShowSteps(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,255,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-2xl pt-24 pb-16">

        {/* Hero icon */}
        <motion.div
          className="flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative mb-8">
            {/* Outer pulse rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-primary/40"
                style={{ borderRadius: "50%" }}
                animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.5, 0] }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(204,255,0,0.15) 0%, rgba(204,255,0,0.05) 100%)",
                border: "2px solid rgba(204,255,0,0.4)",
                boxShadow: "0 0 40px rgba(204,255,0,0.25), 0 0 80px rgba(204,255,0,0.1)",
              }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-14 h-14 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>

          <motion.p
            className="text-primary uppercase tracking-[0.3em] text-sm font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Ödeme Başarılı
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Yolculuğunuz{" "}
            <span
              className="text-primary"
              style={{ textShadow: "0 0 30px rgba(204,255,0,0.5)" }}
            >
              Başlıyor
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Tebrikler! En iyi kararı verdiniz. Artık geriye yalnızca çalışmak kalıyor.
          </motion.p>
        </motion.div>

        {/* Order details */}
        {orderInfo && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(204,255,0,0.15)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="text-primary" size={16} />
              </div>
              <h2 className="text-white font-heading font-bold text-base uppercase tracking-wider">
                Sipariş Detayları
              </h2>
            </div>
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { label: "Paket", value: orderInfo.packageName },
                { label: "Süre", value: `${orderInfo.weeks} Hafta` },
                {
                  label: "Ödenen Tutar",
                  value: `₺${parseFloat(orderInfo.totalPrice).toLocaleString("tr-TR")}`,
                  highlight: true,
                },
                ...(orderInfo.startDate
                  ? [
                      {
                        label: "Program Tarihleri",
                        value: `${formatDate(orderInfo.startDate)} – ${formatDate(orderInfo.endDate)}`,
                      },
                    ]
                  : []),
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span
                    className={`font-semibold text-sm ${
                      (row as any).highlight ? "text-primary text-base" : "text-white"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next steps timeline */}
        <AnimatePresence>
          {showSteps && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4 text-center">
                Sonraki Adımlar
              </p>
              <div className="space-y-2">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-start gap-4 rounded-xl p-4 relative overflow-hidden"
                      style={{
                        background: step.done
                          ? "rgba(204,255,0,0.05)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${step.done ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `${step.color}18`,
                          border: `1px solid ${step.color}40`,
                        }}
                      >
                        <Icon size={16} style={{ color: step.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-semibold text-sm">{step.title}</p>
                          {step.done && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{
                                background: "rgba(204,255,0,0.12)",
                                color: "#ccff00",
                              }}
                            >
                              Tamamlandı
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                      {/* Step number */}
                      <span className="text-white/10 font-heading font-black text-3xl absolute right-4 top-1/2 -translate-y-1/2 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.1) 0%, rgba(37,211,102,0.04) 100%)",
            border: "1px solid rgba(37,211,102,0.25)",
          }}
        >
          <div
            className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: "#25d366" }}
          />
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#25d366" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-white font-heading font-bold text-base mb-1">
                Koçunuz 24 saat içinde sizinle iletişime geçecek
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sipariş bilgileriniz alındı. Koçunuz WhatsApp üzerinden sizinle iletişime
                geçecek, vücut ölçülerinizi ve hedeflerinizi alarak kişisel programınızı
                hazırlayacak.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <Button
            onClick={() => window.open("https://wa.me/905312822402", "_blank")}
            className="flex-1 py-6 text-base font-heading font-bold uppercase tracking-wider"
            style={{
              background: "#25d366",
              color: "#fff",
              boxShadow: "0 0 24px rgba(37,211,102,0.3)",
            }}
            data-testid="button-whatsapp-success"
          >
            <MessageCircle size={20} className="mr-2" />
            WhatsApp ile Ulaş
          </Button>

          <Link href="/panel" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-6 text-base font-heading font-bold uppercase tracking-wider border-primary/40 text-primary hover:bg-primary hover:text-black transition-all"
              data-testid="button-go-panel"
            >
              Panele Git
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Motivational footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-10"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-primary fill-primary" />
            ))}
          </div>
          <p className="text-gray-600 text-sm italic">
            "Disiplin, motivasyonun bitmediği yerde devreye girer."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
