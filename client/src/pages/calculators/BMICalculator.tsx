import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, RotateCcw } from "lucide-react";

export default function BMICalculator() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [gender, setGender] = useState("male");
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
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Sağlık Analizi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            Vücut Kitle <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">İndeksi</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Boy ve kilonuza göre BMI değerinizi ve ideal aralığınızı hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Activity className="text-primary" /> Verilerini Gir
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Boyunuz (cm)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-height-value">{height} cm</span>
                </div>
                <Slider 
                  value={[height]} 
                  onValueChange={(val) => setHeight(val[0])} 
                  min={140} 
                  max={220} 
                  step={1} 
                  className="py-4"
                  data-testid="slider-height"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Kilonuz (kg)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-weight-value">{weight} kg</span>
                </div>
                <Slider 
                  value={[weight]} 
                  onValueChange={(val) => setWeight(val[0])} 
                  min={40} 
                  max={150} 
                  step={0.5} 
                  className="py-4"
                  data-testid="slider-weight"
                />
              </div>

              <div className="space-y-2">
                 <Label className="text-gray-400 uppercase tracking-wider font-bold text-sm">Cinsiyet</Label>
                 <Select value={gender} onValueChange={setGender}>
                   <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white" data-testid="select-gender">
                     <SelectValue placeholder="Seçiniz" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="male">Erkek</SelectItem>
                     <SelectItem value="female">Kadın</SelectItem>
                   </SelectContent>
                 </Select>
              </div>

              <Button 
                onClick={calculateBMI} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-bmi"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div className="bg-black/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {bmi ? (
              <div className="space-y-8 w-full relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">Vücut Kitle İndeksiniz</div>
                
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                   <div className={`absolute inset-0 rounded-full border-[12px] opacity-10 ${status?.color.replace('text-', 'border-')}`}></div>
                   <div className={`absolute inset-0 rounded-full border-t-[12px] border-l-[12px] ${status?.color.replace('text-', 'border-')} animate-spin-slow duration-[3s]`}></div>
                   <div className="text-6xl font-bold font-heading text-white" data-testid="text-bmi-result">{bmi}</div>
                </div>

                <div>
                  <Badge className={`text-xl px-6 py-2 mb-3 ${status?.bg} text-black hover:${status?.bg} border-none font-bold uppercase`} data-testid="badge-bmi-status">
                    {status?.label}
                  </Badge>
                  <p className="text-gray-400 mt-2 text-lg" data-testid="text-bmi-description">{status?.desc}</p>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setBmi(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs"
                  data-testid="button-reset-bmi"
                >
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
      </div>
    </div>
  );
}
