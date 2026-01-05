import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Droplets, RotateCcw, GlassWater, Sun, Thermometer, Sofa, Footprints, Bike, Dumbbell, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { waterIntakeFAQs } from "@/components/CalculatorFAQ";

const activityIcons = { sedentary: Sofa, light: Footprints, moderate: Bike, active: Dumbbell, athlete: Flame };
const climateIcons = { cold: Thermometer, normal: Sun, hot: Flame, veryHot: Flame };

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("normal");
  const [result, setResult] = useState<{ liters: number; glasses: number; hourly: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz", mult: 0.9 },
    light: { label: "Hafif", mult: 1.0 },
    moderate: { label: "Orta", mult: 1.15 },
    active: { label: "Aktif", mult: 1.3 },
    athlete: { label: "Sporcu", mult: 1.5 },
  };

  const climates = {
    cold: { label: "Soğuk", mult: 0.9 },
    normal: { label: "Normal", mult: 1.0 },
    hot: { label: "Sıcak", mult: 1.2 },
    veryHot: { label: "Çok Sıcak", mult: 1.4 },
  };

  const calculateWaterIntake = () => {
    let baseWater = weight * 0.033;
    baseWater *= activityLevels[activity as keyof typeof activityLevels].mult;
    baseWater *= climates[climate as keyof typeof climates].mult;

    setResult({
      liters: parseFloat(baseWater.toFixed(1)),
      glasses: Math.round(baseWater * 4),
      hourly: parseFloat((baseWater / 16).toFixed(2)),
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Günlük Su İhtiyacı Hesaplama | Su Tüketimi Hesaplayıcı - Gokalaf"
        description="Günlük su ihtiyacınızı hesaplayın. Kilo, aktivite seviyesi ve hava durumuna göre ne kadar su içmeniz gerektiğini öğrenin."
        keywords="günlük su ihtiyacı, su tüketimi hesaplama, ne kadar su içmeliyim, su hesaplayıcı, sağlıklı su tüketimi"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Su Tüketimi Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/su-tuketimi",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Hidrasyon
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Su <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">İhtiyacı</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Günlük su tüketim miktarınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Droplets className="w-4 h-4 text-blue-400" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                  <span className="text-blue-400 font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={1} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite Seviyesi</Label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(activityLevels).map(([key, val]) => {
                    const Icon = activityIcons[key as keyof typeof activityIcons];
                    return (
                      <button
                        key={key}
                        onClick={() => setActivity(key)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          activity === key 
                            ? 'bg-blue-500/20 border-blue-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-activity-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${activity === key ? 'text-blue-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">İklim</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(climates).map(([key, val]) => {
                    const Icon = climateIcons[key as keyof typeof climateIcons];
                    return (
                      <button
                        key={key}
                        onClick={() => setClimate(key)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          climate === key 
                            ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-climate-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${climate === key ? 'text-cyan-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={calculateWaterIntake} 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-water"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Günlük Su İhtiyacınız</div>
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="10" />
                      <motion.circle 
                        cx="64" cy="64" r="56" 
                        fill="none" 
                        stroke="url(#waterGradient)" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 352" }}
                        animate={{ strokeDasharray: `${(result.liters / 5) * 352} 352` }}
                        transition={{ duration: 0.8 }}
                      />
                      <defs>
                        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-400 mb-1" />
                      <div className="text-3xl font-bold font-heading text-white" data-testid="text-water-liters">{result.liters}</div>
                      <div className="text-[10px] text-gray-500">litre</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 rounded-xl border border-blue-500/20 text-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GlassWater className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Bardak</div>
                    <div className="text-2xl font-bold text-blue-400" data-testid="text-water-glasses">{result.glasses}</div>
                    <div className="text-[9px] text-gray-500">(250ml)</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-4 rounded-xl border border-cyan-500/20 text-center"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Saatlik</div>
                    <div className="text-2xl font-bold text-cyan-400" data-testid="text-water-hourly">{result.hourly}L</div>
                    <div className="text-[9px] text-gray-500">(uyanık)</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Günlük Dağılım</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {["Sabah", "Öğle", "Akşam", "Gece"].map((time, i) => (
                      <div key={time} className="p-2 bg-white/5 rounded-lg">
                        <div className="text-[9px] text-gray-500">{time}</div>
                        <div className="text-sm font-bold text-white">{Math.round(result.glasses / 4)}</div>
                        <div className="text-[8px] text-gray-600">bardak</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-water"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Droplets size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="su-tuketimi" />
        <CalculatorFAQ title="Su Tüketimi Hesaplama" faqs={waterIntakeFAQs} schemaUrl="https://gokalaf.com/araclar/su-tuketimi" />
      </div>
    </div>
  );
}
