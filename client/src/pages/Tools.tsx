import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Calculator, Scale, Dumbbell, Utensils, TrendingUp, Calendar, Zap, Info, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Placeholder components for tools not yet implemented
const ToolPlaceholder = ({ title }: { title: string }) => (
  <div className="p-12 text-center space-y-6 border border-dashed border-white/10 rounded-xl bg-white/5">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
      <Calculator size={40} />
    </div>
    <div>
      <h3 className="text-2xl font-bold uppercase mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto">Bu araç şu anda geliştirilme aşamasındadır. Çok yakında hizmetinizde olacak!</p>
    </div>
    <Button disabled variant="outline">Yakında</Button>
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
      <div className="space-y-6 p-6 bg-card/50 rounded-xl border border-white/5">
        <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2">
          <Activity className="text-primary" /> Verilerini Gir
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Boyunuz (cm)</Label>
              <span className="text-primary font-bold">{height} cm</span>
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

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Kilonuz (kg)</Label>
              <span className="text-primary font-bold">{weight} kg</span>
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
             <Label>Cinsiyet</Label>
             <Select defaultValue="male">
               <SelectTrigger className="bg-background/50 border-white/10">
                 <SelectValue placeholder="Seçiniz" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="male">Erkek</SelectItem>
                 <SelectItem value="female">Kadın</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <Button onClick={calculateBMI} size="lg" className="w-full bg-primary text-primary-foreground font-bold uppercase mt-4">
            Hesapla
          </Button>
        </div>
      </div>

      {/* Result */}
      <div className="bg-card/50 rounded-xl border border-white/5 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
        {bmi ? (
          <div className="space-y-6 w-full relative z-10 animate-in fade-in zoom-in duration-500">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Vücut Kitle İndeksiniz</div>
            
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
               <div className={`absolute inset-0 rounded-full border-8 opacity-20 ${status?.color.replace('text-', 'border-')}`}></div>
               <div className={`absolute inset-0 rounded-full border-t-8 border-l-8 ${status?.color.replace('text-', 'border-')} animate-spin-slow duration-[3s]`}></div>
               <div className="text-5xl font-bold font-heading text-white">{bmi}</div>
            </div>

            <div>
              <Badge className={`text-lg px-4 py-1 mb-2 ${status?.bg} text-black hover:${status?.bg} border-none`}>
                {status?.label}
              </Badge>
              <p className="text-muted-foreground mt-2">{status?.desc}</p>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setBmi(null)} className="text-muted-foreground hover:text-white">
              <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4 opacity-50">
             <Activity size={64} className="mx-auto text-muted-foreground" />
             <h3 className="text-xl font-bold uppercase">Sonuç Bekleniyor</h3>
             <p className="text-sm">Sol taraftaki bilgileri doldurup hesapla butonuna basın.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

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
      title: "Günlük Aktivite (NEAT)",
      desc: "Günlük aktivite düzeyinize göre harcadığınız ekstra kaloriyi hesaplayın.",
      icon: <Zap className="w-8 h-8" />,
      category: "Yaşam Tarzı",
      component: <ToolPlaceholder title="Günlük Aktivite (NEAT)" />
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
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider">
            Gelişim Araçları
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-6">
            Vücudunu <span className="text-primary">Analiz Et</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Profesyonel koçluk sistemimde kullandığım hesaplama araçlarını ücretsiz olarak deneyimle.
            Verilerini gir, haritanı çıkar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Dialog key={tool.id}>
              <DialogTrigger asChild>
                <Card className="bg-card border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {tool.icon}
                      </div>
                      <Badge variant="outline" className="bg-transparent border-white/10 text-xs text-muted-foreground">
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-heading uppercase group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {tool.desc}
                    </CardDescription>
                    <div className="mt-6 flex items-center text-primary text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Hesapla <span className="ml-2 text-lg">→</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] bg-[#0A0A0A] border-white/10 text-foreground max-h-[90vh] overflow-y-auto">
                <div className="border-b border-white/10 pb-4 mb-4">
                   <h2 className="text-2xl font-heading font-bold uppercase text-primary flex items-center gap-3">
                     {tool.icon} {tool.title}
                   </h2>
                   <p className="text-muted-foreground">{tool.desc}</p>
                </div>
                
                <div className="min-h-[300px]">
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
