import { motion } from "framer-motion";
import { XCircle, MessageCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen pt-28 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center"
          >
            <XCircle className="w-14 h-14 text-red-500" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
            Ödeme <span className="text-red-500">Başarısız</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya bizimle iletişime geçin.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-heading font-bold text-white mb-4">
              Olası Sebepler
            </h2>
            <ul className="text-left text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Kart bilgileriniz yanlış girilmiş olabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Kartınızda yeterli bakiye olmayabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                Bankanız online alışverişe izin vermemiş olabilir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                İnternet bağlantısı sorunu yaşanmış olabilir
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/odeme">
              <Button
                className="bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase px-8 py-6 text-lg w-full sm:w-auto"
                data-testid="button-retry-payment"
              >
                <RefreshCw size={20} className="mr-2" />
                Tekrar Dene
              </Button>
            </Link>
            
            <Button
              onClick={() => window.open("https://wa.me/905312822402", "_blank")}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-heading font-bold uppercase px-8 py-6 text-lg w-full sm:w-auto"
              data-testid="button-whatsapp-failed"
            >
              <MessageCircle size={20} className="mr-2" />
              Yardım Al
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link href="/paketler" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Paketlere Dön
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
