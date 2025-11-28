import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-[150px] sm:text-[200px] font-heading font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl sm:text-8xl font-heading font-bold text-primary text-glow">
                404
              </span>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase text-white mb-4">
            Sayfa <span className="text-primary">Bulunamadı</span>
          </h2>
          
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Aradığın sayfa mevcut değil veya taşınmış olabilir. 
            Ana sayfaya dönerek devam edebilirsin.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-12 px-8 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all" data-testid="button-go-home">
                <Home className="w-5 h-5 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 hover:text-primary font-heading font-bold uppercase h-12 px-8"
              data-testid="button-go-back"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Geri Dön
            </Button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </div>
    </div>
  );
}
