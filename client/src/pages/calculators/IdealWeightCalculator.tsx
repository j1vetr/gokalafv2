import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, RotateCcw, TrendingUp, TrendingDown, Check } from "lucide-react";

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
  } | null>(null);

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

    setResult({
      robinson: parseFloat(robinson.toFixed(1)),
      miller: parseFloat(miller.toFixed(1)),
      devine: parseFloat(devine.toFixed(1)),
      hamwi: parseFloat(hamwi.toFixed(1)),
      average: parseFloat(average.toFixed(1)),
    });
  };

  const getWeightDifference = () => {
    if (!result) return null;
    const diff = currentWeight - result.average;
    if (Math.abs(diff) < 2) return { type: "ideal", text: "İdeal kilondasın!", color: "text-green-400" };
    if (diff > 0) return { type: "over", text: `${diff.toFixed(1)} kg fazlan var`, color: "text-yellow-400" };
    return { type: "under", text: `${Math.abs(diff).toFixed(1)} kg eksik`, color: "text-blue-400" };
  };

  const difference = getWeightDifference();

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            Hedef Belirleme
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
            İdeal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Kilo</span>
          </h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">
            Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 p-8 bg-black/40 rounded-3xl border border-white/10">
            <h3 className="text-xl font-heading font-bold uppercase mb-4 flex items-center gap-2 text-white">
              <Target className="text-primary" /> Verilerini Gir
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
                  <Label className="text-gray-400 uppercase tracking-wider font-bold">Mevcut Kilonuz (kg)</Label>
                  <span className="text-primary font-bold text-lg" data-testid="text-current-weight">{currentWeight} kg</span>
                </div>
                <Slider 
                  value={[currentWeight]} 
                  onValueChange={(val) => setCurrentWeight(val[0])} 
                  min={40} 
                  max={150} 
                  step={0.5} 
                  className="py-4"
                  data-testid="slider-current-weight"
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
                onClick={calculateIdealWeight} 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase mt-4 h-14 text-lg"
                data-testid="button-calculate-ideal-weight"
              >
                Hesapla
              </Button>
            </div>
          </div>

          <div className="bg-black/40 rounded-3xl border border-white/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {result ? (
              <div className="space-y-6 w-full relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">İdeal Kilo Aralığın</div>
                
                <div className="relative">
                  <div className="text-7xl font-bold font-heading text-primary" data-testid="text-ideal-weight-result">
                    {result.average}
                    <span className="text-2xl text-gray-500 ml-2">kg</span>
                  </div>
                  
                  {difference && (
                    <div className={`flex items-center justify-center gap-2 mt-4 ${difference.color}`}>
                      {difference.type === "ideal" && <Check className="w-5 h-5" />}
                      {difference.type === "over" && <TrendingDown className="w-5 h-5" />}
                      {difference.type === "under" && <TrendingUp className="w-5 h-5" />}
                      <span className="font-bold" data-testid="text-weight-difference">{difference.text}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">Robinson</div>
                    <div className="text-xl font-bold text-white">{result.robinson} kg</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">Miller</div>
                    <div className="text-xl font-bold text-white">{result.miller} kg</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">Devine</div>
                    <div className="text-xl font-bold text-white">{result.devine} kg</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">Hamwi</div>
                    <div className="text-xl font-bold text-white">{result.hamwi} kg</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setResult(null)} 
                  className="text-gray-500 hover:text-white uppercase tracking-wider text-xs mt-4"
                  data-testid="button-reset-ideal-weight"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Yeniden Hesapla
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-30">
                 <Target size={80} className="mx-auto text-white" />
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
