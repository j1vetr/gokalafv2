import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import generatedVideo from '@assets/generated_videos/professional_gym_rack_with_dumbbells_close_up.mp4';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src={generatedVideo} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/50"></div>
      
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-yellow-400 to-primary animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="https://www.gokalaf.com/wp-content/uploads/2023/02/ALAFCOACHING-FINAL-8-scaled.png" 
              alt="Gokalaf Logo" 
              className="h-24 md:h-32 mx-auto object-contain"
            />
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
            className="text-xl text-gray-400 mb-12 leading-relaxed"
          >
            Sitemizi sizin için daha iyi hale getirmek için çalışıyoruz. 
            <br className="hidden md:block" />
            Kısa süre içinde geri döneceğiz!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <p className="text-gray-500 text-sm">
              Acil durumlar için WhatsApp üzerinden ulaşabilirsiniz
            </p>
            <Button
              onClick={() => window.open("https://wa.me/905312822402", "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-heading font-bold uppercase px-8 py-6 text-lg"
              data-testid="button-whatsapp-maintenance"
            >
              WhatsApp İletişim <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
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
