import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, RotateCcw, Weight, ArrowUp, ArrowDown, Equal, Heart, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ from "@/components/CalculatorFAQ";

const bkeKategorileri = [
  { min: 0, max: 18.5, label: "Düşük", color: "bg-sky-500", textColor: "text-sky-400", risk: "Yetersiz beslenme riski" },
  { min: 18.5, max: 25, label: "Sağlıklı", color: "bg-emerald-500", textColor: "text-emerald-400", risk: "Optimal aralık" },
  { min: 25, max: 30, label: "Yüksek", color: "bg-amber-500", textColor: "text-amber-400", risk: "Sağlık riski artar" },
  { min: 30, max: 50, label: "Riskli", color: "bg-rose-500", textColor: "text-rose-400", risk: "Ciddi sağlık riski" },
];

const boyKiloEndeksiFAQs = [
  {
    question: "Boy kilo endeksi nedir?",
    answer: "Boy kilo endeksi, vücut ağırlığınızın boyunuzla olan ilişkisini gösteren bir sağlık göstergesidir. Kilonuzun (kg) boyunuzun metre cinsinden karesine bölünmesiyle hesaplanır. Bu değer, vücudunuzun sağlıklı bir kilo aralığında olup olmadığını anlamanıza yardımcı olur. Dünya Sağlık Örgütü tarafından kabul görmüş evrensel bir ölçüttür."
  },
  {
    question: "Boy kilo endeksi nasıl yorumlanır?",
    answer: "Boy kilo endeksi değerleriniz şu şekilde yorumlanır: 18.5 altı düşük kilolu (zayıf), 18.5-24.9 arası sağlıklı (normal), 25-29.9 arası kilolu, 30 ve üzeri ise obez kategorisindedir. Sağlıklı yaşam için 18.5-24.9 aralığında kalmak önerilir. Ancak bu değerler genel bir rehberdir; bireysel faktörler de göz önünde bulundurulmalıdır."
  },
  {
    question: "Boy kilo endeksim düşük çıktı, bu ne anlama gelir?",
    answer: "18.5'in altındaki boy kilo endeksi, yetersiz beslenme veya düşük vücut kütlesi anlamına gelebilir. Bu durum bağışıklık sisteminin zayıflaması, kemik erimesi riski, yorgunluk ve enerji eksikliği gibi sorunlara yol açabilir. Dengeli beslenme programı, kalori alımını artırma ve gerekirse bir diyetisyene danışmanız önerilir."
  },
  {
    question: "Boy kilo endeksi yüksek olanlar ne yapmalı?",
    answer: "Yüksek boy kilo endeksi, kalp-damar hastalıkları, diyabet ve eklem problemleri riskini artırabilir. Sağlıklı bir şekilde kilo vermek için günlük 300-500 kalori açığı oluşturun, haftada en az 150 dakika orta yoğunlukta egzersiz yapın, işlenmiş gıdalardan kaçının ve bol su için. Kademeli kilo kaybı (haftada 0.5-1 kg) en sürdürülebilir yöntemdir."
  },
  {
    question: "Kaslı bireyler için boy kilo endeksi doğru mu?",
    answer: "Boy kilo endeksi, kas kütlesi ile yağ kütlesini ayırt edemez. Bu nedenle sporcular, vücut geliştirmeciler veya yoğun fiziksel aktivite yapan kişilerde yanıltıcı sonuçlar verebilir. Bu kişiler için vücut yağ oranı ölçümü, bel çevresi ölçümü veya biyoelektrik impedans analizi gibi alternatif yöntemler daha doğru sonuç verir."
  },
  {
    question: "Boy kilo endeksi ile ideal kilo arasındaki fark nedir?",
    answer: "Boy kilo endeksi, mevcut durumunuzu değerlendiren bir gösterge iken, ideal kilo boyunuza göre olmanız gereken kilo aralığını ifade eder. Boy kilo endeksi 18.5-24.9 aralığında olduğunda, kilonuz ideal aralıkta kabul edilir. Örneğin 1.75 m boyundaki biri için ideal kilo yaklaşık 56.5 - 76 kg arasındadır."
  }
];

