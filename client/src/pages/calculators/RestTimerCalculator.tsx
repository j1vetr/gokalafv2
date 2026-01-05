import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Dumbbell, Zap, Heart, Target, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { waistHipFAQs } from "@/components/CalculatorFAQ";

const trainingTypes = [
  { id: "strength", label: "Güç", icon: Dumbbell, min: 180, max: 300, color: "red", desc: "1-5 tekrar" },
  { id: "hypertrophy", label: "Hipertrofi", icon: Target, min: 60, max: 120, color: "primary", desc: "6-12 tekrar" },
  { id: "endurance", label: "Dayanıklılık", icon: Heart, min: 30, max: 60, color: "blue", desc: "15+ tekrar" },
  { id: "hiit", label: "HIIT", icon: Zap, min: 10, max: 30, color: "orange", desc: "Sprint" },
  { id: "compound", label: "Bileşik", icon: Dumbbell, min: 120, max: 180, color: "purple", desc: "Squat/Deadlift" },
  { id: "isolation", label: "İzolasyon", icon: Flame, min: 45, max: 90, color: "cyan", desc: "Bicep/Tricep" },
];

const colorMap: Record<string, string> = {
  red: "bg-red-500/20 border-red-500/30 text-red-400",
  primary: "bg-primary/20 border-primary/30 text-primary",
  blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
};

export default function RestTimerCalculator() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2NzLdTQhQpay1tGlYTlJjK3D0K5yU12EobG+sYNjXXqMnKanlYB3c4OPmZ6bk4l/eoCGjZGRjol/eX2EiY2OjIl/en2Ei46RkY6Jf3p9hIuOkpGOiX97fYOLjpKRjol/en2Ei46RkY6Jf3p9hIuOkZGOiX96fYSLjpGRjol/en2Ei46SkI6Jf3p9hIuOkZGOiX96fYSLjpKRjol/en2Ei46RkY6Jf3p9hIuOkpGOiX96fYSLjpGRj4l/en2Ei46SkY6Jf3t9hIuOkZGOiYB7fYSLjpGRjomAe32Ei46RkI6Jf3t9hIuOkZGOiYB7fYSLjpGRjomAe32EjI6RkY6JgHt9hIuOkZGOiYB7fYSMjpGRjomAe32EjI6RkY6JgHt9hIyOkZGOiYB7fYSMjpGRjomAe32EjI6RkI6JgHt9hIyOkZCOiYB8fYSMjpGRjomAe32EjI6RkY6JgHx9hIyOkZGOiYB8fYSMjpGRjomAfH2EjI6RkY6JgHx9hIyOkZGOiYB8fYSMjpGRj4mAfH2EjI6RkY6JgHx9hIyOkZGPiYB8fYSMjpGRjomAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGRj4mAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGRj4mAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYOMjpGQj4mAfX2DjI6RkI+JgH19g4yOkZCPiYB9fYOMjpGQj4mAfX2DjI6RkI+JgH19g4yOkZCPiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB8fYOMjpGQjomAfHyDjI6RkI6JgHx8g4yOkZCOiYB8fIOMjpGQjomAfHyDjI6RkI6JgHx8g4yOkZCOiYB8fIOMjpGQjomAfHyDjI6RkI6JgHt8g4yOkZCOiYB7fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yD");
  }, []);

  useEffect(() => {
    if (isRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled && audioRef.current) {
              audioRef.current.play();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timerSeconds, soundEnabled]);

  const handleTypeSelect = (id: string) => {
    const type = trainingTypes.find(t => t.id === id)!;
    setSelectedType(id);
    setTimerSeconds(type.max);
    setIsRunning(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentType = trainingTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Dinlenme Süresi Zamanlayıcı | Antrenman Dinlenme Hesaplayıcı - Gokalaf"
        description="Antrenman tipinize göre ideal dinlenme süresini öğrenin ve zamanlayıcı ile takip edin. Güç, hipertrofi, dayanıklılık için dinlenme süreleri."
        keywords="dinlenme süresi, antrenman dinlenme, set arası dinlenme, güç antrenmanı dinlenme, hipertrofi dinlenme"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Dinlenme Süresi Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/dinlenme-suresi",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Zamanlayıcı
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Dinlenme <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Süresi</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Antrenman tipine göre ideal dinlenme süresini belirleyin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Timer className="w-4 h-4 text-teal-400" /> Antrenman Tipi
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {trainingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedType === type.id 
                        ? `${colorMap[type.color]} border-2` 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                    data-testid={`button-type-${type.id}`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${selectedType === type.id ? '' : 'text-gray-500'}`} />
                    <div className="text-xs font-semibold uppercase">{type.label}</div>
                    <div className="text-[9px] text-gray-500">{type.desc}</div>
                  </button>
                );
              })}
            </div>

            {currentType && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                <div className="text-[10px] text-gray-500 uppercase mb-1">Önerilen Aralık</div>
                <div className="text-lg font-bold text-white">
                  {formatTime(currentType.min)} - {formatTime(currentType.max)}
                </div>
              </div>
            )}
          </div>

          <div ref={resultRef} className="lg:col-span-3 bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col justify-center">
            {currentType ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">{currentType.label} Dinlenme</div>
                  
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(20,184,166,0.2)" strokeWidth="8" />
                      <motion.circle 
                        cx="80" cy="80" r="70" 
                        fill="none" 
                        stroke="#14B8A6"
                        strokeWidth="8" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 440" }}
                        animate={{ strokeDasharray: `${(timerSeconds / currentType.max) * 440} 440` }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-5xl font-bold font-heading ${timerSeconds === 0 ? "text-green-400" : "text-white"}`} data-testid="text-timer">
                        {formatTime(timerSeconds)}
                      </div>
                      {timerSeconds === 0 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs text-green-400 font-bold uppercase"
                        >
                          Tamamlandı!
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => isRunning ? setIsRunning(false) : setIsRunning(true)}
                    size="lg"
                    className={`px-6 ${isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
                    data-testid="button-start-pause"
                  >
                    {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Durdur</> : <><Play className="w-4 h-4 mr-2" /> Başlat</>}
                  </Button>
                  <Button
                    onClick={() => { setTimerSeconds(currentType.max); setIsRunning(false); }}
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid="button-reset-timer"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Sıfırla
                  </Button>
                  <Button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    data-testid="button-sound-toggle"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => { setTimerSeconds(currentType.min); setIsRunning(false); }}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-400 hover:bg-white/10"
                    data-testid="button-set-min"
                  >
                    Min: {formatTime(currentType.min)}
                  </Button>
                  <Button
                    onClick={() => { setTimerSeconds(currentType.max); setIsRunning(false); }}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-gray-400 hover:bg-white/10"
                    data-testid="button-set-max"
                  >
                    Max: {formatTime(currentType.max)}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Timer size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Tip Seçin</h3>
                <p className="text-xs text-gray-400">Antrenman tipinizi seçerek başlayın</p>
              </div>
            )}
          </div>
        </div>

        <RelatedCalculators currentSlug="dinlenme" />
        <CalculatorFAQ title="Dinlenme Süresi Hesaplama" faqs={waistHipFAQs} schemaUrl="https://gokalaf.com/araclar/dinlenme-suresi" />
      </div>
    </div>
  );
}
