import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, RotateCcw, Dumbbell, Utensils, Heart, Zap, Scale, Target } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ from "@/components/CalculatorFAQ";

const vucutTipiFAQs = [
  {
    question: "Vücut tipi (somatotip) nedir?",
    answer: "Vücut tipi veya somatotip, 1940'larda psikolog William Sheldon tarafından geliştirilen bir sınıflandırma sistemidir. İnsanları üç temel vücut tipine ayırır: Ektomorf (ince yapılı), Mezomorf (atletik yapılı) ve Endomorf (geniş yapılı). Çoğu insan bu üç tipin bir kombinasyonudur."
  },
  {
    question: "Ektomorf vücut tipi özellikleri nelerdir?",
    answer: "Ektomorflar: İnce ve uzun yapılı, dar omuzlar, hızlı metabolizma, kilo almakta zorlanır, düşük yağ oranı, uzun kollar ve bacaklar. Antrenman önerisi: Ağırlık antrenmanı, bileşik hareketler, yüksek kalori alımı. Güç ve kas kütlesi kazanmak için düşük tekrarlı ağır çalışmalar idealdir."
  },
  {
    question: "Mezomorf vücut tipi özellikleri nelerdir?",
    answer: "Mezomorflar: Atletik ve kaslı yapı, geniş omuzlar dar bel, kolay kas yapabilme, orta metabolizma hızı, güçlü kemik yapısı. Antrenman önerisi: Dengeli antrenman programı, hem kuvvet hem kardiyo. Vücut kolayca şekil alır, çeşitli spor dallarında başarılı olabilirler."
  },
  {
    question: "Endomorf vücut tipi özellikleri nelerdir?",
    answer: "Endomorflar: Geniş ve yuvarlak yapı, yavaş metabolizma, kolay kilo alma, geniş kalça ve bel, güçlü bacak kasları. Antrenman önerisi: Düzenli kardiyo, direnç antrenmanı, kalori kontrolü. Kilo kontrolü için düzenli egzersiz ve beslenme takibi önemlidir."
  },
  {
    question: "Vücut tipimi değiştirebilir miyim?",
    answer: "Genetik yapınız değişmez ancak vücut kompozisyonunuzu (yağ/kas oranı) değiştirebilirsiniz. Doğru beslenme ve antrenman programıyla endomorflar yağ yakabilir, ektomorflar kas yapabilir. Önemli olan genetik yapınıza uygun strateji belirlemektir."
  },
  {
    question: "Karma vücut tipi ne demek?",
    answer: "Çoğu insan saf bir vücut tipine sahip değildir. Ektomezomorf (ince ama kaslı), Endomezomorf (kaslı ama yağlı), Ektoendomorf gibi karma tipler yaygındır. Hesaplayıcımız baskın tipinizi belirlerken karma yapınızı da gösterir."
  }
];

const vucutTipleri = {
  ektomorf: {
    name: "Ektomorf",
    emoji: "🏃",
    color: "from-sky-500 to-cyan-500",
    textColor: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    ozellikler: ["İnce ve uzun yapı", "Hızlı metabolizma", "Kilo almakta zorlanır", "Dar omuzlar"],
    antrenman: "Ağır bileşik hareketler, düşük tekrar, uzun dinlenme",
    beslenme: "Yüksek kalori, sık öğün, karbonhidrat ağırlıklı",
    icon: Zap
  },
  mezomorf: {
    name: "Mezomorf",
    emoji: "💪",
    color: "from-primary to-emerald-500",
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    ozellikler: ["Atletik yapı", "Geniş omuz, dar bel", "Kolay kas yapar", "Güçlü kemik yapısı"],
    antrenman: "Dengeli program, hem kuvvet hem kardiyo",
    beslenme: "Dengeli makrolar, protein ağırlıklı",
    icon: Dumbbell
  },
  endomorf: {
    name: "Endomorf",
    emoji: "🐻",
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    ozellikler: ["Geniş yapı", "Yavaş metabolizma", "Kolay kilo alır", "Güçlü bacaklar"],
    antrenman: "Düzenli kardiyo, yüksek yoğunluk, süperset",
    beslenme: "Düşük karbonhidrat, yüksek protein, kalori kontrolü",
    icon: Scale
  }
};

