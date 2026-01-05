import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Beef, RotateCcw, Target, Dumbbell, Scale, Zap, Utensils } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { proteinIntakeFAQs } from "@/components/CalculatorFAQ";

const goals = [
  { id: "muscle", label: "Kas Yap", icon: Dumbbell, mult: { min: 1.6, opt: 2.0, max: 2.4 } },
  { id: "fat-loss", label: "Yağ Yak", icon: Target, mult: { min: 1.2, opt: 1.6, max: 2.0 } },
  { id: "maintenance", label: "Koru", icon: Scale, mult: { min: 0.8, opt: 1.2, max: 1.6 } },
  { id: "endurance", label: "Dayanıklılık", icon: Zap, mult: { min: 1.2, opt: 1.4, max: 1.8 } },
];

const activities = [
  { id: "sedentary", label: "Hareketsiz", mult: 0.9 },
  { id: "moderate", label: "Orta", mult: 1.0 },
  { id: "active", label: "Aktif", mult: 1.1 },
  { id: "very-active", label: "Çok Aktif", mult: 1.2 },
];

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState(75);
  const [goal, setGoal] = useState("muscle");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<{ min: number; opt: number; max: number; perMeal: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const goalData = goals.find(g => g.id === goal)!;
    const activityData = activities.find(a => a.id === activity)!;

    const min = Math.round(weight * goalData.mult.min * activityData.mult);
    const opt = Math.round(weight * goalData.mult.opt * activityData.mult);
    const max = Math.round(weight * goalData.mult.max * activityData.mult);

    setResult({ min, opt, max, perMeal: Math.round(opt / 4) });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Günlük Protein İhtiyacı Hesaplama | Protein Hesaplayıcı - Gokalaf"
        description="Günlük protein ihtiyacınızı hesaplayın. Kilonuz ve aktivite seviyenize göre kas yapmak için gereken protein miktarını öğrenin."
        keywords="protein ihtiyacı hesaplama, günlük protein, kas yapmak için protein, protein hesaplayıcı, spor beslenme"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Protein İhtiyacı Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/protein-ihtiyaci",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Beslenme
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Protein <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">İhtiyacı</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Hedefinize göre günlük protein ihtiyacınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Beef className="w-4 h-4 text-amber-400" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                  <span className="text-amber-400 font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={1} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Hedefiniz</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {goals.map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          goal === g.id 
                            ? 'bg-amber-500/20 border-amber-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-goal-${g.id}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${goal === g.id ? 'text-amber-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {activities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setActivity(a.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        activity === a.id 
                          ? 'bg-orange-500/20 border-orange-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                      data-testid={`button-activity-${a.id}`}
                    >
                      <div className="text-[9px] font-semibold uppercase leading-tight">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculate} 
                className="w-full bg-amber-500 text-black hover:bg-amber-600 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-protein"
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
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Önerilen Günlük Protein</div>
                  <div className="flex items-center justify-center gap-2">
                    <Beef className="w-6 h-6 text-amber-400" />
                    <span className="text-5xl font-bold font-heading text-amber-400" data-testid="text-protein-result">{result.opt}g</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-[10px] text-gray-500 uppercase">Minimum</div>
                    <div className="text-xl font-bold text-white" data-testid="text-protein-min">{result.min}g</div>
                  </motion.div>
                  <motion.div 
                    className="bg-amber-500/20 rounded-xl p-3 text-center border border-amber-500/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="text-[10px] text-amber-400 uppercase">Optimal</div>
                    <div className="text-xl font-bold text-amber-400">{result.opt}g</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-[10px] text-gray-500 uppercase">Maksimum</div>
                    <div className="text-xl font-bold text-white" data-testid="text-protein-max">{result.max}g</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Öğün Başına (4 Öğün)</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["Kahvaltı", "Öğle", "Akşam", "Ara"].map((meal, i) => (
                      <div key={meal} className="text-center p-2 bg-white/5 rounded-lg">
                        <div className="text-[9px] text-gray-500">{meal}</div>
                        <div className="text-lg font-bold text-white">{result.perMeal}g</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Protein Kaynakları</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400">
                    <div>Tavuk Göğsü (31g/100g)</div>
                    <div>Yumurta (6g/adet)</div>
                    <div>Greek Yoğurt (10g/100g)</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-protein"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Beef size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="protein-ihtiyaci" />
        <CalculatorFAQ title="Protein İhtiyacı Hesaplama" faqs={proteinIntakeFAQs} schemaUrl="https://gokalaf.com/araclar/protein-ihtiyaci" />
      </div>
    </div>
  );
}
