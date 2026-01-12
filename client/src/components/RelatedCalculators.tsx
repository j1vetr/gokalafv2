import { Link } from "wouter";
import { Calculator, ArrowRight } from "lucide-react";

interface CalculatorItem {
  slug: string;
  name: string;
  description: string;
}

const allCalculators: CalculatorItem[] = [
  { slug: "boy-kilo-endeksi", name: "Boy Kilo Endeksi", description: "Boyunuza göre ideal kilonuzda mısınız?" },
  { slug: "vki", name: "Vücut Kitle İndeksi (BMI)", description: "Boy-kilo oranınızı hesaplayın" },
  { slug: "kalori", name: "Kalori Hesaplama", description: "Günlük kalori ihtiyacınızı öğrenin" },
  { slug: "tdee", name: "TDEE Hesaplama", description: "Toplam günlük enerji harcamanız" },
  { slug: "makro", name: "Makro Hesaplama", description: "Protein, karbonhidrat, yağ oranları" },
  { slug: "ideal-kilo", name: "İdeal Kilo", description: "Boyunuza göre ideal kilonuz" },
  { slug: "su-tuketimi", name: "Su Tüketimi", description: "Günlük su ihtiyacınızı hesaplayın" },
  { slug: "vucut-yagi", name: "Vücut Yağ Oranı", description: "Yağ yüzdenizi öğrenin" },
  { slug: "protein", name: "Protein İhtiyacı", description: "Günlük protein miktarınız" },
  { slug: "bir-tekrar-max", name: "1RM Hesaplama", description: "Maksimum kaldırabileceğiniz ağırlık" },
  { slug: "kalp-atisi", name: "Kalp Atış Hızı", description: "Antrenman kalp hızı bölgeleriniz" },
  { slug: "dinlenme", name: "Dinlenme Süresi", description: "Set arası dinlenme zamanlayıcı" },
  { slug: "bel-kalca-orani", name: "Bel Kalça Oranı", description: "Karın yağlanması ve sağlık riski" },
  { slug: "vucut-tipi", name: "Vücut Tipi", description: "Ektomorf, mezomorf, endomorf testi" },
];

interface RelatedCalculatorsProps {
  currentSlug: string;
  maxItems?: number;
}

export default function RelatedCalculators({ currentSlug, maxItems = 4 }: RelatedCalculatorsProps) {
  const related = allCalculators
    .filter(calc => calc.slug !== currentSlug)
    .slice(0, maxItems);

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Calculator size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold uppercase text-white">Diğer Hesaplayıcılar</h2>
          <p className="text-gray-500 text-xs">Fitness hedefleriniz için faydalı araçlar</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {related.map((calc) => (
          <Link 
            key={calc.slug} 
            href={`/araclar/${calc.slug}`}
            className="group p-3 bg-black/40 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <h3 className="font-heading font-bold text-sm text-white group-hover:text-primary transition-colors mb-0.5">
              {calc.name}
            </h3>
            <p className="text-gray-500 text-xs mb-2">{calc.description}</p>
            <div className="flex items-center gap-1 text-primary text-xs font-medium">
              Hesapla <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          href="/araclar" 
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Tüm Araçları Gör <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
