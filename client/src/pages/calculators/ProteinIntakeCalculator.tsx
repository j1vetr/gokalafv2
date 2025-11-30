import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Beef, Save, Info, Target, Dumbbell, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ProteinResult {
  minimum: number;
  optimal: number;
  maximum: number;
  perMeal: number;
  meals: number;
}

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activity, setActivity] = useState("");
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0 || !goal || !activity) return;

    let minMultiplier = 0.8;
    let optMultiplier = 1.2;
    let maxMultiplier = 1.6;

    if (goal === "muscle") {
      minMultiplier = 1.6;
      optMultiplier = 2.0;
      maxMultiplier = 2.4;
    } else if (goal === "fat-loss") {
      minMultiplier = 1.2;
      optMultiplier = 1.6;
      maxMultiplier = 2.0;
    } else if (goal === "maintenance") {
      minMultiplier = 0.8;
      optMultiplier = 1.2;
      maxMultiplier = 1.6;
    } else if (goal === "endurance") {
      minMultiplier = 1.2;
      optMultiplier = 1.4;
      maxMultiplier = 1.8;
    }

    if (activity === "sedentary") {
      minMultiplier *= 0.9;
      optMultiplier *= 0.9;
      maxMultiplier *= 0.9;
    } else if (activity === "moderate") {
      // Keep as is
    } else if (activity === "active") {
      minMultiplier *= 1.1;
      optMultiplier *= 1.1;
      maxMultiplier *= 1.1;
    } else if (activity === "very-active") {
      minMultiplier *= 1.2;
      optMultiplier *= 1.2;
      maxMultiplier *= 1.2;
    }

    const meals = 4;
    const optimal = Math.round(weightNum * optMultiplier);

    setResult({
      minimum: Math.round(weightNum * minMultiplier),
      optimal,
      maximum: Math.round(weightNum * maxMultiplier),
      perMeal: Math.round(optimal / meals),
      meals
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const saveResult = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await fetch("/api/calculator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          calculatorType: "protein",
          inputData: { weight: parseFloat(weight), goal, activity },
          resultData: result
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Kaydetme hatası:", error);
    } finally {
      setSaving(false);
    }
  };

  const goalDescriptions: Record<string, string> = {
    muscle: "Kas yapımı için yüksek protein alımı önerilir",
    "fat-loss": "Yağ yakımında kas korumak için orta-yüksek protein",
    maintenance: "Genel sağlık için standart protein alımı",
    endurance: "Dayanıklılık sporcuları için optimize edilmiş"
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/araclar">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Araçlara Dön
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/30 flex items-center justify-center">
              <Beef className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-white uppercase">Protein İhtiyacı</h1>
              <p className="text-gray-400">Hedefinize göre günlük protein ihtiyacınızı hesaplayın</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="space-y-6">
            <div>
              <Label className="text-gray-400">Kilo (kg)</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Örn: 75"
                className="bg-white/5 border-white/10 mt-1 text-lg h-12"
                data-testid="input-weight"
              />
            </div>

            <div>
              <Label className="text-gray-400">Hedefiniz</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="bg-white/5 border-white/10 mt-1 h-12" data-testid="select-goal">
                  <SelectValue placeholder="Hedef seçin..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10">
                  <SelectItem value="muscle" className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-primary" />
                      Kas Yapımı
                    </div>
                  </SelectItem>
                  <SelectItem value="fat-loss" className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      Yağ Yakımı
                    </div>
                  </SelectItem>
                  <SelectItem value="maintenance" className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      Kilo Koruma
                    </div>
                  </SelectItem>
                  <SelectItem value="endurance" className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      Dayanıklılık
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-400">Aktivite Seviyesi</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger className="bg-white/5 border-white/10 mt-1 h-12" data-testid="select-activity">
                  <SelectValue placeholder="Aktivite seviyesi seçin..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10">
                  <SelectItem value="sedentary" className="text-white hover:bg-white/10">Sedanter (Masa başı iş)</SelectItem>
                  <SelectItem value="moderate" className="text-white hover:bg-white/10">Orta (Haftada 3-4 antrenman)</SelectItem>
                  <SelectItem value="active" className="text-white hover:bg-white/10">Aktif (Haftada 5-6 antrenman)</SelectItem>
                  <SelectItem value="very-active" className="text-white hover:bg-white/10">Çok Aktif (Günlük yoğun antrenman)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={calculate}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 text-lg"
            disabled={!weight || !goal || !activity}
            data-testid="button-calculate"
          >
            Hesapla
          </Button>
        </motion.div>

        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-2">Önerilen Günlük Protein</p>
                <p className="text-6xl font-bold text-amber-400">{result.optimal}g</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase">Minimum</p>
                  <p className="text-2xl font-bold text-white">{result.minimum}g</p>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-400 uppercase">Optimal</p>
                  <p className="text-2xl font-bold text-amber-400">{result.optimal}g</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase">Maksimum</p>
                  <p className="text-2xl font-bold text-white">{result.maximum}g</p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Beef className="w-5 h-5" />
                  <span className="font-bold">Öğün Başına</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ~{result.perMeal}g <span className="text-sm text-gray-400">({result.meals} öğün)</span>
                </p>
              </div>

              {goal && (
                <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{goalDescriptions[goal]}</span>
                </div>
              )}
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Protein Kaynakları</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Tavuk Göğsü", protein: "31g/100g" },
                  { name: "Yumurta", protein: "13g/100g" },
                  { name: "Yoğurt", protein: "10g/100g" },
                  { name: "Ton Balığı", protein: "26g/100g" },
                  { name: "Mercimek", protein: "9g/100g" },
                  { name: "Peynir", protein: "25g/100g" },
                  { name: "Kırmızı Et", protein: "26g/100g" },
                  { name: "Whey Protein", protein: "80g/100g" }
                ].map((item) => (
                  <div key={item.name} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-sm text-white font-medium">{item.name}</p>
                    <p className="text-xs text-amber-400">{item.protein}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={saveResult}
              disabled={saving || saved}
              className="w-full mt-6 bg-primary text-black hover:bg-primary/90 font-bold py-4"
              data-testid="button-save"
            >
              {saved ? "✓ Kaydedildi" : saving ? "Kaydediliyor..." : <><Save className="w-4 h-4 mr-2" /> Sonucu Kaydet</>}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
