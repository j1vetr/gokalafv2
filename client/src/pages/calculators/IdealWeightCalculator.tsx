import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, RotateCcw, TrendingUp, TrendingDown, Check, Scale } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { idealWeightFAQs } from "@/components/CalculatorFAQ";

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState("male");
  const [currentWeight, setCurrentWeight] = useState(75);
  const [result, setResult] = useState<{
    robinson: number;
    miller: number;
    devine: number;
    hamwi: number;
    average: number;
    min: number;
    max: number;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateIdealWeight = () => {
    const heightInches = height / 2.54;
    const baseHeight = 60;
    const extraInches = Math.max(0, heightInches - baseHeight);

    let robinson, miller, devine, hamwi;

    if (gender === "male") {
      robinson = 52 + 1.9 * extraInches;
      miller = 56.2 + 1.41 * extraInches;
      devine = 50 + 2.3 * extraInches;
      hamwi = 48 + 2.7 * extraInches;
    } else {
      robinson = 49 + 1.7 * extraInches;
      miller = 53.1 + 1.36 * extraInches;
      devine = 45.5 + 2.3 * extraInches;
      hamwi = 45.5 + 2.2 * extraInches;
    }

    const average = (robinson + miller + devine + hamwi) / 4;
    const values = [robinson, miller, devine, hamwi];
    const min = Math.min(...values);
    const max = Math.max(...values);

    setResult({
      robinson: parseFloat(robinson.toFixed(1)),
      miller: parseFloat(miller.toFixed(1)),
      devine: parseFloat(devine.toFixed(1)),
      hamwi: parseFloat(hamwi.toFixed(1)),
      average: parseFloat(average.toFixed(1)),
      min: parseFloat(min.toFixed(1)),
      max: parseFloat(max.toFixed(1)),
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getWeightDifference = () => {
    if (!result) return null;
    const diff = currentWeight - result.average;
    if (Math.abs(diff) < 2) return { type: "ideal", text: "İdeal kilondasın!", color: "text-green-400", icon: Check };
    if (diff > 0) return { type: "over", text: `${diff.toFixed(1)} kg fazla`, color: "text-yellow-400", icon: TrendingDown };
    return { type: "under", text: `${Math.abs(diff).toFixed(1)} kg eksik`, color: "text-blue-400", icon: TrendingUp };
  };

  const getPositionOnScale = () => {
    if (!result) return 50;
    const range = result.max - result.min + 20;
    const position = ((currentWeight - (result.min - 10)) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const difference = getWeightDifference();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="İdeal Kilo Hesaplama | Boyunuza Göre İdeal Kilonuz - Gokalaf"
        description="İdeal kilo hesaplayıcı ile boyunuza ve cinsiyetinize göre olmanız gereken kiloyu öğrenin. 4 farklı formülle ideal kilo hesaplama."
        keywords="ideal kilo hesaplama, boy kilo oranı, ideal ağırlık, kilo hesaplama, sağlıklı kilo"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "İdeal Kilo Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/ideal-kilo",
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
            Hedef Belirleme
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            İdeal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Kilo</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            4 bilimsel formülle ideal kilonuzu hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Scale className="w-4 h-4 text-primary" /> Bilgileriniz
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Boy</Label>
                  <span className="text-primary font-bold" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider value={[height]} onValueChange={(val) => setHeight(val[0])} min={140} max={220} step={1} className="py-1" data-testid="slider-height" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Mevcut Kilo</Label>
                  <span className="text-primary font-bold" data-testid="text-current-weight">{currentWeight} kg</span>
                </div>
                <Slider value={[currentWeight]} onValueChange={(val) => setCurrentWeight(val[0])} min={40} max={150} step={0.5} className="py-1" data-testid="slider-current-weight" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Cinsiyet</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-white text-sm" data-testid="select-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateIdealWeight} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-ideal-weight"
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
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">İdeal Kilonuz</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-heading text-primary" data-testid="text-ideal-weight-result">{result.average}</span>
                      <span className="text-sm text-gray-500">kg</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Aralık: {result.min} - {result.max} kg</div>
                  </div>
                  {difference && (
                    <div className={`text-right p-3 rounded-xl bg-white/5`}>
                      <difference.icon className={`w-5 h-5 ${difference.color} ml-auto mb-1`} />
                      <div className={`text-sm font-bold ${difference.color}`} data-testid="text-weight-difference">{difference.text}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Mevcut vs İdeal</div>
                  <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-green-500/30 to-green-500/10 rounded-full"
                      style={{ 
                        left: `${((result.min - (result.min - 10)) / (result.max - result.min + 20)) * 100}%`,
                        width: `${((result.max - result.min) / (result.max - result.min + 20)) * 100}%`
                      }}
                    />
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"
                      initial={{ left: "50%" }}
                      animate={{ left: `${getPositionOnScale()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500">
                    <span>{result.min - 10} kg</span>
                    <span className="text-green-400">İdeal Aralık</span>
                    <span>{result.max + 10} kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: "Robinson", value: result.robinson },
                    { name: "Miller", value: result.miller },
                    { name: "Devine", value: result.devine },
                    { name: "Hamwi", value: result.hamwi },
                  ].map((formula, i) => (
                    <motion.div 
                      key={formula.name}
                      className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="text-[9px] text-gray-500 uppercase mb-1">{formula.name}</div>
                      <div className="text-lg font-bold text-white">{formula.value}</div>
                      <div className="text-[9px] text-gray-600">kg</div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Hedefe Ulaşmak İçin</div>
                  <div className="text-center">
                    {difference?.type === "ideal" ? (
                      <div className="text-green-400 font-semibold">Harika! İdeal kilondasınız</div>
                    ) : difference?.type === "over" ? (
                      <div className="text-yellow-400">
                        <span className="text-2xl font-bold">{(currentWeight - result.average).toFixed(1)}</span>
                        <span className="text-sm ml-1">kg vermeniz önerilir</span>
                      </div>
                    ) : (
                      <div className="text-blue-400">
                        <span className="text-2xl font-bold">{(result.average - currentWeight).toFixed(1)}</span>
                        <span className="text-sm ml-1">kg almanız önerilir</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-ideal-weight"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Target size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: İdeal Kilo Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            İdeal Kilo <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              İdeal kilo, belirli bir boy için sağlık riskleri ve yaşam kalitesi açısından en uygun vücut ağırlığı aralığını ifade eden kavramdır. Tek bir "doğru" değer olmaktan çok, kişinin fiziksel yapısına, kas kütlesine, kemik yoğunluğuna ve yaşına göre değişen bir aralık söz konusudur. Bu hesap makinesi, bilim dünyasında en yaygın kabul gören dört farklı formülü bir arada kullanarak size kapsamlı bir değerlendirme sunar.
            </p>
            <p>
              İdeal kilo hesaplamada kullanılan başlıca formüller şunlardır: <strong className="text-white">Devine formülü</strong> (1974), başlangıçta ilaç dozajı hesaplamak için geliştirilmiş ancak zamanla ideal kilo tahminine uyarlanmıştır. <strong className="text-white">Robinson formülü</strong> (1983), Devine'den daha hassas bir yaklaşım sunar. <strong className="text-white">Miller formülü</strong> (1983), özellikle düşük boylar için daha gerçekçi sonuçlar verir. <strong className="text-white">Hamwi formülü</strong> ise klinik pratikte diyetisyenler tarafından sıkça başvurulan klasik bir yöntemdir.
            </p>
            <p>
              Tüm bu formüller boy üzerinden bir temel kilo belirler ve her ek santimetre için küçük bir ağırlık artışı ekler. Erkek ve kadın için ayrı hesaplamalar yapılır çünkü kadınların kemik yapısı ve kas kütlesi dağılımı erkeklerden farklıdır. Bu farklılık, aynı boyda bir erkek ve kadın için önerilen ideal kilo aralığının birbirinden ayrışmasına yol açar.
            </p>
            <p>
              Kemik yapısı (çerçeve boyutu) da ideal kiloyu etkileyen önemli bir faktördür. İnce kemik yapısına sahip biri ile geniş kemikli biri için aynı boy değerinde birbirinden farklı ideal ağırlık aralıkları söz konusu olabilir. Bileğin çevresi ölçülerek kabaca kemik yapısı tahmin edilebilir: 17 cm altı ince, 17-20 cm orta, 20 cm üzeri geniş kemik yapısına işaret eder. Bu hesap makinesi bu farkı dikkate alarak önerilen aralığı birkaç kilogram kaydırabilir.
            </p>
            <p>
              İdeal kilo kavramının sınırlılıklarını da göz önünde bulundurmak gerekir. Bu formüller genel popülasyon ortalamaları üzerinden türetilmiştir ve sporculara, vücut geliştiricilere ya da özel tıbbi durumlara sahip bireylere direkt uygulanamaz. Yüksek kas kütlesine sahip bir atlet, formüle göre "fazla kilolu" görünebilir; oysa gerçekte mükemmel bir sağlık tablosu sergileyebilir.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: Sonuçları Yorumlama */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            İdeal Kilo Sonuçlarını <span className="text-primary">Nasıl Yorumlamalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              Hesap makinesi size birden fazla formülden elde edilen sonuçları gösterir. Bu değerlerin birbirinden birkaç kilogram farklı olması normaldir; dört formülün ortalaması ya da ortanca değeri en güvenilir tahmini sunar. Önemli olan, tek bir sayıya değil, bu sonuçların işaret ettiği genel aralığa odaklanmaktır.
            </p>
            <p>
              Mevcut kilonuzun ideal aralığın üzerinde olması; hedef kilo vermek için kalori açığı oluşturmanız, düzenli egzersiz yapmanız ve beslenme düzeninizi gözden geçirmeniz gerektiğine işaret eder. Kilo verme sürecinde haftada 0.5-1 kg arası kayıp, hem sürdürülebilir hem de kas kütlesini koruma açısından en güvenli hızdır.
            </p>
            <p>
              Mevcut kilonuz ideal aralığın altındaysa, bu beslenme yetersizliği, düşük kas kütlesi veya bir sağlık sorununa işaret edebilir. Kilo almak amacıyla yalnızca kalori fazlası oluşturmak yerine, direnç antrenmanıyla desteklenen ve protein ağırlıklı bir kalori fazlası stratejisi benimsemek, kilo artışının büyük bölümünün kas olarak gelmesini sağlar.
            </p>
            <p>
              İdeal kiloya ulaştıktan sonra hedef yalnızca kilo korumak olmamalıdır. Vücut kompozisyonunu iyileştirmek — aynı ağırlıkta daha fazla kas, daha az yağ — sağlık, performans ve görünüm açısından çok daha anlamlı bir hedef olabilir. Bu "rekomposizyon" süreci, yeterli protein alımı ve düzenli direnç antrenmanının kombinasyonuyla mümkündür; ancak kilo değişimi minimal olduğundan çok daha sabır gerektiren bir yoldur.
            </p>
            <p>
              Son olarak ideal kilo hedefini kısa vadeli bir varış noktası olarak değil, uzun vadeli bir sağlık yolculuğunun kilometre taşı olarak değerlendirmek önemlidir. Herhangi bir özel sağlık durumunuz varsa veya ciddi kilo değişikliği hedefliyorsanız, bir diyetisyen ya da spor hekimi ile çalışmanızı öneririz.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Fitness'ta Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            İdeal Kiloyu Fitness Hedefi Olarak <span className="text-primary">Nasıl Kullanmalısın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              İdeal kilo hesabını bir fitness yol haritasının başlangıç noktası olarak kullanmak, hedef belirleme sürecini önemli ölçüde netleştirir. Ancak bu değeri körü körüne takip etmek yerine, kendi vücut yapınızı, yaşam tarzınızı ve gerçekçi hedeflerinizi de göz önünde bulundurmanız gerekir.
            </p>
            <p>
              Formüle dayalı ideal kilodan farklı olarak <strong className="text-white">kişisel ideal kilonuzu</strong> belirlemek için şu soruları kendinize sorun: Hangi kiloda enerji dolu ve sağlıklı hissediyordunuz? Kan değerleriniz hangi kilo aralığında normal seyretti? Hangi kiloda spor performansınız en yüksekti? Bu kişisel referans noktaları, genellikle formül sonuçlarından daha anlamlı bir hedef ortaya koyar.
            </p>
            <p>
              İdeal kiloya giden yolda sürdürülebilirlik en kritik faktördür. Hızlı kilo kaybı yöntemleri (çok düşük kalorili diyetler, aşırı kardio) kısa vadede etkili görünse de uzun vadede kas kaybı, metabolizma yavaşlaması ve "yo-yo" etkisiyle sonuçlanır. Kademeli ilerleme, alışkanlık geliştirme ve yaşam tarzı değişiklikleri; hedefe çok daha kalıcı biçimde ulaşmayı sağlar.
            </p>
            <p>
              İdeal kiloya yaklaştıkça ilerleme yavaşlar. Bu "set point" etkisi, vücudun belirli bir ağırlığı korumaya çalışan metabolik adaptasyonunun sonucudur. Bu dönemde kilo değişimine odaklanmak yerine vücut kompozisyonuna — yağ yüzdesi ve kas kütlesine — odaklanmak motivasyonu korur ve süreci daha anlamlı kılar. Bant ölçüleri ve vücut yağ yüzdesi takibi, bu dönemde kilogramdan çok daha fazlasını söyler.
            </p>
            <p>
              İdeal kilo hesabını <strong className="text-white">TDEE ve kalori hesabıyla birlikte kullanmak</strong> en akıllıca yaklaşımdır. İdeal kilonuzu belirleyin, ardından TDEE hesabıyla o kilodaki enerji ihtiyacınızı öngörün. Mevcut kilonuz ile ideal kilonuz arasındaki fark, ne kadar kalori açığı oluşturmanız ya da ne kadar süre sürdürmeniz gerektiğine dair gerçekçi bir çerçeve sunar.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="ideal-kilo" />
        <CalculatorFAQ title="İdeal Kilo Hesaplama" faqs={idealWeightFAQs} schemaUrl="https://gokalaf.com/araclar/ideal-kilo" />
      </div>
    </div>
  );
}
