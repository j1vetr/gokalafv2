import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Heart, RotateCcw, Activity, Flame, Zap, Wind, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { heartRateFAQs } from "@/components/CalculatorFAQ";

const zoneConfig = [
  { name: "Toparlanma", pct: "50-60%", icon: Wind, color: "blue", colorClass: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400" },
  { name: "Yağ Yakımı", pct: "60-70%", icon: Flame, color: "green", colorClass: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-400" },
  { name: "Aerobik", pct: "70-80%", icon: Activity, color: "yellow", colorClass: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400" },
  { name: "Anaerobik", pct: "80-90%", icon: Zap, color: "orange", colorClass: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400" },
  { name: "Maksimum", pct: "90-100%", icon: AlertTriangle, color: "red", colorClass: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400" },
];

export default function HeartRateZonesCalculator() {
  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState(60);
  const [result, setResult] = useState<{ maxHR: number; zones: { min: number; max: number }[] } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateZones = () => {
    const maxHeartRate = 220 - age;
    const hrReserve = maxHeartRate - restingHR;

    const zones = [
      { min: Math.round(restingHR + hrReserve * 0.5), max: Math.round(restingHR + hrReserve * 0.6) },
      { min: Math.round(restingHR + hrReserve * 0.6), max: Math.round(restingHR + hrReserve * 0.7) },
      { min: Math.round(restingHR + hrReserve * 0.7), max: Math.round(restingHR + hrReserve * 0.8) },
      { min: Math.round(restingHR + hrReserve * 0.8), max: Math.round(restingHR + hrReserve * 0.9) },
      { min: Math.round(restingHR + hrReserve * 0.9), max: maxHeartRate },
    ];

    setResult({ maxHR: maxHeartRate, zones });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
          "author": { "@type": "Organization", "name": "Gokalaf", "url": "https://gokalaf.com" }
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge className="mb-3 bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 uppercase tracking-wider px-3 py-1 text-xs">
            Kardiyovasküler
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            Kalp Hızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">Bölgeleri</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Karvonen formülüyle antrenman bölgelerinizi hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Heart className="w-4 h-4 text-rose-400" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Yaş</Label>
                  <span className="text-rose-400 font-bold" data-testid="text-age-value">{age}</span>
                </div>
                <Slider value={[age]} onValueChange={(val) => setAge(val[0])} min={15} max={80} step={1} className="py-1" data-testid="slider-age" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Dinlenme Nabzı</Label>
                  <span className="text-rose-400 font-bold" data-testid="text-resting-hr">{restingHR} BPM</span>
                </div>
                <Slider value={[restingHR]} onValueChange={(val) => setRestingHR(val[0])} min={40} max={100} step={1} className="py-1" data-testid="slider-resting-hr" />
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 text-[10px] text-gray-400">
                Dinlenme nabzınızı sabah uyandığınızda yatakta iken ölçün.
              </div>

              <Button 
                onClick={calculateZones} 
                className="w-full bg-rose-500 text-white hover:bg-rose-600 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-hr"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Maksimum Kalp Hızı</div>
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 text-rose-400" />
                    <span className="text-4xl font-bold font-heading text-white" data-testid="text-max-hr">{result.maxHR}</span>
                    <span className="text-sm text-gray-500">BPM</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {result.zones.map((zone, i) => {
                    const config = zoneConfig[i];
                    const Icon = config.icon;
                    return (
                      <motion.div 
                        key={i}
                        className={`bg-gradient-to-r ${config.colorClass} border rounded-xl p-3 flex items-center justify-between`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        data-testid={`zone-${i + 1}`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <div>
                            <div className="text-xs font-bold text-white">Bölge {i + 1} - {config.name}</div>
                            <div className="text-[9px] text-gray-400">{config.pct}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{zone.min} - {zone.max}</div>
                          <div className="text-[9px] text-gray-500">BPM</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Antrenman Önerileri</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-start gap-1.5">
                      <Flame className="w-3 h-3 text-green-400 mt-0.5" />
                      <span className="text-gray-400">Yağ yakımı için Bölge 2'de antrenman yap</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3 h-3 text-orange-400 mt-0.5" />
                      <span className="text-gray-400">Performans için Bölge 4-5 interval</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-hr"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Heart size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: Kalp Atış Hızı Bölgeleri Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Kalp Atış Hızı Bölgeleri <span className="text-primary">Nedir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Kalp atış hızı bölgeleri (heart rate zones), egzersiz yoğunluğunu kalp hızı üzerinden kategorize eden bir sistemdir. Maksimum kalp hızınızın belirli yüzdelerine karşılık gelen bu bölgeler, her birinin farklı fizyolojik süreçleri ve antrenman etkilerini temsil etmesi nedeniyle egzersiz planlamasında kritik bir araçtır. Doğru bölgede egzersiz yapmak, hem hedeflerinize ulaşma hızını artırır hem de aşırı antrenman ve sakatlanma riskini azaltır.
            </p>
            <p>
              Maksimum kalp hızı (MKH), teorik olarak kişinin bir dakikada ulaşabileceği en yüksek kalp hızıdır. En yaygın kullanılan tahmin formülü <strong className="text-white">220 − yaş</strong>'tır. Bu basit formülün hata payı yaklaşık ±10-12 atım/dk olup bireysel farklılıkları tam olarak yansıtmaz. Daha doğru bir tahmin için <strong className="text-white">Tanaka formülü</strong> (208 − 0.7 × yaş) kullanılabilir; bu formül özellikle 40 yaş üzeri bireylerde daha güvenilir sonuçlar verir. En kesin yöntem ise kardiyopulmoner egzersiz testi veya sahada yapılan maksimal egzersiz protokolleridir.
            </p>
            <p>
              Dinlenme kalp hızı da antrenman planlaması için önemli bir değerdir. Sağlıklı yetişkinlerde dinlenme kalp hızı genellikle 60-100 atım/dk arasındadır. Düzenli aerobik antrenman yapan bireylerde bu değer 40-60'a kadar düşebilir; bu, kalbin daha verimli çalıştığının göstergesidir. Sabah yataktan kalkmadan önce ölçülen dinlenme kalp hızı, iyileşme durumunuzu ve aşırı antrenman belirtilerini takip etmek için de güvenilir bir gösterge işlevi görür.
            </p>
            <p>
              Bu hesap makinesi, maksimum kalp hızınızı hesaplayıp beş temel bölgeye böler. Her bölge belirli bir yoğunluk aralığını temsil eder ve farklı antrenman hedefleri için kullanılır. Kalp hızı monitörü veya spor saati ile bu bölgeleri gerçek zamanlı takip etmek, antrenman kalitesini önemli ölçüde artırır.
            </p>
            <p>
              Kalp atış hızı bölgelerini kullanmak için ekstra alet şart değildir. Algısal efor skalası (RPE — Rate of Perceived Exertion), yaklaşık bir yoğunluk tahmini sunar: rahat konuşabiliyorsanız düşük bölgedesinizdir, kısa cümlelerle konuşabiliyorsanız orta bölgedesinizdir, konuşmak zorlaştıysa yüksek bölgeye giriyorsunuzdur.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: 5 Bölge ve Etkileri */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            5 Kalp Hızı Bölgesi <span className="text-primary">Ne Anlama Gelir?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <div className="space-y-2 my-4">
              {[
                { zone: "Bölge 1", pct: "%50-60", color: "bg-blue-500/10 border-blue-500/20 text-blue-400", title: "Aktif Dinlenme", desc: "Isınma, soğuma ve aktif toparlanma için idealdir. Kardiyovasküler sistemi çok az zorlar. Enerji büyük ölçüde yağdan karşılanır. Uzun süre sürdürülebilir, neredeyse sınırsız dayanıklılık bölgesidir." },
                { zone: "Bölge 2", pct: "%60-70", color: "bg-green-500/10 border-green-500/20 text-green-400", title: "Aerobik Temel", desc: "Yağ yakımının maksimize olduğu bölgedir. Aerobik kapasite ve temel dayanıklılık bu bölgede gelişir. Uzun mesafe koşularının büyük çoğunluğu burada yapılır. Kelime 'aerobik' burada gerçek anlamını bulur." },
                { zone: "Bölge 3", pct: "%70-80", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400", title: "Aerobik Geliştirme", desc: "Kardiyovasküler verim artar, vücut laktata alışmaya başlar. Hem yağ hem karbonhidrat yakılır. Tempo koşuları ve orta yoğunluklu antrenmanlar bu bölgede gerçekleşir." },
                { zone: "Bölge 4", pct: "%80-90", color: "bg-orange-500/10 border-orange-500/20 text-orange-400", title: "Anaerobik Eşik", desc: "Laktat birikimi hızlanır, enerji artık ağırlıklı olarak karbonhidrattan sağlanır. Hız ve güç dayanıklılığı bu bölgede gelişir. Interval antrenmanları ve yarış temposu burada yer alır." },
                { zone: "Bölge 5", pct: "%90-100", color: "bg-red-500/10 border-red-500/20 text-red-400", title: "Maksimal", desc: "Çok kısa süreli maksimum efor bölgesidir. VO2 maks geliştirme ve sürat kapasitesi için kullanılır. Birkaç dakikadan uzun sürdürülemez. Deneyimli sporcular için uygundur." },
              ].map(z => (
                <div key={z.zone} className={`${z.color} border rounded-xl p-3 flex gap-3 items-start`}>
                  <div className="shrink-0 w-16">
                    <div className={`font-heading font-bold text-xs uppercase ${z.color.split(' ')[2]}`}>{z.zone}</div>
                    <div className="text-white text-xs font-bold">{z.pct}</div>
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold mb-0.5">{z.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{z.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Kalp Hızı Bölgelerini Antrenmanında <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Kalp hızı bölgelerini antrenman planlamasına entegre etmek, rastgele egzersiz yapmakla kıyaslandığında çok daha sistematik ve ölçülebilir bir gelişim sağlar. Hangi bölgede ne kadar zaman geçirdiğinizi bilmek, antrenman yükünüzü kontrol etmenizi ve iyileşme süreçlerini optimize etmenizi mümkün kılar.
            </p>
            <p>
              Dayanıklılık sporcuları için yaygın kabul gören <strong className="text-white">80/20 kuralı</strong>, antrenman süresinin yüzde 80'ini Bölge 1-2'de (düşük yoğunluk), yüzde 20'sini ise Bölge 4-5'te (yüksek yoğunluk) geçirmeyi önerir. Bu dağılım, hem yorgunluğu yönetir hem de aerobik kapasiteyi ve hız dayanıklılığını aynı anda geliştirmenize olanak tanır.
            </p>
            <p>
              Yağ yakımını hedefliyorsanız, Bölge 2 antrenmanlarına odaklanmak en etkili stratejidir. Bölge 2, yağı birincil enerji kaynağı olarak kullanan bölgedir ve uzun süre sürdürülebilir olması sayesinde toplam kalori harcaması da yüksek olur. Yaygın yanılgı şudur: daha yoğun egzersiz yaptıkça yağ yakmak daha hızlanır; oysa çok yüksek yoğunluklarda enerji kaynağı ağırlıklı olarak karbonhidrata kayar.
            </p>
            <p>
              Kalp hızı bölgeleri güç antrenmanında da kullanılabilir. Yüksek tekrarlı setler arasında kalp hızının Bölge 2'ye düşmesini beklemek, iyileşme sürecini optimize eder ve bir sonraki seti daha kaliteli yapmanızı sağlar. Bu yöntem, kardiyovasküler kapasiteyi de geliştirir.
            </p>
            <p>
              Düzenli kalp hızı takibi, aşırı antrenmanı erkenden fark etmenin de en güvenilir yoludur. Sabah dinlenme kalp hızınız normalden 5-10 atım/dk daha yüksekse, bu vücudun yeterince toparlanamadığının işaretidir. Bu durumda planlanmış yoğun bir antrenman yerine düşük yoğunluklu aktif dinlenme ya da tam dinlenme gününü tercih etmek, uzun vadeli performansı koruyan akıllıca bir karardır.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="kalp-atisi" />
        <CalculatorFAQ title="Kalp Atış Hızı Bölgeleri" faqs={heartRateFAQs} schemaUrl="https://gokalaf.com/araclar/kalp-atis-hizi" />
      </div>
    </div>
  );
}
