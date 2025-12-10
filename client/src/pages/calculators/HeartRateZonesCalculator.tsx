import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Save, Info } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";

interface HeartRateZone {
  name: string;
  minBpm: number;
  maxBpm: number;
  description: string;
  color: string;
  percentage: string;
}

export default function HeartRateZonesCalculator() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [zones, setZones] = useState<HeartRateZone[] | null>(null);
  const [maxHR, setMaxHR] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateZones = () => {
    const ageNum = parseInt(age);
    const restingHRNum = parseInt(restingHR) || 60;
    
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) return;

    const maxHeartRate = 220 - ageNum;
    setMaxHR(maxHeartRate);

    const heartRateReserve = maxHeartRate - restingHRNum;

    const calculateZone = (lowPct: number, highPct: number) => {
      return {
        min: Math.round(restingHRNum + heartRateReserve * lowPct),
        max: Math.round(restingHRNum + heartRateReserve * highPct)
      };
    };

    const zone1 = calculateZone(0.5, 0.6);
    const zone2 = calculateZone(0.6, 0.7);
    const zone3 = calculateZone(0.7, 0.8);
    const zone4 = calculateZone(0.8, 0.9);
    const zone5 = calculateZone(0.9, 1.0);

    const calculatedZones: HeartRateZone[] = [
      {
        name: "Bölge 1 - Toparlanma",
        minBpm: zone1.min,
        maxBpm: zone1.max,
        description: "Hafif aktivite, ısınma ve soğuma",
        color: "blue",
        percentage: "50-60%"
      },
      {
        name: "Bölge 2 - Yağ Yakımı",
        minBpm: zone2.min,
        maxBpm: zone2.max,
        description: "Dayanıklılık geliştirme, yağ yakımı",
        color: "green",
        percentage: "60-70%"
      },
      {
        name: "Bölge 3 - Aerobik",
        minBpm: zone3.min,
        maxBpm: zone3.max,
        description: "Kardiyovasküler fitness, dayanıklılık",
        color: "yellow",
        percentage: "70-80%"
      },
      {
        name: "Bölge 4 - Anaerobik",
        minBpm: zone4.min,
        maxBpm: zone4.max,
        description: "Yüksek yoğunluklu antrenman, hız",
        color: "orange",
        percentage: "80-90%"
      },
      {
        name: "Bölge 5 - Maksimum",
        minBpm: zone5.min,
        maxBpm: zone5.max,
        description: "Maksimum efor, sprint antrenmanı",
        color: "red",
        percentage: "90-100%"
      }
    ];

    setZones(calculatedZones);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const saveResult = async () => {
    if (!zones) return;
    setSaving(true);
    try {
      await fetch("/api/calculator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          calculatorType: "heartRate",
          inputData: { age: parseInt(age), restingHR: parseInt(restingHR) || 60 },
          resultData: { maxHR, zones }
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

  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400"
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Kalp Atış Hızı Bölgeleri Hesaplama | Antrenman Nabız Hesaplayıcı - Gokalaf"
        description="Kalp atış hızı bölgelerinizi hesaplayın. Yağ yakma, kardiyo ve maksimum performans için ideal nabız aralıklarınızı öğrenin."
        keywords="kalp atış hızı hesaplama, nabız bölgeleri, yağ yakma nabzı, kardiyo kalp atış hızı, antrenman nabız"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Kalp Atış Hızı Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/kalp-atis-hizi",
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
        <Link href="/araclar">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Araçlara Dön
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/30 flex items-center justify-center">
              <Heart className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-white uppercase">Kalp Hızı Bölgeleri</h1>
              <p className="text-gray-400">Karvonen formülüyle antrenman bölgelerini hesaplayın</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-400">Yaş</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Örn: 30"
                className="bg-white/5 border-white/10 mt-1 text-lg h-12"
                data-testid="input-age"
              />
            </div>
            <div>
              <Label className="text-gray-400">Dinlenme Kalp Hızı (opsiyonel)</Label>
              <Input
                type="number"
                value={restingHR}
                onChange={(e) => setRestingHR(e.target.value)}
                placeholder="Örn: 60 (varsayılan)"
                className="bg-white/5 border-white/10 mt-1 text-lg h-12"
                data-testid="input-resting-hr"
              />
            </div>
          </div>

          <Button
            onClick={calculateZones}
            className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-6 text-lg"
            disabled={!age}
            data-testid="button-calculate"
          >
            Hesapla
          </Button>
        </motion.div>

        {zones && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6">
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm">Maksimum Kalp Hızı</p>
                <p className="text-5xl font-bold text-rose-400">{maxHR} <span className="text-xl text-gray-400">BPM</span></p>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>Karvonen formülü kullanılarak hesaplandı: THR = ((Max HR - Rest HR) x %Intensity) + Rest HR</span>
              </div>
            </div>

            <div className="space-y-3">
              {zones.map((zone, i) => (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-r ${colorMap[zone.color]} border rounded-xl p-5`}
                  data-testid={`zone-${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">{zone.name}</h3>
                    <Badge className={`bg-${zone.color}-500/30 ${colorMap[zone.color].split(' ').pop()}`}>
                      {zone.percentage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">{zone.description}</p>
                    <p className="text-2xl font-bold text-white">
                      {zone.minBpm} - {zone.maxBpm} <span className="text-sm text-gray-400">BPM</span>
                    </p>
                  </div>
                </motion.div>
              ))}
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

        <RelatedCalculators currentSlug="kalp-atis-hizi" />
      </div>
    </div>
  );
}
