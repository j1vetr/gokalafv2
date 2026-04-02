import { motion } from "framer-motion";
import { XCircle, MessageCircle, ArrowLeft, RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const REASONS = [
  "Kart bilgileriniz hatalı girilmiş olabilir",
  "Kartınızda yeterli bakiye olmayabilir",
  "Bankanız online alışverişe izin vermemiş olabilir",
  "İnternet bağlantısı sorunu yaşanmış olabilir",
];

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 max-w-2xl pt-24 pb-16">

        {/* Hero icon */}
        <motion.div
          className="flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative mb-8">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-red-500/30"
                style={{ borderRadius: "50%" }}
                animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.4, 0] }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "2px solid rgba(239,68,68,0.3)",
                boxShadow: "0 0 40px rgba(239,68,68,0.15)",
              }}
              initial={{ scale: 0, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 180 }}
            >
              <XCircle className="w-14 h-14 text-red-500" strokeWidth={1.5} />
            </motion.div>
          </div>

          <motion.p
            className="text-red-500 uppercase tracking-[0.3em] text-sm font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Ödeme Başarısız
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl font-heading font-black uppercase text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Bir Sorun{" "}
            <span className="text-red-500" style={{ textShadow: "0 0 24px rgba(239,68,68,0.4)" }}>
              Oluştu
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Ödeme işleminiz tamamlanamadı. Endişelenmeyin — tekrar deneyebilir ya da
            bizimle iletişime geçebilirsiniz.
          </motion.p>
        </motion.div>

        {/* Possible reasons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="text-red-400" size={16} />
            </div>
            <h2 className="text-white font-heading font-bold text-base uppercase tracking-wider">
              Olası Sebepler
            </h2>
          </div>
          <ul className="space-y-3">
            {REASONS.map((reason, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3 text-gray-400 text-sm"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.95 + i * 0.1 }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    color: "#f87171",
                  }}
                >
                  {i + 1}
                </span>
                {reason}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* WhatsApp help card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.03) 100%)",
            border: "1px solid rgba(37,211,102,0.2)",
          }}
        >
          <div
            className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-10"
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
                Yardıma mı ihtiyacınız var?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sorunu çözemediniz mi? Bize WhatsApp'tan yazın, size anında yardımcı olalım.
                Manuel ödeme seçenekleri için de iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25 }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <Link href="/odeme" className="flex-1">
            <Button
              className="w-full py-6 text-base font-heading font-bold uppercase tracking-wider"
              style={{
                background: "#ccff00",
                color: "#000",
                boxShadow: "0 0 20px rgba(204,255,0,0.2)",
              }}
              data-testid="button-retry-payment"
            >
              <RefreshCw size={18} className="mr-2" />
              Tekrar Dene
            </Button>
          </Link>

          <Button
            onClick={() => window.open("https://wa.me/905312822402", "_blank")}
            variant="outline"
            className="flex-1 py-6 text-base font-heading font-bold uppercase tracking-wider border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
            data-testid="button-whatsapp-failed"
          >
            <MessageCircle size={18} className="mr-2" />
            WhatsApp Yardım
          </Button>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/paketler"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-300 transition-colors text-sm"
          >
            <ArrowLeft size={14} />
            Paketlere Dön
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
