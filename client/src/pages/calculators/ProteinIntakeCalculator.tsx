import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Beef, RotateCcw, Target, Dumbbell, Scale, Zap, Utensils } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { proteinIntakeFAQs } from "@/components/CalculatorFAQ";

const goals = [
  { id: "muscle", label: "Kas Yap", icon: Dumbbell, mult: { min: 1.6, opt: 2.0, max: 2.4 } },
  { id: "fat-loss", label: "Yağ Yak", icon: Target, mult: { min: 1.2, opt: 1.6, max: 2.0 } },
  { id: "maintenance", label: "Koru", icon: Scale, mult: { min: 0.8, opt: 1.2, max: 1.6 } },
  { id: "endurance", label: "Dayanıklılık", icon: Zap, mult: { min: 1.2, opt: 1.4, max: 1.8 } },
];

const activities = [
  { id: "sedentary", label: "Hareketsiz", mult: 0.9 },
  { id: "moderate", label: "Orta", mult: 1.0 },
  { id: "active", label: "Aktif", mult: 1.1 },
  { id: "very-active", label: "Çok Aktif", mult: 1.2 },
];

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState(75);
  const [goal, setGoal] = useState("muscle");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<{ min: number; opt: number; max: number; perMeal: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const goalData = goals.find(g => g.id === goal)!;
    const activityData = activities.find(a => a.id === activity)!;

    const min = Math.round(weight * goalData.mult.min * activityData.mult);
    const opt = Math.round(weight * goalData.mult.opt * activityData.mult);
    const max = Math.round(weight * goalData.mult.max * activityData.mult);

    setResult({ min, opt, max, perMeal: Math.round(opt / 4) });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Günlük Protein İhtiyacı Hesaplama | Protein Hesaplayıcı - Gokalaf"
        description="Günlük protein ihtiyacınızı hesaplayın. Kilonuz ve aktivite seviyenize göre kas yapmak için gereken protein miktarını öğrenin."
        keywords="protein ihtiyacı hesaplama, günlük protein, kas yapmak için protein, protein hesaplayıcı, spor beslenme"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Protein İhtiyacı Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/protein-ihtiyaci",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Beslenme
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Protein <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">İhtiyacı</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Hedefinize göre günlük protein ihtiyacınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Beef className="w-4 h-4 text-amber-400" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                  <span className="text-amber-400 font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={1} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Hedefiniz</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {goals.map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          goal === g.id 
                            ? 'bg-amber-500/20 border-amber-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-goal-${g.id}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${goal === g.id ? 'text-amber-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {activities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setActivity(a.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        activity === a.id 
                          ? 'bg-orange-500/20 border-orange-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                      data-testid={`button-activity-${a.id}`}
                    >
                      <div className="text-[9px] font-semibold uppercase leading-tight">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculate} 
                className="w-full bg-amber-500 text-black hover:bg-amber-600 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-protein"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Önerilen Günlük Protein</div>
                  <div className="flex items-center justify-center gap-2">
                    <Beef className="w-6 h-6 text-amber-400" />
                    <span className="text-5xl font-bold font-heading text-amber-400" data-testid="text-protein-result">{result.opt}g</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-[10px] text-gray-500 uppercase">Minimum</div>
                    <div className="text-xl font-bold text-white" data-testid="text-protein-min">{result.min}g</div>
                  </motion.div>
                  <motion.div 
                    className="bg-amber-500/20 rounded-xl p-3 text-center border border-amber-500/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="text-[10px] text-amber-400 uppercase">Optimal</div>
                    <div className="text-xl font-bold text-amber-400">{result.opt}g</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-[10px] text-gray-500 uppercase">Maksimum</div>
                    <div className="text-xl font-bold text-white" data-testid="text-protein-max">{result.max}g</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Öğün Başına (4 Öğün)</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["Kahvaltı", "Öğle", "Akşam", "Ara"].map((meal, i) => (
                      <div key={meal} className="text-center p-2 bg-white/5 rounded-lg">
                        <div className="text-[9px] text-gray-500">{meal}</div>
                        <div className="text-lg font-bold text-white">{result.perMeal}g</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Protein Kaynakları</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400">
                    <div>Tavuk Göğsü (31g/100g)</div>
                    <div>Yumurta (6g/adet)</div>
                    <div>Greek Yoğurt (10g/100g)</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-protein"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Beef size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: Protein Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Protein İhtiyacı <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Protein, vücudun en temel yapı taşıdır. Amino asitlerden oluşan bu makro besin; kaslar, organlar, enzimler, hormonlar, antikorlar ve hücre zarlarının yapımında kullanılır. Günlük protein ihtiyacı, vücut ağırlığına, aktivite düzeyine, yaşa ve spor hedefine göre önemli ölçüde değişir. Bu hesap makinesi, bilimsel araştırmalara dayalı kişiselleştirilmiş bir günlük protein hedefi sunar.
            </p>
            <p>
              Protein ihtiyacı hesaplamasının temeli, vücut ağırlığının kilogramı başına düşen gram miktarına (g/kg) dayanır. Hareketsiz bir yaşam süren yetişkin için minimum 0.8 g/kg yeterli görülse de bu değer, aktif bireyler ve sporcular için yetersiz kalır. Güncel spor bilimi araştırmaları, direnç antrenmanı yapan bireyler için <strong className="text-white">1.6-2.2 g/kg</strong> aralığını optimum kas gelişimi için önermektedir. Kalori kısıtlaması dönemlerinde ise bu aralığın üst sınırına çıkmak, kas kaybını önlemek açısından kritik önem taşır.
            </p>
            <p>
              Hesaplama yaparken <strong className="text-white">yağsız vücut kütlesi (YVK)</strong> üzerinden protein hedefi belirlemek daha doğru sonuçlar verir. Vücut yağ yüzdesi yüksek olan bireylerde toplam vücut ağırlığı üzerinden hesaplama yapılırsa protein hedefi abartılabilir. YVK = Toplam Kilo × (1 − Yağ Yüzdesi) formülüyle hesaplanan değer üzerinden belirlenen protein miktarı, gerçek fizyolojik ihtiyacı daha iyi yansıtır.
            </p>
            <p>
              Yaş faktörü de protein ihtiyacını doğrudan etkiler. 65 yaş üzeri bireylerde kas kaybı (sarkopeni) riski arttığından, günlük protein alımının 1.2-1.6 g/kg düzeyinde tutulması önerilir. Ergenlik dönemindeyse büyüme ve gelişim için ek protein gerekmektedir. Bu hesap makinesi yaşınızı hesaba katarak size uygun aralığı belirler.
            </p>
            <p>
              Protein kaynaklarının kalitesi de miktarı kadar önemlidir. <strong className="text-white">Tam protein kaynakları</strong> — yumurta, et, tavuk, balık, süt ürünleri ve soya — tüm esansiyel amino asitleri içerir. Bitkisel protein kaynakları genellikle bir veya daha fazla esansiyel amino asit bakımından sınırlıdır; ancak çeşitli bitkisel kaynakların (baklagiller + tahıllar gibi) kombinasyonu eksiksiz bir amino asit profili sağlar. Whey protein, kazein ve bitkisel protein takviyeler de günlük hedefe ulaşmayı kolaylaştıran pratik seçeneklerdir.
            </p>
            <p>
              Protein sindirimine ilişkin önemli bir nokta: vücudun tek öğünde sindirebileceği protein miktarına dair eski "30-40 gram sınırı" artık bilimsel olarak desteklenmemektedir. Vücut, tüketilen tüm proteini zaman içinde işleyebilir; ancak öğün başına 30-50 gram protein tüketimi, kas protein sentezini optimize etmek açısından pratik bir hedef olarak değerini korumaktadır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Hedeflerine Göre Protein */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Hedefe Göre <span className="text-primary">Protein İhtiyacı</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Kilo Verme</div>
                <div className="text-white font-bold text-sm mb-2">2.0 – 2.5 g/kg</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kalori açığında kas kaybını en aza indirmek için protein ihtiyacı artar. Yüksek protein, doygunluk hissini de destekler ve toplam kalori alımını doğal biçimde azaltmaya yardımcı olur.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Kas Kazanımı</div>
                <div className="text-white font-bold text-sm mb-2">1.6 – 2.2 g/kg</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kas protein sentezini maksimize etmek için yeterli amino asit temini gerekir. Bu aralığın üzerinde tüketmek ek kas kazanımı sağlamaz; fazla protein enerji olarak kullanılır.</p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="text-primary font-heading font-bold uppercase text-xs tracking-wider mb-1">Genel Sağlık</div>
                <div className="text-white font-bold text-sm mb-2">0.8 – 1.2 g/kg</div>
                <p className="text-gray-500 text-xs leading-relaxed">Fiziksel aktivite yapmayan veya hafif aktif yaşayan bireyler için günlük minimum ihtiyaç. Bağışıklık sistemi, doku tamiri ve hormon üretimi için yeterli düzeyi karşılar.</p>
              </div>
            </div>
            <p>
              Protein zamalaması — öğünlerin gün içine nasıl dağıtıldığı — toplam protein miktarı kadar önemlidir. Araştırmalar, protein tüketimini güne eşit dağıtmanın (sabah, öğle, akşam ve antrenman sonrası) 24 saatlik kas protein sentezini artırdığını göstermektedir. Özellikle sabah kahvaltısında yeterli protein tüketmek, kahvaltıyı atlayan ya da düşük proteinli öğünle geçiştirenlere kıyasla belirgin bir avantaj sağlar.
            </p>
            <p>
              Antrenman sonrası protein penceresi ise gerçektir ancak çok dar değildir. Egzersizin ardından 2-3 saat içinde protein tüketmek, kas sentezini desteklemek için yeterlidir. 30 dakikalık "anabolik pencere" fikri abartılmıştır. Günlük toplam protein hedefini karşılamak ve düzenli aralıklarla protein tüketmek, zamanlama kaygısından çok daha etkili bir stratejidir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Pratik Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Günlük Protein Hedefine <span className="text-primary">Nasıl Ulaşırsın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Hesaplanan protein hedefine düzenli olarak ulaşmak, fitness sürecinin en zorlu pratik parçalarından biridir. Özellikle 150-200 gram gibi yüksek protein hedefleri, dikkatli planlama ve doğru gıda seçimleri gerektir. İşte bu hedefe sistematik biçimde ulaşmak için kanıtlanmış stratejiler:
            </p>
            <p>
              <strong className="text-white">Gıda başına protein yoğunluğunu bilmek</strong> ilk adımdır. 100 gram pişmiş tavuk göğsü yaklaşık 31g, yumurta (1 adet) 6g, 100g lor peyniri 12g, 100g yağsız kırmızı et 28g, 100g somon 25g protein içerir. Bu değerleri yaklaşık olarak ezberlemek, çeşitli öğünleri makul bir eforla hedefle uyumlu hale getirmenizi sağlar.
            </p>
            <p>
              <strong className="text-white">Her öğüne bir protein kaynağı koymak</strong> en etkili pratik alışkanlıktır. Kahvaltıda yumurta veya süzme peynir, öğle yemeğinde tavuk veya ton balığı, akşamda kırmızı et veya balık planlamak; günlük hedefe otomatik biçimde yaklaşmanızı sağlar. Öğün atlamak protein hedefini tutturmayı ciddi ölçüde güçleştirir.
            </p>
            <p>
              Protein takviyeleri, diyetten yeterli protein almakta zorlananlara pratik bir çözüm sunar. 1 ölçek whey protein tozu genellikle 20-25g protein içerir ve düşük kalori yüküyle bu gramajı karşılamanın en hızlı yoludur. Ancak takviyelerin gerçek gıdaların yerini tutamayacağını hatırlatmak gerekir; gerçek gıdalar, protein dışında pek çok mikro besin ve faydalı bileşik sunar.
            </p>
            <p>
              Son olarak: hesaplanan protein hedefi her gün tam olarak tutturulmak zorunda değildir. Haftalık ortalamaya odaklanmak daha sürdürülebilir bir yaklaşımdır. Sosyal etkinlikler, yoğun iş günleri veya seyahat dönemlerinde hedefin biraz altında kalmak, genel ilerlemeyi anlamlı biçimde etkilemez. Önemli olan, tutarlı bir haftalık ortalamayı korumaktır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 4: Google Odaklı Uzman Rehberi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Protein Alımı Hakkında <span className="text-primary">Doğru Bilinen Yanlışlar ve Sık Sorulan Sorular</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              "Günde ne kadar protein almalıyım?" sorusu, spor ve beslenme alanında en çok aranan sorulardan biridir. Yanıt kişisel koşullara göre değişse de bilimsel literatürde bu konuda giderek güçlenen bir fikir birliği mevcuttur. Yanlış anlamalar ise genellikle iki uçta kümelenmektedir: ya protein alımı yetersiz kalır ya da "ne kadar çok o kadar iyi" mantığıyla gerektiğinden fazla tüketilir.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Çok Fazla Protein Böbreklere Zarar Verir Mi?</h3>
            <p>
              Bu, spor dünyasının en köklü efsanelerinden biridir. Araştırmalar, böbrek fonksiyonu sağlıklı olan bireyler için yüksek protein alımının (3 g/kg'a kadar) böbrek sağlığını olumsuz etkilemediğini ortaya koymaktadır. Böbrek hastalığı veya böbrek yetmezliği olan bireyler için protein kısıtlaması gerekebilir; ancak bu durum, sağlıklı bireylere genelleştirilemez. Dünya genelinde milyonlarca sporcu yıllarca yüksek protein alımını sürdürmekte ve böbrek sorunu yaşamamaktadır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Bitkisel Protein Hayvansal Proteinle Aynı Etkiyi Sağlar Mı?</h3>
            <p>
              Bitkisel proteinlerin kas sentezi açısından hayvansal proteinlerden daha az etkili olduğu bilinmektedir; ancak bu fark yeterli miktarda ve doğru kombinasyonlarla büyük ölçüde kapatılabilir. Temel sorun, çoğu bitkisel proteinin düşük lösin içeriğidir. Lösin, kas protein sentezini tetikleyen en kritik amino asittir. Soya, lösin bakımından en zengin bitkisel protein kaynağıdır ve hayvansal proteinlere en yakın kas senteziuyarımını sağlar. Bezelye ve pirinç protein kombinasyonu da (50/50) eksiksiz bir amino asit profili oluşturur.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Yaşlılıkta Protein İhtiyacı Artar Mı?</h3>
            <p>
              Evet, önemli ölçüde. 60 yaş üzerinde kas dokusunun yenilenmesi için gereken uyarım eşiği yükselir; bu fenomene "anabolik direnç" denir. Başka bir deyişle, aynı miktarda kas sentezi için daha fazla protein gerekmektedir. Güncel araştırmalar, 65 yaş üzeri bireyler için kilogram başına en az 1.2-1.6 gram protein önermekte; bazı uzmanlar bu aralığın 2.0 g/kg'a kadar çıkılabileceğini savunmaktadır. Bu konuda bilinç oluşturmak özellikle önemlidir çünkü yaşlılıkta kas kaybı (sarkopeni) bağımsız yaşamı ve genel sağlığı tehdit eden en önde gelen faktörlerden biridir.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Sabahları Protein Tüketmek Neden Bu Kadar Önemli?</h3>
            <p>
              Uyku sırasında 7-9 saatlik oruç sonrası vücut, kas protein yıkımı üstün gelmeye başlar. Sabah yüksek protein içeren bir kahvaltı, bu yıkım sürecini anabolizm (yapım) lehine döndürür. Araştırmalar, sabah kahvaltısına 30-40 gram protein eklemenin günlük toplam protein sentezini öğleden ve akşamdan alınan eşdeğer miktarına kıyasla anlamlı biçimde artırdığını ortaya koymaktadır. Bu nedenle sabah kahvaltısını atlamak veya düşük proteinli geçiştirmek, özellikle kas koruma ve gelişimi hedefleyenler için maliyetli bir alışkanlıktır.
            </p>
            <p>
              Bu hesap makinesini üç ayda bir yeniden kullanmanızı öneririz. Kilo, aktivite düzeyi veya hedef değiştikçe optimum protein miktarı da değişir. Güncel verilerle hesaplanmış bir protein hedefi, hem sonuç almanızı hızlandırır hem de kaynaklarınızı en verimli şekilde kullanmanızı sağlar.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="protein" />
        <CalculatorFAQ title="Protein İhtiyacı Hesaplama" faqs={proteinIntakeFAQs} schemaUrl="https://gokalaf.com/araclar/protein-ihtiyaci" />
      </div>
    </div>
  );
}
