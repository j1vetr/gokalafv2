import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, RotateCcw, Flame, Shield, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { bodyFatFAQs } from "@/components/CalculatorFAQ";

const maleCategories = [
  { min: 2, max: 5, label: "Esansiyel", color: "bg-red-500", textColor: "text-red-400" },
  { min: 6, max: 13, label: "Atletik", color: "bg-green-500", textColor: "text-green-400" },
  { min: 14, max: 17, label: "Fitness", color: "bg-primary", textColor: "text-primary" },
  { min: 18, max: 24, label: "Ortalama", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { min: 25, max: 50, label: "Obez", color: "bg-red-500", textColor: "text-red-400" },
];

const femaleCategories = [
  { min: 10, max: 13, label: "Esansiyel", color: "bg-red-500", textColor: "text-red-400" },
  { min: 14, max: 20, label: "Atletik", color: "bg-green-500", textColor: "text-green-400" },
  { min: 21, max: 24, label: "Fitness", color: "bg-primary", textColor: "text-primary" },
  { min: 25, max: 31, label: "Ortalama", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { min: 32, max: 50, label: "Obez", color: "bg-red-500", textColor: "text-red-400" },
];

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [waist, setWaist] = useState(85);
  const [neck, setNeck] = useState(38);
  const [hip, setHip] = useState(95);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    bodyFat: number;
    fatMass: number;
    leanMass: number;
    category: string;
    color: string;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const categories = gender === "male" ? maleCategories : femaleCategories;

  const validateMeasurements = (): boolean => {
    if (gender === "male") {
      if (waist <= neck) {
        setError("Bel çevresi boyun çevresinden büyük olmalıdır.");
        return false;
      }
    } else {
      if (waist + hip <= neck) {
        setError("Bel ve kalça çevresi toplamı boyun çevresinden büyük olmalıdır.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const calculateBodyFat = () => {
    if (!validateMeasurements()) {
      setResult(null);
      return;
    }

    let bodyFat: number;
    
    if (gender === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    if (isNaN(bodyFat) || !isFinite(bodyFat)) {
      setError("Hesaplama yapılamadı. Ölçümlerinizi kontrol edin.");
      setResult(null);
      return;
    }

    bodyFat = Math.max(3, Math.min(50, bodyFat));
    
    const fatMass = (bodyFat / 100) * weight;
    const leanMass = weight - fatMass;

    const cat = categories.find(c => bodyFat >= c.min && bodyFat < c.max) || categories[categories.length - 1];

    setResult({
      bodyFat: parseFloat(bodyFat.toFixed(1)),
      fatMass: parseFloat(fatMass.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      category: cat.label,
      color: cat.textColor,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getGaugePosition = (val: number) => {
    return Math.max(0, Math.min(100, (val / 50) * 100));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Vücut Yağ Oranı Hesaplama | Yağ Yüzdesi Hesaplayıcı - Gokalaf"
        description="Vücut yağ oranınızı hesaplayın. Bel, boyun ve kalça ölçülerinizle yağ yüzdenizi ve kategorisinizi öğrenin."
        keywords="vücut yağ oranı hesaplama, yağ yüzdesi, body fat hesaplama, yağ oranı ölçme, fit vücut"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Vücut Yağ Oranı Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/vucut-yag-orani",
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
            Vücut Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Yağ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Oranı</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            US Navy formülüyle vücut yağ yüzdenizi hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-3 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Percent className="w-4 h-4 text-primary" /> Ölçümleriniz
            </h3>
            
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Cinsiyet</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-8 text-white text-xs" data-testid="select-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Erkek</SelectItem>
                      <SelectItem value="female">Kadın</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Boy</Label>
                    <span className="text-primary font-bold" data-testid="text-height-value">{height}</span>
                  </div>
                  <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={140} max={220} step={1} className="py-1" data-testid="slider-height" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                    <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                  </div>
                  <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={0.5} className="py-1" data-testid="slider-weight" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Boyun</Label>
                    <span className="text-primary font-bold" data-testid="text-neck-value">{neck} cm</span>
                  </div>
                  <Slider value={[neck]} onValueChange={(val) => setNeck(val[0])} min={25} max={60} step={0.5} className="py-1" data-testid="slider-neck" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Bel Çevresi</Label>
                  <span className="text-primary font-bold" data-testid="text-waist-value">{waist} cm</span>
                </div>
                <Slider value={[waist]} onValueChange={(val) => setWaist(val[0])} min={50} max={150} step={0.5} className="py-1" data-testid="slider-waist" />
              </div>

              {gender === "female" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kalça Çevresi</Label>
                    <span className="text-primary font-bold" data-testid="text-hip-value">{hip} cm</span>
                  </div>
                  <Slider value={[hip]} onValueChange={(val) => setHip(val[0])} min={60} max={150} step={0.5} className="py-1" data-testid="slider-hip" />
                </div>
              )}

              {error && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2" data-testid="error-message">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button 
                onClick={calculateBodyFat} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-body-fat"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div ref={resultRef} className="lg:col-span-3 bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col justify-center">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Vücut Yağ Oranınız</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-heading text-white" data-testid="text-body-fat-result">%{result.bodyFat}</span>
                    </div>
                  </div>
                  <Badge className={`${result.color} bg-white/5 border-white/10 font-bold uppercase text-xs px-3 py-1`} data-testid="text-body-fat-category">
                    {result.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                    {categories.map((cat, i) => (
                      <div 
                        key={i} 
                        className={`${cat.color} h-full`}
                        style={{ width: `${((cat.max - cat.min) / 48) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative h-4">
                    <motion.div 
                      className="absolute top-0 w-0.5 h-4 bg-white rounded-full"
                      initial={{ left: "0%" }}
                      animate={{ left: `${getGaugePosition(result.bodyFat)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500">
                    {categories.map((cat, i) => (
                      <span key={i} className={cat.textColor}>{cat.label}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-3 rounded-xl border border-orange-500/20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Flame className="w-4 h-4 text-orange-400 mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Yağ Kütlesi</div>
                    <div className="text-2xl font-bold text-orange-400" data-testid="text-fat-mass">{result.fatMass} kg</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-3 rounded-xl border border-blue-500/20"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Shield className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Yağsız Kütle</div>
                    <div className="text-2xl font-bold text-blue-400" data-testid="text-lean-mass">{result.leanMass} kg</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Vücut Kompozisyonu</div>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-orange-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.bodyFat}%` }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div 
                      className="bg-blue-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - result.bodyFat}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                    <span className="text-orange-400">Yağ %{result.bodyFat}</span>
                    <span className="text-blue-400">Yağsız %{(100 - result.bodyFat).toFixed(1)}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-body-fat"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Percent size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Ölçümlerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="vucut-yag-orani" />
        <CalculatorFAQ title="Vücut Yağ Oranı Hesaplama" faqs={bodyFatFAQs} schemaUrl="https://gokalaf.com/araclar/vucut-yag-orani" />
      </div>
    </div>
  );
}
