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

        {/* İçerik Bölümü 1: Dinlenme Süresi Neden Önemlidir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Setler Arası Dinlenme <span className="text-primary">Neden Önemlidir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Setler arası dinlenme süresi, antrenman programlamasının en sık göz ardı edilen ancak en belirleyici değişkenlerinden biridir. Doğru dinlenme süresini seçmek; performansı, kas uyarımını, hormonsal yanıtı ve enerji sistemlerinin kullanımını doğrudan etkiler. "Ne kadar dinlenmeliyim?" sorusunun yanıtı ise hedef, egzersiz türü ve bireysel toparlanma kapasitesine göre değişir.
            </p>
            <p>
              Dinlenmenin fizyolojik temeli <strong className="text-white">ATP-PCr (fosfokreatin) sisteminin yenilenmesine</strong> dayanır. Yüksek yoğunluklu kısa süreli egzersizlerde (ağır kaldırma, sprintle vb.) birincil enerji kaynağı olan PCr, kas hücrelerinde sınırlı miktarda depolanır ve kasılmalar sırasında hızla tükenir. Tam yenilenmesi için yaklaşık <strong className="text-white">3-5 dakika</strong> gerekmektedir. Kısa dinlenme süreleriyle tekrar eden yüksek yoğunluklu setler, yorgunlukla birlikte performans düşüşüne yol açar.
            </p>
            <p>
              Laktik asit birikimi de dinlenme ihtiyacını etkileyen önemli bir faktördür. Orta-yüksek tekrarlı setlerde (8-15 tekrar) artan laktat konsantrasyonu, kas asitliğini yükselterek kasılma kapasitesini düşürür. Bu asidik ortamın temizlenmesi, hem oksijene hem de zaman gerektirir. Bu nedenle metabolik stres odaklı antrenmanlarda 60-90 saniyelik dinlenme süreleri, bu birikimi yönetmek için yeterlidir.
            </p>
            <p>
              Sinir sistemi yorgunluğu da göz ardı edilmemesi gereken bir boyuttur. Özellikle maksimal ya da maksimale yakın yüklerle yapılan egzersizler (güç antrenmanı, olimpik kaldırışlar) merkezi sinir sistemini yoğun biçimde zorlar. Bu tür egzersizlerde kas yorgunluğunun çok ötesinde bir toparlanma zamanı gereklidir; 3-5 dakika hatta bazı durumlarda daha uzun süreler uygundur.
            </p>
            <p>
              Bu hesap makinesi, seçtiğiniz egzersiz türü ve hedefinizi dikkate alarak bilimsel literatüre dayalı bir dinlenme süresi önerisi sunar. Kronometreyle ölçülen disiplinli dinlenme, "hissettiğinizde başlamak"tan çok daha tutarlı antrenman kalitesi sağlar.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Hedefe Göre Dinlenme Süreleri */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Hedefe Göre <span className="text-primary">Dinlenme Süreleri</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Maksimal Güç</div>
                <div className="text-white font-bold text-sm mb-2">3 – 5 dakika</div>
                <p className="text-gray-500 text-xs leading-relaxed">%85-100 1RM yüklerinde çalışılırken PCr sisteminin tam yenilenmesi ve sinir sistemi toparlanması için uzun dinlenme şarttır. Kısa dinlenme güç çıktısını ciddi ölçüde düşürür.</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="text-orange-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Hipertrofi (Kas Büyümesi)</div>
                <div className="text-white font-bold text-sm mb-2">60 – 90 saniye</div>
                <p className="text-gray-500 text-xs leading-relaxed">Metabolik stres ve hormonsal tepkiyi (büyüme hormonu, testosteron) artırmak için kas henüz tam toparlanmadan bir sonraki sete geçilir. Sürdürülebilir yorgunluk birikimi hedeflenir.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Güç Dayanıklılığı</div>
                <div className="text-white font-bold text-sm mb-2">30 – 60 saniye</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kısa dinlenme süreleriyle birikimli yorgunlukla çalışmak kardiyovasküler kapasiteyi ve kas dayanıklılığını artırır. Devre antrenmanları ve yüksek yoğunluklu interval programları bu aralığı kullanır.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Genel Kondisyon</div>
                <div className="text-white font-bold text-sm mb-2">45 – 90 saniye</div>
                <p className="text-gray-500 text-xs leading-relaxed">Genel fitness hedefli antrenmanlarda esneklik önemlidir. Ağırlık, tekrar sayısı ve kişisel toparlanma kapasitesine göre bu aralıkta ince ayar yapılabilir.</p>
              </div>
            </div>
            <p>
              Önemli bir not: bu süreler genel kılavuz niteliğindedir. Bireysel toparlanma kapasitesi, yaş, kondisyon düzeyi, uyku kalitesi ve beslenme durumu bu süreleri etkileyebilir. Deneyimli sporcular, yeni başlayanlardan daha hızlı toparlanabilirken 40 yaş üzeri bireyler için dinlenme sürelerinin biraz uzatılması performansı koruyabilir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Dinlenme Süresini Optimize Etme */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Dinlenme Sürecini <span className="text-primary">Nasıl Optimize Etmelisin?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Dinlenme süreci sadece pasif bekleme değildir; bu zamanı bilinçli kullanmak antrenman kalitesini artırır. Setler arasında yapabileceğiniz şeyler arasında hafif germeler (statik değil, dinâmik), nefes kontrolü egzersizleri, antagonist kas grupları için hafif aktivasyonlar veya zihinsel hazırlık yer alabilir.
            </p>
            <p>
              <strong className="text-white">Süperset ve drop set</strong> tekniklerinde dinlenme zamanlaması farklılaşır. Zıt kas gruplarının süperseti (örn. biceps + triceps) her iki egzersiz için de ayrı ayrı 30-45 saniyelik pasif dinlenme sağlarken toplam antrenman süresini kısaltır. Drop setlerde ise ağırlığı azaltarak hemen devam edilir; bu nedenle setler arası dinlenmeye gerek kalmaz.
            </p>
            <p>
              Uzun antrenman seanslarında dinlenme sürelerinin kümülatif etkisi ciddi biçimde uzar. 4 set × 8 egzersiz × 2 dakika dinlenme = 64 dakika yalnızca beklemeyle geçer. Dinlenme sürelerini hedefe göre optimize etmek, antrenman süresini kısaltırken yoğunluğu artırır. Bu sayede daha kısa ama daha kaliteli seanslar mümkün olur.
            </p>
            <p>
              Setler arası dinlenmeyi izlemek için bu uygulamayı ya da spor saatinizdeki kronometre özelliğini kullanın. "Hazır hissedince başlarım" yaklaşımı, araştırmalarda tutarsız dinlenme sürelerine ve dolayısıyla tutarsız performansa yol açtığı gösterilmiştir. Dinlenme sürelerini standartlaştırmak, antrenman yüküne ilişkin nesnel veri toplamanıza ve ilerlemeyi doğru izlemenize imkân tanır.
            </p>
            <p>
              Son olarak set arası dinlenmeyi nefes alışverişinizle ilişkilendirmek pratik bir kural sunar: nefes hızınız normale döndüğünde veya bir sonraki seti tam güçle yapabilecek kadar toparlandığınızı hissettiğinizde başlayın. Bu özellikle ileri düzey sporcular için, egzersiz türüne ve yoğunluğa göre dinamik dinlenme sürelerini kullananlar için değerli bir tamamlayıcı stratejidir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 4: Google Odaklı Uzman Rehberi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Kas Toparlanması ve Uyku: <span className="text-primary">Göz Ardı Edilen Bağlantı</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              "Antrenman aralarında ne kadar dinlenmeliyim?", "Kaslar ne kadar sürede toparlanır?", "Uyku gerçekten bu kadar önemli mi?" — bu sorular sporseverler tarafından sıkça araştırılmaktadır. Bu rehberde, dinlenme ve toparlanma sürecinin fizyolojisini ve pratik optimizasyon yollarını açıklıyoruz.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Kaslar Ne Zaman Büyür: Antrenman Sırasında mı, Sonrasında mı?</h3>
            <p>
              Çok yaygın bir yanılgıyı düzeltmek gerekir: kaslar antrenman sırasında değil, sonrasında büyür. Egzersiz, kas dokusunda mikroskobik hasarlar oluşturur; bu hasar, vücudun onarım ve yeniden yapılanma sürecini tetikler. Bu süreç 24-72 saat arasında sürebilir ve sürenin uzunluğu kas grubuna, antrenman yoğunluğuna ve bireyin toparlanma kapasitesine bağlıdır. Kaslar hasardan daha güçlü onarılarak büyür; bu "süperameli" (supercompensation) olarak bilinir. Yeterli dinlenme vermeksizin aynı kas grubunu tekrar tekrar çalıştırmak bu süreci engeller.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Uyku Esnasında Vücutta Ne Olur?</h3>
            <p>
              Uyku, antrenman adaptasyonunun gerçekleştiği birincil zaman dilimidir. Derin uyku (slow-wave sleep) evrelerinde büyüme hormonu (GH) günlük salgısının yüzde 70-80'i gerçekleşir. Büyüme hormonu, protein sentezini teşvik eder, yağ asitlerini enerji olarak mobilize eder ve kas dokusunu onarır. Bu nedenle yetersiz uyku, antrenmanın büyük bölümünün boşa gitmesi anlamına gelir: egzersiz yaptınız, uyarım oluşturdunuz, ancak adaptasyonun gerçekleşeceği ortamı sağlamadınız.
            </p>
            <p>
              Araştırmalar, uyku kalitesini ve süresini iyileştirmenin kas gücü, reaksiyon süresi, kardiyovasküler dayanıklılık ve yaralanma riskini anlamlı biçimde etkilediğini göstermektedir. Stanford Üniversitesi'nin basketbolcularla yürüttüğü bir çalışmada, uyku süresi 10 saate çıkarılan oyuncuların sprint süreleri hızlandı, serbest atış isabetliliği arttı ve genel performans anlamlı biçimde iyileşti.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Toparlanmayı Hızlandıran Kanıtlanmış Stratejiler</h3>
            <p>
              <strong className="text-white">Aktif dinlenme:</strong> Yoğun antrenmandan sonraki gün hafif yürüyüş, yüzme veya yoga gibi düşük yoğunluklu aktiviteler, kan akışını artırarak metabolik atıkların uzaklaştırılmasını hızlandırır. Pasif dinlenmeye (tamamen hareketsiz kalmak) kıyasla aktif dinlenme, kas yorgunluğunu genellikle daha hızlı giderir.
            </p>
            <p>
              <strong className="text-white">Soğuk-sıcak kontrast terapi:</strong> Soğuk su banyosu veya kontrast duş (soğuk-sıcak dönüşümlü), özellikle yoğun antrenmandan sonra inflamasyonu azaltır ve toparlanmayı destekler. Araştırmalar bu yöntemin kas ağrısını yüzde 20-30 azaltabileceğini göstermektedir.
            </p>
            <p>
              <strong className="text-white">Beslenme zamanlaması:</strong> Antrenman sonrası 30-60 dakika içinde protein ve karbonhidrat kombinasyonu tüketmek, kas glikojen depolarını hızla yenileyerek iyileşmeyi optimize eder. Bu "anabolik pencere" artık eskisi kadar dar görülmese de antrenmandan hemen sonra beslenmek hâlâ en akıllıca stratejidir.
            </p>
            <p>
              Setler arasındaki dinlenme süreleri kadar günler arasındaki dinlenme de büyük önem taşır. Bu hesap makinesini antrenman sırasında kullanarak setler arası dinlenmeyi optimize edin; günlük ve haftalık toparlanma düzeninizi ise uyku kalitesi ve aktif dinlenme günleriyle destekleyin.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="dinlenme" />
        <CalculatorFAQ title="Dinlenme Süresi Hesaplama" faqs={waistHipFAQs} schemaUrl="https://gokalaf.com/araclar/dinlenme-suresi" />
      </div>
    </div>
  );
}
