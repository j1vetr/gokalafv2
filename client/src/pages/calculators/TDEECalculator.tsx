import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, RotateCcw, Sofa, Footprints, Bike, Dumbbell, Flame } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { tdeeFAQs } from "@/components/CalculatorFAQ";

const activityIcons = {
  sedentary: Sofa,
  light: Footprints,
  moderate: Bike,
  very: Dumbbell,
  extra: Flame,
};

export default function TDEECalculator() {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const activityLevels = {
    sedentary: { label: "Hareketsiz", desc: "Ofis işi", multiplier: 1.2 },
    light: { label: "Hafif", desc: "1-3 gün/hafta", multiplier: 1.375 },
    moderate: { label: "Orta", desc: "3-5 gün/hafta", multiplier: 1.55 },
    very: { label: "Yoğun", desc: "6-7 gün/hafta", multiplier: 1.725 },
    extra: { label: "Ekstra", desc: "2x/gün", multiplier: 1.9 },
  };

  const calculateTDEE = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevels[activity as keyof typeof activityLevels].multiplier;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Enerji Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            TDEE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Hesaplama</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Günlük toplam enerji harcamanızı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Yaş</Label>
                    <span className="text-primary font-bold" data-testid="text-age-value">{age}</span>
                  </div>
                  <Slider value={[age]} onValueChange={(val) => setAge(val[0])} min={15} max={80} step={1} className="py-1" data-testid="slider-age" />
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
                  <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={140} max={220} step={1} className="py-1" data-testid="slider-height" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label className="text-gray-400 uppercase tracking-wider font-semibold">Kilo</Label>
                    <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                  </div>
                  <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={40} max={150} step={0.5} className="py-1" data-testid="slider-weight" />
                </div>
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
                            ? 'bg-primary/20 border-primary text-white' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                        data-testid={`button-activity-${key}`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${activity === key ? 'text-primary' : ''}`} />
                        <div className="text-[8px] font-semibold uppercase leading-tight">{val.label}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-500 text-center">{activityLevels[activity as keyof typeof activityLevels].desc}</p>
              </div>

              <Button 
                onClick={calculateTDEE} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-tdee"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Günlük Enerji Harcamanız</div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="text-4xl font-bold font-heading text-white" data-testid="text-tdee-result">{result.tdee}</span>
                    <span className="text-sm text-gray-500">kcal/gün</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">BMR</div>
                    <div className="text-lg font-bold text-white" data-testid="text-bmr">{result.bmr}</div>
                    <div className="text-[9px] text-gray-600">Bazal metabolizma</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Aktivite</div>
                    <div className="text-lg font-bold text-white">+{result.tdee - result.bmr}</div>
                    <div className="text-[9px] text-gray-600">Ekstra kalori</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider text-center">Hedefine Göre Kalori</div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <motion.div 
                      className="bg-gradient-to-r from-red-500/10 to-transparent p-3 rounded-xl border border-red-500/20"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="text-[10px] text-red-400 uppercase font-semibold">Hızlı Kilo Ver</div>
                      <div className="text-xl font-bold text-white" data-testid="text-weight-loss">{result.weightLoss}</div>
                      <div className="text-[9px] text-gray-500">-500 kcal/gün</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-yellow-500/10 to-transparent p-3 rounded-xl border border-yellow-500/20"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div className="text-[10px] text-yellow-400 uppercase font-semibold">Yavaş Kilo Ver</div>
                      <div className="text-xl font-bold text-white" data-testid="text-mild-loss">{result.mildLoss}</div>
                      <div className="text-[9px] text-gray-500">-250 kcal/gün</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-green-500/10 to-transparent p-3 rounded-xl border border-green-500/20"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-[10px] text-green-400 uppercase font-semibold">Yavaş Kas Yap</div>
                      <div className="text-xl font-bold text-white" data-testid="text-mild-gain">{result.mildGain}</div>
                      <div className="text-[9px] text-gray-500">+250 kcal/gün</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500/10 to-transparent p-3 rounded-xl border border-blue-500/20"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <div className="text-[10px] text-blue-400 uppercase font-semibold">Hızlı Kas Yap</div>
                      <div className="text-xl font-bold text-white" data-testid="text-weight-gain">{result.weightGain}</div>
                      <div className="text-[9px] text-gray-500">+500 kcal/gün</div>
                    </motion.div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-tdee"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Zap size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: TDEE Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            TDEE <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              TDEE, İngilizce "Total Daily Energy Expenditure" ifadesinin kısaltmasıdır ve Türkçeye <strong className="text-white">Toplam Günlük Enerji Harcaması</strong> olarak çevrilir. Adından da anlaşılacağı gibi, bir günde vücudunuzun tüm aktiviteleri için harcadığı toplam kalori miktarını ifade eder. Bu değer yalnızca egzersizi değil; dinlenirken, iş yaparken, yemek yerken ve uyurken harcanan enerjiyi de kapsar.
            </p>
            <p>
              TDEE'nin hesaplanması iki aşamadan oluşur. İlk aşamada <strong className="text-white">Bazal Metabolizma Hızı (BMR)</strong> hesaplanır. BMR, vücudun tamamen dinlenme halindeyken temel yaşamsal fonksiyonları — kalp atışı, solunum, vücut ısısı, sinir sistemi ve hücre yenilenmesi — için harcadığı enerjidir. Hesap makinemizde BMR için Mifflin-St Jeor denklemi kullanılmaktadır: erkekler için BMR = (10 × kilo) + (6.25 × boy) − (5 × yaş) + 5, kadınlar için ise bu formüle −161 eklenir.
            </p>
            <p>
              İkinci aşamada BMR değeri bir <strong className="text-white">aktivite çarpanıyla</strong> çarpılır. Bu çarpan, günlük hareketlilik düzeyinizi yansıtır. Aktivite çarpanları şu şekildedir: masa başı hareketsiz yaşam için 1.2, haftada 1-3 gün hafif egzersiz için 1.375, haftada 3-5 gün orta yoğunlukta egzersiz için 1.55, haftada 6-7 gün yoğun antrenman için 1.725 ve fiziksel iş ile günde iki kez antrenman kombinasyonu için 1.9 kullanılır.
            </p>
            <p>
              TDEE kavramı beslenme biliminde 1919'larda Harris ve Benedict'in çalışmalarına dayanır; ancak modern dünklemler çok daha fazla değişkeni hesaba katar. Günümüzde Mifflin-St Jeor (1990) ile Katch-McArdle (vücut yağ yüzdesini kullanan) denklemleri en yaygın ve doğru hesaplama yöntemleri olarak kabul görmektedir.
            </p>
            <p>
              TDEE ile kalori ihtiyacı arasındaki farka dikkat etmek gerekir. TDEE, kilonuzu <em>korumak</em> için tüketmeniz gereken kalori miktarını gösterir. Kilo vermek için bunun altında, kilo almak ya da kas kazanmak için ise üzerinde kalori tüketmeniz gerekir. Bu temel denge, beslenme planlamasının ve vücut kompozisyonu çalışmalarının temelidir.
            </p>
            <p>
              Hesaplama yaparken aktivite seviyenizi olduğundan yüksek seçmek çok yaygın yapılan bir hatadır. Haftada 4 gün antrenman yapıyor olsanız bile, günün geri kalanını masa başında geçiriyorsanız "orta aktif" kategorisi gerçeği en iyi yansıtan seçenek olacaktır. Aktivite seviyesini abartmak, kalori dengesini bozar ve hedeflere ulaşmayı zorlaştırır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Sonuçları Yorumlama */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            TDEE Sonuçlarını <span className="text-primary">Nasıl Yorumlamalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Hesap makinesi size dört farklı hedef için kalori değeri sunar. Bu değerlerin her biri farklı bir vücut kompozisyonu stratejisine karşılık gelir ve doğru seçim, hedefinize ve mevcut fiziksel durumunuza göre değişir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Hızlı Kilo Verme</div>
                <div className="text-white font-bold text-sm mb-2">TDEE − 500 kcal</div>
                <p className="text-gray-500 text-xs leading-relaxed">Haftada yaklaşık 0.45 kg kilo kaybına yol açar. Motivasyonu yüksek tutar ancak uzun vadede kas kaybı ve metabolizma yavaşlaması riski taşır. Kısa süreli müdahaleler için uygundur.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Yavaş Kilo Verme</div>
                <div className="text-white font-bold text-sm mb-2">TDEE − 250 kcal</div>
                <p className="text-gray-500 text-xs leading-relaxed">Haftada 0.2-0.3 kg kayıp. Kas kütlesini en iyi koruyan, sürdürülebilir ve uzun vadeli tercih. Yeni başlayanlar ve uzun süreli diyet geçmişi olanlar için ideal başlangıç noktasıdır.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Yavaş Kas Yapma</div>
                <div className="text-white font-bold text-sm mb-2">TDEE + 250 kcal</div>
                <p className="text-gray-500 text-xs leading-relaxed">Temiz bulk olarak bilinen bu strateji minimum yağ depolarken kas gelişimine olanak sağlar. Vücut yağ oranı %15-20 (erkek) veya %22-27 (kadın) üzerindeyse önerilen yaklaşımdır.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Hızlı Kas Yapma</div>
                <div className="text-white font-bold text-sm mb-2">TDEE + 500 kcal</div>
                <p className="text-gray-500 text-xs leading-relaxed">Daha agresif bir fazla kalori stratejisi. Kas gelişimini biraz hızlandırır ancak yağ birikimini de artırır. İnce yapılı, zor kilo alan bireylere daha uygundur.</p>
              </div>
            </div>

            <p>
              TDEE değeriniz yaşa, vücut kompozisyonuna ve antrenman geçmişinize göre önemli ölçüde değişir. Kas dokusu, yağ dokusuna kıyasla dinlenirken daha fazla kalori yakar. Bu yüzden kas kütlesi yüksek birinin TDEE'si, aynı kiloda ancak daha fazla vücut yağı olan birine göre belirgin şekilde daha yüksektir. Bu fark özellikle 10+ yıl direnç antrenmanı yapan sporcular için günlük 300-500 kcal'a kadar ulaşabilir.
            </p>
            <p>
              Kadınlarda TDEE döngüsel hormonal değişimler nedeniyle ay içinde farklılık gösterebilir. Luteal fazda (ovülasyondan âdete kadar) BMR yaklaşık 100-300 kcal artabilir; bu dönemde açlık hissinin artması tamamen fizyolojik bir tepkidir ve irade eksikliğiyle açıklanamaz.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            TDEE'yi Fitness Planında <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              TDEE, bir fitness planının merkezinde yer alması gereken değerdir. Antrenman programı ne kadar iyi yazılmış olursa olsun, kalori dengesi doğru kurulmadan vücut kompozisyonunda anlamlı değişimler elde etmek son derece güçtür. TDEE'yi bir "sıfır noktası" olarak düşünebilirsiniz: bu değerin altında kalırsanız kilo verirsiniz, üzerinde çıkarsanız kilo alırsınız.
            </p>
            <p>
              Pratikte TDEE'nin gerçek bir araç olarak çalışabilmesi için onu <strong className="text-white">refeeding stratejisiyle</strong> birleştirmek önerilir. Kalori kısıtlaması sürecinde metabolizma zamanla uyum sağlar ve enerji harcaması düşebilir; bu olguya "metabolik adaptasyon" denir. Bunu önlemek için her 8-12 haftada bir 1-2 haftalık ara verme ya da TDEE seviyesine çıkma dönemleri planlanabilir. Bu strateji hem metabolizmayı canlı tutar hem de psikolojik yükü azaltır.
            </p>
            <p>
              TDEE değerinizin ne kadar doğru olduğunu anlamak için en iyi yöntem <strong className="text-white">iki haftalık kilo takibi</strong> yapmaktır. Hesaplanan TDEE kadar yiyin ve kilonuzun nasıl değiştiğini gözlemleyin. Kilo sabit kalıyorsa hesap doğrudur. Her hafta artıyorsa gerçek TDEE'niz hesaplananın altındadır; düşüyorsa üstündedir. Bu kişisel kalibrasyon, formül tabanlı hesaplamanın öngöremediği bireysel metabolizma farklarını ortaya çıkarır.
            </p>
            <p>
              TDEE'yi antrenman döngülerinize göre dinamik olarak ayarlamak da büyük fark yaratır. Yoğun antrenman dönemlerinde (hacim fazı, yarışma hazırlığı vb.) kalori ihtiyacı artarken, aktif dinlenme ya da deload haftalarında düşer. Sabit bir kalori hedefine takılı kalmak yerine, haftalık antrenman yüküyle paralel bir beslenme yaklaşımı benimsemek hem performansı hem de vücut kompozisyonu sonuçlarını iyileştirir.
            </p>
            <p>
              Son olarak TDEE hesabını <strong className="text-white">makro hesaplayıcısıyla birlikte kullanmayı</strong> öneririz. Toplam kalori hedefinizi belirledikten sonra bu kalorileri protein, karbonhidrat ve yağ olarak nasıl dağıtacağınızı belirlemek, özellikle kas koruma ve kas kazanımı süreçlerinde kritik önem taşır. TDEE size "ne kadar yiyeceğini", makro dağılımı ise "ne yiyeceğini" söyler; ikisi birlikte tam bir beslenme stratejisi oluşturur.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="tdee" />
        <CalculatorFAQ title="TDEE Hesaplama" faqs={tdeeFAQs} schemaUrl="https://gokalaf.com/araclar/tdee-hesaplama" />
      </div>
    </div>
  );
}
