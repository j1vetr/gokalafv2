import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, RotateCcw, GlassWater, Sun, Moon } from "lucide-react";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("normal");
  const [result, setResult] = useState<{
    liters: number;
    glasses: number;
    hourly: number;
    tips: string[];
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateWaterIntake = () => {
    let baseWater = weight * 0.033;
    
    const activityMultipliers: Record<string, number> = {
      sedentary: 0.9,
      light: 1.0,
      moderate: 1.15,
      active: 1.3,
      athlete: 1.5
    };
    
    const climateMultipliers: Record<string, number> = {
      cold: 0.9,
      normal: 1.0,
      hot: 1.2,
      veryHot: 1.4
    };

    baseWater *= activityMultipliers[activity] || 1;
    baseWater *= climateMultipliers[climate] || 1;

    const liters = parseFloat(baseWater.toFixed(1));
    const glasses = Math.round(liters * 4);
    const hourly = parseFloat((liters / 16).toFixed(2));

    const tips: string[] = [];
    if (activity === "athlete" || activity === "active") {
      tips.push("Antrenman öncesi ve sonrası ekstra 500ml su iç");
    }
    if (climate === "hot" || climate === "veryHot") {
      tips.push("Sıcak havalarda elektrolit takviyesi düşün");
    }
    tips.push("Sabah kalktığında bir bardak su ile güne başla");
    tips.push("Yemeklerden 30 dk önce su içmeyi alışkanlık edin");

    setResult({ liters, glasses, hourly, tips });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const activityLabels: Record<string, string> = {
    sedentary: "Hareketsiz (Masa başı iş)",
    light: "Hafif (Günlük yürüyüş)",
    moderate: "Orta (Haftada 3-4 antrenman)",
    active: "Aktif (Günlük antrenman)",
    athlete: "Sporcu (Yoğun antrenman)"
  };

  const climateLabels: Record<string, string> = {
    cold: "Soğuk İklim",
    normal: "Normal İklim",
    hot: "Sıcak İklim",
    veryHot: "Çok Sıcak / Nemli"
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Hidrasyon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Su <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">İhtiyacı</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Kilonuza, aktivite seviyenize ve yaşadığınız iklime göre günlük su ihtiyacınızı hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Droplets className="text-blue-400" /> Bilgilerini Gir
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Kilonuz (kg)</Label>
                  <span className="text-blue-400 font-bold text-lg" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider 
                  value={[weight]} 
                  onValueChange={(val) => setWeight(val[0])} 
                  min={40} 
                  max={150} 
                  step={1} 
                  className="py-4"
                  data-testid="slider-weight"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Aktivite Seviyesi</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-activity">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">İklim / Hava Durumu</Label>
                <Select value={climate} onValueChange={setClimate}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-climate">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(climateLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateWaterIntake} 
                size="lg" 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-water"
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
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Günlük Su İhtiyacın</div>
                
                <div className="relative">
                  <div className="w-40 h-40 mx-auto relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="12" />
                      <circle 
                        cx="80" cy="80" r="70" 
                        fill="none" 
                        stroke="url(#waterGradient)" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        strokeDasharray={`${(result.liters / 5) * 440} 440`}
                      />
                      <defs>
                        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Droplets className="w-8 h-8 text-blue-400 mb-1" />
                      <div className="text-4xl font-bold font-heading text-white" data-testid="text-water-liters">{result.liters}</div>
                      <div className="text-sm text-gray-500">litre</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                    <GlassWater className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-500 uppercase mb-1">Bardak</div>
                    <div className="text-2xl font-bold text-blue-400" data-testid="text-water-glasses">{result.glasses}</div>
                    <div className="text-xs text-gray-500">(250ml)</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex justify-center gap-1 mb-2">
                      <Sun className="w-4 h-4 text-yellow-400" />
                      <Moon className="w-4 h-4 text-blue-300" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Saatlik</div>
                    <div className="text-2xl font-bold text-cyan-400" data-testid="text-water-hourly">{result.hourly}L</div>
                    <div className="text-xs text-gray-500">(uyanık)</div>
                  </div>
                </div>

                <div className="mt-6 text-left">
                  <div className="text-xs text-gray-500 uppercase mb-3 font-bold">Öneriler</div>
                  <div className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <Droplets className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs mt-4"
                  data-testid="button-reset-water"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                <Droplets size={80} className="mx-auto text-white" />
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
