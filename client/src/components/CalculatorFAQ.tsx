import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorFAQProps {
  title: string;
  faqs: FAQItem[];
  schemaUrl: string;
}

export default function CalculatorFAQ({ title, faqs, schemaUrl }: CalculatorFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="mt-16 pt-12 border-t border-white/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <HelpCircle size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold uppercase text-white">Sıkça Sorulan Sorular</h2>
          <p className="text-gray-500 text-sm">{title} hakkında merak edilenler</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              data-testid={`faq-question-${index}`}
            >
              <span className="font-medium text-white pr-4">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`text-primary shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-4 text-gray-400 leading-relaxed" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export const bmiFAQs: FAQItem[] = [
  {
    question: "Vücut Kitle İndeksi (BMI) nedir ve nasıl hesaplanır?",
    answer: "Vücut Kitle İndeksi (BMI), kilonuzun boyunuza oranını ölçen bir değerdir. Formül basittir: Kilonuz (kg) / Boyunuz (m)². Örneğin, 80 kg ağırlığında ve 1.80 m boyunda birinin BMI'si 80 / (1.80 × 1.80) = 24.7 olarak hesaplanır. Bu değer, genel sağlık durumunuz hakkında fikir verir ancak kas kütlesi, kemik yoğunluğu gibi faktörleri hesaba katmaz."
  },
  {
    question: "BMI değerleri neyi ifade eder? Hangi aralık sağlıklıdır?",
    answer: "BMI değerleri 4 ana kategoriye ayrılır: 18.5'in altı zayıf (underweight), 18.5-24.9 arası normal kilolu, 25-29.9 arası fazla kilolu (overweight), 30 ve üzeri obez olarak kabul edilir. Sağlıklı aralık 18.5-24.9 arasıdır. Ancak sporcular ve kas kütlesi yüksek kişilerde BMI yanıltıcı olabilir çünkü kas, yağdan daha ağırdır."
  },
  {
    question: "BMI hesaplama sporcular için doğru sonuç verir mi?",
    answer: "Hayır, BMI sporcular ve vücut geliştirmeciler için yanıltıcı olabilir. Kas dokusu yağ dokusundan daha yoğun olduğu için, kas kütlesi yüksek kişilerin BMI değeri 'fazla kilolu' veya 'obez' çıkabilir. Bu kişiler için vücut yağ oranı ölçümü, bel-kalça oranı veya DEXA taraması gibi yöntemler daha doğru sonuç verir. BMI sadece genel popülasyon için tasarlanmış bir tarama aracıdır."
  },
  {
    question: "BMI değerim yüksek çıktı, ne yapmalıyım?",
    answer: "BMI değeriniz 25'in üzerindeyse, öncelikle panik yapmayın. İlk adım olarak gerçek vücut kompozisyonunuzu değerlendirin - kas kütleniz yüksek olabilir. Eğer gerçekten fazla yağ taşıyorsanız, haftalık 500 kalori açığı oluşturarak aylık 2 kg civarı sağlıklı kilo verebilirsiniz. Düzenli egzersiz (haftada 3-5 gün), protein ağırlıklı beslenme ve yeterli uyku kritik önem taşır. Profesyonel destek için bir diyetisyen veya fitness koçuyla çalışmanızı öneririz."
  },
  {
    question: "Kadın ve erkek için BMI hesaplaması farklı mıdır?",
    answer: "BMI formülü kadın ve erkek için aynıdır, ancak sonuçların yorumlanması farklı olabilir. Kadınlar doğal olarak daha yüksek vücut yağ oranına sahiptir (esansiyel yağ kadınlarda %10-13, erkeklerde %2-5). Bu nedenle aynı BMI değerinde bir kadın ve erkek farklı vücut kompozisyonuna sahip olabilir. Genel sağlık değerlendirmesi için BMI'nin yanında bel çevresi ve vücut yağ oranı da ölçülmelidir."
  },
  {
    question: "Çocuklar ve yaşlılar için BMI nasıl değerlendirilir?",
    answer: "Çocuklar için BMI-persentil kullanılır çünkü büyüme döneminde değerler yaşa göre değişir. 85-94 persentil arası fazla kilolu, 95 persentil üzeri obez kabul edilir. Yaşlılarda ise BMI biraz daha yüksek olması (23-28 arası) aslında koruyucu olabilir - bu 'obezite paradoksu' olarak bilinir. 65 yaş üstü kişilerde kas kaybı (sarkopeni) da değerlendirilmeli, sadece BMI'ye bakılmamalıdır."
  }
];

export const calorieFAQs: FAQItem[] = [
  {
    question: "Günlük kalori ihtiyacı nasıl hesaplanır?",
    answer: "Günlük kalori ihtiyacınız iki bileşenden oluşur: Bazal Metabolizma Hızı (BMR) ve aktivite faktörü. BMR, vücudunuzun dinlenme halinde harcadığı enerjidir ve Mifflin-St Jeor formülüyle hesaplanır. Erkekler için: (10 × kilo) + (6.25 × boy) - (5 × yaş) + 5. Kadınlar için: (10 × kilo) + (6.25 × boy) - (5 × yaş) - 161. Bu değer aktivite seviyenize göre 1.2 (hareketsiz) ile 1.9 (çok aktif) arasında bir çarpanla çarpılarak toplam günlük enerji harcamanız (TDEE) bulunur."
  },
  {
    question: "Kilo vermek için kaç kalori almalıyım?",
    answer: "Sağlıklı kilo vermek için günlük 300-500 kalori açığı oluşturmanız önerilir. Bu, haftada yaklaşık 0.3-0.5 kg kayıp anlamına gelir. Örneğin, TDEE'niz 2500 kalori ise, 2000-2200 kalori alarak sürdürülebilir bir şekilde kilo verebilirsiniz. 500 kalorinin altına düşmek metabolizmanızı yavaşlatabilir ve kas kaybına neden olabilir. Ayrıca protein alımınızı yüksek tutarak (kg başına 1.6-2.2 gram) kas koruması sağlayın."
  },
  {
    question: "Kalori açığı oluşturdum ama kilo veremiyorum, neden?",
    answer: "Bunun birkaç nedeni olabilir: 1) Kalori takibiniz doğru olmayabilir - porsiyon boyutlarını küçümsemek yaygındır. 2) Metabolik adaptasyon - uzun süreli diyetlerde vücut enerji harcamasını azaltır. 3) Su tutulumu - özellikle kadınlarda hormonal değişimler geçici kilo artışına neden olabilir. 4) Kas kazanımı - antrenman yapıyorsanız yağ kaybederken kas kazanıyor olabilirsiniz. 2-3 hafta bekleyin, ölçümlerinizi takip edin ve gerekirse kalori alımınızı %10 daha azaltın."
  },
  {
    question: "Kas yapmak için kaç kalori fazlası gerekir?",
    answer: "Kas yapımı için TDEE'nizin üzerine günlük 200-500 kalori eklemeniz yeterlidir. Daha fazlası gereksiz yağ birikimine neden olur. Örneğin, TDEE'niz 2500 ise, 2700-3000 kalori alabilirsiniz. Önemli olan makro dağılımıdır: Vücut ağırlığınızın kg başına 1.6-2.2 gram protein, 0.8-1 gram yağ ve kalan kaloriler karbonhidrattan gelmelidir. Yeni başlayanlar ilk yıl 8-12 kg kas kazanabilirken, ileri seviyeler yılda 1-2 kg ile sınırlıdır."
  },
  {
    question: "Aktivite seviyemi nasıl belirlemeleyim?",
    answer: "Aktivite seviyenizi belirlerken hem egzersiz hem de günlük hareket miktarınızı düşünün. Hareketsiz (1.2): Masa başı iş, egzersiz yok. Hafif aktif (1.375): Haftada 1-3 gün hafif egzersiz. Orta aktif (1.55): Haftada 3-5 gün orta yoğunlukta egzersiz. Çok aktif (1.725): Haftada 6-7 gün yoğun egzersiz. Ekstra aktif (1.9): Günde 2 kez antrenman veya ağır fiziksel iş. Çoğu insan kendini olduğundan daha aktif görür - şüphe durumunda bir alt kategoriyi seçin."
  },
  {
    question: "Metabolizmamı hızlandırabilir miyim?",
    answer: "Metabolizmayı doğrudan 'hızlandırmak' zordur, ancak bazı stratejiler enerji harcamanızı artırabilir: 1) Kas kütlesi artışı - her 0.5 kg kas günde 6-10 kalori daha yakar. 2) NEAT (Non-Exercise Activity Thermogenesis) artışı - daha fazla yürümek, ayakta durmak, merdiven çıkmak. 3) Yeterli protein almak - proteinlerin termik etkisi %20-30'dur. 4) Yeterli uyku - uyku eksikliği metabolizmayı %5-20 yavaşlatabilir. 5) Stres yönetimi - kronik stres kortizol artışına ve metabolizma yavaşlamasına neden olur."
  }
];

export const tdeeFAQs: FAQItem[] = [
  {
    question: "TDEE nedir ve BMR'dan farkı nedir?",
    answer: "TDEE (Total Daily Energy Expenditure), günlük toplam enerji harcamanızdır. BMR (Basal Metabolic Rate) ise vücudunuzun hiç hareket etmeden, sadece yaşamsal fonksiyonları sürdürmek için harcadığı enerjidir. TDEE = BMR × Aktivite Faktörü formülüyle hesaplanır. Örneğin, BMR'nız 1600 kalori ve orta aktif (1.55) iseniz, TDEE'niz 2480 kalori olur. TDEE, gerçek kalori ihtiyacınızı gösterdiği için beslenme planlamasında daha kullanışlıdır."
  },
  {
    question: "TDEE hesaplamak için hangi formül en doğrudur?",
    answer: "En yaygın ve güvenilir formül Mifflin-St Jeor formülüdür (1990). Harris-Benedict (1919) eski ve daha az doğrudur. Katch-McArdle formülü yağsız vücut kütlenizi biliyorsanız daha kesin sonuç verir. Hesaplayıcımız Mifflin-St Jeor kullanır. Ancak hiçbir formül %100 doğru değildir - bu değerleri başlangıç noktası olarak alın ve 2-4 hafta boyunca kilo değişiminizi takip ederek kişiselleştirin. Kilo sabit kalıyorsa TDEE'nizi buldunuz demektir."
  },
  {
    question: "TDEE'm her gün aynı mı kalır?",
    answer: "Hayır, TDEE günden güne değişir. Antrenman günlerinde daha yüksek, dinlenme günlerinde daha düşüktür. Ayrıca mevsimsel değişimler, stres, uyku kalitesi, hormonal döngüler (kadınlarda adet dönemi) ve hastalık durumları TDEE'yi etkiler. Bu nedenle haftalık ortalama kalori alımına odaklanmak daha mantıklıdır. Bazı sporcular 'kalori döngüsü' yapar - antrenman günlerinde daha fazla, dinlenme günlerinde daha az kalori alırlar."
  },
  {
    question: "TDEE hesabım doğru mu, nasıl test ederim?",
    answer: "TDEE'nizi test etmenin en iyi yolu 2-4 haftalık 'maintenance' dönemidir. Hesaplanan TDEE kadar kalori alın ve her gün aynı koşullarda (sabah, aç karnına) tartılın. Haftalık ortalamayı hesaplayın. Kilo sabitse TDEE'niz doğrudur. Haftada 0.25-0.5 kg kaybediyorsanız 250-500 kalori ekleyin, alıyorsanız çıkarın. Vücut ağırlığı su, bağırsak içeriği gibi faktörlerle günlük 1-2 kg oynayabilir, bu nedenle tek günlük değerlere değil haftalık ortalamaya bakın."
  },
  {
    question: "Diyet yaparken TDEE düşer mi?",
    answer: "Evet, uzun süreli kalori kısıtlamasında metabolik adaptasyon gerçekleşir. Vücut enerji harcamasını %10-15 kadar azaltabilir - buna 'adaptif termogenez' denir. Bu, evrimsel bir hayatta kalma mekanizmasıdır. Bunu minimize etmek için: 1) Çok agresif diyetten kaçının (günde 500+ kalori açığı). 2) Düzenli 'diet break' yapın (2-4 haftada bir, 1 hafta maintenance). 3) Direniş antrenmanı ile kas kütlenizi koruyun. 4) Protein alımını yüksek tutun (kg başına 2+ gram)."
  },
  {
    question: "NEAT nedir ve TDEE'yi nasıl etkiler?",
    answer: "NEAT (Non-Exercise Activity Thermogenesis), egzersiz dışı aktivitelerden yakılan kaloridir: yürümek, ayakta durmak, ev işleri, kıpırdanmak vb. NEAT, toplam enerji harcamasının %15-50'sini oluşturabilir ve kişiden kişiye günde 200-900 kalori fark yaratabilir. İlginç şekilde, bazı insanlar fazla kalori aldığında NEAT'lerini otomatik artırırken, diyet yaparken azaltır. Günlük 10.000+ adım atmak, merdiven kullanmak ve ayakta çalışmak NEAT'i artırmanın basit yollarıdır."
  }
];

export const macroFAQs: FAQItem[] = [
  {
    question: "Makro besinler nelerdir ve neden önemlidir?",
    answer: "Makro besinler, vücudun büyük miktarlarda ihtiyaç duyduğu 3 temel besin grubudur: Protein (gram başına 4 kalori), Karbonhidrat (gram başına 4 kalori) ve Yağ (gram başına 9 kalori). Protein kas yapımı ve onarımı için kritiktir. Karbonhidratlar ana enerji kaynağıdır ve yoğun antrenmanlar için gereklidir. Yağlar hormon üretimi, vitamin emilimi ve hücre sağlığı için zorunludur. Doğru makro dengesi, vücut kompozisyonunuzu ve performansınızı doğrudan etkiler."
  },
  {
    question: "Kilo vermek için en iyi makro oranı nedir?",
    answer: "Kilo verme için protein oranını yüksek tutmak kritiktir - toplam kalorinin %30-35'i veya vücut ağırlığınızın kg başına 1.8-2.2 gram. Yağ, kalorinin %25-30'u (kg başına 0.8-1 gram) olmalıdır. Kalan kalori karbonhidrattan gelir (%35-45). Örneğin, 2000 kalorilik diyette: 175g protein (700 kcal), 67g yağ (600 kcal), 175g karbonhidrat (700 kcal). Düşük karbonhidrat diyetleri de işe yarar ancak uzun vadede sürdürülebilirlik önemlidir."
  },
  {
    question: "Kas yapmak için protein ne kadar olmalı?",
    answer: "Bilimsel araştırmalar, kas yapımı için optimal protein alımının vücut ağırlığının kg başına 1.6-2.2 gram olduğunu gösteriyor. 80 kg bir kişi için bu günde 128-176 gram proteindir. Daha fazlası ek fayda sağlamaz. Önemli olan toplam günlük alım ve protein kalitesidir - hayvansal proteinler (et, yumurta, süt) tam amino asit profili sunar. Bitkisel proteinler kombine edilmelidir. Proteini öğünlere eşit dağıtın (öğün başına 25-40 gram)."
  },
  {
    question: "Karbonhidrat yemeden kas yapılabilir mi?",
    answer: "Teorik olarak evet, ancak optimal değildir. Karbonhidratlar yoğun antrenmanlarda ana yakıt kaynağıdır ve kas glikojenini doldurur. Keto veya düşük karbonhidrat diyetlerinde performans başlangıçta düşer ve adaptasyon 2-4 hafta sürer. Araştırmalar, yeterli protein alındığında düşük karbonhidratlı diyetlerin kas korumada etkili olduğunu ancak kas YAPIMINDA yüksek karbonhidratlı diyetlerin daha avantajlı olduğunu gösteriyor. Antrenman performansınızı korumak için günde en az 1-3 gram/kg karbonhidrat önerilir."
  },
  {
    question: "Yağ alımını çok düşürmek zararlı mı?",
    answer: "Evet, yağ alımını günde 20-30 gramın altına düşürmek hormon üretimini olumsuz etkiler. Testosteron, östrojen ve diğer steroid hormonlar kolesterolden üretilir. Çok düşük yağ diyetleri testosteron düşüşüne, adet düzensizliğine, kuru cilde, vitamin eksikliklerine (A, D, E, K yağda çözünür) ve sürekli açlık hissine neden olabilir. Günlük kalorinin minimum %20'si yağdan gelmeli ve omega-3 (balık, ceviz) ile omega-6 dengesi korunmalıdır."
  },
  {
    question: "Makro takibi yapmak şart mı?",
    answer: "Şart değil, ancak hedeflerinize bağlı. Genel sağlık için porsiyon kontrolü ve dengeli beslenme yeterlidir. Ancak spesifik vücut kompozisyonu hedefleri (yarışma hazırlığı, ciddi kilo verme/alma) için makro takibi büyük fark yaratır. Başlangıçta 2-4 hafta takip yapmak, porsiyon boyutları ve besin değerleri hakkında farkındalık kazandırır. Sonrasında 'sezgisel beslenme'ye geçebilirsiniz. MyFitnessPal, Yazio gibi uygulamalar takibi kolaylaştırır."
  }
];

export const idealWeightFAQs: FAQItem[] = [
  {
    question: "İdeal kilo nasıl hesaplanır?",
    answer: "İdeal kilo hesaplamak için birden fazla bilimsel formül kullanılır. En yaygın olanları: Devine formülü (1974), Hamwi formülü (1964), Robinson formülü (1983) ve Miller formülü (1983). Bu formüller boy ve cinsiyete göre hesaplama yapar. Örneğin, 175 cm boyundaki bir erkek için ortalama ideal kilo 70-75 kg civarındadır. Hesaplayıcımız 4 formülün ortalamasını alarak daha dengeli bir sonuç sunar. Ancak bu değerler sadece rehberdir - kas kütlesi, kemik yapısı ve vücut tipi de önemlidir."
  },
  {
    question: "Neden farklı formüller farklı sonuçlar veriyor?",
    answer: "Her formül farklı popülasyonlar ve farklı dönemlerde geliştirilmiştir. Devine formülü ilaç dozajı için tasarlanmıştır ve genel kullanıma uygun değildir. Hamwi formülü 1960'larda Metropolitan Life sigorta tablolarına dayanır. Robinson ve Miller formülleri daha modern ve dengeli sonuçlar verir. Hiçbiri 'doğru' değildir - hepsi tahmindir. Kendi vücut tipiniz, kas kütleniz ve sağlık göstergeleriniz (kan basıncı, kolesterol, enerji seviyesi) ideal kilonuzu belirlemede daha önemlidir."
  },
  {
    question: "İdeal kilom ile gerçek kilom arasında büyük fark var, ne yapmalıyım?",
    answer: "Öncelikle paniğe kapılmayın - 'ideal kilo' formülleri ortalama değerlerdir ve bireysel farklılıkları hesaba katmaz. Eğer fark 10 kg'dan fazlaysa ve sağlık göstergeleriniz (BMI, bel çevresi, kan değerleri) sorunlu ise, kademeli bir yaklaşım benimseyin. Haftada 0.5 kg kayıp hedefleyin - bu aylık 2 kg, yılda 24 kg demektir. Kas kütlesi yüksek kişilerde 'ideal kilo'nun üzerinde olmak normaldir. Odağınızı sadece tartıdaki sayıdan, genel sağlık ve vücut kompozisyonuna kaydırın."
  },
  {
    question: "Vücut tipim (ektomorf, mezomorf, endomorf) ideal kiloyu etkiler mi?",
    answer: "Evet, vücut tipi ideal kilo aralığınızı etkiler. Ektomorflar (ince yapılı, dar omuzlar) formül değerinin alt sınırına yakın olabilir. Mezomorflar (atletik yapı, geniş omuzlar) orta değerlerde rahat ederler ve kolayca kas yaparlar. Endomorflar (geniş kalça, yavaş metabolizma) üst sınıra yakın olabilir. Ancak vücut tipi kategorileri kesin sınırlar değildir - çoğu insan karma özelliklere sahiptir. Kemik yapınız da önemlidir: ince bilekli (17 cm altı) kişiler daha hafif, kalın bilekli (19 cm üstü) kişiler daha ağır olabilir."
  },
  {
    question: "Yaş ilerledikçe ideal kilo değişir mi?",
    answer: "Evet, yaşlanmayla vücut kompozisyonu doğal olarak değişir. 30 yaşından sonra her on yılda kas kütlesi %3-8 azalır (sarkopeni), yağ oranı artar. Bu nedenle 50 yaşında 70 kg olan biri, 30 yaşındaki 70 kg'dan farklı vücut kompozisyonuna sahiptir. İlginç şekilde, 65 yaş üstü kişilerde hafif 'fazla kilo' (BMI 25-27) sağlık açısından koruyucu olabilir. Yaşla birlikte odak, tartıdan çok kas kütlesini korumaya ve fonksiyonel fitness'a kaymalıdır. Protein alımını artırın ve direniş antrenmanı yapın."
  },
  {
    question: "Gebelik sonrası ideal kiloya dönmek ne kadar sürer?",
    answer: "Gebelikte alınan 11-16 kg'ın çoğu doğumdan sonra hızla gider (bebek, plasenta, sıvı). Kalan kilo kaybı için 6-12 ay hedeflemek sağlıklıdır. Emziren annelerin günde 300-500 kalori fazla ihtiyacı vardır, bu nedenle agresif diyet yapılmamalıdır. Haftada 0.5 kg kayıp güvenli ve sürdürülebilirdir. Hormonlar, uyku eksikliği ve stres kilo vermeyi zorlaştırabilir. Karın kaslarının toparlanması için diastasis recti kontrolü yapılmalı ve uygun egzersizler seçilmelidir. Kendinize zaman tanıyın - vücudunuz 9 ayda değişti, düzelmesi de zaman alacaktır."
  }
];

export const waterIntakeFAQs: FAQItem[] = [
  {
    question: "Günde ne kadar su içmeliyim?",
    answer: "Genel öneri günde 8 bardak (yaklaşık 2 litre) su olsa da, gerçek ihtiyaç kişiden kişiye değişir. Daha doğru hesaplama: Vücut ağırlığınızın kg başına 30-35 ml su. 70 kg biri için bu 2.1-2.5 litre demektir. Ancak aktivite seviyesi, iklim, terle kaybedilen sıvı ve genel sağlık durumunuz bu ihtiyacı artırabilir. Yoğun egzersiz yapanlar, sıcak iklimde yaşayanlar ve hamile/emziren kadınlar daha fazla su ihtiyacı duyar."
  },
  {
    question: "Çay, kahve ve diğer içecekler su yerine geçer mi?",
    answer: "Kısmen. Çay ve kahve su içerir ancak kafein hafif diüretik etkiye sahiptir (idrar söktürücü). Günde 3-4 fincana kadar kafeinli içecek net sıvı alımına katkı sağlar, ancak 5+ fincan diüretik etkiyi artırabilir. Bitki çayları su yerine sayılabilir. Meyve suları ve süt de sıvı kaynağıdır ancak kalori içerirler. Alkolü içecekler dehidrasyona neden olur - her alkollü içeceğe karşılık 1 bardak su için. Gazlı içecekler ve enerji içecekleri şeker/tatlandırıcı içerir, ana su kaynağınız olmamalıdır."
  },
  {
    question: "Çok su içmek zararlı olabilir mi?",
    answer: "Evet, aşırı su tüketimi 'hiponatremi' denilen tehlikeli bir duruma yol açabilir. Bu, kandaki sodyum seviyesinin aşırı seyrelmesidir. Belirtileri: baş ağrısı, mide bulantısı, kas krampları, şuur bulanıklığı, ciddi vakalarda koma. Nadir görülür ancak maraton koşucuları ve 'detoks' için aşırı su içenler risk altındadır. Genel kural: Günde 4-5 litreden fazla su içmeyin ve susuzluk hissinize güvenin. Çok sık ve renksiz idrar yapıyorsanız su alımınızı azaltın."
  },
  {
    question: "İdrar rengi su ihtiyacım hakkında ne söyler?",
    answer: "İdrar rengi hidrasyon durumunuzun en pratik göstergesidir. Açık sarı (limonata rengi) ideal hidrasyonu gösterir. Koyu sarı-amber renk dehidrasyona işaret eder, daha fazla su için. Renksiz veya çok açık idrar aşırı hidrasyon olabilir. Dikkat: B vitaminleri idrarı parlak sarı yapabilir, pancar kırmızıya boyayabilir - bunlar normaldir. Kahverengi veya kanlı idrar doktor gerektiren bir durumdur. Sabah ilk idrar normalde daha koyu olur, gün içinde açılmalıdır."
  },
  {
    question: "Egzersiz sırasında ne kadar su içmeliyim?",
    answer: "Egzersiz öncesi: 2-3 saat önce 500 ml, 30 dakika önce 250 ml. Egzersiz sırasında: Her 15-20 dakikada 150-250 ml (saatte yaklaşık 400-800 ml). Egzersiz sonrası: Kaybedilen her 0.5 kg için 500-750 ml su. 1 saatten uzun veya yoğun egzersizlerde elektrolit (sodyum, potasyum) içeren içecekler faydalıdır. Aşırı terleme durumunda tuz tabletleri veya sporcu içecekleri düşünülebilir. Susuzluk hissi gecikmeli gelebilir, bu nedenle planlı içim önemlidir."
  },
  {
    question: "Su içmenin cilt ve kilo verme üzerine etkisi nedir?",
    answer: "Su içmenin cilt üzerine etkisi abartılmış olabilir - dehidrasyon cildi kötüleştirir ancak fazla su içmek mucize yaratmaz. Yeterli hidrasyon, toksin atılımını destekler ve cildin elastikiyetini korur. Kilo verme için: Su, kalori içermez ve doygunluk hissi verir. Yemeklerden 30 dakika önce 500 ml su içmek kalori alımını %10-15 azaltabilir. Soğuk su içmek metabolizmayı çok az artırır (günde 8-100 kalori). Bazen açlık hissi aslında susuzluktur - su içip 15 dakika bekleyin. Su, kalori yakma sürecinde yağ metabolizmasını destekler."
  }
];

export const bodyFatFAQs: FAQItem[] = [
  {
    question: "Vücut yağ oranı nedir ve neden önemlidir?",
    answer: "Vücut yağ oranı, toplam vücut ağırlığınızın yüzde kaçının yağ dokusundan oluştuğunu gösterir. BMI'den farklı olarak, gerçek vücut kompozisyonunuzu yansıtır. Erkeklerde %6-13 atletik, %14-17 fitness, %18-24 kabul edilebilir, %25+ obez. Kadınlarda %14-20 atletik, %21-24 fitness, %25-31 kabul edilebilir, %32+ obez. Esansiyel yağ (yaşam için gerekli minimum) erkeklerde %2-5, kadınlarda %10-13'tür. Çok düşük yağ oranı hormon bozuklukları, bağışıklık zayıflığı ve organ hasarına yol açabilir."
  },
  {
    question: "Evde vücut yağ oranını nasıl ölçebilirim?",
    answer: "Evde kullanılabilecek yöntemler: 1) Kumpas (caliper) ölçümü: 3-7 noktadan deri kıvrımı ölçülür, formülle hesaplanır (%3-5 hata payı). 2) Biyoelektrik impedans (tartı): Vücuttan elektrik geçirerek ölçer, hidrasyon durumundan çok etkilenir (%3-8 hata). 3) Navy yöntemi: Bel ve boyun çevresi ile hesaplanır (%3-4 hata) - bizim hesaplayıcımız bunu kullanır. 4) Ayna ve fotoğraf: Görsel karşılaştırma, takip için faydalı. En doğru yöntemler (DEXA, hidrostatic tartım, Bod Pod) klinik ortamda yapılır."
  },
  {
    question: "Yağ yakımı için en etkili egzersiz türü hangisidir?",
    answer: "Yağ yakımında en önemli faktör toplam kalori açığıdır - hangi egzersizi yaptığınız ikincildir. Ancak bazı egzersizler daha etkilidir: 1) Direniş antrenmanı (ağırlık): Kas kütlesini artırır, dinlenme metabolizmasını yükseltir, EPOC (sonradan yakım) sağlar. 2) HIIT (Yüksek Yoğunluklu Aralıklı Antrenman): 20-30 dakikada yüksek kalori yakar, EPOC etkisi güçlüdür. 3) Kardiyo (koşu, yüzme): Kalori yakar ancak kas korumaz. İdeal kombinasyon: Haftada 3-4 gün ağırlık + 2-3 gün HIIT veya orta tempolu kardiyo + yeterli protein."
  },
  {
    question: "Belli bölgelerden (karın, kalça) yağ yakılabilir mi?",
    answer: "Hayır, 'spot reduction' yani bölgesel yağ yakımı miti bilimsel olarak çürütülmüştür. Vücut yağı genetik olarak belirlenen sırayla yakılır ve bu sıra kişiden kişiye değişir. Erkeklerde genelde karın bölgesi yağı en son gider, kadınlarda kalça ve uyluk. Karın egzersizleri karın kaslarını güçlendirir ancak üzerindeki yağı yakmaz - bunu kalori açığı yapar. Odak: Toplam yağ yüzdesini düşürün, zamanla 'inatçı yağlar' da gidecektir. Sabır ve tutarlılık anahtardır."
  },
  {
    question: "Düşük yağ oranına inmek neden zor?",
    answer: "Vücut yağı düştükçe zorluk artar çünkü: 1) Metabolik adaptasyon: Vücut enerji harcamasını azaltır, açlık hormonları (ghrelin) artar. 2) Hormon değişimleri: Leptin (tokluk hormonu) düşer, tiroid yavaşlar. 3) Psikolojik stres: Kronik diyet yorgunluğu, yemek takıntısı. 4) Genetik faktörler: Bazı insanlar doğal olarak daha yüksek yağ oranında denge kurar. 5) Uyku ve stres: Kortizol yükselir, su tutulumu artar. Çözüm: 'Diet break'ler yapın, diyet dönemlerini 8-12 haftayla sınırlayın, mental sağlığınızı gözetin."
  },
  {
    question: "Kadın ve erkek vücut yağ oranı neden farklıdır?",
    answer: "Kadınlar biyolojik olarak daha yüksek yağ oranına sahiptir - bu gebelik ve emzirme için evrimsel bir adaptasyondur. Kadınlarda esansiyel yağ %10-13 iken erkeklerde %2-5'tir. Kadınlar yağı genelde kalça, uyluk ve göğüs bölgesinde depolar (armut tipi), erkekler karın bölgesinde (elma tipi). Hormonlar (östrojen, testosteron) yağ dağılımını belirler. Kadın sporcular %14-20 aralığında sağlıklı performans gösterebilir; daha düşük oranlar adet düzensizliği ve kemik yoğunluğu kaybına neden olabilir. Karşılaştırma yaparken cinsiyet özelindeki referans aralıklarını kullanın."
  }
];

export const proteinIntakeFAQs: FAQItem[] = [
  {
    question: "Günlük protein ihtiyacı nasıl hesaplanır?",
    answer: "Protein ihtiyacı aktivite seviyenize ve hedefinize göre değişir. Hareketsiz yetişkinler için minimum: 0.8 g/kg. Düzenli egzersiz yapanlar: 1.2-1.4 g/kg. Kas yapımı hedefleyenler: 1.6-2.2 g/kg. Diyet yapanlar (kas koruma için): 2.0-2.4 g/kg. Yaşlılar (sarkopeni önleme): 1.2-1.5 g/kg. Örneğin, 75 kg olup kas yapmak isteyen biri için günlük 120-165 gram protein idealdir. Üst sınır güvenli kabul edilir; fazla protein sağlıklı böbreklere zarar vermez."
  },
  {
    question: "Protein alımını öğünlere nasıl dağıtmalıyım?",
    answer: "Protein sentezini optimize etmek için her öğünde 25-40 gram protein almak idealdir. Araştırmalar, tek seferde 40 gramın üzerinde proteinin ek kas yapımı sağlamadığını gösteriyor - fazlası enerji olarak kullanılır. Günde 4-5 öğün yaparak proteini eşit dağıtın. Örneğin 150 gram/gün hedefi: Kahvaltı 35g, ara öğün 25g, öğle 35g, antrenman sonrası 30g, akşam 25g. Antrenman sonrası 1-2 saat içinde protein almak önemlidir, ancak 'anabolik pencere' düşünüldüğü kadar dar değildir."
  },
  {
    question: "En iyi protein kaynakları hangileridir?",
    answer: "Hayvansal kaynaklar tam amino asit profili sunar: Tavuk göğsü (31g/100g), yumurta (13g/2 adet), yağsız dana (26g/100g), somon (25g/100g), yoğurt (10g/100g), lor peyniri (11g/100g). Bitkisel kaynaklar: Mercimek (9g/100g pişmiş), nohut (9g/100g), tofu (8g/100g), tempeh (19g/100g), kinoa (4g/100g). Vegan diyette farklı bitkisel kaynakları kombine ederek tam amino asit profili oluşturabilirsiniz. Protein kalitesi için 'biyolojik değer' ve 'PDCAAS' skorlarına bakılabilir."
  },
  {
    question: "Protein tozu gerekli mi, hangisini seçmeliyim?",
    answer: "Protein tozu 'gerekli' değildir ancak hedeflere ulaşmayı kolaylaştırır. Gerçek gıdadan yeterli protein alamıyorsanız veya pratiklik istiyorsanız faydalıdır. Whey protein: En yaygın, hızlı emilir, antrenman sonrası ideal. Kazein: Yavaş emilir, gece öncesi veya uzun açlık dönemleri için. İzole whey: Laktoz intoleransı olanlar için uygun. Vegan seçenekler: Bezelye, pirinç, kenevir proteini kombinasyonları. Kalite kontrolü: İnformel test programlarına (Labdoor, ConsumerLab) katılmış markaları tercih edin. Protein tozu tamamlayıcıdır, gerçek gıdanın yerini alamaz."
  },
  {
    question: "Fazla protein böbreklere zarar verir mi?",
    answer: "Sağlıklı böbreklere sahip kişilerde yüksek protein alımının zarar verdiğine dair bilimsel kanıt yoktur. Vücut ağırlığının 2-3 katı protein bile (2-3 g/kg) uzun vadeli çalışmalarda böbrek fonksiyonlarını etkilememiştir. Ancak mevcut böbrek hastalığı olanlarda durum farklıdır - bu kişiler protein alımını kısıtlamalı ve doktor kontrolünde olmalıdır. Yüksek proteinli diyetlerde yeterli su tüketimi önemlidir. Ayrıca protein kaynaklarının kalitesi önemlidir - işlenmiş etler yerine kaliteli hayvansal veya bitkisel kaynaklar tercih edilmelidir."
  },
  {
    question: "Vejeteryan veya vegansa protein ihtiyacımı nasıl karşılarım?",
    answer: "Bitkisel proteinler 'tamamlanmamış' amino asit profiline sahiptir ancak gün boyunca farklı kaynakları kombine ederek tüm esansiyel amino asitleri alabilirsiniz. Kombine örnekleri: Pirinç + fasulye, humus + pita, yulaf + badem. Günlük alımı biraz artırın (%10-20 fazla) çünkü bitkisel proteinlerin sindirim oranı daha düşüktür. Leucin amino asidi (kas sentezi için kritik) bitkisel kaynaklarda düşüktür - soya, bezelye proteini ve tempeh iyi kaynaklardır. B12 vitamini takviyesi ve vegan protein tozları (bezelye+pirinç karışımı) faydalı olabilir."
  }
];

export const oneRepMaxFAQs: FAQItem[] = [
  {
    question: "1RM (One Rep Max) nedir ve neden önemlidir?",
    answer: "1RM, bir egzersizde doğru formla kaldırabileceğiniz maksimum ağırlıktır - tek tekrar. Bu değer antrenman programlamasında kritik bir referans noktasıdır. Antrenman yoğunlukları genellikle 1RM'nin yüzdesi olarak belirlenir: Güç için %85-95, hipertrofi (kas büyümesi) için %65-85, dayanıklılık için %50-65. 1RM bilmek, ilerlemenizi objektif olarak takip etmenizi ve aşırı veya yetersiz yüklenmeyi önlemenizi sağlar."
  },
  {
    question: "1RM'yi test etmek mi yoksa hesaplamak mı daha güvenlidir?",
    answer: "Deneyim seviyenize bağlıdır. Yeni başlayanlar için hesaplama daha güvenlidir - 5-10 tekrarlık ağırlığınızla formül kullanarak tahmin yapın. Gerçek 1RM testi deneyimli sporcular için uygundur ve şu kurallara uyulmalıdır: Isınma şart, spotter (yardımcı) bulunun, formdan ödün vermeyin, tam dinlenme alın (3-5 dakika setler arası). Hesaplama formülleri (%95-99 doğruluk): Brzycki, Epley, Lander. 10+ tekrar yapabildiğiniz ağırlıklarda formüller daha az güvenilirdir. Haftada bir 3-5 tekrar maksimumunuzu test edip hesaplamak güvenli bir orta yoldur."
  },
  {
    question: "1RM'yi artırmak için en iyi antrenman stratejisi nedir?",
    answer: "1RM artışı için 'güç bloğu' programlaması etkilidir: 4-6 hafta boyunca ağır ağırlık (%80-90 1RM), düşük tekrar (2-5), yüksek set (4-6), uzun dinlenme (3-5 dakika). Haftada 2-3 kez ana kaldırışları (squat, bench, deadlift) çalışın. Progresif yüklenme kritiktir - her hafta küçük artışlar (1-2.5 kg). Yardımcı egzersizler zayıf noktaları güçlendirir: Bench için triceps, squat için glute, deadlift için sırt. Beslenme ve uyku göz ardı edilmemeli - kas güç salonunda parçalanır, mutfak ve yatakta onarılır."
  },
  {
    question: "Antrenman yüzdelerini nasıl kullanmalıyım?",
    answer: "Tipik yüzde kullanımı: Isınma setleri %40-60 (8-10 tekrar), çalışma setleri hedefe göre değişir. Güç antrenmanı: %85-95, 1-5 tekrar, 4-6 set. Hipertrofi: %65-80, 6-12 tekrar, 3-5 set. Dayanıklılık: %50-65, 12-20 tekrar, 2-3 set. RPE (Zorluk Algısı Ölçeği) sistemi de kullanılabilir: RPE 8 = 2 tekrar daha yapabilirsiniz, RPE 10 = maksimum efor. Örnek: 100 kg bench 1RM varsa, hipertrofi için 65-80 kg ile çalışırsınız. Formüller tahmindir, vücudunuzun tepkisine göre ayarlayın."
  },
  {
    question: "Kadınlar için 1RM hesaplaması farklı mıdır?",
    answer: "Formül aynıdır ancak kadınlar genellikle daha fazla tekrar yapabilir (kas lifi dağılımı farklılığı nedeniyle). Yani bir kadın 10 tekrar yaptığında, formül 1RM'yi biraz düşük hesaplayabilir. Kadınlar genellikle alt vücut kuvvetinde erkeklere göre daha yakın seviyelerde iken, üst vücutta fark daha belirgindir. Kadınlar için tipik bench press 1RM vücut ağırlığının %0.5-1 katı, squat 1.0-1.5 katı, deadlift 1.2-2.0 katıdır (antrenman seviyesine göre). Karşılaştırma için 'Wilks' veya 'DOTS' gibi göreceli güç formülleri kullanılabilir."
  },
  {
    question: "1RM testinde sakatlanmamak için nelere dikkat etmeliyim?",
    answer: "Güvenli 1RM testi için: 1) Kapsamlı ısınma yapın (5-10 dk kardio + dinamik esneme + kademeli set artışı). 2) Her zaman spotter kullanın (bench, squat). 3) Güvenlik ekipmanı (squat rack'te safety bar, deadlift'te drop yapabilme). 4) Yeterli dinlenme - önceki antrenman yorgunluğu yokken test edin. 5) Form asla bozulmamalı - kaldıramıyorsanız bırakın. 6) Ego kaldırış yapmayın - planlı artışlarla ilerleyin. 7) Vücuduzu dinleyin - ağrı veya anormal his varsa durun. Sakatlanma riski en yüksek: deadlift'te bel, bench'te omuz, squat'ta diz."
  }
];

export const heartRateFAQs: FAQItem[] = [
  {
    question: "Kalp atış hızı bölgeleri nedir?",
    answer: "Kalp atış hızı bölgeleri, maksimum kalp hızınızın (MKH) yüzdelerine göre belirlenen antrenman yoğunluk aralıklarıdır. Tipik olarak 5 bölge vardır: Bölge 1 (Çok Hafif, %50-60 MKH): Isınma, toparlanma. Bölge 2 (Hafif, %60-70): Yağ yakımı, aerobik baz. Bölge 3 (Orta, %70-80): Aerobik kapasite, dayanıklılık. Bölge 4 (Zor, %80-90): Anaerobik eşik, performans. Bölge 5 (Maksimum, %90-100): VO2max, sprint. Her bölge farklı fizyolojik adaptasyonları hedefler."
  },
  {
    question: "Maksimum kalp hızımı nasıl hesaplayabilirim?",
    answer: "En yaygın formül: 220 - yaş. Örneğin, 30 yaşındaysanız MKH ≈ 190 bpm. Ancak bu formül bireysel farklılıkları hesaba katmaz (±10-15 bpm hata payı). Daha doğru formüller: Tanaka (208 - 0.7 × yaş), Gulati (kadınlar için: 206 - 0.88 × yaş). En doğru yöntem laboratuvar testleri veya saha testleridir (örn. 3-4 dakikalık maksimum efor koşusu sonrası ölçüm). Bazı kişilerin MKH yaşa göre beklentiden 10-20 bpm yüksek veya düşük olabilir - bu normaldir."
  },
  {
    question: "Yağ yakmak için hangi kalp hızı bölgesinde antrenman yapmalıyım?",
    answer: "Yaygın inanış Bölge 2'nin (%60-70 MKH) 'yağ yakma bölgesi' olduğudur. Bu kısmen doğrudur - düşük yoğunlukta vücut yakıtının büyük kısmını yağdan alır. Ancak toplam kalori harcaması düşüktür. Yüksek yoğunluklu antrenmanlarda (%80+ MKH) mutlak yağ yakımı daha fazladır çünkü toplam kalori harcaması yüksektir. Ayrıca EPOC etkisi (antrenman sonrası yakım) yoğun antrenmanlarda daha güçlüdür. Optimal strateji: Karışık antrenman - haftada 2-3 gün düşük-orta yoğunluk (Bölge 2-3), 1-2 gün yüksek yoğunluk (Bölge 4-5)."
  },
  {
    question: "Antrenman sırasında nabız nasıl takip edilir?",
    answer: "Nabız takip yöntemleri: 1) Göğüs bandı (en doğru): EKG benzeri ölçüm, anlık tepki. 2) Bilek tabanlı optik sensör (akıllı saat): Günlük kullanım için iyi, yoğun egzersizde hata payı artar. 3) Elle sayma: 15 saniye nabız sayıp 4'le çarp - pratik ancak egzersiz sırasında zor. 4) Kulak içi kulaklıklar: Yeni teknoloji, doğruluğu artıyor. Antrenman uygulamaları (Strava, Garmin Connect, Polar Flow) nabız bölgelerini otomatik hesaplar ve analiz eder. Düzenli ölçüm, aşırı antrenman belirtilerini erkenden tespit etmeye yardımcı olur."
  },
  {
    question: "Dinlenme kalp hızı nedir ve ne anlama gelir?",
    answer: "Dinlenme kalp hızı (DKH), tamamen dinlenme halindeyken - ideal olarak sabah uyandığınızda yatakta - ölçülen nabzınızdır. Normal aralık: 60-100 bpm. İyi antrenman yapan kişilerde: 50-60 bpm. Elit dayanıklılık sporcularında: 35-50 bpm. Düşük DKH genellikle iyi kardiyovasküler fitness'ı gösterir - kalp her atışta daha fazla kan pompalar. DKH'nın artması: Hastalık, stres, aşırı antrenman, dehidrasyon, yetersiz uyku belirtisi olabilir. Günlük takip, vücut durumunuz hakkında değerli bilgi verir."
  },
  {
    question: "Yüksek kalp hızı ile antrenman yapmak tehlikeli midir?",
    answer: "Sağlıklı kişilerde kısa süreli yüksek kalp hızı (Bölge 5, %90-100 MKH) genellikle güvenlidir. Vücut sınırlarını korumak için tasarlanmıştır. Ancak dikkat edilmesi gerekenler: 1) Bölge 5 antrenmanları haftada 1-2'yi geçmemeli. 2) Kalp hastalığı, hipertansiyon veya aile öyküsü varsa doktor onayı alın. 3) Göğüs ağrısı, baş dönmesi, nefes darlığı hissederseniz durun. 4) Yeterli ısınma ve soğuma yapın. 5) İlaç kullanıyorsanız (beta blokerler gibi) kalp hızı tepkisi değişebilir - doktorunuza danışın. Kademeli ilerleme ve vücudu dinlemek esastır."
  }
];

export const waistHipFAQs: FAQItem[] = [
  {
    question: "Bel-kalça oranı (WHR) nedir ve neden önemlidir?",
    answer: "Bel-kalça oranı (Waist-to-Hip Ratio, WHR), bel çevrenizin kalça çevrenize bölünmesiyle hesaplanır. Bu oran, vücut yağ dağılımını ve buna bağlı sağlık risklerini değerlendirmek için kullanılır. Karın bölgesinde biriken yağ (elma tipi vücut), kalça ve uylukta biriken yağdan (armut tipi) daha yüksek sağlık riski taşır. WHO'ya göre riskli değerler: Erkeklerde >0.90, kadınlarda >0.85. WHR, kalp hastalığı, tip 2 diyabet ve metabolik sendrom riskini BMI'den daha iyi öngörebilir."
  },
  {
    question: "Bel ve kalça ölçümü doğru nasıl yapılır?",
    answer: "Doğru ölçüm için: 1) Bel çevresi: Kaburgaların alt sınırı ile kalça kemiğinin üst noktası arasındaki en dar yerden, genellikle göbek deliği hizasından ölçülür. Nefes verirken, hafif gevşek şekilde ölçün. 2) Kalça çevresi: Kalçaların en geniş noktasından, yandan bakıldığında en çıkıntılı yerden ölçülür. Ölçüm bandını yere paralel tutun, sıkı değil temas halinde. Aç karnına, sabah ölçüm en tutarlı sonucu verir. Giysisiz veya ince iç çamaşırla ölçün. Aynı koşullarda haftalık takip, ilerlemenizi doğru yansıtır."
  },
  {
    question: "Bel çevresi tek başına ne anlama gelir?",
    answer: "Bel çevresi, viseral (iç organ çevresi) yağ birikiminin basit bir göstergesidir ve sağlık riskleriyle güçlü korelasyon gösterir. Risk eşikleri - Erkekler: <94 cm düşük risk, 94-102 cm orta risk, >102 cm yüksek risk. Kadınlar: <80 cm düşük risk, 80-88 cm orta risk, >88 cm yüksek risk. WHR'ye göre ölçümü daha kolaydır ve bazı çalışmalar tek başına bel çevresinin WHR kadar prediktif olduğunu gösteriyor. Düzenli ölçüm, tartıdan bağımsız ilerlemenizi takip etmenize yardımcı olur."
  },
  {
    question: "Vücut tipimi (elma, armut) nasıl belirlerim?",
    answer: "Elma tipi (android obezite): Yağ karın, göğüs ve sırt bölgesinde birikir. WHR erkeklerde >0.90, kadınlarda >0.85. Erkeklerde ve menopoz sonrası kadınlarda daha yaygın. Daha yüksek metabolik risk taşır. Armut tipi (jinoid obezite): Yağ kalça, uyluk ve basen bölgesinde birikir. WHR erkeklerde <0.90, kadınlarda <0.85. Kadınlarda daha yaygın, östrojen etkisiyle. Görece daha düşük sağlık riski. Dikdörtgen tipi: Bel ve kalça ölçüleri yakın, yağ eşit dağılır. Elma tipi olanlar kilo verdiğinde sağlık göstergeleri daha hızlı iyileşir."
  },
  {
    question: "Bel-kalça oranını iyileştirmek için ne yapmalıyım?",
    answer: "WHR iyileştirme stratejileri: 1) Kalori açığı: Genel yağ kaybı bel çevresini azaltır. 2) Kardiyo + direnç antrenmanı kombinasyonu: HIIT özellikle karın yağını hedefler. 3) Beslenme: Şeker ve işlenmiş gıdalardan kaçının, protein ve lifi artırın - bu insülin direncini azaltır ve karın yağını hedefler. 4) Stres yönetimi: Kortizol karın yağı birikimini artırır. 5) Uyku: Yetersiz uyku viseral yağ artışıyla ilişkili. 6) Alkol kısıtlama: 'Bira göbeği' gerçektir. 7) Kalça kası geliştirme (glute egzersizleri): WHR oranını dolaylı olarak iyileştirir."
  },
  {
    question: "WHR ve BMI arasındaki fark nedir, hangisi daha önemli?",
    answer: "BMI, toplam vücut ağırlığını değerlendirir ancak yağ dağılımı hakkında bilgi vermez. WHR, yağın nerede biriktiğini gösterir. Bir kişi normal BMI'ye sahip olup ('normal kilolu') yine de yüksek WHR'ye sahip olabilir - buna 'metabolik obezite' veya 'TOFI' (Thin Outside Fat Inside) denir ve ciddi sağlık riski taşır. Tersine, kas kütlesi yüksek bir sporcu yüksek BMI'ye ancak sağlıklı WHR'ye sahip olabilir. İdeal olarak her ikisi de kullanılmalıdır. Bel çevresi + BMI kombinasyonu, tek başına BMI'den daha iyi risk tahmini yapar. Kan testleri (açlık kan şekeri, lipid paneli) tam resmi tamamlar."
  }
];
