import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, RotateCcw, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { bmiFAQs } from "@/components/CalculatorFAQ";

const bmiCategories = [
  { min: 0, max: 18.5, label: "Zayıf", color: "bg-blue-500", textColor: "text-blue-400" },
  { min: 18.5, max: 25, label: "Normal", color: "bg-green-500", textColor: "text-green-400" },
  { min: 25, max: 30, label: "Fazla Kilolu", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { min: 30, max: 50, label: "Obez", color: "bg-red-500", textColor: "text-red-400" },
];

export default function BMICalculator() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
  const [bmi, setBmi] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateBMI = () => {
    const h = height / 100;
    const result = weight / (h * h);
    setBmi(parseFloat(result.toFixed(1)));
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: "Zayıf", color: "text-blue-400", bg: "bg-blue-500", desc: "Kalori alımını artırmalısın.", icon: TrendingUp };
    if (val < 25) return { label: "Normal", color: "text-green-400", bg: "bg-green-500", desc: "Formunu korumaya devam et!", icon: Minus };
    if (val < 30) return { label: "Fazla Kilolu", color: "text-yellow-400", bg: "bg-yellow-500", desc: "Kalori açığı oluşturmalısın.", icon: TrendingDown };
    return { label: "Obez", color: "text-red-400", bg: "bg-red-500", desc: "Profesyonel destek almalısın.", icon: TrendingDown };
  };

  const getIdealWeight = () => {
    const h = height / 100;
    const minWeight = 18.5 * h * h;
    const maxWeight = 24.9 * h * h;
    return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1) };
  };

  const getGaugePosition = (val: number) => {
    const minBmi = 15;
    const maxBmi = 40;
    const clampedVal = Math.max(minBmi, Math.min(maxBmi, val));
    return ((clampedVal - minBmi) / (maxBmi - minBmi)) * 100;
  };

  const status = bmi ? getBMIStatus(bmi) : null;
  const idealWeight = getIdealWeight();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="Vücut Kitle İndeksi (BMI) Hesaplama | Ücretsiz VKİ Hesaplayıcı - Gokalaf"
        description="Vücut kitle indeksi (BMI) hesaplama aracı ile boy ve kilonuza göre VKİ değerinizi anında öğrenin. Ücretsiz online BMI hesaplayıcı."
        keywords="vücut kitle indeksi hesaplama, bmi hesaplama, vki hesaplama, boy kilo indeksi, ideal kilo hesaplama"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Vücut Kitle İndeksi (BMI) Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/vucut-kitle-indeksi",
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
            Sağlık Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Vücut Kitle <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">İndeksi</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Boy ve kilonuza göre BMI değerinizi hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-5 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Scale className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Cinsiyet</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-10 text-white text-sm" data-testid="select-gender">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateBMI} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-11 text-sm"
                data-testid="button-calculate-bmi"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div ref={resultRef} className="lg:col-span-3 bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col justify-center">
            {bmi ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">VKİ Değeriniz</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-heading text-white" data-testid="text-bmi-result">{bmi}</span>
                      <span className="text-sm text-gray-500">kg/m²</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${status?.bg} text-black border-none font-bold uppercase text-xs px-3 py-1`} data-testid="badge-bmi-status">
                      {status?.label}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1.5 max-w-[140px]" data-testid="text-bmi-description">{status?.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
                    {bmiCategories.map((cat, i) => (
                      <div 
                        key={i} 
                        className={`${cat.color} h-full`}
                        style={{ width: `${((cat.max - cat.min) / 35) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative h-4">
                    <motion.div 
                      className="absolute top-0 w-0.5 h-4 bg-white rounded-full"
                      initial={{ left: "0%" }}
                      animate={{ left: `${getGaugePosition(bmi)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">İdeal Kilo Aralığı</div>
                    <div className="text-lg font-bold text-white">{idealWeight.min} - {idealWeight.max} <span className="text-xs text-gray-400">kg</span></div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Mevcut Durumunuz</div>
                    <div className={`text-lg font-bold ${status?.color}`}>
                      {weight < parseFloat(idealWeight.min) && `${(parseFloat(idealWeight.min) - weight).toFixed(1)} kg eksik`}
                      {weight > parseFloat(idealWeight.max) && `${(weight - parseFloat(idealWeight.max)).toFixed(1)} kg fazla`}
                      {weight >= parseFloat(idealWeight.min) && weight <= parseFloat(idealWeight.max) && "İdeal aralıkta"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">BMI Kategorileri</div>
                  <div className="grid grid-cols-4 gap-2">
                    {bmiCategories.map((cat, i) => (
                      <div 
                        key={i} 
                        className={`text-center p-2 rounded-lg ${bmi >= cat.min && bmi < cat.max ? 'bg-white/10 ring-1 ring-primary' : 'bg-white/5'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${cat.color} mx-auto mb-1`}></div>
                        <div className="text-[10px] text-gray-400">{cat.label}</div>
                        <div className="text-[9px] text-gray-600">{cat.min}-{cat.max}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setBmi(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-bmi"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Activity size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: Nedir & Nasıl Hesaplanır */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Vücut Kitle İndeksi <span className="text-primary">Nedir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Vücut Kitle İndeksi (VKİ), ya da uluslararası adıyla Body Mass Index (BMI), bir kişinin kilogram cinsinden vücut ağırlığının metre cinsinden boyunun karesine bölünmesiyle elde edilen bir ölçümdür. Formül son derece basittir: <strong className="text-white">VKİ = Kilo (kg) / Boy² (m²)</strong>. Örneğin 80 kg ağırlığında, 1.80 m boyunda bir kişinin VKİ değeri 80 / (1.80 × 1.80) = <strong className="text-primary">24.7</strong> olarak hesaplanır.
            </p>
            <p>
              Bu ölçüm, ilk kez 1830'lu yıllarda Belçikalı istatistikçi Adolphe Quetelet tarafından geliştirilmiş ve başlangıçta bireysel sağlık değerlendirmesi için değil, toplumların genel vücut ağırlığı dağılımını incelemek amacıyla kullanılmıştır. Quetelet İndeksi olarak bilinen bu formül, 1970'lerde Ancel Keys'in kapsamlı araştırmaları sonucunda "Vücut Kitle İndeksi" adını almış ve modern tıp dünyasında standart bir ölçüm aracı haline gelmiştir.
            </p>
            <p>
              VKİ'nin bu denli yaygınlaşmasının temel nedeni pratikliğidir. Özel bir ekipman gerektirmez, hesaplaması dakikalar içinde tamamlanır ve tüm dünyada ortak bir referans çerçevesi sunar. Dünya Sağlık Örgütü (WHO), VKİ'yi popülasyon düzeyinde obezite ve aşırı kilo takibinde birincil gösterge olarak kabul etmektedir. Türkiye'de de aile hekimliğinden beslenme danışmanlığına, spor biliminden sigorta değerlendirmelerine kadar pek çok alanda aktif biçimde kullanılmaktadır.
            </p>
            <p>
              VKİ hesabında kullanılan iki değişken — boy ve kilo — vücudun gerçek kompozisyonu hakkında sınırlı bilgi verse de, büyük popülasyonlarda kardiyovasküler hastalık riski, tip 2 diyabet, hipertansiyon ve bazı kanser türleriyle istatistiksel olarak anlamlı bir korelasyon göstermektedir. Bu nedenle tek başına tanı koydurucu bir araç olmasa da, kapsamlı bir sağlık değerlendirmesinin olmazsa olmaz başlangıç adımlarından biri olarak kabul görmektedir.
            </p>
            <p>
              Hesaplama yaparken dikkat edilmesi gereken birkaç nokta vardır. Boy değerini sabah ölçmek daha doğrudur çünkü gün içinde omurga hafifçe sıkışır ve boyunuz 1-2 cm azalabilir. Kilo ölçümünü ise sabah aç karnına, tercihen tuvaletten sonra yapmanız en tutarlı sonucu verecektir. Bu şekilde elde ettiğiniz VKİ değeri, zaman içindeki değişimi takip etmek için güvenilir bir baz referans noktası oluşturur.
            </p>
            <p>
              Sonuç olarak VKİ, vücut ağırlığının sağlık üzerindeki potansiyel etkisini hızla değerlendirmenin en kolay yollarından biridir. Doğru yorumlandığında, beslenme planınızı optimize etmek, hedef kilonuzu belirlemek veya sağlık profesyonelleriyle daha verimli görüşmeler yapmak için sağlam bir başlangıç noktası sağlar.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Sonuçlar Ne Anlama Gelir */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            VKİ Değerleri <span className="text-primary">Ne Anlama Gelir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              WHO'nun belirlediği standart sınıflandırmaya göre VKİ değerleri dört ana kategoriye ayrılır. Bu kategorilerin her biri, farklı sağlık risklerini ve yaşam tarzı önerilerini beraberinde getirir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Zayıf</div>
                <div className="text-white font-bold text-lg mb-1">VKİ &lt; 18.5</div>
                <p className="text-gray-500 text-xs leading-relaxed">Yetersiz kalori alımı, kas kaybı riski, bağışıklık sistemi zayıflığı ve kemik yoğunluğu kaybı görülebilir. Hipotiroidi, yeme bozukluğu veya kronik hastalıkların belirtisi olabilir. Öncelikle altta yatan neden araştırılmalıdır.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Normal</div>
                <div className="text-white font-bold text-lg mb-1">18.5 – 24.9</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kardiyovasküler hastalık, tip 2 diyabet ve hipertansiyon riski en düşük aralıktır. Ancak bu aralıkta olmak, yüksek yağ oranı ve düşük kas kütlesine sahip "normal kilolu obez" bireyler için yanıltıcı olabilir.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="text-yellow-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Fazla Kilolu</div>
                <div className="text-white font-bold text-lg mb-1">25 – 29.9</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kronik hastalık riski yükselmeye başlar. Özellikle bel çevresi 94 cm'yi (erkek) veya 80 cm'yi (kadın) aşıyorsa risk anlamlı düzeyde artar. Kalori kısıtlaması ve düzenli egzersizle bu kategoriden çıkmak mümkündür.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Obez</div>
                <div className="text-white font-bold text-lg mb-1">VKİ ≥ 30</div>
                <p className="text-gray-500 text-xs leading-relaxed">Tip 2 diyabet, kalp hastalığı, uyku apnesi, eklem problemleri ve bazı kanser türleri için risk belirgin biçimde artar. Profesyonel destek alınması ve kapsamlı bir yaşam tarzı değişikliği önerilir.</p>
              </div>
            </div>

            <p>
              Yaş faktörü de VKİ yorumunu etkiler. 65 yaş ve üzeri bireylerde 22-27 arasındaki bir VKİ değeri normal kabul edilir çünkü hafif fazla kilo, yaşlılıkta oluşabilecek kas ve kemik kaybına karşı koruyucu bir etki gösterebilir. Çocuk ve ergenler için ise yaşa ve cinsiyete özgü persentil tabloları kullanılır; yetişkin kategorileri direkt uygulanamaz.
            </p>
            <p>
              Etnik köken de göz ardı edilmemelidir. Asya kökenli bireylerde aynı VKİ değerinde kardiyovasküler risk Avrupalı bireylere kıyasla daha yüksek olduğundan, bu popülasyon için sınır değerler daha düşük tutulmaktadır (fazla kilo eşiği 23, obezite eşiği 27.5). Türk toplumunu kapsayan araştırmalar da bu eşiklerin etnik farklılığa göre yeniden değerlendirilmesi gerektiğine işaret etmektedir.
            </p>
            <p>
              VKİ değerinizin sınır bölgede olduğu durumlarda (örn. 24.5 veya 25.5 gibi eşiğe yakın değerler), tek başına bu ölçümü belirleyici kabul etmemek gerekir. Bel çevresi, bel-kalça oranı ve vücut yağ yüzdesi gibi tamamlayıcı ölçümlerle bir bütün olarak değerlendirme yapmak çok daha sağlıklı bir tablo ortaya koyar.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness ile Bağlantısı */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            VKİ'yi Fitness Sürecinde <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              VKİ, fitness hedefleri koyarken kullanışlı bir başlangıç noktasıdır; ancak tek başına yeterli bir rehber değildir. Özellikle düzenli egzersiz yapan kişiler için bu ölçümün ciddi sınırlılıkları bulunur. Kas dokusu, yağ dokusuna kıyasla daha yoğundur ve daha ağırdır. Bu nedenle düzenli direnç antrenmanı yapan bir sporcu, gerçekte çok düşük bir vücut yağ yüzdesine sahip olmasına karşın VKİ hesabına göre "fazla kilolu" hatta "obez" kategorisinde yer alabilir. Ünlü bir örnek üzerinden düşünürsek: pek çok dünya güreşi şampiyonu ya da olimpik halterci, BMI hesabına göre "obez" sınırındadır.
            </p>
            <p>
              Bu sınırlılığı aşmak için VKİ'yi diğer ölçümlerle birlikte kullanmak gerekir. <strong className="text-white">Vücut yağ yüzdesi</strong> ölçümü, vücudunuzdaki yağ dokusu ile yağsız kütleyi (kas, kemik, organlar) birbirinden ayırt eder; bu nedenle fitness ilerlemenizi takip etmede çok daha anlamlı bir göstergedir. <strong className="text-white">Bel çevresi</strong> ölçümü ise özellikle visseral yağ (iç organ yağı) birikimini yansıtır ve kardiyovasküler risk açısından VKİ'ye göre daha güçlü bir öngörücüdür.
            </p>
            <p>
              Pratik bir yaklaşım olarak şu üç ölçümü birlikte kullanabilirsin: VKİ, bel-kalça oranı ve kilo. Bu üç metriğin zaman içindeki değişimini aylık olarak takip etmek, vücudunun nasıl dönüştüğünü çok daha net biçimde ortaya koyar. Fotoğraf çekmek de nesnel bir geri bildirim aracı olarak bu süreci destekler.
            </p>
            <p>
              Hedef belirleme sürecinde VKİ'yi şöyle kullanabilirsin: mevcut VKİ değerine göre kaba bir yol haritası çiz, ardından bu hedefi TDEE hesabıyla birleştirerek günlük kalori hedefini belirle. Kilo vermek istiyorsan ve VKİ değerin 27'nin üzerindeyse, haftada 0.5-1 kg kayıp sağlayacak bir kalori açığı (genellikle günlük 300-500 kcal) sürdürülebilir ve sağlıklı bir stratejidir. Kas kazanımı hedefliyorsan ve VKİ değerin 18.5-22 arasındaysa, kalori fazlası ve yüksek protein alımıyla kombine bir direnç antrenmanı programı en hızlı sonucu verecektir.
            </p>
            <p>
              Bir başka önemli nokta: VKİ değerinde kısa sürede dramatik değişimler beklemek gerçekçi değildir. 80 kg'dan 75 kg'a inmek, 1.75 m'lik bir kişi için VKİ değerini yalnızca yaklaşık 1.6 puan düşürür. Bu yüzden VKİ'yi haftadan haftaya değil, aylık veya üç aylık dönemlerde değerlendirmek hem motivasyonunu korumanı hem de gerçekçi beklentiler içinde kalmayı kolaylaştırır.
            </p>
            <p>
              Sonuç olarak VKİ; nerede durduğunu anlaman, ilerlemeyi izlemen ve hedef aralığını belirlemen için değerli bir araçtır. Ama spor performansını, kas kütleni ve gerçek sağlık durumunu yansıtmaz. En sağlıklı yaklaşım, VKİ'yi bir ön değerlendirme olarak almak ve bunu diğer ölçümler, beslenme verileri ve antrenman ilerlemenle birlikte bir bütün olarak yorumlamaktır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 4: Google Odaklı Uzman Rehberi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            VKİ Hesabının <span className="text-primary">Sınırları ve Doğru Yorumlama Rehberi</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Vücut Kitle İndeksi, 1832 yılında Belçikalı matematikçi Adolphe Quetelet tarafından geliştirilen ve bugün dünyanın en yaygın kullanılan sağlık ölçümlerinden biri olmayı sürdüren bir formüldür. Ancak Quetelet bu formülü bireysel sağlık değerlendirmesi için değil, nüfus istatistikleri için tasarlamıştı. Bu önemli tarihsel bağlamı göz önünde bulundurduğumuzda, VKİ'nin hem güçlü hem de zayıf yönlerini çok daha net biçimde anlayabiliriz.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">VKİ Neden Her Zaman Yeterli Değil?</h3>
            <p>
              VKİ'nin en temel sorunu, vücut ağırlığını oluşturan bileşenleri ayırt edememesidir. Kas dokusu, yağ dokusundan çok daha yoğundur; bu nedenle yüksek kas kütlesine sahip bir atlet, aynı boydaki hareketsiz bir bireyle aynı VKİ değerini paylaşabilir. Dünya Sağlık Örgütü sınıflandırmasına göre "obez" kategorisine giren bir powerlifting sporcusu, gerçekte yüzde 12 vücut yağıyla son derece sağlıklı bir tabloya sahip olabilir. Bu nedenle VKİ, kas kütlesi yüksek bireyler için yanıltıcı sonuçlar üretir.
            </p>
            <p>
              Yaş da VKİ yorumlamada önemli bir faktördür. İleri yaşlarda kemik yoğunluğu azalırken kas kütlesi düşer; bu durum, gerçek vücut yağ yüzdesinin VKİ'nin öngördüğünden çok daha yüksek olmasına yol açabilir. 65 yaş üzeri bireylerde normal kabul edilen VKİ aralığının biraz daha geniş tutulması (22-27 arası) klinik pratikle daha uyumludur.
            </p>
            <p>
              Etnik köken de VKİ eşiklerini etkiler. Asya kökenli bireyler için kronik hastalık riski, standart Batı normlarına göre daha düşük VKİ değerlerinde başlar. Dünya Sağlık Örgütü, Asya popülasyonu için "aşırı kilo" sınırını 25 yerine 23 olarak önermektedir. Bu farkı bilmek, özellikle farklı etnik geçmişlere sahip bireyler için doğru risk değerlendirmesi açısından hayati önem taşır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">VKİ ile Birlikte Kullanılması Gereken Ölçümler</h3>
            <p>
              Sağlık riskini daha doğru değerlendirmek için VKİ'yi tek başına kullanmak yerine şu ölçümlerle birleştirmek önerilir: Bel çevresi ölçümü (erkeklerde 94 cm, kadınlarda 80 cm üzeri risk sinyali verir), bel-kalça oranı (visseral yağ birikimini gösterir), vücut yağ yüzdesi (en doğru kompozisyon bilgisini sunar) ve kan biyomarkerları (trigliserid, HDL, insülin direnci). Bu dört ölçüm, VKİ ile birlikte değerlendirildiğinde çok daha kapsamlı ve güvenilir bir sağlık tablosu ortaya çıkar.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Sık Sorulan Sorular: VKİ Kaç Olmalı?</h3>
            <p>
              Arama motorlarında en çok sorulan soruların başında "kaç kiloda hangi VKİ değeri normal sayılır?" sorusu gelir. Türkiye'de 170 cm boyunda bir erkek için sağlıklı kilo aralığı 53-72 kg (VKİ 18.5-24.9) olarak hesaplanır. 165 cm boyundaki bir kadın içinse bu aralık 50-68 kg'a karşılık gelir. Ancak bu rakamlar yalnızca istatistiksel ortalamaları yansıtır; bireysel sağlık durumu, yaş ve vücut yapısı bu aralıkları önemli ölçüde değiştirebilir.
            </p>
            <p>
              Öte yandan "VKİ 25 fazla kilolu sayılır mı?" sorusu da sıkça karşılaşılan bir sorundur. Teknik olarak evet; ancak bu etiket, bağlamdan koparıldığında yanıltıcı olabilir. Düzenli egzersiz yapan, kan değerleri normal olan ve bel çevresi ideal sınırlar içinde olan bir bireyin VKİ'si 25-27 arasında olsa bile gerçek sağlık riski son derece düşük olabilir.
            </p>
            <p>
              Sonuç olarak VKİ, sağlığın bir fotoğrafını değil yalnızca bir ipucunu sunar. En doğru değerlendirme; VKİ, vücut yağ yüzdesi, bel çevresi ve yaşam tarzı alışkanlıklarının bir bütün olarak ele alınmasıyla mümkündür. Bu hesap makinesini düzenli olarak kullanarak zaman içindeki değişimlerinizi takip etmek, anlık bir ölçümden çok daha değerli bilgiler sağlayacaktır.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="vki" />
        <CalculatorFAQ title="BMI Hesaplama" faqs={bmiFAQs} schemaUrl="https://gokalaf.com/araclar/vucut-kitle-indeksi" />
      </div>
    </div>
  );
}
