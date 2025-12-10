import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, RotateCcw, TrendingUp, TrendingDown, Target } from "lucide-react";
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
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Beslenme Analizi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Kalori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Hedefinize göre günlük almanız gereken kalori miktarını hesaplayın.
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

              <Button 
                onClick={calculateCalories} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-calories"
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
                className="space-y-8 w-full relative z-10"
              >
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Günlük Kalori İhtiyacınız</div>
                
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border-[12px] opacity-10 border-primary"></div>
                   <div className="absolute inset-0 rounded-full border-t-[12px] border-l-[12px] border-primary animate-spin-slow duration-[3s]"></div>
                   <div className="text-center">
                     <div className="text-5xl font-bold font-heading text-white" data-testid="text-target-calories">{result.target}</div>
                     <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">kcal</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">BMR</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-bmr">{result.bmr} kcal</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">TDEE</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-tdee">{result.tdee} kcal</div>
                  </div>
                </div>

                <Badge className="text-xl px-6 py-2 bg-primary text-black hover:bg-primary border-none font-bold uppercase" data-testid="badge-goal">
                  {goal === "lose" && <TrendingDown className="w-5 h-5 mr-2" />}
                  {goal === "maintain" && <Target className="w-5 h-5 mr-2" />}
                  {goal === "gain" && <TrendingUp className="w-5 h-5 mr-2" />}
                  {result.goal}
                </Badge>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs"
                  data-testid="button-reset-calories"
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

        <RelatedCalculators currentSlug="kalori-hesaplama" />
        <CalculatorFAQ title="Kalori Hesaplama" faqs={calorieFAQs} schemaUrl="https://gokalaf.com/araclar/kalori-hesaplama" />
      </div>
    </div>
  );
}
