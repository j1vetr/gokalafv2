import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, HelpCircle, Trophy, Crown, Star, Zap, TrendingUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Packages() {
  const [selectedDuration, setSelectedDuration] = useState<number>(12); // Default 12 weeks

  const durations = [
    { weeks: 4, label: "4 Hafta", discount: 0 },
    { weeks: 8, label: "8 Hafta", discount: 0.05 },
    { weeks: 12, label: "12 Hafta", discount: 0.10 }, // 10% discount
    { weeks: 24, label: "24 Hafta", discount: 0.15 }  // 15% discount
  ];

  // Base prices for 4 weeks
  const basePrices = {
    starter: 3500,
    pro: 4500, // Slightly higher base for dynamic calc
    vip: 8000
  };

  const calculatePrice = (base: number, weeks: number) => {
    const durationObj = durations.find(d => d.weeks === weeks);
    const discount = durationObj ? durationObj.discount : 0;
    const total = base * (weeks / 4) * (1 - discount);
    return Math.floor(total / 100) * 100; // Round to nearest 100
  };

  const packages = [
    { 
      id: "starter",
      name: "Başlangıç", 
      icon: <Zap className="w-6 h-6" />,
      desc: "Fitness dünyasına sağlam bir giriş.",
      basePrice: basePrices.starter,
      features: [
        "Kişiye Özel Antrenman Programı", 
        "Beslenme & Makro Rehberliği", 
        "Haftalık Check-in (E-mail)", 
        "Temel Video Form Analizi",
        "WhatsApp Desteği (Mesai Saatleri)"
      ],
      color: "blue"
    },
    { 
      id: "pro",
      name: "Değişim", 
      icon: <Trophy className="w-6 h-6" />,
      desc: "Ciddi sonuçlar isteyenler için ideal.",
      isPopular: true,
      basePrice: basePrices.pro,
      features: [
        "Her Şey Dahil Kişiye Özel Program", 
        "Detaylı Beslenme & Tarifler", 
        "Haftalık Detaylı Video Analiz", 
        "7/24 WhatsApp Desteği",
        "Form Düzeltme & Teknik Analiz",
        "Kardiyo & Supplement Planlaması",
        "Öncelikli Soru Cevap"
      ],
      color: "primary"
    },
    { 
      id: "vip",
      name: "VIP Elite", 
      icon: <Crown className="w-6 h-6" />,
      desc: "Profesyonel sporcu disiplini.",
      basePrice: basePrices.vip,
      features: [
        "Haftalık 30dk Görüntülü Görüşme", 
        "Tamamen Dinamik Program (Anlık Revize)", 
        "Yarışma/Fotoğraf Çekimi Hazırlığı", 
        "7/24 Öncelikli VIP Destek",
        "Tüm E-Kitaplara Erişim",
        "Kan Tahlili Yorumlama",
        "Postür Analizi"
      ],
      color: "gold"
    }
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
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block mb-4"
           >
             <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-4 py-1">
              Kendine Yatırım Yap
             </Badge>
           </motion.div>
           
           <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase mb-6 text-white">
             Senin Hedefin, <br/> <span className="text-primary text-glow">Senin Planın.</span>
           </h1>
           <p className="text-lg text-gray-400 max-w-2xl mx-auto">
             Sadece bir program değil, hayatını değiştirecek bir sistem satın alıyorsun. 
             Süreyi seç, tasarruf et ve değişime başla.
           </p>
        </div>

        {/* DURATION SELECTOR */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 flex flex-wrap md:flex-nowrap gap-2 border border-white/10">
            {durations.map((d) => (
              <button
                key={d.weeks}
                onClick={() => setSelectedDuration(d.weeks)}
                className={`flex-1 py-4 px-2 rounded-xl text-center transition-all duration-300 relative overflow-hidden group ${
                  selectedDuration === d.weeks 
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]" 
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div className="font-heading font-bold text-xl md:text-2xl uppercase relative z-10">{d.label}</div>
                {d.discount > 0 && (
                  <div className={`text-xs font-bold uppercase tracking-wide relative z-10 ${selectedDuration === d.weeks ? "text-black/70" : "text-green-400"}`}>
                    %{d.discount * 100} İndirim
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
          <AnimatePresence mode="wait">
            {packages.map((pkg) => {
              const price = calculatePrice(pkg.basePrice, selectedDuration);
              const isVip = pkg.id === 'vip';
              const isPro = pkg.id === 'pro';
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-3xl p-1 ${
                    pkg.isPopular 
                      ? "bg-gradient-to-b from-primary via-primary/20 to-transparent shadow-[0_0_40px_rgba(204,255,0,0.15)] z-10 md:-translate-y-4" 
                      : isVip 
                        ? "bg-gradient-to-b from-yellow-500/50 via-yellow-900/10 to-transparent" 
                        : "bg-gradient-to-b from-white/10 to-transparent"
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                      En Çok Tercih Edilen
                    </div>
                  )}
                  
                  <div className="bg-[#080808] rounded-[22px] h-full flex flex-col p-6 md:p-8 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-${pkg.color === 'gold' ? 'yellow-500' : pkg.color === 'primary' ? 'primary' : 'blue-500'}/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>

                    <div className="mb-8 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        pkg.isPopular ? "bg-primary text-black" : isVip ? "bg-yellow-500 text-black" : "bg-blue-500/20 text-blue-500"
                      }`}>
                        {pkg.icon}
                      </div>
                      <h3 className="text-2xl font-heading font-bold uppercase text-white">{pkg.name}</h3>
                      <p className="text-sm text-gray-400 mt-2 min-h-[40px]">{pkg.desc}</p>
                    </div>

                    <div className="mb-8 relative z-10">
                      <div className="flex items-end gap-2">
                        <span className={`text-4xl md:text-5xl font-bold tracking-tight ${pkg.isPopular ? "text-primary" : isVip ? "text-yellow-400" : "text-white"}`}>
                          ₺{price.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-gray-500 font-medium mb-2">/ {selectedDuration} hafta</span>
                      </div>
                      {selectedDuration > 4 && (
                         <div className="text-green-400 text-sm mt-2 font-bold flex items-center gap-1">
                           <TrendingUp size={14} />
                           Aylık sadece ₺{Math.round(price / (selectedDuration / 4)).toLocaleString('tr-TR')}
                         </div>
                      )}
                    </div>

                    <div className="space-y-4 flex-grow mb-8 relative z-10">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            pkg.isPopular ? "bg-primary/20 text-primary" : isVip ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                          }`}>
                            <Check size={12} />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/contact">
                      <Button className={`w-full h-14 text-lg font-bold uppercase tracking-wide relative z-10 ${
                        pkg.isPopular 
                          ? "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                          : isVip
                            ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                            : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/10"
                      }`}>
                        {isVip ? "Başvuru Yap" : "Planı Seç"}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
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
