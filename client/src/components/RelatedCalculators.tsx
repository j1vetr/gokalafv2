import { Link } from "wouter";
import { Calculator, ArrowRight } from "lucide-react";

interface Calculator {
  slug: string;
  name: string;
  description: string;
}

const allCalculators: Calculator[] = [
  { slug: "vucut-kitle-indeksi", name: "Vücut Kitle İndeksi (BMI)", description: "Boy-kilo oranınızı hesaplayın" },
  { slug: "kalori-hesaplama", name: "Kalori Hesaplama", description: "Günlük kalori ihtiyacınızı öğrenin" },
  { slug: "tdee-hesaplama", name: "TDEE Hesaplama", description: "Toplam günlük enerji harcamanız" },
  { slug: "makro-hesaplama", name: "Makro Hesaplama", description: "Protein, karbonhidrat, yağ oranları" },
  { slug: "ideal-kilo", name: "İdeal Kilo", description: "Boyunuza göre ideal kilonuz" },
  { slug: "su-tuketimi", name: "Su Tüketimi", description: "Günlük su ihtiyacınızı hesaplayın" },
  { slug: "vucut-yag-orani", name: "Vücut Yağ Oranı", description: "Yağ yüzdenizi öğrenin" },
  { slug: "protein-ihtiyaci", name: "Protein İhtiyacı", description: "Günlük protein miktarınız" },
  { slug: "one-rep-max", name: "1RM Hesaplama", description: "Maksimum kaldırabileceğiniz ağırlık" },
  { slug: "kalp-atis-hizi", name: "Kalp Atış Hızı", description: "Antrenman kalp hızı bölgeleriniz" },
  { slug: "bel-kalca-orani", name: "Bel-Kalça Oranı", description: "Vücut şekli analiziniz" },
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
    <div className="mt-16 pt-12 border-t border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Calculator size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold uppercase text-white">Diğer Hesaplayıcılar</h2>
          <p className="text-gray-500 text-sm">Fitness hedefleriniz için faydalı araçlar</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((calc) => (
          <Link 
            key={calc.slug} 
            href={`/araclar/${calc.slug}`}
            className="group p-4 bg-black/40 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <h3 className="font-heading font-bold text-white group-hover:text-primary transition-colors mb-1">
              {calc.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3">{calc.description}</p>
            <div className="flex items-center gap-1 text-primary text-sm font-medium">
              Hesapla <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          href="/araclar" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Tüm Araçları Gör <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
