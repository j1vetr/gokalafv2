import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Calculator, Scale, Dumbbell, Utensils, TrendingUp, Calendar, Zap, Info, RotateCcw, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Placeholder components for tools not yet implemented
const ToolPlaceholder = ({ title }: { title: string }) => (
  <div className="p-12 text-center space-y-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
      <Calculator size={48} />
    </div>
    <div>
      <h3 className="text-2xl font-heading font-bold uppercase mb-2 text-white">{title}</h3>
      <p className="text-gray-400 max-w-md mx-auto">Bu araç şu anda geliştirilme aşamasındadır. Çok yakında hizmetinizde olacak!</p>
    </div>
    <Button disabled variant="outline" className="border-white/20 text-gray-400">Yakında</Button>
  </div>
);

// BMI Calculator Component
const BMICalculator = () => {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = height / 100;
    const result = weight / (h * h);
    setBmi(parseFloat(result.toFixed(1)));
  };

  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: "Zayıf", color: "text-blue-400", bg: "bg-blue-500", desc: "Kalori alımını artırmalısın." };
    if (val < 25) return { label: "Normal", color: "text-green-400", bg: "bg-green-500", desc: "Formunu korumaya devam et!" };
    if (val < 30) return { label: "Fazla Kilolu", color: "text-yellow-400", bg: "bg-yellow-500", desc: "Kalori açığı oluşturmalısın." };
    return { label: "Obez", color: "text-red-400", bg: "bg-red-500", desc: "Profesyonel destek almalısın." };
  };

  const status = bmi ? getBMIStatus(bmi) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
        <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
          <Activity className="text-primary" /> Verilerini Gir
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <Label className="text-gray-400 uppercase tracking-wider font-bold">Boyunuz (cm)</Label>
              <span className="text-primary font-bold text-lg">{height} cm</span>
            </div>
            <Slider 
              value={[height]} 
              onValueChange={(val) => setHeight(val[0])} 
              min={140} 
              max={220} 
              step={1} 
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <Label className="text-gray-400 uppercase tracking-wider font-bold">Kilonuz (kg)</Label>
              <span className="text-primary font-bold text-lg">{weight} kg</span>
            </div>
            <Slider 
              value={[weight]} 
              onValueChange={(val) => setWeight(val[0])} 
              min={40} 
              max={150} 
              step={0.5} 
              className="py-4"
            />
          </div>

          <div className="space-y-2">
             <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Cinsiyet</Label>
             <Select defaultValue="male">
               <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                 <SelectValue placeholder="Seçiniz" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="male">Erkek</SelectItem>
                 <SelectItem value="female">Kadın</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <Button onClick={calculateBMI} size="lg" className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg">
            Hesapla
          </Button>
        </div>
      </div>

      {/* Result */}
      <div className="bg-black/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
        {bmi ? (
          <div className="space-y-8 w-full relative z-10 animate-in fade-in zoom-in duration-500">
            <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Vücut Kitle İndeksiniz</div>
            
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
               <div className={`absolute inset-0 rounded-full border-[12px] opacity-10 ${status?.color.replace('text-', 'border-')}`}></div>
               <div className={`absolute inset-0 rounded-full border-t-[12px] border-l-[12px] ${status?.color.replace('text-', 'border-')} animate-spin-slow duration-[3s]`}></div>
               <div className="text-6xl font-bold font-heading text-white">{bmi}</div>
            </div>

            <div>
              <Badge className={`text-xl px-6 py-2 mb-3 ${status?.bg} text-black hover:${status?.bg} border-none font-bold uppercase`}>
                {status?.label}
              </Badge>
              <p className="text-gray-400 mt-2 text-lg">{status?.desc}</p>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setBmi(null)} className="text-gray-500 hover:text-white uppercase tracking-wider text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6 opacity-30">
             <Activity size={80} className="mx-auto text-white" />
             <h3 className="text-2xl font-heading font-bold uppercase text-white">Sonuç Bekleniyor</h3>
             <p className="text-gray-400">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Tools() {
  const tools = [
    {
      id: "bmi",
      title: "Vücut Kitle İndeksi",
      desc: "Boy ve kilonuza göre BMI değerinizi ve ideal aralığınızı hesaplayın.",
      icon: <Activity className="w-8 h-8" />,
      category: "Sağlık",
      component: <BMICalculator />
    },
    {
      id: "calories",
      title: "Kalori & Makro",
      desc: "Hedefinize göre günlük almanız gereken kalori, protein, karbonhidrat ve yağ miktarı.",
      icon: <Utensils className="w-8 h-8" />,
      category: "Beslenme",
      component: <ToolPlaceholder title="Kalori & Makro" />
    },
    {
      id: "bodyfat",
      title: "Yağ Oranı Tahmini",
      desc: "Vücut ölçülerinizi girerek tahmini yağ oranınızı öğrenin.",
      icon: <Scale className="w-8 h-8" />,
      category: "Vücut Analizi",
      component: <ToolPlaceholder title="Yağ Oranı Tahmini" />
    },
    {
      id: "rm",
      title: "1RM Hesaplayıcı",
      desc: "Maksimum kuvvetinizi (1 Rep Max) tahmin edin ve antrenman ağırlıklarını belirleyin.",
      icon: <Dumbbell className="w-8 h-8" />,
      category: "Performans",
      component: <ToolPlaceholder title="1RM Hesaplayıcı" />
    },
    {
      id: "volume",
      title: "Antrenman Hacmi",
      desc: "Toplam antrenman hacminizi ve yoğunluğunuzu analiz edin.",
      icon: <TrendingUp className="w-8 h-8" />,
      category: "Antrenman",
      component: <ToolPlaceholder title="Antrenman Hacmi" />
    },
    {
      id: "neat",
      title: "Günlük Aktivite",
      desc: "Günlük aktivite düzeyinize göre harcadığınız ekstra kaloriyi hesaplayın.",
      icon: <Zap className="w-8 h-8" />,
      category: "Yaşam Tarzı",
      component: <ToolPlaceholder title="Günlük Aktivite" />
    },
    {
      id: "weight-tracker",
      title: "Kilo Takip Grafiği",
      desc: "Haftalık kilo değişimlerinizi görselleştirin ve trendi takip edin.",
      icon: <TrendingUp className="w-8 h-8" />,
      category: "Takip",
      component: <ToolPlaceholder title="Kilo Takip Grafiği" />
    },
    {
      id: "goal-date",
      title: "Hedef Tarih Planlayıcı",
      desc: "İstediğiniz kiloya ne zaman ulaşabileceğinizi simüle edin.",
      icon: <Calendar className="w-8 h-8" />,
      category: "Planlama",
      component: <ToolPlaceholder title="Hedef Tarih Planlayıcı" />
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-4 py-1">
            Gelişim Araçları
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase mb-6 text-white tracking-tighter">
            Vücudunu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Analiz Et</span>
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
            Profesyonel koçluk sistemimde kullandığım hesaplama araçlarını ücretsiz olarak deneyimle.
            Verilerini gir, haritanı çıkar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <Dialog key={tool.id}>
              <DialogTrigger asChild>
                <div className="group bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden flex flex-col h-full shadow-xl">
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
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] bg-[#050505] border-white/10 text-white max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl">
                <div className="p-8 border-b border-white/10 bg-[#0A0A0A]">
                   <h2 className="text-3xl font-heading font-bold uppercase text-white flex items-center gap-4">
                     <span className="text-primary">{tool.icon}</span> {tool.title}
                   </h2>
                   <p className="text-gray-400 mt-2 text-lg">{tool.desc}</p>
                </div>
                
                <div className="p-8 bg-[#050505]">
                   {tool.component}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