export default function BoyKiloEndeksiCalculator() {
  const [boy, setBoy] = useState(170);
  const [kilo, setKilo] = useState(70);
  const [cinsiyet, setCinsiyet] = useState("erkek");
  const [sonuc, setSonuc] = useState<number | null>(null);
  const sonucRef = useRef<HTMLDivElement>(null);

  const hesapla = () => {
    const boyMetre = boy / 100;
    const bke = kilo / (boyMetre * boyMetre);
    setSonuc(parseFloat(bke.toFixed(1)));
    
    setTimeout(() => {
      sonucRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getDurum = (deger: number) => {
    if (deger < 18.5) return { 
      label: "Düşük Kilo", 
      color: "text-sky-400", 
      bg: "bg-sky-500", 
      aciklama: "Kilo almanız önerilir.",
      icon: ArrowUp,
      detay: "Vücut kütleniz boyunuza göre düşük. Dengeli beslenme ile sağlıklı kilo alımı hedeflenebilir."
    };
    if (deger < 25) return { 
      label: "Sağlıklı", 
      color: "text-emerald-400", 
      bg: "bg-emerald-500", 
      aciklama: "Harika! Formunu koru.",
      icon: CheckCircle,
      detay: "Boy ve kilonuz dengeli. Bu sağlıklı aralığı korumaya devam edin."
    };
    if (deger < 30) return { 
      label: "Kilolu", 
      color: "text-amber-400", 
      bg: "bg-amber-500", 
      aciklama: "Kalori açığı oluşturmalısın.",
      icon: ArrowDown,
      detay: "Boyunuza göre biraz fazla kilonuz var. Beslenme düzeni ve egzersiz ile iyileştirilebilir."
    };
    return { 
      label: "Obez", 
      color: "text-rose-400", 
      bg: "bg-rose-500", 
      aciklama: "Profesyonel destek al.",
      icon: AlertTriangle,
      detay: "Sağlık riskleri açısından bir uzmana danışmanız önerilir."
    };
  };

  const getIdealKilo = () => {
    const boyMetre = boy / 100;
    const minKilo = 18.5 * boyMetre * boyMetre;
    const maxKilo = 24.9 * boyMetre * boyMetre;
    return { min: minKilo.toFixed(1), max: maxKilo.toFixed(1) };
  };

  const getGostergePozisyon = (deger: number) => {
    const minBke = 14;
    const maxBke = 42;
    const sinirliDeger = Math.max(minBke, Math.min(maxBke, deger));
    return ((sinirliDeger - minBke) / (maxBke - minBke)) * 100;
  };

  const durum = sonuc ? getDurum(sonuc) : null;
  const idealKilo = getIdealKilo();
  const StatusIcon = durum?.icon || Equal;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[#050505]">
      <SEO
        title="Boy Kilo Endeksi Hesaplama | Ücretsiz BKE Hesaplayıcı - Gokalaf"
        description="Boy kilo endeksi hesaplama aracı ile boyunuza göre ideal kilonuzu öğrenin. Ücretsiz online boy kilo endeksi hesaplayıcı ile sağlık durumunuzu değerlendirin."
        keywords="boy kilo endeksi, boy kilo endeksi hesaplama, bke hesaplama, boy kilo oranı, boyuma göre kilom, ideal kilo hesaplama, sağlıklı kilo"
        canonical="/araclar/boy-kilo-endeksi"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Boy Kilo Endeksi Hesaplayıcı",
              "url": "https://gokalaf.com/araclar/boy-kilo-endeksi",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "description": "Boyunuza göre ideal kilonuzu hesaplayın ve sağlık durumunuzu değerlendirin.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY"
              },
              "author": {
                "@type": "Organization",
                "name": "Gokalaf",
                "url": "https://gokalaf.com"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": boyKiloEndeksiFAQs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            }
          ]
        }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-4 py-1.5 text-xs font-semibold">
            Sağlık Hesaplayıcı
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase mb-4 text-white tracking-tight">
            Boy Kilo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary">Endeksi</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Boyunuza göre ideal kilonuzda olup olmadığınızı öğrenin ve sağlığınızı değerlendirin
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Ölçümleriniz</h2>
                <p className="text-xs text-gray-500">Boy ve kilo bilgilerinizi girin</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Boy */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Boyunuz</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary" data-testid="text-boy-value">{boy}</span>
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
                <Slider 
                  value={[boy]} 
                  onValueChange={(val) => setBoy(val[0])} 
                  min={140} 
                  max={220} 
                  step={1} 
                  className="py-2"
                  data-testid="slider-boy"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>140 cm</span>
                  <span>220 cm</span>
                </div>
              </div>

              {/* Kilo */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Kilonuz</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary" data-testid="text-kilo-value">{kilo}</span>
                    <span className="text-sm text-gray-500">kg</span>
                  </div>
                </div>
                <Slider 
                  value={[kilo]} 
                  onValueChange={(val) => setKilo(val[0])} 
                  min={35} 
                  max={160} 
                  step={0.5} 
                  className="py-2"
                  data-testid="slider-kilo"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>35 kg</span>
                  <span>160 kg</span>
                </div>
              </div>

              {/* Cinsiyet */}
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm font-medium">Cinsiyetiniz</Label>
                <Select value={cinsiyet} onValueChange={setCinsiyet}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-cinsiyet">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erkek">Erkek</SelectItem>
                    <SelectItem value="kadin">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={hesapla} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-12 text-sm tracking-wider"
                data-testid="button-hesapla"
              >
                <Weight className="w-4 h-4 mr-2" />
                Hesapla
              </Button>
            </div>
          </div>

          {/* Result Section */}
          <div ref={sonucRef} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-6 flex flex-col justify-center min-h-[400px]">
            {sonuc ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Main Result */}
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Boy Kilo Endeksiniz</div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-6xl font-bold font-heading text-white" data-testid="text-bke-sonuc">{sonuc}</span>
                    <div className="text-left">
                      <span className="text-sm text-gray-500">kg/m²</span>
                      <Badge className={`${durum?.bg} text-black border-none font-bold uppercase text-xs px-3 py-1 block mt-1`} data-testid="badge-durum">
                        {durum?.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`flex items-start gap-3 p-4 rounded-xl ${durum?.bg}/10 border border-white/5`}>
                  <StatusIcon className={`w-5 h-5 ${durum?.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-medium ${durum?.color}`}>{durum?.aciklama}</p>
                    <p className="text-sm text-gray-400 mt-1">{durum?.detay}</p>
                  </div>
                </div>

                {/* Gauge */}
                <div className="space-y-2">
                  <div className="h-4 rounded-full overflow-hidden flex">
                    {bkeKategorileri.map((kat, i) => (
                      <div 
                        key={i} 
                        className={`${kat.color} h-full`}
                        style={{ width: `${((kat.max - kat.min) / 35) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative h-3">
                    <motion.div 
                      className="absolute top-0 w-1 h-3 bg-white rounded-full shadow-lg shadow-white/30"
                      initial={{ left: "0%" }}
                      animate={{ left: `${getGostergePozisyon(sonuc)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>14</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>42</span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-gray-500 uppercase tracking-wider">İdeal Kilo Aralığı</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {idealKilo.min} - {idealKilo.max}
                      <span className="text-xs text-gray-400 ml-1">kg</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="w-4 h-4 text-primary" />
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Kilo Farkı</span>
                    </div>
                    <div className={`text-xl font-bold ${durum?.color}`}>
                      {kilo < parseFloat(idealKilo.min) && `+${(parseFloat(idealKilo.min) - kilo).toFixed(1)} kg al`}
                      {kilo > parseFloat(idealKilo.max) && `-${(kilo - parseFloat(idealKilo.max)).toFixed(1)} kg ver`}
                      {kilo >= parseFloat(idealKilo.min) && kilo <= parseFloat(idealKilo.max) && "Dengeli"}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSonuc(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full mt-2"
                  data-testid="button-yeniden"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">Sonuç Bekleniyor</h3>
                <p className="text-sm text-gray-500 max-w-[250px] mx-auto">
                  Boy ve kilo bilgilerinizi girerek boy kilo endeksinizi hesaplayın
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Category Legend */}
        <div className="mt-8 p-6 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/5">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Boy Kilo Endeksi Kategorileri
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bkeKategorileri.map((kat, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className={`w-3 h-3 rounded-full ${kat.color}`} />
                <div>
                  <div className="text-sm font-medium text-white">{kat.label}</div>
                  <div className="text-xs text-gray-500">{kat.min} - {kat.max}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Calculators */}
        <RelatedCalculators currentSlug="boy-kilo-endeksi" />
        
        {/* FAQ */}
        <CalculatorFAQ 
          title="Boy Kilo Endeksi Hesaplama" 
          faqs={boyKiloEndeksiFAQs} 
          schemaUrl="https://gokalaf.com/araclar/boy-kilo-endeksi" 
        />
      </div>
    </div>
  );
}
