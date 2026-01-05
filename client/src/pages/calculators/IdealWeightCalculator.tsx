import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, RotateCcw, TrendingUp, TrendingDown, Check, Scale } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { idealWeightFAQs } from "@/components/CalculatorFAQ";

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState("male");
  const [currentWeight, setCurrentWeight] = useState(75);
  const [result, setResult] = useState<{
    robinson: number;
    miller: number;
    devine: number;
    hamwi: number;
    average: number;
    min: number;
    max: number;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateIdealWeight = () => {
    const heightInches = height / 2.54;
    const baseHeight = 60;
    const extraInches = Math.max(0, heightInches - baseHeight);

    let robinson, miller, devine, hamwi;

    if (gender === "male") {
      robinson = 52 + 1.9 * extraInches;
      miller = 56.2 + 1.41 * extraInches;
      devine = 50 + 2.3 * extraInches;
      hamwi = 48 + 2.7 * extraInches;
    } else {
      robinson = 49 + 1.7 * extraInches;
      miller = 53.1 + 1.36 * extraInches;
      devine = 45.5 + 2.3 * extraInches;
      hamwi = 45.5 + 2.2 * extraInches;
    }

    const average = (robinson + miller + devine + hamwi) / 4;
    const values = [robinson, miller, devine, hamwi];
    const min = Math.min(...values);
    const max = Math.max(...values);

    setResult({
      robinson: parseFloat(robinson.toFixed(1)),
      miller: parseFloat(miller.toFixed(1)),
      devine: parseFloat(devine.toFixed(1)),
      hamwi: parseFloat(hamwi.toFixed(1)),
      average: parseFloat(average.toFixed(1)),
      min: parseFloat(min.toFixed(1)),
      max: parseFloat(max.toFixed(1)),
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getWeightDifference = () => {
    if (!result) return null;
    const diff = currentWeight - result.average;
    if (Math.abs(diff) < 2) return { type: "ideal", text: "İdeal kilondasın!", color: "text-green-400", icon: Check };
    if (diff > 0) return { type: "over", text: `${diff.toFixed(1)} kg fazla`, color: "text-yellow-400", icon: TrendingDown };
    return { type: "under", text: `${Math.abs(diff).toFixed(1)} kg eksik`, color: "text-blue-400", icon: TrendingUp };
  };

  const getPositionOnScale = () => {
    if (!result) return 50;
    const range = result.max - result.min + 20;
    const position = ((currentWeight - (result.min - 10)) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const difference = getWeightDifference();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="İdeal Kilo Hesaplama | Boyunuza Göre İdeal Kilonuz - Gokalaf"
        description="İdeal kilo hesaplayıcı ile boyunuza ve cinsiyetinize göre olmanız gereken kiloyu öğrenin. 4 farklı formülle ideal kilo hesaplama."
        keywords="ideal kilo hesaplama, boy kilo oranı, ideal ağırlık, kilo hesaplama, sağlıklı kilo"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "İdeal Kilo Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/ideal-kilo",
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
            Hedef Belirleme
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            İdeal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Kilo</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            4 bilimsel formülle ideal kilonuzu hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Scale className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Boy</Label>
                  <span className="text-primary font-bold" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={140} max={220} step={1} className="py-1" data-testid="slider-height" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Mevcut Kilo</Label>
                  <span className="text-primary font-bold" data-testid="text-current-weight">{currentWeight} kg</span>
                </div>
                <Slider value={[currentWeight]} onValueChange={(val) => setCurrentWeight(val[0])} min={40} max={150} step={0.5} className="py-1" data-testid="slider-current-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Cinsiyet</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-white text-sm" data-testid="select-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateIdealWeight} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-ideal-weight"
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
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">İdeal Kilonuz</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-heading text-primary" data-testid="text-ideal-weight-result">{result.average}</span>
                      <span className="text-sm text-gray-500">kg</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Aralık: {result.min} - {result.max} kg</div>
                  </div>
                  {difference && (
                    <div className={`text-right p-3 rounded-xl bg-white/5`}>
                      <difference.icon className={`w-5 h-5 ${difference.color} ml-auto mb-1`} />
                      <div className={`text-sm font-bold ${difference.color}`} data-testid="text-weight-difference">{difference.text}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Mevcut vs İdeal</div>
                  <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-green-500/30 to-green-500/10 rounded-full"
                      style={{ 
                        left: `${((result.min - (result.min - 10)) / (result.max - result.min + 20)) * 100}%`,
                        width: `${((result.max - result.min) / (result.max - result.min + 20)) * 100}%`
                      }}
                    />
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"
                      initial={{ left: "50%" }}
                      animate={{ left: `${getPositionOnScale()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500">
                    <span>{result.min - 10} kg</span>
                    <span className="text-green-400">İdeal Aralık</span>
                    <span>{result.max + 10} kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: "Robinson", value: result.robinson },
                    { name: "Miller", value: result.miller },
                    { name: "Devine", value: result.devine },
                    { name: "Hamwi", value: result.hamwi },
                  ].map((formula, i) => (
                    <motion.div 
                      key={formula.name}
                      className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="text-[9px] text-gray-500 uppercase mb-1">{formula.name}</div>
                      <div className="text-lg font-bold text-white">{formula.value}</div>
                      <div className="text-[9px] text-gray-600">kg</div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Hedefe Ulaşmak İçin</div>
                  <div className="text-center">
                    {difference?.type === "ideal" ? (
                      <div className="text-green-400 font-semibold">Harika! İdeal kilondasınız</div>
                    ) : difference?.type === "over" ? (
                      <div className="text-yellow-400">
                        <span className="text-2xl font-bold">{(currentWeight - result.average).toFixed(1)}</span>
                        <span className="text-sm ml-1">kg vermeniz önerilir</span>
                      </div>
                    ) : (
                      <div className="text-blue-400">
                        <span className="text-2xl font-bold">{(result.average - currentWeight).toFixed(1)}</span>
                        <span className="text-sm ml-1">kg almanız önerilir</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-ideal-weight"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Target size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="ideal-kilo" />
        <CalculatorFAQ title="İdeal Kilo Hesaplama" faqs={idealWeightFAQs} schemaUrl="https://gokalaf.com/araclar/ideal-kilo" />
      </div>
    </div>
  );
}
