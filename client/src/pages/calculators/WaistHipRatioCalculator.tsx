import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler, RotateCcw, Heart, AlertTriangle, CheckCircle, TrendingDown, Activity, Target } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ from "@/components/CalculatorFAQ";

const belKalcaFAQs = [
  {
    question: "Bel kalça oranı nedir?",
    answer: "Bel kalça oranı (BKO), bel çevrenizin kalça çevrenize bölünmesiyle hesaplanan bir sağlık göstergesidir. Vücuttaki yağ dağılımını ve karın bölgesindeki yağlanmayı ölçer. Bu oran, kalp hastalıkları, diyabet ve metabolik sendrom riskini değerlendirmede BMI'dan daha güvenilir kabul edilir."
  },
  {
    question: "Bel kalça oranı nasıl ölçülür?",
    answer: "Bel çevresi: Karın boşken, göbek hizasından (en dar nokta) ölçülür. Kalça çevresi: Kalçaların en geniş noktasından ölçülür. Her iki ölçüm de ayakta, rahat nefes alırken, mezura ile yapılmalıdır. Ölçüm sabah, aç karnına yapılırsa daha doğru sonuç verir."
  },
  {
    question: "İdeal bel kalça oranı kaç olmalı?",
    answer: "Dünya Sağlık Örgütü'ne göre sağlıklı bel kalça oranı erkeklerde 0.90'ın altında, kadınlarda 0.85'in altında olmalıdır. Bu değerlerin üzerinde olması karın bölgesinde aşırı yağlanma ve artmış sağlık riski anlamına gelir."
  },
  {
    question: "Bel kalça oranı neden BMI'dan daha önemli?",
    answer: "BMI sadece boy ve kilo ilişkisini ölçerken, bel kalça oranı yağın vücutta nerede toplandığını gösterir. Karın bölgesindeki yağ (viseral yağ), organlara yakın olduğu için kalp hastalığı ve diyabet riskini artırır. Bu nedenle aynı BMI'a sahip iki kişiden karın yağı fazla olan daha riskli kabul edilir."
  },
  {
    question: "Bel kalça oranını nasıl düşürebilirim?",
    answer: "Bel kalça oranını düşürmek için: Düzenli kardiyo egzersizi (haftada 150+ dakika), direnç antrenmanı ile kas yapımı, işlenmiş gıda ve şeker tüketimini azaltma, lif açısından zengin beslenme, yeterli uyku (7-9 saat), stres yönetimi önemlidir. Özellikle HIIT antrenmanları karın yağını hedef alır."
  },
  {
    question: "Elma ve armut vücut tipi ne demek?",
    answer: "Elma tipi vücut: Yağ karın bölgesinde toplanır, bel kalça oranı yüksektir. Sağlık riski daha fazladır. Armut tipi vücut: Yağ kalça ve bacaklarda toplanır, bel kalça oranı düşüktür. Sağlık açısından daha avantajlıdır. Genetik etkili olsa da yaşam tarzı değişiklikleriyle yağ dağılımı iyileştirilebilir."
  }
];

const maleRiskCategories = [
  { max: 0.90, label: "Düşük Risk", color: "bg-emerald-500", textColor: "text-emerald-400", icon: CheckCircle, desc: "Sağlıklı aralıkta" },
  { max: 0.99, label: "Orta Risk", color: "bg-amber-500", textColor: "text-amber-400", icon: AlertTriangle, desc: "Dikkat gerektirir" },
  { max: 2.0, label: "Yüksek Risk", color: "bg-rose-500", textColor: "text-rose-400", icon: AlertTriangle, desc: "Sağlık riski yüksek" },
];

const femaleRiskCategories = [
  { max: 0.80, label: "Düşük Risk", color: "bg-emerald-500", textColor: "text-emerald-400", icon: CheckCircle, desc: "Sağlıklı aralıkta" },
  { max: 0.85, label: "Orta Risk", color: "bg-amber-500", textColor: "text-amber-400", icon: AlertTriangle, desc: "Dikkat gerektirir" },
  { max: 2.0, label: "Yüksek Risk", color: "bg-rose-500", textColor: "text-rose-400", icon: AlertTriangle, desc: "Sağlık riski yüksek" },
];

