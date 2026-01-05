import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, RotateCcw, TrendingUp, TrendingDown, Target, Zap, Activity } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { calorieFAQs } from "@/components/CalculatorFAQ";

export default function CalorieCalculator() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz", multiplier: 1.2, desc: "Masa başı iş" },
    light: { label: "Hafif Aktif", multiplier: 1.375, desc: "Haftada 1-2 gün" },
    moderate: { label: "Orta Aktif", multiplier: 1.55, desc: "Haftada 3-5 gün" },
    very: { label: "Çok Aktif", multiplier: 1.725, desc: "Haftada 6-7 gün" },
    extra: { label: "Ekstra Aktif", multiplier: 1.9, desc: "Günde 2 kez" },
  };

  const goals = {
    lose: { label: "Kilo Ver", deficit: -500, color: "text-blue-400", icon: TrendingDown },
    maintain: { label: "Koru", deficit: 0, color: "text-green-400", icon: Target },
    gain: { label: "Kas Yap", deficit: 300, color: "text-orange-400", icon: TrendingUp },
  };

  const calculateCalories = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevels[activity as keyof typeof activityLevels].multiplier;
    const targetCalories = tdee + goals[goal as keyof typeof goals].deficit;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      goal: goals[goal as keyof typeof goals].label,
      goalKey: goal,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const goalData = goals[goal as keyof typeof goals];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Günlük Kalori İhtiyacı Hesaplama | Ücretsiz Kalori Hesaplayıcı - Gokalaf"
        description="Günlük kalori ihtiyacınızı hesaplayın. Yaş, boy, kilo ve aktivite seviyenize göre kilo vermek veya almak için gereken kalori miktarını öğrenin."
        keywords="günlük kalori hesaplama, kalori ihtiyacı, kalori hesaplayıcı, kilo vermek için kalori, bazal metabolizma"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Günlük Kalori Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/kalori-hesaplama",
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
            Beslenme Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Kalori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Hedefinize göre günlük kalori ihtiyacınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Flame className="w-4 h-4 text-primary" /> Bilgileriniz
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

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-white text-sm" data-testid="select-activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([key, val]) => (
                      <SelectItem key={key} value={key}>
                        <span>{val.label}</span>
                        <span className="text-gray-500 ml-2 text-xs">({val.desc})</span>
                      </SelectItem>
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

              <Button 
                onClick={calculateCalories} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm mt-2"
                data-testid="button-calculate-calories"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Günlük Hedef Kaloriniz</div>
                  <div className="flex items-center justify-center gap-3">
                    <Flame className="w-8 h-8 text-primary" />
                    <span className="text-5xl font-bold font-heading text-white" data-testid="text-target-calories">{result.target}</span>
                    <span className="text-lg text-gray-500">kcal</span>
                  </div>
                  <Badge className={`mt-3 ${goalData.color} bg-white/5 border-white/10 font-semibold uppercase text-xs`} data-testid="badge-goal">
                    {result.goal} Hedefi
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">BMR</div>
                    <div className="text-lg font-bold text-white" data-testid="text-bmr">{result.bmr}</div>
                    <div className="text-[9px] text-gray-600">kcal/gün</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">TDEE</div>
                    <div className="text-lg font-bold text-white" data-testid="text-tdee">{result.tdee}</div>
                    <div className="text-[9px] text-gray-600">kcal/gün</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <Target className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Fark</div>
                    <div className={`text-lg font-bold ${result.goalKey === 'lose' ? 'text-blue-400' : result.goalKey === 'gain' ? 'text-orange-400' : 'text-green-400'}`}>
                      {result.goalKey === 'lose' ? '-500' : result.goalKey === 'gain' ? '+300' : '0'}
                    </div>
                    <div className="text-[9px] text-gray-600">kcal</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Kalori Dağılımı</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-400">BMR</div>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-yellow-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(result.bmr / result.target) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right text-gray-400">{Math.round((result.bmr / result.target) * 100)}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-400">Aktivite</div>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((result.tdee - result.bmr) / result.target) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right text-gray-400">{Math.round(((result.tdee - result.bmr) / result.target) * 100)}%</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Öğün Başına (3 öğün)</div>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{Math.round(result.target / 3)}</div>
                      <div className="text-[9px] text-gray-500">kcal/öğün</div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-calories"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Flame size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="kalori-hesaplama" />
        <CalculatorFAQ title="Kalori Hesaplama" faqs={calorieFAQs} schemaUrl="https://gokalaf.com/araclar/kalori-hesaplama" />
      </div>
    </div>
  );
}
