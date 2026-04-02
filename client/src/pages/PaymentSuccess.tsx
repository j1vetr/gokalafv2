import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, Star, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderInfo {
  id: string;
  packageName: string;
  weeks: number;
  totalPrice: string;
  startDate: string | null;
  endDate: string | null;
}

function WhatsAppIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0],
        y: [0, -(70 + size * 6)],
      }}
      transition={{
        duration: 2 + size * 0.1,
        delay,
        repeat: Infinity,
        repeatDelay: 3 + size * 0.3,
        ease: "easeOut",
      }}
    />
  );
}

function PulseRing({ delay, scale }: { delay: number; scale: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        inset: 0,
        borderRadius: "50%",
        border: "1.5px solid rgba(204,255,0,0.5)",
      }}
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale, opacity: [0, 0.55, 0] }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        repeatDelay: 0.3,
        ease: "easeOut",
      }}
    />
  );
}

const STEPS = [
  {
    icon: CheckCircle,
    title: "Sipariş Onaylandı",
    desc: "Ödemeniz başarıyla alındı, sistemimize kaydedildi.",
    done: true,
    color: "#ccff00",
  },
  {
    useWhatsApp: true,
    title: "WhatsApp ile İletişim",
    desc: "24 saat içinde koçunuz sizi WhatsApp'tan arayacak.",
    done: false,
    color: "#25d366",
  },
  {
    icon: Zap,
    title: "Kişisel Program Hazırlanıyor",
    desc: "Vücudunuza özel antrenman ve beslenme planı oluşturuluyor.",
    done: false,
    color: "#ccff00",
  },
  {
    icon: Trophy,
    title: "Dönüşüm Başlıyor",
    desc: "Hedeflerinize giden yolda ilk adımı attınız.",
    done: false,
    color: "#d4a017",
  },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: 5 + (i / 20) * 90 + (Math.sin(i) * 10),
  y: 10 + (Math.cos(i * 2.3) * 35 + 35),
  size: 4 + (i % 6),
  delay: i * 0.22,
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,255,0,0.07) 0%, transparent 70%)",
        }}
      />

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
          <div className="relative mb-8 w-28 h-28">
            <PulseRing delay={0} scale={1.55} />
            <PulseRing delay={0.65} scale={1.85} />
            <PulseRing delay={1.3} scale={2.2} />

            <motion.div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(204,255,0,0.15) 0%, rgba(204,255,0,0.04) 100%)",
                border: "2px solid rgba(204,255,0,0.45)",
                boxShadow: "0 0 36px rgba(204,255,0,0.22), 0 0 70px rgba(204,255,0,0.09)",
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
            <span className="text-primary" style={{ textShadow: "0 0 30px rgba(204,255,0,0.5)" }}>
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
            <div className="divide-y divide-white/5">
              {[
                { label: "Paket", value: orderInfo.packageName },
                { label: "Süre", value: `${orderInfo.weeks} Hafta` },
                {
                  label: "Ödenen Tutar",
                  value: `₺${parseFloat(orderInfo.totalPrice).toLocaleString("tr-TR")}`,
                  highlight: true,
                },
                ...(orderInfo.startDate
                  ? [{
                      label: "Program Tarihleri",
                      value: `${formatDate(orderInfo.startDate)} – ${formatDate(orderInfo.endDate)}`,
                    }]
                  : []),
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className={`font-semibold text-sm ${ (row as any).highlight ? "text-primary text-base" : "text-white" }`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next steps */}
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
                  const Icon = (step as any).icon;
                  const isWA = (step as any).useWhatsApp;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-start gap-4 rounded-xl p-4 relative overflow-hidden"
                      style={{
                        background: step.done ? "rgba(204,255,0,0.05)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${step.done ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `${step.color}18`,
                          border: `1px solid ${step.color}40`,
                          color: step.color,
                        }}
                      >
                        {isWA
                          ? <WhatsAppIcon size={16} />
                          : <Icon size={16} style={{ color: step.color }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-semibold text-sm">{step.title}</p>
                          {step.done && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ background: "rgba(204,255,0,0.12)", color: "#ccff00" }}
                            >
                              Tamamlandı
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                      </div>
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

        {/* WhatsApp CTA card */}
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
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: "#25d366" }} />
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white"
              style={{ background: "#25d366" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <WhatsAppIcon size={26} />
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

        {/* Single CTA button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <Button
            onClick={() => window.open("https://wa.me/905312822402", "_blank")}
            className="w-full py-6 text-base font-heading font-bold uppercase tracking-wider"
            style={{
              background: "#25d366",
              color: "#fff",
              boxShadow: "0 0 28px rgba(37,211,102,0.35)",
            }}
            data-testid="button-whatsapp-success"
          >
            <WhatsAppIcon size={22} className="mr-2" />
            WhatsApp ile Ulaş
          </Button>
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
