import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dumbbell, RotateCcw, Trophy, Target } from "lucide-react";

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const [result, setResult] = useState<{
    oneRepMax: number;
    percentages: { percent: number; weight: number; reps: string }[];
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateOneRepMax = () => {
    const brzycki = weight * (36 / (37 - reps));
    const epley = weight * (1 + reps / 30);
    const lander = (100 * weight) / (101.3 - 2.67123 * reps);
    
    const oneRepMax = Math.round((brzycki + epley + lander) / 3);

    const percentages = [
      { percent: 100, weight: oneRepMax, reps: "1" },
      { percent: 95, weight: Math.round(oneRepMax * 0.95), reps: "2" },
      { percent: 90, weight: Math.round(oneRepMax * 0.90), reps: "3-4" },
      { percent: 85, weight: Math.round(oneRepMax * 0.85), reps: "5-6" },
      { percent: 80, weight: Math.round(oneRepMax * 0.80), reps: "7-8" },
      { percent: 75, weight: Math.round(oneRepMax * 0.75), reps: "9-10" },
      { percent: 70, weight: Math.round(oneRepMax * 0.70), reps: "11-12" },
      { percent: 65, weight: Math.round(oneRepMax * 0.65), reps: "13-15" },
    ];

    setResult({ oneRepMax, percentages });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Güç Analizi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            One Rep <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Max</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Kaldırdığın ağırlık ve tekrar sayısından 1RM değerini hesapla. Antrenman yoğunluğunu planla.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Dumbbell className="text-primary" /> Performansını Gir
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Kaldırdığın Ağırlık (kg)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider 
                  value={[weight]} 
                  onValueChange={(val) => setWeight(val[0])} 
                  min={10} 
                  max={300} 
                  step={2.5} 
                  className="py-4"
                  data-testid="slider-weight"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Tekrar Sayısı</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-reps-value">{reps} tekrar</span>
                </div>
                <Slider 
                  value={[reps]} 
                  onValueChange={(val) => setReps(val[0])} 
                  min={1} 
                  max={15} 
                  step={1} 
                  className="py-4"
                  data-testid="slider-reps"
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <span className="text-white font-bold">İpucu:</span> En doğru sonuç için 2-10 tekrar arasında yaptığın bir set kullan.
                  </div>
                </div>
              </div>

              <Button 
                onClick={calculateOneRepMax} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-1rm"
              >
                Hesapla
              </Button>
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
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Tahmini 1RM Değerin</div>
                
                <div className="relative">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-green-500 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Trophy className="w-16 h-16 text-black" />
                  </div>
                  <div className="mt-6">
                    <div className="text-6xl font-bold font-heading text-white" data-testid="text-1rm-result">{result.oneRepMax}</div>
                    <div className="text-xl text-gray-500">kilogram</div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-bold">Antrenman Yoğunluk Tablosu</div>
                  <div className="grid grid-cols-4 gap-2">
                    {result.percentages.map((p) => (
                      <div 
                        key={p.percent} 
                        className={`rounded-lg p-3 ${p.percent === 100 ? "bg-primary/20 border border-primary/30" : "bg-white/5"}`}
                        data-testid={`intensity-${p.percent}`}
                      >
                        <div className={`text-xs font-bold ${p.percent === 100 ? "text-primary" : "text-gray-500"}`}>%{p.percent}</div>
                        <div className="text-lg font-bold text-white">{p.weight}</div>
                        <div className="text-[10px] text-gray-500">{p.reps} rep</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs mt-4"
                  data-testid="button-reset-1rm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                <Dumbbell size={80} className="mx-auto text-white" />
                <h3 className="text-2xl font-heading font-bold uppercase text-white">Sonuç Bekleniyor</h3>
                <p className="text-gray-400">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
