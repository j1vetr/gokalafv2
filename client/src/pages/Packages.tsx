import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Trophy, Zap, TrendingUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Packages() {
  const [selectedDuration, setSelectedDuration] = useState<number>(12); // Default 12 weeks

  const durations = [
    { weeks: 8, label: "8 Hafta" },
    { weeks: 12, label: "12 Hafta" },
    { weeks: 16, label: "16 Hafta" },
    { weeks: 24, label: "24 Hafta" }
  ];

  const prices: Record<number, number> = {
    8: 5950,
    12: 7280,
    16: 8660,
    24: 12000
  };

  const packageFeatures = [
    "Kişiye ve hedeflere özel antrenman programlaması",
    "Olduğu konum ve hedefe yönelik beslenme planlaması",
    "Haftalık olarak kişinin ilerleyişinin değerlendirilmesi ve gerekli revizelerin yapılması",
    "Whatsapp üstünden direkt olarak “Gokalaf” ile iletişim"
  ];

  const faqs = [
    {
      q: "Ödemeyi nasıl yapabilirim?",
      a: "Ödemeleri Havale/EFT veya Kredi Kartı (iyzico güvencesiyle) ile peşin veya taksitli olarak yapabilirsiniz."
    },
    {
      q: "Programlar nasıl teslim ediliyor?",
      a: "Kayıt sonrası size özel panelinize giriş bilgileriniz iletilir. Antrenman ve beslenme programlarınız bu panel üzerinden yönetilir. Mobil uyumludur."
    },
    {
      q: "Salona gitmek zorunda mıyım?",
      a: "Hayır. Evde veya parkta antrenman yapmak istiyorsanız, ekipman durumunuza göre program hazırlanır. Ancak en iyi sonuçlar için spor salonu üyeliği önerilir."
    },
    {
      q: "İptal ve iade hakkım var mı?",
      a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block mb-2"
           >
             <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
              Kendine Yatırım Yap
             </Badge>
           </motion.div>
           
           <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase mb-4 text-white">
             Senin Hedefin, <br/> <span className="text-primary text-glow">Senin Planın.</span>
           </h1>
           <p className="text-base text-gray-400 max-w-xl mx-auto">
             Süreyi seç ve değişime başla.
           </p>
        </div>

        {/* DURATION SELECTOR */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-1.5 flex flex-wrap md:flex-nowrap gap-1.5 border border-white/10">
            {durations.map((d) => (
              <button
                key={d.weeks}
                onClick={() => setSelectedDuration(d.weeks)}
                className={`flex-1 py-3 px-2 rounded-lg text-center transition-all duration-300 relative overflow-hidden group ${
                  selectedDuration === d.weeks 
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div className="font-heading font-bold text-lg md:text-xl uppercase relative z-10">{d.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SINGLE PACKAGE CARD */}
        <div className="max-w-xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDuration}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl p-1 bg-gradient-to-b from-primary via-primary/20 to-transparent shadow-[0_0_40px_rgba(204,255,0,0.1)] z-10"
            >
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 border-4 border-[#050505] z-20">
                  Normal Plan
                </div>
              
              <div className="bg-[#080808] rounded-[20px] h-full flex flex-col p-6 md:p-8 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="text-center mb-6 relative z-10 border-b border-white/5 pb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Trophy size={32} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-1">Normal Plan</h3>
                  <p className="text-sm text-gray-400">Kapsamlı Koçluk Paketi</p>
                </div>

                <div className="text-center mb-6 relative z-10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                      ₺{prices[selectedDuration].toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="text-primary text-base mt-1 font-bold flex items-center justify-center gap-1.5">
                    <TrendingUp size={16} />
                    {selectedDuration} Haftalık Plan
                  </div>
                </div>

                <div className="space-y-3 flex-grow mb-8 relative z-10 bg-white/5 p-4 rounded-xl border border-white/5">
                  {packageFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-200">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact">
                  <Button className="w-full h-12 text-lg font-bold uppercase tracking-wide relative z-10 bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all transform hover:-translate-y-1">
                    Hemen Başla
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto" id="faq">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold uppercase mb-4 flex items-center justify-center gap-3 text-white">
              <HelpCircle className="text-primary" /> Sıkça Sorulan Sorular
            </h2>
            <p className="text-gray-400">Aklına takılan diğer sorular için WhatsApp hattımdan yazabilirsin.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-xl bg-white/5 px-6 overflow-hidden">
                <AccordionTrigger className="text-lg font-medium text-white hover:text-primary hover:no-underline py-6">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