export default function WaistHipRatioCalculator() {
  const [cinsiyet, setCinsiyet] = useState("erkek");
  const [bel, setBel] = useState(85);
  const [kalca, setKalca] = useState(100);
  const [sonuc, setSonuc] = useState<number | null>(null);
  const sonucRef = useRef<HTMLDivElement>(null);

  const hesapla = () => {
    const oran = bel / kalca;
    setSonuc(parseFloat(oran.toFixed(2)));
    
    setTimeout(() => {
      sonucRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const sifirla = () => {
    setBel(85);
    setKalca(100);
    setSonuc(null);
  };

  const getRiskKategorisi = (oran: number) => {
    const kategoriler = cinsiyet === "erkek" ? maleRiskCategories : femaleRiskCategories;
    return kategoriler.find(k => oran <= k.max) || kategoriler[kategoriler.length - 1];
  };

  const getVucutTipi = (oran: number) => {
    const esik = cinsiyet === "erkek" ? 0.90 : 0.80;
    if (oran > esik) return { tip: "Elma Tipi", desc: "Yağ karın bölgesinde yoğunlaşmış", icon: "🍎" };
    return { tip: "Armut Tipi", desc: "Yağ kalça ve bacaklarda dağılmış", icon: "🍐" };
  };

  const getIdealBel = () => {
    const idealOran = cinsiyet === "erkek" ? 0.90 : 0.80;
    return Math.floor(kalca * idealOran);
  };

  const risk = sonuc ? getRiskKategorisi(sonuc) : null;
  const vucutTipi = sonuc ? getVucutTipi(sonuc) : null;
  const RiskIcon = risk?.icon || Activity;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[#050505]">
      <SEO
        title="Bel Kalça Oranı Hesaplama | Sağlık Risk Değerlendirmesi - Gokalaf"
        description="Bel kalça oranı hesaplayıcı ile karın yağlanmanızı ve sağlık riskinizi değerlendirin. Ücretsiz online BKO hesaplama aracı."
        keywords="bel kalça oranı, bel kalça oranı hesaplama, BKO hesaplama, karın yağı, sağlık riski, elma tipi vücut, armut tipi vücut"
        canonical="/araclar/bel-kalca-orani"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Bel Kalça Oranı Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/bel-kalca-orani",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "description": "Bel kalça oranınızı hesaplayın ve sağlık riskinizi değerlendirin.",
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
            Sağlık Hesaplayıcı
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase mb-4 text-white tracking-tight">
            Bel Kalça <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-primary">Oranı</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Karın bölgesindeki yağlanmanızı ölçün ve sağlık riskinizi değerlendirin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Ölçümleriniz</h2>
                <p className="text-xs text-gray-500">Bel ve kalça çevrenizi girin</p>
              </div>
            </div>
            
            <div className="space-y-6">
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

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Bel Çevresi</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-rose-400" data-testid="text-bel-value">{bel}</span>
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
                <Slider 
                  value={[bel]} 
                  onValueChange={(val) => setBel(val[0])} 
                  min={50} 
                  max={150} 
                  step={1} 
                  className="py-2"
                  data-testid="slider-bel"
                />
                <p className="text-xs text-gray-600">Göbek hizasından ölçün</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm font-medium">Kalça Çevresi</Label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary" data-testid="text-kalca-value">{kalca}</span>
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
                <Slider 
                  value={[kalca]} 
                  onValueChange={(val) => setKalca(val[0])} 
                  min={60} 
                  max={160} 
                  step={1} 
                  className="py-2"
                  data-testid="slider-kalca"
                />
                <p className="text-xs text-gray-600">En geniş noktadan ölçün</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={hesapla} className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold" data-testid="button-hesapla">
                  <Target className="w-4 h-4 mr-2" />
                  Hesapla
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
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Sonuç</h2>
                <p className="text-xs text-gray-500">Sağlık risk değerlendirmeniz</p>
              </div>
            </div>

            {sonuc ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center py-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5">
                  <div className="text-5xl font-bold text-white mb-2" data-testid="text-sonuc">{sonuc}</div>
                  <div className={`text-lg font-semibold ${risk?.textColor}`}>{risk?.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{risk?.desc}</div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full relative">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-800 shadow-lg"
                      style={{ left: `${Math.min(100, Math.max(0, (sonuc - 0.5) / 0.7 * 100))}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.50</span>
                    <span>Düşük Risk</span>
                    <span>Yüksek Risk</span>
                    <span>1.20</span>
                  </div>
                </div>

                {vucutTipi && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{vucutTipi.icon}</span>
                      <div>
                        <div className="font-bold text-white">{vucutTipi.tip}</div>
                        <div className="text-sm text-gray-400">{vucutTipi.desc}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">İdeal Bel</div>
                    <div className="text-lg font-bold text-primary">{getIdealBel()} cm</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Fark</div>
                    <div className={`text-lg font-bold ${bel > getIdealBel() ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {bel > getIdealBel() ? '+' : ''}{bel - getIdealBel()} cm
                    </div>
                  </div>
                </div>

                {risk?.label !== "Düşük Risk" && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                      <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-400 mb-1">Öneri</div>
                        <p className="text-sm text-gray-400">
                          Kardiyo egzersizleri, düşük karbonhidrat beslenmesi ve düzenli fiziksel aktivite ile bel çevrenizi azaltabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Ruler className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">
                  Bel ve kalça ölçümlerinizi girin,<br />sonuçları görün
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Bel Kalça Oranı Referans Değerleri</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-bold text-primary mb-3">Erkekler</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Düşük Risk:</span><span className="text-emerald-400">&lt; 0.90</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Orta Risk:</span><span className="text-amber-400">0.90 - 0.99</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Yüksek Risk:</span><span className="text-rose-400">≥ 1.00</span></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-bold text-rose-400 mb-3">Kadınlar</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Düşük Risk:</span><span className="text-emerald-400">&lt; 0.80</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Orta Risk:</span><span className="text-amber-400">0.80 - 0.85</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Yüksek Risk:</span><span className="text-rose-400">&gt; 0.85</span></div>
                </div>
              </div>
            </div>
          </div>

          <CalculatorFAQ faqs={belKalcaFAQs} title="Bel Kalça Oranı Sıkça Sorulan Sorular" />
          
          <RelatedCalculators currentSlug="bel-kalca-orani" />
        </div>
      </div>
    </div>
  );
}
