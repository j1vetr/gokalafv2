import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { macroFAQs } from "@/components/CalculatorFAQ";

export default function MacroCalculator() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [proteinRatio, setProteinRatio] = useState(30);
  const [result, setResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz", multiplier: 1.2 },
    light: { label: "Hafif Aktif", multiplier: 1.375 },
    moderate: { label: "Orta Aktif", multiplier: 1.55 },
    very: { label: "Çok Aktif", multiplier: 1.725 },
    extra: { label: "Ekstra Aktif", multiplier: 1.9 },
  };

  const goals = {
    lose: { label: "Kilo Vermek", deficit: -500 },
    maintain: { label: "Korumak", deficit: 0 },
    gain: { label: "Kas Yapmak", deficit: 300 },
  };

  const calculateMacros = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevels[activity as keyof typeof activityLevels].multiplier;
    const targetCalories = tdee + goals[goal as keyof typeof goals].deficit;

    const proteinCalories = (targetCalories * proteinRatio) / 100;
    const proteinGrams = Math.round(proteinCalories / 4);

    const fatRatio = 25;
    const fatCalories = (targetCalories * fatRatio) / 100;
    const fatGrams = Math.round(fatCalories / 9);

    const carbRatio = 100 - proteinRatio - fatRatio;
    const carbCalories = (targetCalories * carbRatio) / 100;
    const carbGrams = Math.round(carbCalories / 4);

    setResult({
      calories: Math.round(targetCalories),
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      proteinRatio,
      carbRatio,
      fatRatio,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <SEO
        title="Makro Besin Hesaplama | Protein Karbonhidrat Yağ Oranları - Gokalaf"
        description="Makro besin hesaplayıcı ile günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize göre makro dağılımı."
        keywords="makro hesaplama, protein hesaplama, karbonhidrat hesaplama, makro besin, beslenme programı"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Makro Besin Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/makro-hesaplama",
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
            Beslenme Planlama
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Makro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Protein, karbonhidrat ve yağ miktarlarınızı hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Utensils className="text-primary" /> Verilerini Gir
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Yaş</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-age-value">{age}</span>
                </div>
                <Slider 
                  value={[age]} 
                  onValueChange={(val) => setAge(val[0])} 
                  min={15} 
                  max={80} 
                  step={1} 
                  className="py-4"
                  data-testid="slider-age"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Boy (cm)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider 
                  value={[height]} 
                  onValueChange={(val) => setHeight(val[0])} 
                  min={140} 
                  max={220} 
                  step={1} 
                  className="py-4"
                  data-testid="slider-height"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Kilo (kg)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider 
                  value={[weight]} 
                  onValueChange={(val) => setWeight(val[0])} 
                  min={40} 
                  max={150} 
                  step={0.5} 
                  className="py-4"
                  data-testid="slider-weight"
                />
              </div>

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

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Aktivite Seviyesi</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-activity">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Hedefiniz</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-goal">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goals).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Protein Oranı (%)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-protein-ratio-value">{proteinRatio}%</span>
                </div>
                <Slider 
                  value={[proteinRatio]} 
                  onValueChange={(val) => setProteinRatio(val[0])} 
                  min={20} 
                  max={40} 
                  step={5} 
                  className="py-4"
                  data-testid="slider-protein-ratio"
                />
                <p className="text-xs text-gray-500">Yağ sabit %25, kalan karbonhidrat olacak</p>
              </div>

              <Button 
                onClick={calculateMacros} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-macros"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div ref={resultRef} className="bg-black/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-center relative overflow-hidden">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-8 w-full relative z-10"
              >
                <div className="text-center">
                  <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold mb-4">Günlük Makro İhtiyacınız</div>
                  <div className="text-6xl font-bold font-heading text-white mb-2" data-testid="text-total-calories">{result.calories}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">kcal / gün</div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-500/20 to-red-500/10 p-6 rounded-2xl border border-red-500/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-red-400 uppercase tracking-wider font-bold">Protein</div>
                      <Badge className="bg-red-500 text-white text-xs">{result.proteinRatio}%</Badge>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1" data-testid="text-protein-grams">{result.protein}g</div>
                    <div className="text-xs text-gray-400">4 kcal/gram</div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/10 p-6 rounded-2xl border border-blue-500/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-blue-400 uppercase tracking-wider font-bold">Karbonhidrat</div>
                      <Badge className="bg-blue-500 text-white text-xs">{result.carbRatio}%</Badge>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1" data-testid="text-carb-grams">{result.carbs}g</div>
                    <div className="text-xs text-gray-400">4 kcal/gram</div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 p-6 rounded-2xl border border-yellow-500/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-yellow-400 uppercase tracking-wider font-bold">Yağ</div>
                      <Badge className="bg-yellow-500 text-black text-xs">{result.fatRatio}%</Badge>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1" data-testid="text-fat-grams">{result.fats}g</div>
                    <div className="text-xs text-gray-400">9 kcal/gram</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-macros"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                 <Utensils size={80} className="mx-auto text-white" />
                 <h3 className="text-2xl font-heading font-bold uppercase text-white">Sonuç Bekleniyor</h3>
                 <p className="text-gray-400">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="makro-hesaplama" />
        <CalculatorFAQ title="Makro Hesaplama" faqs={macroFAQs} schemaUrl="https://gokalaf.com/araclar/makro-hesaplama" />
      </div>
    </div>
  );
}
