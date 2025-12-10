import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { tdeeFAQs } from "@/components/CalculatorFAQ";

export default function TDEECalculator() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz (ofis işi, hiç spor yok)", multiplier: 1.2 },
    light: { label: "Hafif Aktif (haftada 1-3 gün hafif egzersiz)", multiplier: 1.375 },
    moderate: { label: "Orta Aktif (haftada 3-5 gün orta şiddette)", multiplier: 1.55 },
    very: { label: "Çok Aktif (haftada 6-7 gün yoğun egzersiz)", multiplier: 1.725 },
    extra: { label: "Ekstra Aktif (günde 2 kez antrenman)", multiplier: 1.9 },
  };

  const calculateTDEE = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevels[activity as keyof typeof activityLevels].multiplier;

    const maintain = Math.round(tdee);
    const mildLoss = Math.round(tdee - 250);
    const weightLoss = Math.round(tdee - 500);
    const mildGain = Math.round(tdee + 250);
    const weightGain = Math.round(tdee + 500);

    setResult({
      bmr: Math.round(bmr),
      tdee: maintain,
      mildLoss,
      weightLoss,
      mildGain,
      weightGain,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <SEO
        title="TDEE Hesaplama | Toplam Günlük Enerji Harcaması Hesaplayıcı - Gokalaf"
        description="TDEE (Toplam Günlük Enerji Harcaması) hesaplayıcı ile metabolizmanızı ve günlük yakmanız gereken kaloriyi öğrenin. Ücretsiz TDEE hesaplama."
        keywords="tdee hesaplama, günlük enerji harcaması, metabolizma hesaplama, tdee nedir, kalori yakma hesaplama"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "TDEE Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/tdee-hesaplama",
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
            Enerji Analizi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            TDEE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Total Daily Energy Expenditure - günlük toplam enerji harcamanızı hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Zap className="text-primary" /> Verilerini Gir
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

              <Button 
                onClick={calculateTDEE} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-tdee"
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
                className="space-y-6 w-full relative z-10"
              >
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold mb-4">Günlük Enerji Harcamanız</div>
                  <div className="text-6xl font-bold font-heading text-white mb-2" data-testid="text-tdee-result">{result.tdee}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">kcal / gün</div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bazal Metabolizma (BMR)</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-bmr">{result.bmr} kcal</div>
                  </div>

                  <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                    <div className="text-xs text-red-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                      Kilo Verme (-500 kcal/gün)
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-weight-loss">{result.weightLoss} kcal</div>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20">
                    <div className="text-xs text-yellow-400 uppercase tracking-wider mb-1">Hafif Kilo Verme (-250 kcal/gün)</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-mild-loss">{result.mildLoss} kcal</div>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                    <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Hafif Kilo Alma (+250 kcal/gün)</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-mild-gain">{result.mildGain} kcal</div>
                  </div>

                  <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                    <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Kas Yapma (+500 kcal/gün)</div>
                    <div className="text-2xl font-bold text-white" data-testid="text-weight-gain">{result.weightGain} kcal</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full mt-6"
                  data-testid="button-reset-tdee"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                 <Zap size={80} className="mx-auto text-white" />
                 <h3 className="text-2xl font-heading font-bold uppercase text-white">Sonuç Bekleniyor</h3>
                 <p className="text-gray-400">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="tdee-hesaplama" />
        <CalculatorFAQ title="TDEE Hesaplama" faqs={tdeeFAQs} schemaUrl="https://gokalaf.com/araclar/tdee-hesaplama" />
      </div>
    </div>
  );
}
