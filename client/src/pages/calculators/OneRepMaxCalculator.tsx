import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dumbbell, RotateCcw, Trophy, Info } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { oneRepMaxFAQs } from "@/components/CalculatorFAQ";

const exercises = [
  { id: "bench", name: "Bench Press", icon: "🏋️" },
  { id: "squat", name: "Squat", icon: "🦵" },
  { id: "deadlift", name: "Deadlift", icon: "💪" },
  { id: "ohp", name: "Overhead Press", icon: "🙆" },
];

export default function OneRepMaxCalculator() {
  const [exercise, setExercise] = useState("bench");
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const [result, setResult] = useState<{
    oneRepMax: number;
    percentages: { percent: number; weight: number; reps: string; zone: string }[];
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateOneRepMax = () => {
    const brzycki = weight * (36 / (37 - reps));
    const epley = weight * (1 + reps / 30);
    const lander = (100 * weight) / (101.3 - 2.67123 * reps);
    
    const oneRepMax = Math.round((brzycki + epley + lander) / 3);

    const percentages = [
      { percent: 100, weight: oneRepMax, reps: "1", zone: "Maksimum" },
      { percent: 95, weight: Math.round(oneRepMax * 0.95), reps: "2", zone: "Güç" },
      { percent: 90, weight: Math.round(oneRepMax * 0.90), reps: "3-4", zone: "Güç" },
      { percent: 85, weight: Math.round(oneRepMax * 0.85), reps: "5-6", zone: "Güç/Hipertrofi" },
      { percent: 80, weight: Math.round(oneRepMax * 0.80), reps: "7-8", zone: "Hipertrofi" },
      { percent: 75, weight: Math.round(oneRepMax * 0.75), reps: "9-10", zone: "Hipertrofi" },
      { percent: 70, weight: Math.round(oneRepMax * 0.70), reps: "11-12", zone: "Dayanıklılık" },
      { percent: 65, weight: Math.round(oneRepMax * 0.65), reps: "13-15", zone: "Dayanıklılık" },
    ];

    setResult({ oneRepMax, percentages });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="1RM Hesaplama | One Rep Max Hesaplayıcı - Gokalaf"
        description="1RM (One Rep Max) hesaplayıcı ile maksimum kaldırabileceğiniz ağırlığı hesaplayın. Antrenman yüzdelerinizi öğrenin."
        keywords="1rm hesaplama, one rep max, maksimum ağırlık, bench press 1rm, squat 1rm, güç antrenmanı"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "1RM Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/one-rep-max",
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
            Güç Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            One Rep <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Max</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Maksimum kaldırabileceğiniz ağırlığı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Dumbbell className="w-4 h-4 text-primary" /> Performansınız
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Egzersiz</Label>
                <div className="grid grid-cols-4 gap-2">
                  {exercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setExercise(ex.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        exercise === ex.id 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                      data-testid={`button-exercise-${ex.id}`}
                    >
                      <div className="text-lg mb-0.5">{ex.icon}</div>
                      <div className="text-[8px] font-semibold uppercase leading-tight">{ex.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Ağırlık</Label>
                  <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={10} max={300} step={2.5} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Tekrar Sayısı</Label>
                  <span className="text-primary font-bold" data-testid="text-reps-value">{reps}</span>
                </div>
                <Slider value={[reps]} onValueChange={(val) => setReps(val[0])} min={1} max={15} step={1} className="py-1" data-testid="slider-reps" />
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-gray-400">En doğru sonuç için 2-10 tekrar arasında yaptığın bir set kullan.</p>
              </div>

              <Button 
                onClick={calculateOneRepMax} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-1rm"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                    {exercises.find(e => e.id === exercise)?.name} 1RM
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-green-500 flex items-center justify-center shadow-lg shadow-primary/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Trophy className="w-8 h-8 text-black" />
                    </motion.div>
                    <div>
                      <div className="text-4xl font-bold font-heading text-white" data-testid="text-1rm-result">{result.oneRepMax}</div>
                      <div className="text-sm text-gray-500">kilogram</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider text-center">Antrenman Yoğunluk Tablosu</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {result.percentages.map((p, i) => (
                      <motion.div 
                        key={p.percent} 
                        className={`rounded-lg p-2 text-center ${p.percent === 100 ? "bg-primary/20 border border-primary/30" : "bg-white/5"}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        data-testid={`intensity-${p.percent}`}
                      >
                        <div className={`text-[10px] font-bold ${p.percent === 100 ? "text-primary" : "text-gray-500"}`}>%{p.percent}</div>
                        <div className="text-lg font-bold text-white">{p.weight}</div>
                        <div className="text-[9px] text-gray-500">{p.reps} rep</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Antrenman Bölgeleri</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-xs font-bold text-red-400">Güç</div>
                      <div className="text-[9px] text-gray-500">%85-100 · 1-6 rep</div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-xs font-bold text-blue-400">Hipertrofi</div>
                      <div className="text-[9px] text-gray-500">%70-85 · 6-12 rep</div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-xs font-bold text-green-400">Dayanıklılık</div>
                      <div className="text-[9px] text-gray-500">%50-70 · 12+ rep</div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-1rm"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Dumbbell size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="bir-tekrar-max" />
        <CalculatorFAQ title="1RM Hesaplama" faqs={oneRepMaxFAQs} schemaUrl="https://gokalaf.com/araclar/one-rep-max" />
      </div>
    </div>
  );
}
