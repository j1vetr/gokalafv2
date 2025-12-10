import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, RotateCcw, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";

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
    desc: string;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
      setError("Hesaplama yapılamadı. Lütfen ölçümlerinizi kontrol edin.");
      setResult(null);
      return;
    }

    bodyFat = Math.max(3, Math.min(50, bodyFat));
    
    const fatMass = (bodyFat / 100) * weight;
    const leanMass = weight - fatMass;

    let category, color, desc;
    
    if (gender === "male") {
      if (bodyFat < 6) { category = "Esansiyel Yağ"; color = "text-red-400"; desc = "Sağlık için tehlikeli düşüklük"; }
      else if (bodyFat < 14) { category = "Atletik"; color = "text-green-400"; desc = "Mükemmel form, yarışma seviyesi"; }
      else if (bodyFat < 18) { category = "Fitness"; color = "text-primary"; desc = "Sağlıklı ve fit"; }
      else if (bodyFat < 25) { category = "Ortalama"; color = "text-yellow-400"; desc = "Kabul edilebilir aralık"; }
      else { category = "Obez"; color = "text-red-400"; desc = "Yağ kaybı önerilir"; }
    } else {
      if (bodyFat < 14) { category = "Esansiyel Yağ"; color = "text-red-400"; desc = "Sağlık için tehlikeli düşüklük"; }
      else if (bodyFat < 21) { category = "Atletik"; color = "text-green-400"; desc = "Mükemmel form, yarışma seviyesi"; }
      else if (bodyFat < 25) { category = "Fitness"; color = "text-primary"; desc = "Sağlıklı ve fit"; }
      else if (bodyFat < 32) { category = "Ortalama"; color = "text-yellow-400"; desc = "Kabul edilebilir aralık"; }
      else { category = "Obez"; color = "text-red-400"; desc = "Yağ kaybı önerilir"; }
    }

    setResult({
      bodyFat: parseFloat(bodyFat.toFixed(1)),
      fatMass: parseFloat(fatMass.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      category,
      color,
      desc
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Vücut Analizi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Yağ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Oranı</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            US Navy formülüyle vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Percent className="text-primary" /> Ölçümlerini Gir
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Cinsiyet</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-gender">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Boy (cm)</Label>
                  <span className="text-primary font-bold" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={140} max={220} step={1} className="py-2" data-testid="slider-height" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Kilo (kg)</Label>
                  <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={0.5} className="py-2" data-testid="slider-weight" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Bel Çevresi (cm)</Label>
                  <span className="text-primary font-bold" data-testid="text-waist-value">{waist} cm</span>
                </div>
                <Slider value={[waist]} onValueChange={(val) => setWaist(val[0])} min={50} max={150} step={0.5} className="py-2" data-testid="slider-waist" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Boyun Çevresi (cm)</Label>
                  <span className="text-primary font-bold" data-testid="text-neck-value">{neck} cm</span>
                </div>
                <Slider value={[neck]} onValueChange={(val) => setNeck(val[0])} min={25} max={60} step={0.5} className="py-2" data-testid="slider-neck" />
              </div>

              {gender === "female" && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <Label className="text-gray-400 uppercase tracking-wider font-bold">Kalça Çevresi (cm)</Label>
                    <span className="text-primary font-bold" data-testid="text-hip-value">{hip} cm</span>
                  </div>
                  <Slider value={[hip]} onValueChange={(val) => setHip(val[0])} min={60} max={150} step={0.5} className="py-2" data-testid="slider-hip" />
                </div>
              )}

              <Button 
                onClick={calculateBodyFat} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-body-fat"
              >
                Hesapla
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center" data-testid="error-message">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div ref={resultRef} className="bg-black/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 w-full relative z-10"
              >
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Vücut Yağ Oranın</div>
                
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      strokeDasharray={`${(result.bodyFat / 50) * 553} 553`}
                      className={result.color}
                    />
                  </svg>
                  <div className="text-center">
                    <div className="text-5xl font-bold font-heading text-white" data-testid="text-body-fat-result">%{result.bodyFat}</div>
                    <div className={`text-sm font-bold ${result.color}`} data-testid="text-body-fat-category">{result.category}</div>
                  </div>
                </div>

                <p className="text-gray-400" data-testid="text-body-fat-description">{result.desc}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-500 uppercase mb-1">Yağ Kütlesi</div>
                    <div className="text-2xl font-bold text-orange-400" data-testid="text-fat-mass">{result.fatMass} kg</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <svg className="w-6 h-6 text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="text-xs text-gray-500 uppercase mb-1">Yağsız Kütle</div>
                    <div className="text-2xl font-bold text-blue-400" data-testid="text-lean-mass">{result.leanMass} kg</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs mt-4"
                  data-testid="button-reset-body-fat"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                <Percent size={80} className="mx-auto text-white" />
                <h3 className="text-2xl font-heading font-bold uppercase text-white">Sonuç Bekleniyor</h3>
                <p className="text-gray-400">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="vucut-yag-orani" />
      </div>
    </div>
  );
}
