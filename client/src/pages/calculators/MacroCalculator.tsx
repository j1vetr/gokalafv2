import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, RotateCcw, TrendingDown, Target, TrendingUp } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { macroFAQs } from "@/components/CalculatorFAQ";

const MacroPieChart = ({ protein, carbs, fats }: { protein: number; carbs: number; fats: number }) => {
  const total = protein + carbs + fats;
  const proteinDeg = (protein / total) * 360;
  const carbsDeg = (carbs / total) * 360;
  const fatsDeg = (fats / total) * 360;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeDasharray={`${(protein / total) * 251.2} 251.2`}
          className="drop-shadow-lg"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${(carbs / total) * 251.2} 251.2`}
          strokeDashoffset={`${-(protein / total) * 251.2}`}
          className="drop-shadow-lg"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#eab308"
          strokeWidth="20"
          strokeDasharray={`${(fats / total) * 251.2} 251.2`}
          strokeDashoffset={`${-((protein + carbs) / total) * 251.2}`}
          className="drop-shadow-lg"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center">
          <PieChart className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default function MacroCalculator() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [proteinRatio, setProteinRatio] = useState(30);
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
    lose: { label: "Kilo Ver", deficit: -500, icon: TrendingDown },
    maintain: { label: "Koru", deficit: 0, icon: Target },
    gain: { label: "Kas Yap", deficit: 300, icon: TrendingUp },
  };

  const calculateMacros = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevels[activity as keyof typeof activityLevels].multiplier;
    const targetCalories = tdee + goals[goal as keyof typeof goals].deficit;

    const proteinCalories = (targetCalories * proteinRatio) / 100;
    const proteinGrams = Math.round(proteinCalories / 4);

    const fatRatio = 25;
    const fatCalories = (targetCalories * fatRatio) / 100;
    const fatGrams = Math.round(fatCalories / 9);

    const carbRatio = 100 - proteinRatio - fatRatio;
    const carbCalories = (targetCalories * carbRatio) / 100;
    const carbGrams = Math.round(carbCalories / 4);

    setResult({
      calories: Math.round(targetCalories),
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      proteinRatio,
      carbRatio,
      fatRatio,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Makro Besin Hesaplama | Protein Karbonhidrat Yağ Oranları - Gokalaf"
        description="Makro besin hesaplayıcı ile günlük protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın. Hedeflerinize göre makro dağılımı."
        keywords="makro hesaplama, protein hesaplama, karbonhidrat hesaplama, makro besin, beslenme programı"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Makro Besin Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/makro-hesaplama",
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
            Beslenme Planlama
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Makro <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Protein, karbonhidrat ve yağ ihtiyacınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <PieChart className="w-4 h-4 text-primary" /> Bilgileriniz
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

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-white text-sm" data-testid="select-activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
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

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Protein Oranı</Label>
                  <span className="text-primary font-bold" data-testid="text-protein-ratio-value">{proteinRatio}%</span>
                </div>
                <Slider 
                  value={[proteinRatio]} 
                  onValueChange={(val) => setProteinRatio(val[0])} 
                  min={20} 
                  max={40} 
                  step={5} 
                  className="py-1"
                  data-testid="slider-protein-ratio"
                />
                <p className="text-[10px] text-gray-500">Yağ %25 sabit, kalan karbonhidrat</p>
              </div>

              <Button 
                onClick={calculateMacros} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm mt-1"
                data-testid="button-calculate-macros"
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Günlük Kalori</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-heading text-white" data-testid="text-total-calories">{result.calories}</span>
                      <span className="text-xs text-gray-500">kcal</span>
                    </div>
                  </div>
                  <MacroPieChart protein={result.proteinRatio} carbs={result.carbRatio} fats={result.fatRatio} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.div 
                    className="bg-gradient-to-br from-red-500/20 to-red-500/5 p-3 rounded-xl border border-red-500/20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-[10px] text-red-400 uppercase font-semibold">Protein</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-protein-grams">{result.protein}g</div>
                    <div className="text-[10px] text-gray-500">{result.proteinRatio}% - 4kcal/g</div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-3 rounded-xl border border-blue-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] text-blue-400 uppercase font-semibold">Karbonhidrat</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-carb-grams">{result.carbs}g</div>
                    <div className="text-[10px] text-gray-500">{result.carbRatio}% - 4kcal/g</div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 p-3 rounded-xl border border-yellow-500/20"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-[10px] text-yellow-400 uppercase font-semibold">Yağ</span>
                    </div>
                    <div className="text-2xl font-bold text-white" data-testid="text-fat-grams">{result.fats}g</div>
                    <div className="text-[10px] text-gray-500">{result.fatRatio}% - 9kcal/g</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Öğün Başına (3 öğün)</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-400">{Math.round(result.protein / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{Math.round(result.carbs / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Karb</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-400">{Math.round(result.fats / 3)}g</div>
                      <div className="text-[9px] text-gray-500">Yağ</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Besin Kaynakları</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="text-gray-400">
                      <span className="text-red-400 font-semibold">Protein:</span> Tavuk, balık, yumurta, süt ürünleri
                    </div>
                    <div className="text-gray-400">
                      <span className="text-blue-400 font-semibold">Karb:</span> Pirinç, yulaf, patates, meyve
                    </div>
                    <div className="text-gray-400">
                      <span className="text-yellow-400 font-semibold">Yağ:</span> Zeytinyağı, avokado, kuruyemiş
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-macros"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <PieChart size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: Makrolar Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Makro Besinler <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Makro besinler ya da kısaca "makrolar", vücudun enerji ve yapı taşı olarak kullandığı üç temel besin grubunu ifade eder: <strong className="text-white">protein, karbonhidrat ve yağ</strong>. Her birinin farklı işlevleri, farklı enerji değerleri ve vücut kompozisyonu üzerinde farklı etkileri vardır. Kalori saymak "ne kadar yiyeceğini" söylerken, makro takibi "ne yiyeceğini" belirler.
            </p>
            <p>
              Enerji değerleri açısından: <strong className="text-white">Protein ve karbonhidrat</strong> gram başına 4 kcal, <strong className="text-white">yağ</strong> ise gram başına 9 kcal sağlar. Bu fark, aynı kalori miktarını farklı gramaj kombinasyonlarıyla karşılayabileceğiniz anlamına gelir. Örneğin 2000 kcal'lik bir plan; 200g protein (800 kcal) + 175g karbonhidrat (700 kcal) + 55g yağ (500 kcal) şeklinde düzenlenebilir.
            </p>
            <p>
              Makro hesaplaması üç adımda gerçekleşir. Önce TDEE belirlenir, ardından hedefe göre (kilo verme, koruma veya kas kazanımı) toplam kalori ayarlanır. Son adımda bu kalori miktarı üç makroya dağıtılır. Bu hesap makinesi bu dağılımı otomatik olarak yapar ve size gram cinsinden günlük protein, karbonhidrat ve yağ hedeflerinizi gösterir.
            </p>
            <p>
              Makro dağılımının temelinde <strong className="text-white">protein önceliği</strong> ilkesi yatar. Günümüz spor beslenme araştırmaları, optimum kas gelişimi ve korunması için vücut ağırlığının kilogramı başına 1.6 ila 2.2 gram protein tüketimini önermektedir. Kalori kısıtlaması dönemlerinde bu aralığın üst sınırına çıkmak (2.2-2.5 g/kg), kas kaybını minimize etmeye yardımcı olur. Protein hedefi belirlendikten sonra kalan kalori, karbonhidrat ve yağ arasında kişisel tercih ve metabolik yanıta göre paylaştırılır.
            </p>
            <p>
              Hesap makinesinde seçebileceğiniz hazır makro şablonları, kanıta dayalı farklı beslenme yaklaşımlarını temsil eder. Dengeli beslenme için standart oranlar uygulanırken, düşük karbonhidrat veya ketojenik seçenekler karbonhidratı dramatik biçimde düşürüp yağı artırır. Yüksek protein şablonu ise protein oranını maksimuma çıkararak özellikle kesim dönemlerinde kas korumayı ön plana alır.
            </p>
            <p>
              Makro hesabının formüller üzerinden yapılan teorik bir çalışma olduğunu ve gerçek uygulama sırasında ince ayara ihtiyaç duyulabileceğini hatırlatmak gerekir. İki-üç haftalık takip sonucunda performansınızı, enerjinizi ve vücut ağırlığı değişiminizi değerlendirip gerekirse karbonhidrat ve yağ dağılımını revize edebilirsiniz. Protein hedefi ise genel olarak sabit tutulur.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Makroların Rolü */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Her Makronun <span className="text-primary">Vücuttaki Rolü</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Protein</div>
                <div className="text-white font-bold text-sm mb-2">4 kcal / gram</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kas dokusu, enzimler, hormonlar ve bağışıklık proteinlerinin yapı taşıdır. Doygunluk hissini en uzun süre sağlayan makrodur. Termik etkisi en yüksek olan besin grubudur; sindirimi için harcanan enerji, alınan kalorinin yüzde 20-30'una ulaşabilir.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Karbonhidrat</div>
                <div className="text-white font-bold text-sm mb-2">4 kcal / gram</div>
                <p className="text-gray-500 text-xs leading-relaxed">Beynin ve kasların tercih ettiği yakıt kaynağıdır. Glikojen olarak kaslarda depolanan karbonhidrat, yoğun egzersiz performansının temelini oluşturur. Lifli karbonhidratlar bağırsak sağlığını destekler ve kan şekerini dengeler.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Yağ</div>
                <div className="text-white font-bold text-sm mb-2">9 kcal / gram</div>
                <p className="text-gray-500 text-xs leading-relaxed">Hormon üretimi (özellikle testosteron ve östrojen) için vazgeçilmezdir. Yağda çözünen vitaminlerin (A, D, E, K) emilimini sağlar. Uzun süreli düşük yoğunluklu aktiviteler için önemli bir enerji kaynağıdır. Minimum yüzde 20 yağ alımının altına düşmek hormon dengesini bozabilir.</p>
              </div>
            </div>

            <p>
              Makro dağılımı hedefe göre önemli ölçüde değişir. <strong className="text-white">Kas kazanımında (bulk)</strong> karbonhidrat antrenman performansı için yüksek tutulurken, protein kas sentezi için yeterli düzeyde kalır. <strong className="text-white">Yağ yakarken (cut)</strong> karbonhidrat azaltılır, protein artırılır; böylece kalori açığında kas korunur. <strong className="text-white">Vücudu koruma döneminde</strong> ise dengeli ve sürdürülebilir bir dağılım tercih edilir.
            </p>
            <p>
              Makro takibine yeni başlayanlar için pratik bir başlangıç noktası şöyledir: önce protein hedefini kilogram başına 2 gram olarak sabitleyin. Kalan kalorileri yaklaşık yüzde 50 karbonhidrat ve yüzde 25-30 yağ şeklinde dağıtın. Bu standart dengeli profil, çoğu kişi için güvenli ve etkin bir başlangıç noktasıdır; ilk birkaç hafta içinde kişisel yanıtınıza göre ince ayar yapabilirsiniz.
            </p>
            <p>
              Makrolar kadar önemli olan bir konu da <strong className="text-white">besin kalitesidir</strong>. Aynı protein gramına ulaşmak için işlenmiş et ürünleri veya yüksek kaliteli tam gıdalar (yumurta, tavuk, baklagiller) tercih etmek; sindirim, hormonal denge ve genel sağlık üzerinde çok farklı sonuçlar doğurur. Makro takibi yalnızca miktarla değil, kaynaklarla birlikte düşünüldüğünde gerçek anlamını kazanır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Makroları Fitness Sürecinde <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Makro takibini pratiğe dökmek, ilk başta karmaşık görünebilir. Ancak birkaç temel ilkeyi benimsemek bu süreci önemli ölçüde sadeleştirir. İlk ve en kritik adım, hesaplanan makro hedeflerinizi bir beslenme takip uygulamasına (MyFitnessPal, Cronometer veya benzeri) girerek günlük öğünlerinizi kaydetmektir. İlk 2-3 haftada bu alışkanlığı oturtmak, uzun vadede çok daha bilinçli beslenme kararları almanızı sağlar.
            </p>
            <p>
              Makro takibinde esneklik büyük önem taşır. <strong className="text-white">Esnek Diyet (IIFYM — If It Fits Your Macros)</strong> yaklaşımı, herhangi bir besini makro hedeflerine uyduğu sürece tüketmeyi mümkün kılar. Bu yaklaşım, sosyal etkinliklerde ve yemek dışarıda yenildiğinde beslenmeyi yönetmeyi kolaylaştırır. Mükemmeliyetçi bir yaklaşım yerine "yüzde seksen kuralı" daha sürdürülebilirdir: hedeflerin yüzde seksenine ulaşmak, tam hedeften sapmayı kurtarmaktan çok daha iyidir.
            </p>
            <p>
              Antrenman zamanlamasına göre karbonhidrat dağılımını optimize etmek de bir sonraki adımdır. <strong className="text-white">Antrenman öncesi</strong> (1-2 saat önce) kompleks karbonhidrat ağırlıklı bir öğün, egzersiz performansını destekler. <strong className="text-white">Antrenman sonrası</strong> (ilk 30-60 dakika içinde) hızlı karbonhidrat ve protein kombinasyonu kas glikojen depolarını yeniler ve iyileşme sürecini hızlandırır. Bu strateji, özellikle yüksek hacimli ya da iki günlük antrenmanlarda belirgin fark yaratır.
            </p>
            <p>
              Makro hesabınızı belirli aralıklarla güncellemek de önemlidir. Vücut ağırlığınız değiştikçe (her 5 kg'da bir veya her 4-6 haftada bir) makro hedeflerinizi yeniden hesaplamak, beslenme planınızın mevcut fiziksel durumunuza uygun kalmасını sağlar. Başlangıç kilonuza ve hedefinize göre hesaplanan makrolar, 20 kg kilo kaybından sonra artık optimum değildir.
            </p>
            <p>
              Son olarak makro takibinin uzun vadeli bir beceri olduğunu unutmamak gerekir. Aylarca haftalık hassas takip yapan kişiler, zamanla porsiyon boyutlarını ve besinlerin makro içeriklerini sezgisel olarak tahmin edebilir hale gelir. Bu sezgi, beslenme uygulamasına sürekli bağımlı kalmadan da dengeli ve hedefe uygun beslenebilme özgürlüğü sağlar. Makro takibi nihai bir araç değil; sağlıklı beslenme alışkanlıklarını içselleştirme sürecinde güçlü bir eğitim yöntemidir.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="makro" />
        <CalculatorFAQ title="Makro Hesaplama" faqs={macroFAQs} schemaUrl="https://gokalaf.com/araclar/makro-hesaplama" />
      </div>
    </div>
  );
}
