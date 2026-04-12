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

        {/* İçerik Bölümü 1: Nedir & Nasıl Hesaplanır */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Kalori <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Kalori, besinlerin içerdiği enerji miktarını ifade eden bir birimdir. Teknik tanımıyla bir kilokalori (kcal), bir litre suyu 1°C ısıtmak için gereken enerji miktarına eşittir. Beslenme dünyasında "kalori" derken aslında hep kilokalori'den bahsedilir; etiketlerde "200 kalori" yazan bir ürün, fizik açısından 200 kilokalori enerji içermektedir.
            </p>
            <p>
              Vücudunuz her an enerji harcar — nefes alırken, uyurken, düşünürken ve hareket ederken. Bu enerji kaynağını besinlerden sağlarsınız. Karbonhidratlar ve proteinler gram başına yaklaşık 4 kcal, yağlar ise 9 kcal enerji sağlar. Alkol gram başına 7 kcal ile besin değeri neredeyse sıfır olan ama enerji yoğunluğu yüksek bir madde olarak öne çıkar.
            </p>
            <p>
              Bu hesap makinesinde kullandığımız formül <strong className="text-white">Mifflin-St Jeor denklemdir</strong>. 1990 yılında geliştirilen ve bilimsel literatürde en doğru sonuçları verdiği kanıtlanan bu formül, günümüzde diyetisyenler ve spor bilimciler tarafından altın standart olarak kabul görmektedir. Formül şu şekilde çalışır:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Mifflin-St Jeor Denklemi</div>
              <div className="text-white font-mono text-sm"><span className="text-primary">Erkek:</span> BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) + 5</div>
              <div className="text-white font-mono text-sm"><span className="text-pink-400">Kadın:</span> BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) − 161</div>
            </div>
            <p>
              Bu denklem önce <strong className="text-white">Bazal Metabolizma Hızı'nı (BMR)</strong> verir. BMR; tamamen dinlenme halindeyken, hiçbir şey yemeden ve en temel yaşamsal fonksiyonları sürdürmek için vücudun tükettiği kalori miktarıdır. Kalp atışı, solunum, vücut ısısını koruma, sinir sistemi aktivitesi ve hücre yenilenmesi gibi süreçler bu enerjiyi tüketir. Çoğu yetişkin için BMR, toplam günlük enerji harcamasının yüzde 60 ila 75'ini oluşturur.
            </p>
            <p>
              Mifflin-St Jeor'dan önce yaygın kullanılan Harris-Benedict denklemi (1919) de benzer mantıkla çalışır ancak modern araştırmalar Mifflin-St Jeor'un gerçek ölçümlerle daha yüksek korelasyon gösterdiğini ortaya koymuştur. Özellikle 10 kg'dan fazla fazla kilosu olan bireylerde doğruluk farkı belirginleşmektedir. Bu yüzden günümüzde Mifflin-St Jeor tercih edilmektedir.
            </p>
            <p>
              Hesaplama sırasında doğru veriler girmeniz sonucun güvenilirliğini doğrudan etkiler. Kilo ölçümünüzü sabah aç karnına, boy ölçümünüzü ise düz bir zeminde dik dururken yapmanız önerilir. Aktivite seviyesini belirlerken dürüst olmak da kritik öneme sahiptir; pek çok kişi aktivite seviyesini olduğundan yüksek seçerek kalori ihtiyacını abartır ve bu da kilo kontrolünü zorlaştırır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: BMR, TDEE ve Sonuçların Yorumu */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            BMR ve TDEE <span className="text-primary">Ne Anlama Gelir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Hesap makinesi size üç temel değer sunar: BMR, TDEE ve hedef kalori. Bu üç değeri doğru anlamak, beslenme planınızı gerçekten işe yarar hale getirir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">BMR</div>
                <div className="text-white font-bold text-sm mb-2">Bazal Metabolizma Hızı</div>
                <p className="text-gray-500 text-xs leading-relaxed">Tamamen yatakta, hiç hareket etmeden, aç karnına yaşamak için gereken minimum kalori. Uyurken bile bu kadar kalori yakarsınız. Vücudunuzun "rölantide" tükettiği enerjidir.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">TDEE</div>
                <div className="text-white font-bold text-sm mb-2">Toplam Günlük Enerji Harcaması</div>
                <p className="text-gray-500 text-xs leading-relaxed">BMR'nin aktivite çarpanıyla çarpılmasıyla elde edilir. Günlük tüm hareketlerinizi, egzersizinizi ve yaşam aktivitenizi kapsar. Kilonuzu korumak için alması gereken kaloridir.</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="text-primary font-heading font-bold uppercase text-xs tracking-wider mb-1">Hedef Kalori</div>
                <div className="text-white font-bold text-sm mb-2">Hedefinize Göre Ayarlı</div>
                <p className="text-gray-500 text-xs leading-relaxed">TDEE'den hedefinize göre kalori eklenip çıkarılır. Kilo vermek için −500 kcal, kilonuzu korumak için ±0, kas kazanmak için +300 kcal uygulanır.</p>
              </div>
            </div>

            <p>
              Aktivite çarpanları şu şekilde belirlenir: <strong className="text-white">Hareketsiz (1.2)</strong> yalnızca masa başı çalışanlar için, <strong className="text-white">Hafif Aktif (1.375)</strong> haftada 1-2 gün hafif egzersiz yapanlar için, <strong className="text-white">Orta Aktif (1.55)</strong> haftada 3-5 gün antrenman yapanlar için, <strong className="text-white">Çok Aktif (1.725)</strong> haftada 6-7 gün yoğun çalışanlar için, <strong className="text-white">Ekstra Aktif (1.9)</strong> ise fiziksel iş yapan ya da günde iki kez antrenman yapanlar için geçerlidir.
            </p>
            <p>
              Kilo verme hedefinde uygulanan <strong className="text-white">−500 kcal</strong> açığı, teorik olarak haftada yaklaşık 0.45 kg yağ kaybına karşılık gelir (1 kg yağ ≈ 7.700 kcal). Bu tempo hem sürdürülebilir hem de kas kütlesini büyük ölçüde koruyan bir hızdır. Bunun iki katı olan −1000 kcal açığı daha hızlı kilo kaybına yol açsa da kas kaybı, metabolizma yavaşlaması ve besin eksikliği riski beraberinde gelir.
            </p>
            <p>
              Kas kazanımı için uygulanan <strong className="text-white">+300 kcal</strong> fazlası ise kasın büyümesi için gereken anabolik ortamı yaratır. Daha büyük fazlalar (500+ kcal) kas gelişimini anlamlı biçimde hızlandırmaz, yalnızca yağ birikimini artırır. Bu yüzden "temiz bulk" stratejisinde 200-400 kcal fazlası altın aralık olarak kabul edilir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Pratik Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Kalori Hedefini Fitness'ta <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Kalori hesabını bilmek ile onu günlük hayata uygulamak arasında önemli bir fark vardır. Hesap makinenizden aldığınız değer bir başlangıç noktasıdır — vücudunuzun gerçek tepkisine göre birkaç hafta içinde ince ayar yapmanız gerekebilir. Bunun nedeni formüllerin istatistiksel ortalamalardan türetilmiş olmasıdır; bireysel metabolizma hızları gerçekte hesaplanan değerden yüzde 10-20 oranında farklılık gösterebilir.
            </p>
            <p>
              Pratik bir yaklaşım olarak şu adımları uygulayabilirsiniz: İlk iki hafta hesaplanan kalori hedefiyle beslenin ve kilonuzdaki değişimi takip edin. Beklenen hızda (haftada 0.3-0.5 kg) kilo vermiyorsanız kaloriyi 100-150 kcal daha düşürün. Öte yandan sürekli yorgunluk, uyku bozukluğu veya performans düşüşü yaşıyorsanız kaloriyi 100-200 kcal artırmayı deneyin. Bu "adaptif kalibrasyon" yaklaşımı, körü körüne bir sayıya bağlı kalmaktan çok daha etkili sonuçlar verir.
            </p>
            <p>
              Kalori saymak bir zorunluluk mu? Kesinlikle değil. Ancak en azından birkaç hafta boyunca yediğiniz besinlerin kalori değerini takip etmek, porsiyon boyutları ve besin yoğunluğu konusunda kalıcı bir sezgi geliştirir. Bu sezgiyi bir kez kazandığınızda, hassas takip yapmadan da hedefinize yakın beslenebilirsiniz. Beslenme uygulamaları (MyFitnessPal, Cronometer gibi) bu süreci önemli ölçüde kolaylaştırır.
            </p>
            <p>
              Kalori hedefi belirledikten sonra bir sonraki adım <strong className="text-white">makro dağılımını planlamaktır</strong>. Aynı kalori miktarını çok farklı makro oranlarıyla karşılayabilirsiniz; bu oranlar vücut kompozisyonunuzu doğrudan etkiler. Kas kazanırken yüksek protein (vücut ağırlığının kilogramı başına 1.6-2.2 g), kilo verirken yeterli protein (1.8-2.5 g/kg) kas kütlesini korumak için kritiktir. Karbonhidrat ve yağ dağılımı ise kişisel tercih, antrenman tipi ve tıbbi duruma göre esnek şekilde ayarlanabilir.
            </p>
            <p>
              Son olarak şunu vurgulamak gerekir: Kalori dengesi kilo kontrolünün en temel prensibi olsa da tek belirleyici faktör değildir. Uyku kalitesi, stres hormonu kortizol, bağırsak mikrobiyomunu, besin kalitesi ve hormon dengesi de vücut kompozisyonunu etkileyen önemli değişkenlerdir. Bu yüzden kalori hedefine ulaşıyor olmanıza rağmen beklenen sonucu görmüyorsanız, bu diğer faktörleri de gözden geçirmeniz gerektiğinin işaretidir.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="kalori" />
        <CalculatorFAQ title="Kalori Hesaplama" faqs={calorieFAQs} schemaUrl="https://gokalaf.com/araclar/kalori-hesaplama" />
      </div>
    </div>
  );
}
