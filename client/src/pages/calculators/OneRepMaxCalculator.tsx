import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dumbbell, RotateCcw, Trophy, Info } from "lucide-react";
import SEO from "@/components/SEO";
import RelatedCalculators from "@/components/RelatedCalculators";
import CalculatorFAQ, { oneRepMaxFAQs } from "@/components/CalculatorFAQ";

const exercises = [
  { id: "bench", name: "Bench Press", icon: "🏋️" },
  { id: "squat", name: "Squat", icon: "🦵" },
  { id: "deadlift", name: "Deadlift", icon: "💪" },
  { id: "ohp", name: "Overhead Press", icon: "🙆" },
];

export default function OneRepMaxCalculator() {
  const [exercise, setExercise] = useState("bench");
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const [result, setResult] = useState<{
    oneRepMax: number;
    percentages: { percent: number; weight: number; reps: string; zone: string }[];
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculateOneRepMax = () => {
    const brzycki = weight * (36 / (37 - reps));
    const epley = weight * (1 + reps / 30);
    const lander = (100 * weight) / (101.3 - 2.67123 * reps);
    
    const oneRepMax = Math.round((brzycki + epley + lander) / 3);

    const percentages = [
      { percent: 100, weight: oneRepMax, reps: "1", zone: "Maksimum" },
      { percent: 95, weight: Math.round(oneRepMax * 0.95), reps: "2", zone: "Güç" },
      { percent: 90, weight: Math.round(oneRepMax * 0.90), reps: "3-4", zone: "Güç" },
      { percent: 85, weight: Math.round(oneRepMax * 0.85), reps: "5-6", zone: "Güç/Hipertrofi" },
      { percent: 80, weight: Math.round(oneRepMax * 0.80), reps: "7-8", zone: "Hipertrofi" },
      { percent: 75, weight: Math.round(oneRepMax * 0.75), reps: "9-10", zone: "Hipertrofi" },
      { percent: 70, weight: Math.round(oneRepMax * 0.70), reps: "11-12", zone: "Dayanıklılık" },
      { percent: 65, weight: Math.round(oneRepMax * 0.65), reps: "13-15", zone: "Dayanıklılık" },
    ];

    setResult({ oneRepMax, percentages });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <SEO
        title="1RM Hesaplama | One Rep Max Hesaplayıcı - Gokalaf"
        description="1RM (One Rep Max) hesaplayıcı ile maksimum kaldırabileceğiniz ağırlığı hesaplayın. Antrenman yüzdelerinizi öğrenin."
        keywords="1rm hesaplama, one rep max, maksimum ağırlık, bench press 1rm, squat 1rm, güç antrenmanı"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "1RM Hesaplayıcı",
          "url": "https://gokalaf.com/araclar/bir-tekrar-max-hesaplama",
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
            Güç Analizi
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-3 text-white tracking-tight">
            One Rep <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Max</span>
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Maksimum kaldırabileceğiniz ağırlığı hesaplayın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-4 p-5 bg-black/40 rounded-2xl border border-white/10">
            <h3 className="text-base font-heading font-bold uppercase flex items-center gap-2 text-white">
              <Dumbbell className="w-4 h-4 text-primary" /> Performansınız
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-400 uppercase tracking-wider font-semibold text-xs">Egzersiz</Label>
                <div className="grid grid-cols-4 gap-2">
                  {exercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setExercise(ex.id)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        exercise === ex.id 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                      data-testid={`button-exercise-${ex.id}`}
                    >
                      <div className="text-lg mb-0.5">{ex.icon}</div>
                      <div className="text-[8px] font-semibold uppercase leading-tight">{ex.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Ağırlık</Label>
                  <span className="text-primary font-bold" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider value={[weight]} onValueChange={(val) => setWeight(val[0])} min={10} max={300} step={2.5} className="py-1" data-testid="slider-weight" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="text-gray-400 uppercase tracking-wider font-semibold">Tekrar Sayısı</Label>
                  <span className="text-primary font-bold" data-testid="text-reps-value">{reps}</span>
                </div>
                <Slider value={[reps]} onValueChange={(val) => setReps(val[0])} min={1} max={15} step={1} className="py-1" data-testid="slider-reps" />
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-gray-400">En doğru sonuç için 2-10 tekrar arasında yaptığın bir set kullan.</p>
              </div>

              <Button 
                onClick={calculateOneRepMax} 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-10 text-sm"
                data-testid="button-calculate-1rm"
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
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                    {exercises.find(e => e.id === exercise)?.name} 1RM
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-green-500 flex items-center justify-center shadow-lg shadow-primary/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Trophy className="w-8 h-8 text-black" />
                    </motion.div>
                    <div>
                      <div className="text-4xl font-bold font-heading text-white" data-testid="text-1rm-result">{result.oneRepMax}</div>
                      <div className="text-sm text-gray-500">kilogram</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider text-center">Antrenman Yoğunluk Tablosu</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {result.percentages.map((p, i) => (
                      <motion.div 
                        key={p.percent} 
                        className={`rounded-lg p-2 text-center ${p.percent === 100 ? "bg-primary/20 border border-primary/30" : "bg-white/5"}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        data-testid={`intensity-${p.percent}`}
                      >
                        <div className={`text-[10px] font-bold ${p.percent === 100 ? "text-primary" : "text-gray-500"}`}>%{p.percent}</div>
                        <div className="text-lg font-bold text-white">{p.weight}</div>
                        <div className="text-[9px] text-gray-500">{p.reps} rep</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Antrenman Bölgeleri</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-xs font-bold text-red-400">Güç</div>
                      <div className="text-[9px] text-gray-500">%85-100 · 1-6 rep</div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-xs font-bold text-blue-400">Hipertrofi</div>
                      <div className="text-[9px] text-gray-500">%70-85 · 6-12 rep</div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-xs font-bold text-green-400">Dayanıklılık</div>
                      <div className="text-[9px] text-gray-500">%50-70 · 12+ rep</div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs w-full"
                  data-testid="button-reset-1rm"
                >
                  <RotateCcw className="w-3 h-3 mr-2" /> Yeniden Hesapla
                </Button>
              </motion.div>
            ) : (
              <div className="text-center py-8 opacity-40">
                <Dumbbell size={48} className="mx-auto text-white mb-3" />
                <h3 className="text-lg font-heading font-bold uppercase text-white mb-1">Sonuç Bekleniyor</h3>
                <p className="text-xs text-gray-400">Bilgilerinizi girin ve hesapla butonuna basın</p>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Bölümü 1: 1RM Nedir */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            1 Tekrar Maksimum <span className="text-primary">Nedir?</span> Nasıl Hesaplanır?
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              1 Tekrar Maksimum (1RM), bir kişinin belirli bir harekette tek seferinde kaldırabileceği maksimum ağırlık miktarıdır. Güç antrenmanının temel referans noktası olan bu değer; antrenman yükünü belirlemek, ilerlemeyi ölçmek ve program tasarlamak için dünya genelinde spor bilimciler ve koçlar tarafından kullanılmaktadır.
            </p>
            <p>
              1RM'i doğrudan test etmek mümkündür; ancak maksimal yük denemeleri ciddi sakatlanma riski taşır ve özellikle yeni başlayanlar için tavsiye edilmez. Bu nedenle bu hesap makinesi, <strong className="text-white">submaksimal test yöntemine</strong> dayanır: maksimumdan daha az bir ağırlıkla yapılan tekrar sayısından 1RM tahminlenir. Bu, hem güvenli hem de pratik bir yaklaşımdır.
            </p>
            <p>
              Hesap makinesinde kullanılan başlıca formüller şunlardır: <strong className="text-white">Epley formülü</strong> (1RM = Ağırlık × (1 + Tekrar/30)) ve <strong className="text-white">Brzycki formülü</strong> (1RM = Ağırlık × (36 / (37 − Tekrar))). Her iki formül de 10 tekrar veya altında en güvenilir sonuçları verir. Tekrar sayısı yükseldikçe (10+) tahmin hatası da artar; bu yüzden 3-8 tekrar aralığında test yapmak daha sağlıklı veriler üretir.
            </p>
            <p>
              1RM tahmininin doğruluğunu etkileyen faktörler arasında teknik form, dinlenme durumu, günlük psikolojik durum, sıcaklık ve kasların ısınma düzeyi yer alır. Bu nedenle ölçümü standart koşullarda (iyi dinlenmiş, ısınmış, tutarlı formla) yapmak, zaman içindeki karşılaştırmaların anlamlı olmasını sağlar.
            </p>
            <p>
              1RM değeri bireyden bireye ve hareketten harekete önemli ölçüde farklılık gösterir. Vücut ağırlığına göreli 1RM değerleri ise performansı karşılaştırmak için kullanılır. Örneğin vücut ağırlığınızın 1.5 katı squat yapmak orta-üst düzey güç olarak kabul edilirken, 2 kat ya da üzerindeki değerler elit sporcu sınıfına girer. Bu oranlar performans düzeyinizi nesnel olarak değerlendirmenize yardımcı olur.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 2: 1RM Yüzdeleri */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            1RM Yüzdelerini <span className="text-primary">Nasıl Kullanırsın?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              1RM'nin asıl değeri, yüzde bazlı antrenman yüklerini belirlemekte yatar. Antrenman hedefine göre hangi yüzde aralığında çalışmanız gerektiği bilimsel olarak belirlenmiştir:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-blue-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Güç Dayanıklılığı</div>
                <div className="text-white font-bold text-sm mb-2">%50-65 / 15-20 tekrar</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kas dayanıklılığını geliştirmek için kullanılır. Yüksek tekrar sayısı metabolik uyumu ön plana çıkarır.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Hipertrofi (Kas Büyümesi)</div>
                <div className="text-white font-bold text-sm mb-2">%65-85 / 6-12 tekrar</div>
                <p className="text-gray-500 text-xs leading-relaxed">Kas kütlesi kazanımı için en optimal aralık. Mekanik gerilim ve metabolik stres kombinasyonu kas büyümesini tetikler.</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="text-orange-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Güç Geliştirme</div>
                <div className="text-white font-bold text-sm mb-2">%85-95 / 2-5 tekrar</div>
                <p className="text-gray-500 text-xs leading-relaxed">Nöromüsküler adaptasyonu ve kas gücünü geliştirmeye odaklanır. Sinir sistemi bu aralıkta maksimum motor ünite devşirmeyi öğrenir.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 font-heading font-bold uppercase text-xs tracking-wider mb-1">Maksimal Güç</div>
                <div className="text-white font-bold text-sm mb-2">%95-100 / 1-2 tekrar</div>
                <p className="text-gray-500 text-xs leading-relaxed">1RM test ve gelişim için kullanılır. Deneyimli sporcular için uygundur, merkezi sinir sistemini yoğun biçimde zorlar. Yeterli iyileşme zorunludur.</p>
              </div>
            </div>
            <p>
              Periyodizasyon (döngüsel antrenman) planlarında 1RM yüzdeleri sistematik biçimde değiştirilir. Örneğin bir 12 haftalık program; ilk 4 hafta hipertrofi ağırlıklı (%70-80), sonraki 4 hafta güç odaklı (%80-90) ve son 4 hafta pik performans için maksimal yükleme (%90-100) içerebilir. Bu döngüsel yaklaşım, hem sürekli ilerlemeyi hem de toparlanmayı optimize eder.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 3: Pratik Kullanım */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            1RM'yi Antrenman Programına <span className="text-primary">Nasıl Entegre Etmelisin?</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              1RM bilgisine sahip olmak, antrenman yükünüzü tahmine dayalı değil, bilimsel olarak belirlemenizi sağlar. "Bu hafta kaç kilo koyayım?" sorusu, 1RM'nizin belirli bir yüzdesiyle otomatik olarak yanıtlanır. Bu yaklaşım, hem aşırı yüklenmeden hem de yetersiz uyarımdan kaçınmanızı sağlar.
            </p>
            <p>
              1RM değerlerinizi belirli aralıklarla (her 4-8 haftada bir) güncellemek önemlidir. Antrenman ilerledikçe güç düzeyiniz artar ve eski 1RM değerlerine göre belirlenen yükler giderek yetersiz kalır. Bu güncelleme, programınızın sürekli zorlu ve gelişim sağlayıcı kalmasını güvence altına alır.
            </p>
            <p>
              Büyük bileşik hareketler (squat, deadlift, bench press, overhead press) için 1RM takibi en değerli olanıdır. Bu hareketler, en fazla kas grubunu bir arada çalıştıran ve güç gelişiminin temel göstergesi olan egzersizlerdir. İzole hareketler için 1RM'yi takip etmek daha az önceliklidir ve sakatlanma riski taşıyabilir.
            </p>
            <p>
              1RM testini nasıl yapmalısınız? Önce genel ısınma, ardından çalışacağınız hareket için spesifik ısınma setleri yapın. Ağırlığı kademeli olarak artırın: yüzde 50, 70, 85, 95 ve 100 şeklinde. Her set arasında en az 3-5 dakika dinlenin. Formu bozmadan tamamlayabileceğiniz en ağır yük 1RM'nizdir. Test sonrasında merkezi sinir sistemi yorulduğu için en az 48-72 saat tam dinlenme planlamak önemlidir.
            </p>
            <p>
              Submaksimal tahmin yönteminde ise test günü yorgunken veya düşük motivasyonlu günlerde hesaplama yapılmamalıdır. Çünkü 6 tekrar yapabildiğiniz ağırlık, zinde bir günde 8 tekrar yapabileceğiniz ağırlıkla aynı olmayabilir ve bu fark 1RM tahminini birkaç kilogram kaydırır.
            </p>
          </div>
        </div>

        {/* İçerik Bölümü 4: Google Odaklı Uzman Rehberi */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-heading font-bold uppercase text-white tracking-tight">
            Güç Standartları ve <span className="text-primary">1RM Hakkında Sık Sorulan Sorular</span>
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
            <p>
              "Squat'ta kaç kilo kaldırmalıyım?", "Bench press 1RM'im iyi mi?", "1RM ne kadar sürede artar?" — bu sorular, güç antrenmanı yapan herkesin merak ettiği konulardır. Bu rehberde güç standartları ve 1RM gelişimi hakkında gerçekçi bir perspektif sunuyoruz.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">Güç Standartları: Nerede Duruyorsunuz?</h3>
            <p>
              Güç standartları, vücut ağırlığına göreli 1RM değerlerine dayanır ve deneyim düzeyine göre kategorize edilir. Squat için genel referans noktaları şöyledir: yeni başlayan erkek için vücut ağırlığının yüzde 75'i, orta düzey için yüzde 150, ileri düzey için yüzde 200 ve elit sporcu için yüzde 250 veya üzeri. Kadınlar için bu değerler genellikle yüzde 20-30 daha düşüktür. Bench press için erkekte başlangıç yüzde 50, orta yüzde 100 ve ileri düzey yüzde 150 vücut ağırlığı olarak sınıflandırılır. Bu rakamlar kesin sınırlar değil, yol gösterici referans noktaları olarak değerlendirilmelidir.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">1RM Ne Kadar Sürede Artar?</h3>
            <p>
              1RM gelişim hızı, antrenman deneyimine göre dramatik biçimde farklılık gösterir. Yeni başlayanlar (0-1 yıl) "yeni başlayan kazanımları" sayesinde her 1-2 haftada belirgin güç artışı yaşarlar; bu dönemde aylık yüzde 5-15 gibi hızlı ilerlemeler mümkündür. Orta düzey sporcular (1-3 yıl) için aylık yüzde 2-5, ileri düzey sporcular (3+ yıl) için ise aylık yüzde 1-2 veya altı daha gerçekçidir. Güç antrenmanında ilerleme kaçınılmaz olarak yavaşlar; bu nedenle deneyimli sporcuların hedeflerini buna göre ayarlaması kritik önem taşır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">1RM Artırmak İçin En Etkili Antrenman Yöntemleri</h3>
            <p>
              <strong className="text-white">Lineer periodizasyon</strong>, yeni başlayanlar için en etkili yöntemdir. Her seansta ağırlığı küçük miktarlarda (alt vücut için 2.5 kg, üst vücut için 1.25 kg) artırmak, güçlü bir adaptasyon sinyali oluşturur. Lineer ilerleme platoya ulaştığında dalgalı veya blok periodizasyona geçmek süreci canlandırır.
            </p>
            <p>
              <strong className="text-white">Submaksimal yükleme</strong>, 1RM test yapmadan güç kazanmanın en sürdürülebilir yoludur. Yüzde 85-90 yüklerde 2-3 tekrar ile birden fazla set yapmak (5×2 veya 6×3 gibi), nöromüsküler adaptasyonu maksimuma çıkarırken sakatlanma riskini minimize eder. Bu yöntem, Sovyet ağırlıkçılık programlarından günümüze uzanan köklü bir geleneğe dayanır.
            </p>
            <h3 className="text-base font-semibold text-white mt-4">1RM Testinden Sonra Ne Yapmalısınız?</h3>
            <p>
              Maksimal bir 1RM testi, merkezi sinir sistemini (MSS) yoğun biçimde yorar. Kas ağrısı minimum olsa bile MSS 48-72 saat tam toparlanma gerektirir. Bu nedenle test sonrası aktif dinlenme ya da düşük yoğunluklu teknik çalışması en uygun yaklaşımdır. Bazı koçlar, 1RM testini önemli bir yarışma veya hedeften 1-2 hafta önce değil, en az 2-3 hafta önce yapılmasını önerir; böylece test yorgunluğu pik performansı olumsuz etkilemez.
            </p>
            <p>
              Bu hesap makinesini kullanarak 1RM değerlerinizi düzenli olarak hesaplayın ve zaman içindeki ilerlemenizi kaydedin. Büyük bileşik hareketlerde elde edilen güç artışı, fitness yolculuğunuzun en güvenilir ve motive edici göstergelerinden biridir.
            </p>
          </div>
        </div>

        <RelatedCalculators currentSlug="bir-tekrar-max-hesaplama" />
        <CalculatorFAQ title="1RM Hesaplama" faqs={oneRepMaxFAQs} schemaUrl="https://gokalaf.com/araclar/bir-tekrar-max-hesaplama" />
      </div>
    </div>
  );
}
