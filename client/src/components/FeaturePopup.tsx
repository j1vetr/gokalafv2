import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Flame, Droplets, Utensils, Trophy, Calendar, TrendingUp } from "lucide-react";

const features = [
  { icon: Scale, text: "Kilo & Vücut Yağ Takibi", color: "text-green-400" },
  { icon: TrendingUp, text: "İlerleme Grafikleri", color: "text-blue-400" },
  { icon: Utensils, text: "Günlük Beslenme Kaydı", color: "text-orange-400" },
  { icon: Droplets, text: "Su Tüketimi Takibi", color: "text-cyan-400" },
  { icon: Flame, text: "Antrenman Serisi", color: "text-red-400" },
  { icon: Trophy, text: "Başarım Rozetleri", color: "text-yellow-400" },
  { icon: Calendar, text: "Aktivite Takvimi", color: "text-purple-400" },
];

export default function FeaturePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("gokalaf_feature_popup_seen");
    if (hasSeenPopup) return;

    const showTimer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem("gokalaf_feature_popup_seen", "true");
    }, 10000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const autoClose = setTimeout(() => {
      setIsOpen(false);
    }, 10000);

    return () => clearTimeout(autoClose);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-[#0A0A0A] border border-[#39ff14]/30 rounded-2xl shadow-2xl shadow-[#39ff14]/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#39ff14]/20">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-[#39ff14]"
              />
            </div>

            <div className="bg-gradient-to-r from-[#39ff14]/20 to-[#39ff14]/5 px-5 py-4 flex items-center justify-between">
              <h3 className="font-['Oswald'] font-bold text-white text-lg tracking-wide">
                BUNLARI BİLİYOR MUSUN?
              </h3>
              <button
                data-testid="button-close-feature-popup"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-gray-400 text-sm mb-4">
                Kayıt olarak bu özellikleri <span className="text-white font-medium">ücretsiz</span> kullanabilirsin:
              </p>
              <div className="space-y-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-sm text-gray-300">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
              <a
                href="/kayit"
                data-testid="link-register-from-popup"
                className="mt-5 block w-full py-3 bg-[#39ff14] text-black font-bold text-center rounded-xl hover:bg-[#39ff14]/90 transition-colors text-sm tracking-wide font-['Oswald']"
              >
                HEMEN KAYIT OL
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
