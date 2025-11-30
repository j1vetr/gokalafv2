import { motion } from "framer-motion";
import { Wrench, Clock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-yellow-400 to-primary animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center shadow-2xl shadow-primary/30"
          >
            <Wrench className="w-16 h-16 text-black" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-heading font-bold uppercase text-white mb-6"
          >
            Bakım <span className="text-primary">Modundayız</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-400 mb-8 leading-relaxed"
          >
            Sitemizi sizin için daha iyi hale getirmek için çalışıyoruz. 
            <br className="hidden md:block" />
            Kısa süre içinde geri döneceğiz!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <Clock className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Tahmini Süre</p>
                <p className="text-white font-bold">Çok Kısa</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <Mail className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider">İletişim</p>
                <p className="text-white font-bold">info@gokalaf.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-gray-500 text-sm">
              Acil durumlar için WhatsApp üzerinden ulaşabilirsiniz
            </p>
            <Button
              onClick={() => window.open("https://wa.me/905551234567", "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-heading font-bold uppercase px-8 py-6 text-lg"
              data-testid="button-whatsapp-maintenance"
            >
              WhatsApp İletişim <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <p className="text-gray-600 text-sm mt-4 uppercase tracking-widest">
              Çalışmalar devam ediyor...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
