import { Link } from "wouter";
import { Activity, Utensils, Zap, Scale, ArrowRight, Target, Percent, Dumbbell, Droplets, Heart, Timer, Beef, Ruler, User, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function Tools() {
  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Ücretsiz Fitness Hesaplayıcıları",
    "description": "BMI, kalori, TDEE, makro, ideal kilo ve daha fazlası için ücretsiz online fitness hesaplayıcıları.",
    "url": "https://gokalaf.com/araclar",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 14,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Boy Kilo Endeksi", "url": "https://gokalaf.com/araclar/boy-kilo-endeksi" },
        { "@type": "ListItem", "position": 2, "name": "BMI Hesaplama", "url": "https://gokalaf.com/araclar/vki" },
        { "@type": "ListItem", "position": 3, "name": "Kalori Hesaplama", "url": "https://gokalaf.com/araclar/kalori" },
        { "@type": "ListItem", "position": 4, "name": "TDEE Hesaplama", "url": "https://gokalaf.com/araclar/tdee" },
        { "@type": "ListItem", "position": 5, "name": "Makro Hesaplama", "url": "https://gokalaf.com/araclar/makro" },
        { "@type": "ListItem", "position": 6, "name": "İdeal Kilo", "url": "https://gokalaf.com/araclar/ideal-kilo" },
        { "@type": "ListItem", "position": 7, "name": "Vücut Yağ Oranı", "url": "https://gokalaf.com/araclar/vucut-yagi" },
        { "@type": "ListItem", "position": 8, "name": "1RM Hesaplama", "url": "https://gokalaf.com/araclar/bir-tekrar-max" },
        { "@type": "ListItem", "position": 9, "name": "Su Tüketimi", "url": "https://gokalaf.com/araclar/su-tuketimi" },
        { "@type": "ListItem", "position": 10, "name": "Kalp Atış Hızı", "url": "https://gokalaf.com/araclar/kalp-atisi" },
        { "@type": "ListItem", "position": 11, "name": "Protein İhtiyacı", "url": "https://gokalaf.com/araclar/protein" },
        { "@type": "ListItem", "position": 12, "name": "Dinlenme Süresi", "url": "https://gokalaf.com/araclar/dinlenme" },
        { "@type": "ListItem", "position": 13, "name": "Bel Kalça Oranı", "url": "https://gokalaf.com/araclar/bel-kalca-orani" },
        { "@type": "ListItem", "position": 14, "name": "Vücut Tipi Belirleme", "url": "https://gokalaf.com/araclar/vucut-tipi" }
      ]
    }
  };
  const tools = [
    {
      id: "boy-kilo-endeksi",
      title: "Boy Kilo Endeksi",
      desc: "Boyunuza göre ideal kilonuzda olup olmadığınızı öğrenin.",
      icon: <Ruler className="w-8 h-8" />,
      category: "Sağlık",
      path: "/araclar/boy-kilo-endeksi",
      color: "emerald"
    },
    {
      id: "bmi",
      title: "Vücut Kitle İndeksi",
      desc: "Boy ve kilonuza göre BMI değerinizi ve ideal aralığınızı hesaplayın.",
      icon: <Activity className="w-8 h-8" />,
      category: "Sağlık",
      path: "/araclar/vki",
      color: "blue"
    },
    {
      id: "calories",
      title: "Kalori Hesaplama",
      desc: "Hedefinize göre günlük almanız gereken kalori miktarını hesaplayın.",
      icon: <Utensils className="w-8 h-8" />,
      category: "Beslenme",
      path: "/araclar/kalori",
      color: "orange"
    },
    {
      id: "tdee",
      title: "TDEE Hesaplama",
      desc: "Total Daily Energy Expenditure - günlük toplam enerji harcamanızı öğrenin.",
      icon: <Zap className="w-8 h-8" />,
      category: "Enerji",
      path: "/araclar/tdee",
      color: "yellow"
    },
    {
      id: "macros",
      title: "Makro Hesaplama",
      desc: "Protein, karbonhidrat ve yağ miktarlarınızı hesaplayın.",
      icon: <Scale className="w-8 h-8" />,
      category: "Beslenme",
      path: "/araclar/makro",
      color: "green"
    },
    {
      id: "ideal-weight",
      title: "İdeal Kilo",
      desc: "Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın.",
      icon: <Target className="w-8 h-8" />,
      category: "Hedef",
      path: "/araclar/ideal-kilo",
      color: "purple"
    },
    {
      id: "body-fat",
      title: "Yağ Oranı",
      desc: "US Navy formülüyle vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.",
      icon: <Percent className="w-8 h-8" />,
      category: "Analiz",
      path: "/araclar/vucut-yagi",
      color: "pink"
    },
    {
      id: "one-rep-max",
      title: "One Rep Max (1RM)",
      desc: "Kaldırdığınız ağırlık ve tekrardan maksimum kaldırma kapasiteni hesaplayın.",
      icon: <Dumbbell className="w-8 h-8" />,
      category: "Güç",
      path: "/araclar/bir-tekrar-max",
      color: "red"
    },
    {
      id: "water-intake",
      title: "Su İhtiyacı",
      desc: "Kilonuza ve aktivite seviyenize göre günlük su ihtiyacınızı hesaplayın.",
      icon: <Droplets className="w-8 h-8" />,
      category: "Hidrasyon",
      path: "/araclar/su-tuketimi",
      color: "cyan"
    },
    {
      id: "heart-rate-zones",
      title: "Kalp Hızı Bölgeleri",
      desc: "Yaşınıza göre antrenman kalp hızı bölgelerinizi hesaplayın.",
      icon: <Heart className="w-8 h-8" />,
      category: "Kardio",
      path: "/araclar/kalp-atisi",
      color: "rose"
    },
    {
      id: "protein-intake",
      title: "Protein İhtiyacı",
      desc: "Hedefinize ve aktivite seviyenize göre günlük protein ihtiyacınızı hesaplayın.",
      icon: <Beef className="w-8 h-8" />,
      category: "Beslenme",
      path: "/araclar/protein",
      color: "amber"
    },
    {
      id: "rest-timer",
      title: "Dinlenme Süresi",
      desc: "Antrenman tipinize göre ideal dinlenme sürenizi öğrenin.",
      icon: <Timer className="w-8 h-8" />,
      category: "Antrenman",
      path: "/araclar/dinlenme",
      color: "teal"
    },
    {
      id: "bel-kalca-orani",
      title: "Bel Kalça Oranı",
      desc: "Karın yağlanmanızı ölçün ve sağlık riskinizi değerlendirin.",
      icon: <CircleDot className="w-8 h-8" />,
      category: "Sağlık",
      path: "/araclar/bel-kalca-orani",
      color: "rose"
    },
    {
      id: "vucut-tipi",
      title: "Vücut Tipi Belirleme",
      desc: "Ektomorf, mezomorf veya endomorf olduğunuzu öğrenin.",
      icon: <User className="w-8 h-8" />,
      category: "Genetik",
      path: "/araclar/vucut-tipi",
      color: "amber"
    }
  ];

  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 group-hover:border-blue-500/40",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 group-hover:border-orange-500/40",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 group-hover:border-yellow-500/40",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 group-hover:border-green-500/40",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 group-hover:border-purple-500/40",
    pink: "from-pink-500/20 to-pink-500/5 border-pink-500/20 group-hover:border-pink-500/40",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 group-hover:border-red-500/40",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 group-hover:border-cyan-500/40",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 group-hover:border-rose-500/40",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 group-hover:border-amber-500/40",
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20 group-hover:border-teal-500/40",
  };

  const iconColorMap: Record<string, string> = {
    blue: "bg-blue-500/30 text-blue-400 group-hover:bg-blue-500",
    orange: "bg-orange-500/30 text-orange-400 group-hover:bg-orange-500",
    yellow: "bg-yellow-500/30 text-yellow-400 group-hover:bg-yellow-500",
    green: "bg-green-500/30 text-green-400 group-hover:bg-green-500",
    purple: "bg-purple-500/30 text-purple-400 group-hover:bg-purple-500",
    pink: "bg-pink-500/30 text-pink-400 group-hover:bg-pink-500",
    red: "bg-red-500/30 text-red-400 group-hover:bg-red-500",
    cyan: "bg-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500",
    rose: "bg-rose-500/30 text-rose-400 group-hover:bg-rose-500",
    amber: "bg-amber-500/30 text-amber-400 group-hover:bg-amber-500",
    teal: "bg-teal-500/30 text-teal-400 group-hover:bg-teal-500",
  };

  return (
    <>
      <SEO
        title="Ücretsiz Fitness Hesaplayıcıları | BMI, Kalori, TDEE, Makro | Gokalaf"
        description="11 farklı ücretsiz fitness hesaplayıcısı: BMI, kalori ihtiyacı, TDEE, makro besin değerleri, ideal kilo, vücut yağ oranı, 1RM, su tüketimi, kalp atış hızı bölgeleri, protein ihtiyacı hesaplama araçları. Bilimsel formüllerle anında sonuç alın."
        keywords="fitness hesaplayıcı, BMI hesaplama, kalori hesaplama, TDEE hesaplama, makro hesaplama, ideal kilo hesaplama, vücut yağ oranı, 1RM hesaplama, su ihtiyacı, kalp atış hızı, protein ihtiyacı, ücretsiz fitness araçları, online hesaplayıcı"
        canonical="/araclar"
        schema={toolsSchema}
      />
      <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Gelişim Araçları
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Vücudunu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Analiz Et</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Profesyonel koçluk sistemimde kullandığım {tools.length} hesaplama aracını ücretsiz olarak deneyimle.
            Verilerini gir, haritanı çıkar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={tool.path}>
                <div 
                  className={`group bg-gradient-to-br ${colorMap[tool.color]} border p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden flex flex-col h-full shadow-xl`} 
                  data-testid={`card-tool-${tool.id}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconColorMap[tool.color]} group-hover:text-black transition-all duration-300`}>
                      {tool.icon}
                    </div>
                    <Badge variant="outline" className="bg-transparent border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
                      {tool.category}
                    </Badge>
                  </div>
                  
                  <div className="flex-grow relative z-10">
                    <h3 className="text-lg font-heading font-bold uppercase text-white mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-2 relative z-10">
                    Hesapla <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
