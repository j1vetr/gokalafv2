import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Droplets, RotateCcw, GlassWater, Sun, Thermometer, Sofa, Footprints, Bike, Dumbbell, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { waterIntakeFAQs } from "@/components/CalculatorFAQ";

const activityIcons = { sedentary: Sofa, light: Footprints, moderate: Bike, active: Dumbbell, athlete: Flame };
const climateIcons = { cold: Thermometer, normal: Sun, hot: Flame, veryHot: Flame };

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("normal");
  const [result, setResult] = useState<{ liters: number; glasses: number; hourly: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz", mult: 0.9 },
    light: { label: "Hafif", mult: 1.0 },
    moderate: { label: "Orta", mult: 1.15 },
    active: { label: "Aktif", mult: 1.3 },
    athlete: { label: "Sporcu", mult: 1.5 },
  };

  const climates = {
    cold: { label: "Soğuk", mult: 0.9 },
    normal: { label: "Normal", mult: 1.0 },
    hot: { label: "Sıcak", mult: 1.2 },
    veryHot: { label: "Çok Sıcak", mult: 1.4 },
  };

  const calculateWaterIntake = () => {
    let baseWater = weight * 0.033;
    baseWater *= activityLevels[activity as keyof typeof activityLevels].mult;
    baseWater *= climates[climate as keyof typeof climates].mult;

    setResult({
      liters: parseFloat(baseWater.toFixed(1)),
      glasses: Math.round(baseWater * 4),
      hourly: parseFloat((baseWater / 16).toFixed(2)),
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Günlük Su İhtiyacı Hesaplama | Su Tüketimi Hesaplayıcı - Gokalaf"
        description="Günlük su ihtiyacınızı hesaplayın. Kilo, aktivite seviyesi ve hava durumuna göre ne kadar su içmeniz gerektiğini öğrenin."
        keywords="günlük su ihtiyacı, su tüketimi hesaplama, ne kadar su içmeliyim, su hesaplayıcı, sağlıklı su tüketimi"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Su Tüketimi Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/su-tuketimi",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Hidrasyon
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Su <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">İhtiyacı</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Günlük su tüketim miktarınızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Droplets className="w-4 h-4 text-blue-400" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                  <span className="text-blue-400 font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={1} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Aktivite Seviyesi</Label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(activityLevels).map(([key, val]) => {
                    const Icon = activityIcons[key as keyof typeof activityIcons];
                    return (
                      <button
                        key={key}
                        onClick={() => setActivity(key)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          activity === key 
                            ? 'bg-blue-500/20 border-blue-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-activity-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${activity === key ? 'text-blue-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">İklim</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(climates).map(([key, val]) => {
                    const Icon = climateIcons[key as keyof typeof climateIcons];
                    return (
                      <button
                        key={key}
                        onClick={() => setClimate(key)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          climate === key 
                            ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-climate-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-0.5 ${climate === key ? 'text-cyan-400' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={calculateWaterIntake} 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-water"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Günlük Su İhtiyacınız</div>
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="10" />
                      <motion.circle 
                        cx="64" cy="64" r="56" 
                        fill="none" 
                        stroke="url(#waterGradient)" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 352" }}
                        animate={{ strokeDasharray: `${(result.liters / 5) * 352} 352` }}
                        transition={{ duration: 0.8 }}
                      />
                      <defs>
                        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-400 mb-1" />
                      <div className="text-3xl font-bold font-heading text-white" data-testid="text-water-liters">{result.liters}</div>
                      <div className="text-[10px] text-gray-500">litre</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 rounded-xl border border-blue-500/20 text-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GlassWater className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Bardak</div>
                    <div className="text-2xl font-bold text-blue-400" data-testid="text-water-glasses">{result.glasses}</div>
                    <div className="text-[9px] text-gray-500">(250ml)</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-4 rounded-xl border border-cyan-500/20 text-center"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-[10px] text-gray-500 uppercase">Saatlik</div>
                    <div className="text-2xl font-bold text-cyan-400" data-testid="text-water-hourly">{result.hourly}L</div>
                    <div className="text-[9px] text-gray-500">(uyanık)</div>
                  </motion.div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Günlük Dağılım</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {["Sabah", "Öğle", "Akşam", "Gece"].map((time, i) => (
                      <div key={time} className="p-2 bg-white/5 rounded-lg">
                        <div className="text-[9px] text-gray-500">{time}</div>
                        <div className="text-sm font-bold text-white">{Math.round(result.glasses / 4)}</div>
                        <div className="text-[8px] text-gray-600">bardak</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-water"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Droplets size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: Su Tüketimi Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Günlük Su İhtiyacı <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Su, insan vücudunun yüzde 60'ını oluşturan ve neredeyse tüm metabolik süreçlerin temelini oluşturan vazgeçilmez bir bileşendir. Besin maddelerini taşımak, vücut ısısını düzenlemek, eklemleri yağlamak, atık maddeleri uzaklaştırmak ve biyokimyasal reaksiyonlara ortam hazırlamak suyun başlıca görevleri arasındadır. Yeterli su tüketimi, hem sağlık hem de fiziksel performans açısından kalori ya da protein kadar kritik öneme sahiptir.
            </p>
            <p>
              Günlük su ihtiyacı kişiden kişiye önemli ölçüde değişir. Bu hesap makinesi, vücut ağırlığınızı, aktivite düzeyinizi ve iklim koşullarınızı birlikte değerlendirerek kişiselleştirilmiş bir tavsiye sunar. Yaygın kullanılan temel formül; vücut ağırlığının kilogramı başına <strong className="text-white">30-35 ml su</strong> olarak hesaplanmasıdır. Buna göre 70 kg bir birey için günlük temel su ihtiyacı 2.1-2.45 litre olarak belirlenir.
            </p>
            <p>
              Egzersiz, su ihtiyacını önemli ölçüde artırır. Orta yoğunlukta bir antrenman sırasında vücut saatte 0.5 ila 1.5 litre arasında ter yoluyla su kaybeder. Bu kaybı yerine koymak için antrenman öncesinde 400-600 ml su içmek, egzersiz sırasında her 15-20 dakikada bir 150-250 ml tüketmek ve antrenman sonrasında kaybedilen her yarım kilogram için 600 ml ek su almak önerilir.
            </p>
            <p>
              Sıcak ve nemli iklimlerde ter üretimi artar, dolayısıyla su ihtiyacı yükselir. Yüksek irtifada da solunum yoluyla su kaybı arttığı için günlük alımın artırılması gerekir. Hamilelik ve emzirme dönemlerinde de su ihtiyacı belirgin biçimde yükselir. Bu hesap makinesi bu faktörleri dikkate alarak temel değeri ayarlar.
            </p>
            <p>
              Suyun sadece içeceklerden değil, besinlerden de karşılandığını hatırlatmak gerekir. Meyveler, sebzeler, çorbalar ve süt gibi besinler, günlük su ihtiyacının yüzde 20-30'unu karşılayabilir. Ancak hesap makineleri genellikle içecek olarak alınması gereken miktarı verir; bu nedenle günlük ölçümünüzü yalnızca sıvı alımınız üzerinden değerlendirmeniz önerilir.
            </p>
            <p>
              Kafein içeren içecekler (kahve, çay) hafif diüretik etkiye sahiptir ancak ölçülü tüketimde su kaybına yol açmaz. Alkol ise gerçek anlamda dehidrasyon yapan bir maddedir; içilen her alkollü içecek için en az bir bardak su içmek iyi bir pratik kuraldır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Dehidrasyon ve Belirtileri */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Dehidrasyon <span className="text-primary">Belirtileri ve Etkileri</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Hafif (%1-2)</div>
                <p className="text-gray-500 text-xs leading-relaxed">Susuzluk hissi, hafif baş ağrısı, konsantrasyon güçlüğü, yorgunluk. Spor performansı yüzde 5-10 oranında düşer. İdrar rengi koyu sarıya döner.</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="text-orange-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Orta (%2-5)</div>
                <p className="text-gray-500 text-xs leading-relaxed">Belirgin yorgunluk, koordinasyon bozukluğu, kas krampları, mide bulantısı. Aerobik kapasite yüzde 20'ye kadar düşebilir. Bilişsel işlevler ciddi ölçüde zayıflar.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Ağır (%5+)</div>
                <p className="text-gray-500 text-xs leading-relaxed">Baş dönmesi, hızlı kalp atışı, bilinç bulanıklığı, acil tıbbi müdahale gerekebilir. Isı çarpması ve uzun vadeli organ hasarı riski ciddi düzeye ulaşır.</p>
              </div>
            </div>
            <p>
              Thirst (susuzluk) mekanizması, hafif dehidrasyon için bile geç devreye girer. Yani susuzluk hissettiren zaman, vücudun zaten yüzde 1-2 oranında su kaybettiği andır. Bu yüzden "susayınca iç" kuralı, optimal hidrasyon için yeterli değildir. Gün boyunca düzenli aralıklarla su içmek, susuzluk hissi beklemekten çok daha etkili bir stratejidir.
            </p>
            <p>
              <strong className="text-white">İdrar rengi</strong>, hidrasyon durumunuzu değerlendirmenin en kolay ve güvenilir yöntemlerinden biridir. Açık sarı (limonata rengi) iyi hidrasyon, koyu sarı veya kahverengi ise yetersiz su alımına işaret eder. Sabah ilk idrarda koyu renk normaldir; gün içinde soluk renge dönmesi hedeflenir. Renksiz idrar ise aşırı su tüketiminin göstergesi olabilir; bu da elektrolit dengesini bozabilir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Su Stratejisi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Fitness Sürecinde <span className="text-primary">Su Tüketim Stratejisi</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Düzenli egzersiz yapan bireyler için su yönetimi, performans ve iyileşme sürecinin ayrılmaz bir parçasıdır. Antrenman öncesi, sırası ve sonrasında su alımını planlamak, yalnızca sağlık için değil atletik performans için de kritik öneme sahiptir.
            </p>
            <p>
              <strong className="text-white">Antrenman öncesi:</strong> Egzersizden 2-3 saat önce 500-600 ml su içmek, antrenmanı tam hidrate başlamanızı sağlar. Antrenmanın hemen öncesinde (15-30 dakika önce) ek 200-300 ml almak da önerilir. Eğer sabah erken antrenman yapıyorsanız, uyku sırasında oluşan su kaybını karşılamak için sabah kalkışında en az bir büyük bardak (300-400 ml) su içmeyi alışkanlık haline getirin.
            </p>
            <p>
              <strong className="text-white">Antrenman sırasında:</strong> Her 15-20 dakikada bir 150-250 ml su tüketimi genel öneri olarak kabul görmektedir. 60 dakikadan uzun veya yoğun terlemenin yaşandığı antrenmanlarda sodyum içeren sporcu içecekleri ya da elektrolit takviyesi, yalnızca suya kıyasla daha etkin bir hidrasyon sağlar.
            </p>
            <p>
              <strong className="text-white">Antrenman sonrası:</strong> Kaybedilen her 0.5 kg vücut ağırlığı için yaklaşık 600-750 ml sıvı alınması önerilir. Bu nedenle antrenmandan önce ve sonra tartılmak, kayıp miktarını doğru belirlemenize yardımcı olur. Antrenman sonrası su alımını protein ve karbonhidratlı bir öğün ya da içecekle birleştirmek, kasların glikojen depolarını yenilemesini ve iyileşme sürecini hızlandırır.
            </p>
            <p>
              Günlük su hedefini tutturmayı kolaylaştıran pratik alışkanlıklar: her sabah kalkışta bir bardak su içmek, her öğünde su ile başlamak, çalışma ortamında görünür bir su şişesi bulundurmak ve gün içinde hatırlatıcı alarmlar kurmak. Bu küçük alışkanlıklar, bilincinde olmadan günlük hedefinizin büyük bölümünü karşılamanızı sağlar.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 4: Google Odaklı Uzman Rehberi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Su İçme Alışkanlığı Hakkında <span className="text-primary">Sık Sorulan Sorular ve Uzman Tavsiyeleri</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              "Günde kaç litre su içmeliyim?" sorusu, sağlık ve beslenme alanında en sık aranan sorular arasında yer alır. Yanıt kişiden kişiye önemli ölçüde değişse de bu rehberde hem genel ilkeleri hem de bireysel ince ayarı yapmanıza yardımcı olacak bilimsel verileri paylaşıyoruz.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Günde 8 Bardak Su Gerçekten Yeterli Mi?</h3>
            <p>
              "Günde 8 bardak su için" tavsiyesi yaygın olmakla birlikte bilimsel bir temelden yoksundur. Bu ifade, muhtemelen 1945 tarihli bir ABD Gıda ve Beslenme Kurulu önerisinin yanlış yorumlanmasından kaynaklanmaktadır. Söz konusu öneri, günlük 2-2.5 litre suyun büyük bölümünün besinlerden karşılandığını da açıkça belirtmiştir. Güncel araştırmalar, "8 bardak" gibi sabit bir hedef yerine bireysel ihtiyaca göre belirlenen miktarın çok daha uygun olduğu sonucuna varıyor. Bu hesap makinesinin sunduğu kişiselleştirilmiş değer, bu nedenle sabit hedeflerden çok daha değerlidir.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Aşırı Su İçmek Zararlı Olabilir Mi?</h3>
            <p>
              Evet, nadir ancak ciddi bir durum olan hiponatremi (kan sodyumunun aşırı seyrelmesi), gereğinden fazla su tüketimiyle tetiklenebilir. Bu risk özellikle uzun mesafe koşularında veya aşırı terleme olmaksızın çok miktarda su tüketildiğinde ortaya çıkar. Günlük 4-5 litrenin üzerindeki su tüketimi sağlıklı yetişkinler için dikkat gerektirir. Normal koşullarda böbrekler sağlıklı bir insanın saatte yaklaşık 0.8-1 litre su atabilir; bu üst sınırın farkında olmak, aşırı su tüketiminden korunmanın ilk adımıdır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Suyun Kilo Vermeye Etkisi Var Mı?</h3>
            <p>
              Araştırmalar, yemekten önce 500 ml su içmenin kalori alımını ortalama yüzde 13 azalttığını göstermektedir. Bunun nedeni mide hacminin geçici olarak dolması ve tokluk sinyallerinin tetiklenmesidir. 12 haftalık bir çalışmada, yemekten önce su içen grup yemekten önce su içmeyen gruba kıyasla iki kat daha fazla kilo kaybetti. Soğuk su içmek ise vücudun suyu vücut sıcaklığına getirme çabası sayesinde çok küçük bir kalori harcamasına neden olur (yaklaşık 8-12 kcal/bardak); bu etki pratik açıdan anlamlı değildir ancak var olan tüm stratejilerin bir toplamı olarak değer taşır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Sporculara Özel Su Tüketim Rehberi</h3>
            <p>
              Profesyonel sporcularda ve yoğun antrenman yapanlarda su ihtiyacı dramatik biçimde artar. Maraton veya uzun mesafeli bisiklet gibi dayanıklılık sporlarında seans başına 2-4 litreye kadar çıkabilen sıvı kaybı söz konusudur. Bu düzeyde kayıplar yalnızca suyla değil, elektrolitlerle (sodyum, potasyum, magnezyum) birlikte yerine konulmalıdır. Hiponatreminin büyük bölümü, uzun etkinliklerde sadece su içen ve elektrolit almayan sporcuların başına gelir. Bir saatten uzun süren etkinliklerde sodyum içeren sporcu içecekleri veya elektrolit takviyeleri, yalnızca suya kıyasla çok daha üstün bir hidrasyon sağlar.
            </p>
            <p>
              Günlük su tüketiminizi artırmanın en kolay yolu alışkanlık yığımlama tekniğidir: her kahve veya çay içişinizden sonra bir bardak su, her öğün öncesi bir bardak su ve her antrenman öncesi-sonrası su gibi mevcut alışkanlıklara su içmeyi bağlamak, bilinçli bir çaba harcamadan günlük hedefinizi tutturmanızı sağlar.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="su-tuketimi" />
        <CalculatorFAQ title="Su Tüketimi Hesaplama" faqs={waterIntakeFAQs} schemaUrl="https://gokalaf.com/araclar/su-tuketimi" />
      </div>
    </div>
  );
}