export default function BodyTypeCalculator() {
  const [cinsiyet, setCinsiyet] = useState("erkek");
  const [boy, setBoy] = useState(175);
  const [kilo, setKilo] = useState(75);
  const [bilek, setBilek] = useState(17);
  const [omuz, setOmuz] = useState(45);
  const [sonuc, setSonuc] = useState<{
    tip: keyof typeof vucutTipleri;
    skorlar: { ektomorf: number; mezomorf: number; endomorf: number };
  } | null>(null);
  const sonucRef = useRef<HTMLDivElement>(null);

  const hesapla = () => {
    const boyMetre = boy / 100;
    const bmi = kilo / (boyMetre * boyMetre);
    
    const bilekOrani = bilek / boy * 100;
    const omuzKiloOrani = omuz / Math.pow(kilo, 0.33);
    
    let ektomorfSkor = 0;
    let mezomorfSkor = 0;
    let endomorfSkor = 0;
    
    if (bmi < 20) ektomorfSkor += 3;
    else if (bmi < 23) ektomorfSkor += 2;
    else if (bmi < 25) mezomorfSkor += 2;
    else if (bmi < 28) { mezomorfSkor += 1; endomorfSkor += 1; }
    else if (bmi < 30) endomorfSkor += 2;
    else endomorfSkor += 3;
    
    if (bilekOrani < 9.5) ektomorfSkor += 3;
    else if (bilekOrani < 10.0) ektomorfSkor += 2;
    else if (bilekOrani < 10.5) mezomorfSkor += 2;
    else if (bilekOrani < 11.0) { mezomorfSkor += 1; endomorfSkor += 1; }
    else endomorfSkor += 2;
    
    if (omuzKiloOrani > 11) mezomorfSkor += 3;
    else if (omuzKiloOrani > 10) mezomorfSkor += 2;
    else if (omuzKiloOrani > 9) { mezomorfSkor += 1; ektomorfSkor += 1; }
    else if (omuzKiloOrani > 8) endomorfSkor += 1;
    else endomorfSkor += 2;
    
    if (cinsiyet === "kadin") {
      mezomorfSkor = mezomorfSkor * 0.9;
    }
    
    const toplam = ektomorfSkor + mezomorfSkor + endomorfSkor;
    const skorlar = {
      ektomorf: Math.round((ektomorfSkor / toplam) * 100),
      mezomorf: Math.round((mezomorfSkor / toplam) * 100),
      endomorf: Math.round((endomorfSkor / toplam) * 100),
    };
    
    let baskinTip: keyof typeof vucutTipleri = "mezomorf";
    if (skorlar.ektomorf > skorlar.mezomorf && skorlar.ektomorf > skorlar.endomorf) {
      baskinTip = "ektomorf";
    } else if (skorlar.endomorf > skorlar.mezomorf && skorlar.endomorf > skorlar.ektomorf) {
      baskinTip = "endomorf";
    }
    
    setSonuc({ tip: baskinTip, skorlar });
    
    setTimeout(() => {
      sonucRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const sifirla = () => {
    setBoy(175);
    setKilo(75);
    setBilek(17);
    setOmuz(45);
    setSonuc(null);
  };

  const tipBilgisi = sonuc ? vucutTipleri[sonuc.tip] : null;
  const TipIcon = tipBilgisi?.icon || User;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[#050505]">
      <SEO
        title="Vücut Tipi Belirleme | Ektomorf Mezomorf Endomorf Testi - Gokalaf"
        description="Vücut tipinizi öğrenin! Ektomorf, mezomorf veya endomorf olduğunuzu belirleyin. Ücretsiz somatotip testi ile genetik yapınıza uygun antrenman ve beslenme önerileri alın."
        keywords="vücut tipi, vücut tipi testi, ektomorf, mezomorf, endomorf, somatotip, genetik yapı, vücut tipi hesaplama, vücut tipi belirleme"
        canonical="/araclar/vucut-tipi"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Vücut Tipi Belirleme Aracı",
          "url": "https://gokalaf.com/araclar/vucut-tipi",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "description": "Vücut tipinizi belirleyin ve kişiselleştirilmiş antrenman önerileri alın.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
          }
        }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-4 py-1.5 text-xs font-semibold">
            Genetik Analiz
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase mb-4 text-white tracking-tight">
            Vücut Tipi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary">Belirleme</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Ektomorf, mezomorf veya endomorf olduğunuzu öğrenin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <User className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Ölçümleriniz</h2>
                <p className="text-xs text-gray-500">Vücut ölçülerinizi girin</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-gray-400 text-sm font-medium">Cinsiyet</Label>
                <Select value={cinsiyet} onValueChange={setCinsiyet}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-cinsiyet">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erkek">Erkek</SelectItem>
                    <SelectItem value="kadin">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-400 text-sm font-medium">Boy</Label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-primary" data-testid="text-boy-value">{boy}</span>
                      <span className="text-xs text-gray-500">cm</span>
                    </div>
                  </div>
                  <Slider value={[boy]} onValueChange={(val) => setBoy(val[0])} min={140} max={220} step={1} data-testid="slider-boy" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-400 text-sm font-medium">Kilo</Label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-primary" data-testid="text-kilo-value">{kilo}</span>
                      <span className="text-xs text-gray-500">kg</span>
                    </div>
                  </div>
                  <Slider value={[kilo]} onValueChange={(val) => setKilo(val[0])} min={40} max={150} step={1} data-testid="slider-kilo" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Bilek Çevresi</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-sky-400" data-testid="text-bilek-value">{bilek}</span>
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
                <Slider value={[bilek]} onValueChange={(val) => setBilek(val[0])} min={12} max={25} step={0.5} data-testid="slider-bilek" />
                <p className="text-xs text-gray-600">El bileğinin en ince yerinden ölçün</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Omuz Genişliği</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-400" data-testid="text-omuz-value">{omuz}</span>
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
                <Slider value={[omuz]} onValueChange={(val) => setOmuz(val[0])} min={30} max={65} step={1} data-testid="slider-omuz" />
                <p className="text-xs text-gray-600">Omuz kemiklerinin en dış noktaları arası</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={hesapla} className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold" data-testid="button-hesapla">
                  <Target className="w-4 h-4 mr-2" />
                  Analiz Et
                </Button>
                <Button onClick={sifirla} variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5" data-testid="button-sifirla">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div ref={sonucRef} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Sonuç</h2>
                <p className="text-xs text-gray-500">Genetik vücut tipiniz</p>
              </div>
            </div>

            {sonuc && tipBilgisi ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className={`text-center py-6 bg-gradient-to-br ${tipBilgisi.bgColor} rounded-xl border ${tipBilgisi.borderColor}`}>
                  <div className="text-5xl mb-2">{tipBilgisi.emoji}</div>
                  <div className={`text-2xl font-bold ${tipBilgisi.textColor}`}>{tipBilgisi.name}</div>
                  <div className="text-sm text-gray-400 mt-1">Baskın Vücut Tipiniz</div>
                </div>

                <div className="space-y-3">
                  {Object.entries(sonuc.skorlar).map(([tip, skor]) => (
                    <div key={tip} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{tip}</span>
                        <span className="text-white font-medium">%{skor}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skor}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full bg-gradient-to-r ${vucutTipleri[tip as keyof typeof vucutTipleri].color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TipIcon className={`w-4 h-4 ${tipBilgisi.textColor}`} />
                      <span className="font-semibold text-white text-sm">Özellikler</span>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {tipBilgisi.ozellikler.map((oz, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${tipBilgisi.textColor.replace('text-', 'bg-')}`} />
                          {oz}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-white text-sm">Antrenman</span>
                      </div>
                      <p className="text-sm text-gray-400">{tipBilgisi.antrenman}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-white text-sm">Beslenme</span>
                      </div>
                      <p className="text-sm text-gray-400">{tipBilgisi.beslenme}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">
                  Ölçümlerinizi girin,<br />vücut tipinizi öğrenin
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-6">Üç Temel Vücut Tipi</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(vucutTipleri).map(([key, tip]) => (
                <div key={key} className={`${tip.bgColor} rounded-xl p-5 border ${tip.borderColor}`}>
                  <div className="text-center mb-3">
                    <span className="text-3xl">{tip.emoji}</span>
                    <h3 className={`font-bold ${tip.textColor} mt-2`}>{tip.name}</h3>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    {tip.ozellikler.slice(0, 3).map((oz, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${tip.textColor.replace('text-', 'bg-')}`} />
                        {oz}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* İçerik Bölümü 1: Vücut Tipleri Nedir */}
          <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
            <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
              Vücut Tipleri <span className="text-primary">Nedir?</span> Nasıl Belirlenir?
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
              <p>
                Vücut tipleri (somatotipler), 1940'larda Amerikalı psikolog William Sheldon tarafından geliştirilen bir sınıflandırma sistemidir. Bu sisteme göre insan vücudu üç temel tipe ayrılır: <strong className="text-white">ektomorf</strong> (ince, uzun kemikli, az yağlı), <strong className="text-white">mezomorf</strong> (atletik, kas gelişimine yatkın) ve <strong className="text-white">endomorf</strong> (yuvarlak, yağ depolamaya eğilimli). Günümüzde bu sınıflandırma, beslenme ve antrenman planlamasında bireysel farklılıkları anlamak için bir çerçeve olarak kullanılmaktadır.
              </p>
              <p>
                Önemli bir nokta: çoğu insan saf bir somatotipe sahip değildir. Gerçekte büyük çoğunluk, iki ya da üç tipin karışımından oluşan bir spektrumda yer alır. "Ekto-mezomorf", "meso-endomorf" gibi melez tipler çok daha yaygındır ve bu hesap makinesi baskın tipi belirlemek için oran ve ölçüm değerlerini kullanır.
              </p>
              <p>
                Vücut tipini belirlemede kullanılan pratik yöntemler arasında bilek çevresi ve boy oranı, omuz-kalça oranı ve görsel değerlendirme yer alır. Bu hesap makinesi, bileğinizin çevresini referans alarak boy ile ağırlığınızı bu formüle dahil eder. Bilek çevresi, kemik yapısının (iskelet boyutunun) dolaylı bir göstergesi olduğundan doğal vücut tipini tahminlemede güvenilir bir ölçüttür.
              </p>
              <p>
                Sheldon'ın orijinal sistemi hem genetik hem de psikolojik özelliklerle ilişkilendirmeye çalışmıştı; ancak bu kısım bilimsel dayanaktan yoksun bulunarak büyük ölçüde terk edilmiştir. Modern spor biliminde somatotip kavramı, metabolik yanıt, kas gelişim potansiyeli ve yağ depolama eğilimi gibi fizyolojik farklılıkları anlamanın başlangıç noktası olarak değer taşımaktadır.
              </p>
              <p>
                Vücut tipinizi bilmek, antrenman ve beslenme stratejinizi kişiselleştirmenin ilk adımıdır. "Herkese uyan tek bir program" yoktur; ektomorfun yediği besin miktarını endomorfun tüketmesi veya aynı antrenman programını her iki tipin uygulaması, birbirine tamamen zıt sonuçlar doğurabilir.
              </p>
            </div>
          </div>

          {/* İçerik Bölümü 2: 3 Vücut Tipi ve Özellikleri */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
              3 Vücut Tipinin <span className="text-primary">Özellikleri ve Farkları</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Ektomorf</div>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">İnce kemik yapısı, hızlı metabolizma, düşük doğal kas kütlesi. Kilo almakta ve kas yapmakta güçlük çeker. Yüksek kalori ve karbonhidrat alımı kritiktir. Aşırı kardio kas gelişimini engeller.</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="text-primary font-heading font-bold uppercase text-xs tracking-wider mb-1">Mezomorf</div>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">Atletik yapı, orta-geniş kemik çerçevesi, hızlı kas yanıtı. Kas kazanımına ve yağ yakmaya en yatkın tip. Çoğu antrenman programı mezomorflar için tasarlanmış gibi görünür; ancak dikkat edilmezse yağ birikimi de hızlı olabilir.</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="text-orange-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Endomorf</div>
                  <p className="text-gray-500 text-xs leading-relaxed mt-1">Geniş kemik yapısı, yavaş metabolizma, yağ depolamaya yüksek eğilim. Kas kazanımı görece kolaydır; ancak yağ altında kalır. Kalori kontrolü ve kardiyovasküler aktivite önceliklidir.</p>
                </div>
              </div>
              <p>
                Bu üç tip arasındaki en kritik fark, <strong className="text-white">insülin duyarlılığı ve metabolik hızdır</strong>. Ektomorflar genellikle yüksek insülin duyarlılığına ve hızlı metabolizmaya sahiptir; bu yüzden yüksek karbonhidrat alımı onlar için daha az risk taşır. Endomorflar ise insülin direncine daha yatkın oldukları için karbonhidrat toleransları daha düşük olabilir ve besin seçimlerinde daha dikkatli olmak avantaj sağlar.
              </p>
            </div>
          </div>

          {/* İçerik Bölümü 3: Vücut Tipine Göre Strateji */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
              Vücut Tipine Göre <span className="text-primary">Antrenman ve Beslenme Stratejisi</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
              <p>
                <strong className="text-white">Ektomorflar için:</strong> Kalori fazlası ve yüksek karbonhidrat tüketimi önceliklidir. Haftada 3-4 gün yoğun direnç antrenmanı, minimum kardio. Kompound hareketler (squat, deadlift, bench press, row) kas büyümesini en hızlı tetikleyen egzersizlerdir. Protein alımı kilogram başına 2-2.5 gram olmalıdır. Uyku ve stres yönetimi, bu tip için özellikle kritiktir çünkü kortizol kas katabolizmasını hızlandırır.
              </p>
              <p>
                <strong className="text-white">Mezomorflar için:</strong> En fazla esnekliğe sahip olan bu tip, hem kas kazanımı hem de yağ kaybı için oldukça hızlı sonuç alabilir. Tehlike ise bu kolaylığa güvenerek beslenmeyi ihmal etmektir. Periyodik diyet dönemleri ve çeşitlendirilmiş antrenman programları mezomorfların uzun vadede en iyi formlarını korumalarını sağlar.
              </p>
              <p>
                <strong className="text-white">Endomorflar için:</strong> Kalori kontrolü ve kardiyovasküler antrenman öne çıkar. Düşük-orta karbonhidrat, yüksek protein ve sağlıklı yağ ağırlıklı beslenme tercih edilir. Yüksek hacimli direnç antrenmanı ile interval kardio kombinasyonu en etkili yaklaşımdır. Yavaş metabolizmayla mücadelede tutarlılık ve sabır, hızlı sonuç arayışından çok daha belirleyicidir.
              </p>
              <p>
                Son olarak şunu hatırlatmak gerekir: vücut tipi bir kader değildir. Epigenetik araştırmalar, genetik eğilimlerin yaşam tarzı seçimleriyle önemli ölçüde değiştirilebileceğini göstermektedir. Vücut tipinizi başlangıç noktanızı anlamak için kullanın; ama limitlerinizi çizmek için değil. Disiplinli bir beslenme ve antrenman programıyla her vücut tipi, dramatik fiziksel dönüşümler yaşayabilir.
              </p>
            </div>
          </div>

          <CalculatorFAQ faqs={vucutTipiFAQs} title="Vücut Tipi Sıkça Sorulan Sorular" />
          
          <RelatedCalculators currentSlug="vucut-tipi" />
        </div>
      </div>
    </div>
  );
}
