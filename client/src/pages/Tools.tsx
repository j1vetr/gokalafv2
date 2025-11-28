import { Link } from "wouter";
import { Activity, Utensils, Zap, Scale, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export default function Tools() {
  const tools = [
    {
      id: "bmi",
      title: "Vücut Kitle İndeksi",
      desc: "Boy ve kilonuza göre BMI değerinizi ve ideal aralığınızı hesaplayın.",
      icon: <Activity className="w-8 h-8" />,
      category: "Sağlık",
      path: "/tools/bmi"
    },
    {
      id: "calories",
      title: "Kalori Hesaplama",
      desc: "Hedefinize göre günlük almanız gereken kalori miktarını hesaplayın.",
      icon: <Utensils className="w-8 h-8" />,
      category: "Beslenme",
      path: "/tools/calories"
    },
    {
      id: "tdee",
      title: "TDEE Hesaplama",
      desc: "Total Daily Energy Expenditure - günlük toplam enerji harcamanızı öğrenin.",
      icon: <Zap className="w-8 h-8" />,
      category: "Enerji",
      path: "/tools/tdee"
    },
    {
      id: "macros",
      title: "Makro Hesaplama",
      desc: "Protein, karbonhidrat ve yağ miktarlarınızı hesaplayın.",
      icon: <Scale className="w-8 h-8" />,
      category: "Beslenme",
      path: "/tools/macros"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Gelişim Araçları
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Vücudunu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Analiz Et</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Profesyonel koçluk sistemimde kullandığım hesaplama araçlarını ücretsiz olarak deneyimle.
            Verilerini gir, haritanı çıkar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.path}>
              <div className="group bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden flex flex-col h-full shadow-xl" data-testid={`card-tool-${tool.id}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    {tool.icon}
                  </div>
                  <Badge variant="outline" className="bg-transparent border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                    {tool.category}
                  </Badge>
                </div>
                
                <div className="flex-grow relative z-10">
                  <h3 className="text-xl font-heading font-bold uppercase text-white mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-2 relative z-10">
                  Hesapla <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
