import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Trophy, TrendingUp, Loader2, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";

interface Package {
  id: string;
  name: string;
  weeks: number;
  price: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
}

export default function Packages() {
  const [selectedDuration, setSelectedDuration] = useState<number>(12);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Paketler yüklenemedi");
      const data = await res.json();
      return data.packages || [];
    },
  });

  const activePackages = Array.isArray(packages) ? packages.filter(p => p.isActive) : [];
  
  const defaultDurations = [
    { weeks: 8, label: "8 Hafta" },
    { weeks: 12, label: "12 Hafta" },
    { weeks: 16, label: "16 Hafta" },
    { weeks: 24, label: "24 Hafta" }
  ];

  const durations = activePackages.length > 0
    ? activePackages
        .map(p => ({ weeks: p.weeks, label: `${p.weeks} Hafta`, isPopular: p.isPopular || false }))
        .sort((a, b) => a.weeks - b.weeks)
    : defaultDurations.map(d => ({ ...d, isPopular: false }));

  useEffect(() => {
    if (durations.length > 0 && !durations.find(d => d.weeks === selectedDuration)) {
      setSelectedDuration(durations[0]?.weeks || 12);
    }
  }, [durations, selectedDuration]);

  const selectedPackage = activePackages.find(p => p.weeks === selectedDuration);
  const price = selectedPackage ? parseFloat(selectedPackage.price) : 0;
  const features = selectedPackage?.features || [
    "Kişisel Antrenman Programı",
    "Beslenme Planlaması",
    "Kardiyo Planlaması",
    "Vitamin & Supplement Önerisi",
    "Form Analizi (Foto/Video)",
    "Teknik Düzeltme Geri Bildirimleri",
    "Haftalık Kontrol",
    "Geri Dönüşe Göre Plan Güncelleme",
    "Haftalık Teknik Video Analizi",
    "Makro Güncellemesi (Gelişime Göre)",
    "Yaşam Tarzına Uygun Planlama",
    "Haftalık Q&A Destek",
    "7/24 Whatsapp İletişim"
  ];

  const faqs = [
    {
      q: "Ödemeyi nasıl yapabilirim?",
      a: "Ödemeleri Kredi Kartı ile (Shopier güvencesiyle) güvenle yapabilirsiniz."
    },
    {
      q: "Programlar nasıl teslim ediliyor?",
      a: "Satın alım sonrası WhatsApp üzerinden iletişime geçiyorum. Antrenman ve beslenme programlarınız size özel Google Sheets dosyası üzerinden eş zamanlı olarak paylaşılır. Tüm güncellemeler anında senkronize edilir ve her yerden erişebilirsiniz."
    },
    {
      q: "Salona gitmek zorunda mıyım?",
      a: "Evet. Programlar spor salonu ekipmanlarına göre hazırlanmaktadır. Etkili sonuçlar için spor salonu üyeliği gerekmektedir."
    },
    {
      q: "İptal ve iade hakkım var mı?",
      a: "Dijital içerik ve kişiye özel hizmet olduğu için program hazırlandıktan sonra iade yapılmamaktadır. Ancak sağlık sorunu gibi durumlarda üyelik dondurma hakkınız saklıdır."
    }
  ];

  const packagesSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Online Fitness Koçluk Paketleri",
    "description": "8, 12, 16 ve 24 haftalık kişiye özel online fitness koçluk paketleri. Antrenman programı, beslenme planı ve birebir WhatsApp iletişimi dahil.",
    "brand": {
      "@type": "Brand",
      "name": "Gokalaf"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "TRY",
      "availability": "https://schema.org/InStock",
      "offerCount": 4
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-12 bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Online Fitness Koçluk Paketleri | 8-12-16-24 Haftalık Programlar | Gokalaf"
        description="Gokalaf online fitness koçluk paketleri: 8, 12, 16 ve 24 haftalık seçenekler. Kişiye özel antrenman programı, beslenme planı, haftalık takip ve WhatsApp üzerinden birebir iletişim. Shopier güvencesiyle güvenli ödeme."
        keywords="online fitness paketi, koçluk paketi, antrenman programı, beslenme programı, kişisel antrenör paketi, online PT fiyatları, fitness koçluk ücreti, vücut geliştirme programı, online spor koçluğu"
        canonical="https://gokalaf.com/paketler"
        schema={packagesSchema}
      />
      <div className="min-h-screen pt-28 pb-12 bg-[#050505]">
        <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-5">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block mb-2"
           >
             <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-2.5 py-0.5 text-[9px]">
              Kendine Yatırım Yap
             </Badge>
           </motion.div>
           
           <h1 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-2 text-white">
             Senin Hedefin, <span className="text-primary text-glow">Senin Planın.</span>
           </h1>
           <p className="text-xs text-gray-400 max-w-md mx-auto">
             Süreyi seç ve değişime başla.
           </p>
        </div>

        {/* DURATION SELECTOR */}
        <div className="max-w-md mx-auto mb-5">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-0.5 flex flex-wrap md:flex-nowrap gap-0.5 border border-white/10">
            {durations.map((d) => (
              <button
                key={d.weeks}
                onClick={() => {
                  setSelectedDuration(d.weeks);
                  setShowAllFeatures(false);
                }}
                data-testid={`button-duration-${d.weeks}`}
                className={`flex-1 py-2 px-2 rounded-md text-center transition-all duration-300 relative overflow-hidden group ${
                  selectedDuration === d.weeks 
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.25)]" 
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {d.isPopular && (
                  <div className="absolute -top-0.5 -right-0.5 z-20">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  </div>
                )}
                <div className="font-heading font-bold text-sm uppercase relative z-10">{d.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SINGLE PACKAGE CARD */}
        <div className="max-w-sm mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDuration}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl p-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent shadow-[0_0_20px_rgba(204,255,0,0.08)] z-10"
            >
               {selectedPackage?.isPopular ? (
                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/30 border-2 border-[#050505] z-20 flex items-center gap-1.5">
                    <Star size={12} className="fill-black" />
                    En Popüler
                  </div>
                ) : (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-md shadow-primary/15 border-2 border-[#050505] z-20">
                    Normal Plan
                  </div>
                )}
              
              <div className="bg-[#080808] rounded-[14px] h-full flex flex-col p-4 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="text-center mb-3 relative z-10 border-b border-white/5 pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Trophy size={18} />
                  </div>
                  <h3 className="text-lg font-heading font-bold uppercase text-white mb-0.5">Normal Plan</h3>
                  <p className="text-[10px] text-gray-400">Kapsamlı Koçluk Paketi</p>
                </div>

                <div className="text-center mb-3 relative z-10">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold tracking-tight text-white" data-testid="text-package-price">
                      ₺{price.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="text-primary text-xs mt-0.5 font-bold flex items-center justify-center gap-1">
                    <TrendingUp size={12} />
                    {selectedDuration} Haftalık Plan
                  </div>
                </div>

                <div className="space-y-1.5 flex-grow mb-4 relative z-10 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={8} />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/odeme?weeks=${selectedDuration}`}>
                  <Button className="w-full h-9 text-sm font-bold uppercase tracking-wide relative z-10 bg-primary text-black hover:bg-primary/90 shadow-[0_0_12px_rgba(204,255,0,0.15)] hover:shadow-[0_0_18px_rgba(204,255,0,0.25)] transition-all transform hover:-translate-y-0.5" data-testid="button-buy">
                    Satın Al
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto" id="faq">
          <div className="text-center mb-8">
            <h2 className="text-xl font-heading font-bold uppercase mb-2 flex items-center justify-center gap-2 text-white">
              <HelpCircle className="text-primary w-5 h-5" /> Sıkça Sorulan Sorular
            </h2>
            <p className="text-gray-400 text-sm">Aklına takılan diğer sorular için WhatsApp hattımdan yazabilirsin.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg bg-white/5 px-4 overflow-hidden">
                <AccordionTrigger className="text-sm font-medium text-white hover:text-primary hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-sm pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        </div>
      </div>
    </>
  );
}
