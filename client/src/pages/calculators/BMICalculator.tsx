import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, RotateCcw, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { bmiFAQs } from "@/components/CalculatorFAQ";

const bmiCategories = [
  { min: 0, max: 18.5, label: "Zayıf", color: "bg-blue-500", textColor: "text-blue-400" },
  { min: 18.5, max: 25, label: "Normal", color: "bg-green-500", textColor: "text-green-400" },
  { min: 25, max: 30, label: "Fazla Kilolu", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { min: 30, max: 50, label: "Obez", color: "bg-red-500", textColor: "text-red-400" },
];

export default function BMICalculator() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [bmi, setBmi] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateBMI = () => {
    const h = height / 100;
    const result = weight / (h * h);
    setBmi(parseFloat(result.toFixed(1)));
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: "Zayıf", color: "text-blue-400", bg: "bg-blue-500", desc: "Kalori alımını artırmalısın.", icon: TrendingUp };
    if (val < 25) return { label: "Normal", color: "text-green-400", bg: "bg-green-500", desc: "Formunu korumaya devam et!", icon: Minus };
    if (val < 30) return { label: "Fazla Kilolu", color: "text-yellow-400", bg: "bg-yellow-500", desc: "Kalori açığı oluşturmalısın.", icon: TrendingDown };
    return { label: "Obez", color: "text-red-400", bg: "bg-red-500", desc: "Profesyonel destek almalısın.", icon: TrendingDown };
  };

  const getIdealWeight = () => {
    const h = height / 100;
    const minWeight = 18.5 * h * h;
    const maxWeight = 24.9 * h * h;
    return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1) };
  };

  const getGaugePosition = (val: number) => {
    const minBmi = 15;
    const maxBmi = 40;
    const clampedVal = Math.max(minBmi, Math.min(maxBmi, val));
    return ((clampedVal - minBmi) / (maxBmi - minBmi)) * 100;
  };

  const status = bmi ? getBMIStatus(bmi) : null;
  const idealWeight = getIdealWeight();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Vücut Kitle İndeksi (BMI) Hesaplama | Ücretsiz VKİ Hesaplayıcı - Gokalaf"
        description="Vücut kitle indeksi (BMI) hesaplama aracı ile boy ve kilonuza göre VKİ değerinizi anında öğrenin. Ücretsiz online BMI hesaplayıcı."
        keywords="vücut kitle indeksi hesaplama, bmi hesaplama, vki hesaplama, boy kilo indeksi, ideal kilo hesaplama"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Vücut Kitle İndeksi (BMI) Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/vucut-kitle-indeksi",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
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
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Sağlık Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Vücut Kitle <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">İndeksi</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Boy ve kilonuza göre BMI değerinizi hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-5 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Scale className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Boy</Label>
                  <span className="text-primary font-bold" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider 
                  value={[height]} 
                  onValueChange={(val) => setHeight(val[0])} 
                  min={140} 
                  max={220} 
                  step={1} 
                  className="py-1"
                  data-testid="slider-height"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                  <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider 
                  value={[weight]} 
                  onValueChange={(val) => setWeight(val[0])} 
                  min={40} 
                  max={150} 
                  step={0.5} 
                  className="py-1"
                  data-testid="slider-weight"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Cinsiyet</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-10 text-white text-sm" data-testid="select-gender">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateBMI} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-11 text-sm"
                data-testid="button-calculate-bmi"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div ref={resultRef} className="lg:col-span-3 bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col justify-center">
            {bmi ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">VKİ Değeriniz</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-heading text-white" data-testid="text-bmi-result">{bmi}</span>
                      <span className="text-sm text-gray-500">kg/m²</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${status?.bg} text-black border-none font-bold uppercase text-xs px-3 py-1`} data-testid="badge-bmi-status">
                      {status?.label}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1.5 max-w-[140px]" data-testid="text-bmi-description">{status?.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                    {bmiCategories.map((cat, i) => (
                      <div 
                        key={i} 
                        className={`${cat.color} h-full`}
                        style={{ width: `${((cat.max - cat.min) / 35) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative h-4">
                    <motion.div 
                      className="absolute top-0 w-0.5 h-4 bg-white rounded-full"
                      initial={{ left: "0%" }}
                      animate={{ left: `${getGaugePosition(bmi)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">İdeal Kilo Aralığı</div>
                    <div className="text-lg font-bold text-white">{idealWeight.min} - {idealWeight.max} <span className="text-xs text-gray-400">kg</span></div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Mevcut Durumunuz</div>
                    <div className={`text-lg font-bold ${status?.color}`}>
                      {weight < parseFloat(idealWeight.min) && `${(parseFloat(idealWeight.min) - weight).toFixed(1)} kg eksik`}
                      {weight > parseFloat(idealWeight.max) && `${(weight - parseFloat(idealWeight.max)).toFixed(1)} kg fazla`}
                      {weight >= parseFloat(idealWeight.min) && weight <= parseFloat(idealWeight.max) && "İdeal aralıkta"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">BMI Kategorileri</div>
                  <div className="grid grid-cols-4 gap-2">
                    {bmiCategories.map((cat, i) => (
                      <div 
                        key={i} 
                        className={`text-center p-2 rounded-lg ${bmi >= cat.min && bmi < cat.max ? 'bg-white/10 ring-1 ring-primary' : 'bg-white/5'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${cat.color} mx-auto mb-1`}></div>
                        <div className="text-[10px] text-gray-400">{cat.label}</div>
                        <div className="text-[9px] text-gray-600">{cat.min}-{cat.max}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setBmi(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-bmi"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Activity size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="vucut-kitle-indeksi" />
        <CalculatorFAQ title="BMI Hesaplama" faqs={bmiFAQs} schemaUrl="https://gokalaf.com/araclar/vucut-kitle-indeksi" />
      </div>
    </div>
  );
}
