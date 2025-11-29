import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Info, Dumbbell, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface RestRecommendation {
  type: string;
  minSeconds: number;
  maxSeconds: number;
  description: string;
  icon: any;
  color: string;
}

export default function RestTimerCalculator() {
  const [trainingType, setTrainingType] = useState("");
  const [recommendation, setRecommendation] = useState<RestRecommendation | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recommendations: Record<string, RestRecommendation> = {
    strength: {
      type: "Güç Antrenmanı",
      minSeconds: 180,
      maxSeconds: 300,
      description: "Ağır yükler (1-5 tekrar) için tam ATP yenilenmesi gerekir",
      icon: Dumbbell,
      color: "red"
    },
    hypertrophy: {
      type: "Kas Geliştirme",
      minSeconds: 60,
      maxSeconds: 120,
      description: "Orta yükler (6-12 tekrar) için metabolik stres önemli",
      icon: Dumbbell,
      color: "primary"
    },
    endurance: {
      type: "Kas Dayanıklılığı",
      minSeconds: 30,
      maxSeconds: 60,
      description: "Hafif yükler (15+ tekrar) için kısa dinlenme yeterli",
      icon: Zap,
      color: "blue"
    },
    circuit: {
      type: "Devre Antrenmanı",
      minSeconds: 15,
      maxSeconds: 30,
      description: "Egzersizler arası minimum dinlenme",
      icon: Heart,
      color: "orange"
    },
    hiit: {
      type: "HIIT",
      minSeconds: 10,
      maxSeconds: 30,
      description: "Yüksek yoğunluklu interval antrenmanı",
      icon: Zap,
      color: "rose"
    },
    compound: {
      type: "Bileşik Hareketler",
      minSeconds: 120,
      maxSeconds: 180,
      description: "Squat, deadlift gibi büyük kas grupları için",
      icon: Dumbbell,
      color: "purple"
    },
    isolation: {
      type: "İzolasyon Hareketleri",
      minSeconds: 45,
      maxSeconds: 90,
      description: "Biceps curl, lateral raise gibi küçük kas grupları için",
      icon: Dumbbell,
      color: "cyan"
    }
  };

  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2NzLdTQhQpay1tGlYTlJjK3D0K5yU12EobG+sYNjXXqMnKanlYB3c4OPmZ6bk4l/eoCGjZGRjol/eX2EiY2OjIl/en2Ei46RkY6Jf3p9hIuOkpGOiX97fYOLjpKRjol/en2Ei46RkY6Jf3p9hIuOkZGOiX96fYSLjpGRjol/en2Ei46SkI6Jf3p9hIuOkZGOiX96fYSLjpKRjol/en2Ei46RkY6Jf3p9hIuOkpGOiX96fYSLjpGRj4l/en2Ei46SkY6Jf3t9hIuOkZGOiYB7fYSLjpGRjomAe32Ei46RkI6Jf3t9hIuOkZGOiYB7fYSLjpGRjomAe32EjI6RkY6JgHt9hIuOkZGOiYB7fYSMjpGRjomAe32EjI6RkY6JgHt9hIyOkZGOiYB7fYSMjpGRjomAe32EjI6RkI6JgHt9hIyOkZCOiYB8fYSMjpGRjomAe32EjI6RkY6JgHx9hIyOkZGOiYB8fYSMjpGRjomAfH2EjI6RkY6JgHx9hIyOkZGOiYB8fYSMjpGRj4mAfH2EjI6RkY6JgHx9hIyOkZGPiYB8fYSMjpGRjomAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGRj4mAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGRj4mAfH2EjI6RkY+JgHx9hIyOkZGPiYB8fYSMjpGRj4mAfH2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYSMjpGQj4mAfX2EjI6RkI+JgH19hIyOkZCPiYB9fYOMjpGQj4mAfX2DjI6RkI+JgH19g4yOkZCPiYB9fYOMjpGQj4mAfX2DjI6RkI+JgH19g4yOkZCPiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB9fYOMjpGQjomAfX2DjI6RkI6JgH19g4yOkZCOiYB9fYOMjpGQjomAfH2DjI6RkI6JgHx9g4yOkZCOiYB8fYOMjpGQjomAfHyDjI6RkI6JgHx8g4yOkZCOiYB8fIOMjpGQjomAfHyDjI6RkI6JgHx8g4yOkZCOiYB8fIOMjpGQjomAfHyDjI6RkI6JgHx8g4yOkZCOiYB7fIOMjpGQjomAe3yDjI6RkI6JgHt8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiX97fIOMjpGQjol/e3yDjI6RkI6Jf3t8g4yOkZCOiQ==");
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerSeconds, soundEnabled]);

  const handleTypeChange = (type: string) => {
    setTrainingType(type);
    const rec = recommendations[type];
    setRecommendation(rec);
    setTimerSeconds(rec.maxSeconds);
    setIsRunning(false);
  };

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const colorMap: Record<string, string> = {
    red: "from-red-500/20 to-red-500/5 border-red-500/30",
    primary: "from-primary/20 to-primary/5 border-primary/30",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/30",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30"
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/tools">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Araçlara Dön
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/30 flex items-center justify-center">
              <Timer className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-white uppercase">Dinlenme Süresi</h1>
              <p className="text-gray-400">Antrenman tipinize göre ideal dinlenme süresini öğrenin</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 mb-6"
        >
          <Label className="text-gray-400">Antrenman Tipi</Label>
          <Select value={trainingType} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-white/5 border-white/10 mt-1 h-12" data-testid="select-training-type">
              <SelectValue placeholder="Antrenman tipini seçin..." />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10">
              <SelectItem value="strength" className="text-white hover:bg-white/10">Güç Antrenmanı (1-5 tekrar)</SelectItem>
              <SelectItem value="hypertrophy" className="text-white hover:bg-white/10">Kas Geliştirme (6-12 tekrar)</SelectItem>
              <SelectItem value="endurance" className="text-white hover:bg-white/10">Kas Dayanıklılığı (15+ tekrar)</SelectItem>
              <SelectItem value="compound" className="text-white hover:bg-white/10">Bileşik Hareketler</SelectItem>
              <SelectItem value="isolation" className="text-white hover:bg-white/10">İzolasyon Hareketleri</SelectItem>
              <SelectItem value="circuit" className="text-white hover:bg-white/10">Devre Antrenmanı</SelectItem>
              <SelectItem value="hiit" className="text-white hover:bg-white/10">HIIT</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`bg-gradient-to-br ${colorMap[recommendation.color]} border rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <recommendation.icon className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">{recommendation.type}</h2>
              </div>
              <p className="text-gray-300 mb-4">{recommendation.description}</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white">
                  {formatTime(recommendation.minSeconds)} - {formatTime(recommendation.maxSeconds)}
                </Badge>
                <span className="text-gray-400 text-sm">önerilen dinlenme aralığı</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className={`text-8xl font-bold ${timerSeconds === 0 ? "text-green-400" : "text-white"} transition-colors`}>
                  {formatTime(timerSeconds)}
                </div>
                {timerSeconds === 0 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-400 text-xl mt-4 font-bold"
                  >
                    Dinlenme Tamamlandı!
                  </motion.p>
                )}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => isRunning ? setIsRunning(false) : startTimer(timerSeconds || recommendation.maxSeconds)}
                  size="lg"
                  className={`px-8 ${isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
                  data-testid="button-start-pause"
                >
                  {isRunning ? <><Pause className="w-5 h-5 mr-2" /> Durdur</> : <><Play className="w-5 h-5 mr-2" /> Başlat</>}
                </Button>
                <Button
                  onClick={() => { setTimerSeconds(recommendation.maxSeconds); setIsRunning(false); }}
                  variant="outline"
                  size="lg"
                  className="border-white/20"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="lg"
                  className="border-white/20"
                  data-testid="button-sound"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => startTimer(recommendation.minSeconds)}
                  variant="outline"
                  className="border-white/20 py-6"
                  data-testid="button-timer-min"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatTime(recommendation.minSeconds)}</div>
                    <div className="text-xs text-gray-500">Minimum</div>
                  </div>
                </Button>
                <Button
                  onClick={() => startTimer(Math.round((recommendation.minSeconds + recommendation.maxSeconds) / 2))}
                  variant="outline"
                  className="border-primary/30 bg-primary/10 py-6"
                  data-testid="button-timer-mid"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {formatTime(Math.round((recommendation.minSeconds + recommendation.maxSeconds) / 2))}
                    </div>
                    <div className="text-xs text-gray-500">Ortalama</div>
                  </div>
                </Button>
                <Button
                  onClick={() => startTimer(recommendation.maxSeconds)}
                  variant="outline"
                  className="border-white/20 py-6"
                  data-testid="button-timer-max"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatTime(recommendation.maxSeconds)}</div>
                    <div className="text-xs text-gray-500">Maksimum</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>Dinlenme süreleri ATP-PC enerji sisteminin yenilenmesi ve kas yorgunluğunun azalmasına göre optimize edilmiştir.</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
