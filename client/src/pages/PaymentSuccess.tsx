import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, ArrowRight, Calendar, Package } from "lucide-react";
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

export default function PaymentSuccess() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order");
      
      if (orderId) {
        try {
          const res = await fetch(`/api/orders/${orderId}/public`);
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
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-14 h-14 text-green-500" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
            Ödemeniz <span className="text-primary">Başarılı!</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Satın alımınız başarıyla tamamlandı. Koçluk yolculuğunuz başlıyor!
          </p>

          {orderInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left"
            >
              <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Package className="text-primary" size={20} />
                Sipariş Detayları
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Paket</span>
                  <span className="text-white font-medium">{orderInfo.packageName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Süre</span>
                  <span className="text-white font-medium">{orderInfo.weeks} Hafta</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Tutar</span>
                  <span className="text-primary font-bold">₺{parseFloat(orderInfo.totalPrice).toLocaleString("tr-TR")}</span>
                </div>
                {orderInfo.startDate && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar size={16} /> Program Tarihleri
                    </span>
                    <span className="text-white font-medium">
                      {formatDate(orderInfo.startDate)} - {formatDate(orderInfo.endDate)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <MessageCircle className="w-8 h-8 text-green-500 shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-lg font-heading font-bold text-white mb-2">
                  WhatsApp Üzerinden İletişim
                </h3>
                <p className="text-gray-400">
                  En kısa sürede sizinle WhatsApp üzerinden iletişime geçeceğiz. 
                  Antrenman ve beslenme programınızı hazırlayıp sizinle paylaşacağız!
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => window.open("https://wa.me/905312822402", "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-heading font-bold uppercase px-8 py-6 text-lg w-full sm:w-auto"
              data-testid="button-whatsapp-success"
            >
              <MessageCircle size={20} className="mr-2" />
              WhatsApp ile Ulaş
            </Button>
            
            <Link href="/panel">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-black font-heading font-bold uppercase px-8 py-6 text-lg w-full sm:w-auto"
                data-testid="button-go-panel"
              >
                Panele Git <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
