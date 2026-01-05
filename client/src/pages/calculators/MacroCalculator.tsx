import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, RotateCcw, TrendingDown, Target, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { macroFAQs } from "@/components/CalculatorFAQ";

const MacroPieChart = ({ protein, carbs, fats }: { protein: number; carbs: number; fats: number }) => {
  const total = protein + carbs + fats;
  const proteinDeg = (protein / total) * 360;
  const carbsDeg = (carbs / total) * 360;
  const fatsDeg = (fats / total) * 360;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeDasharray={`${(protein / total) * 251.2} 251.2`}
          className="drop-shadow-lg"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${(carbs / total) * 251.2} 251.2`}
          strokeDashoffset={`${-(protein / total) * 251.2}`}
          className="drop-shadow-lg"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#eab308"
          strokeWidth="20"
          strokeDasharray={`${(fats / total) * 251.2} 251.2`}
          strokeDashoffset={`${-((protein + carbs) / total) * 251.2}`}
          className="drop-shadow-lg"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center">
          <PieChart className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

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
    lose: { label: "Kilo Ver", deficit: -500, icon: TrendingDown },
    maintain: { label: "Koru", deficit: 0, icon: Target },
    gain: { label: "Kas Yap", deficit: 300, icon: TrendingUp },
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
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Beslenme Planlama
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Makro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <PieChart className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Yaş</Label>
                    <span className="text-primary font-bold" data-testid="text-age-value">{age}</span>
                  </div>
                  <Slider 
                    value={[age]} 
                    onValueChange={(val) => setAge(val[0])} 
                    min={15} 
                    max={80} 
                    step={1} 
                    className="py-1"
                    data-testid="slider-age"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-white text-sm" data-testid="select-activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Hedef</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(goals).map(([key, val]) => {
                    const Icon = val.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setGoal(key)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          goal === key 
                            ? 'bg-primary/20 border-primary text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-goal-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${goal === key ? 'text-primary' : ''}`} />
                        <div className="text-[10px] font-semibold uppercase">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Protein Oranı</Label>
                  <span className="text-primary font-bold" data-testid="text-protein-ratio-value">{proteinRatio}%</span>
                </div>
                <Slider 
                  value={[proteinRatio]} 
                  onValueChange={(val) => setProteinRatio(val[0])} 
                  min={20} 
                  max={40} 
                  step={5} 
                  className="py-1"
                  data-testid="slider-protein-ratio"
                />
                <p className="text-[10px] text-gray-500">Yağ %25 sabit, kalan karbonhidrat</p>
              </div>

              <Button 
                onClick={calculateMacros} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm mt-1"
                data-testid="button-calculate-macros"
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
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Günlük Kalori</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-heading text-white" data-testid="text-total-calories">{result.calories}</span>
                      <span className="text-xs text-gray-500">kcal</span>
                    </div>
                  </div>
                  <MacroPieChart protein={result.proteinRatio} carbs={result.carbRatio} fats={result.fatRatio} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.div 
                    className="bg-gradient-to-br from-red-500/20 to-red-500/5 p-3 rounded-xl border border-red-500/20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-[10px] text-red-400 uppercase font-semibold">Protein</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-protein-grams">{result.protein}g</div>
                    <div className="text-[10px] text-gray-500">{result.proteinRatio}% - 4kcal/g</div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-3 rounded-xl border border-blue-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] text-blue-400 uppercase font-semibold">Karbonhidrat</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-carb-grams">{result.carbs}g</div>
                    <div className="text-[10px] text-gray-500">{result.carbRatio}% - 4kcal/g</div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 p-3 rounded-xl border border-yellow-500/20"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-[10px] text-yellow-400 uppercase font-semibold">Yağ</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-fat-grams">{result.fats}g</div>
                    <div className="text-[10px] text-gray-500">{result.fatRatio}% - 9kcal/g</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Öğün Başına (3 öğün)</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-400">{Math.round(result.protein / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{Math.round(result.carbs / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Karb</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-400">{Math.round(result.fats / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Yağ</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Besin Kaynakları</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="text-gray-400">
                      <span className="text-red-400 font-semibold">Protein:</span> Tavuk, balık, yumurta, süt ürünleri
                    </div>
                    <div className="text-gray-400">
                      <span className="text-blue-400 font-semibold">Karb:</span> Pirinç, yulaf, patates, meyve
                    </div>
                    <div className="text-gray-400">
                      <span className="text-yellow-400 font-semibold">Yağ:</span> Zeytinyağı, avokado, kuruyemiş
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-macros"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <PieChart size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="makro" />
        <CalculatorFAQ title="Makro Hesaplama" faqs={macroFAQs} schemaUrl="https://gokalaf.com/araclar/makro-hesaplama" />
      </div>
    </div>
  );
}
