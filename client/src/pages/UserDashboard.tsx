import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, Package, LogOut, Clock, CheckCircle, 
  Droplets, Dumbbell, Moon, Flame, Calculator, 
  Plus, Minus, Scale, Ruler, TrendingUp, Calendar,
  Target, Award, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Order {
  id: string;
  packageId: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

interface PackageInfo {
  id: string;
  name: string;
  weeks: number;
}

interface DailyHabit {
  id: string;
  date: string;
  waterGlasses: number;
  didWorkout: boolean;
  sleepHours: string | null;
}

interface BodyMeasurement {
  id: string;
  date: string;
  weight: string | null;
  chest: string | null;
  waist: string | null;
  hips: string | null;
  arms: string | null;
  thighs: string | null;
  notes: string | null;
}

interface CalculatorResult {
  id: string;
  calculatorType: string;
  resultData: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [todayHabit, setTodayHabit] = useState<DailyHabit | null>(null);
  const [streak, setStreak] = useState(0);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  
  const [waterCount, setWaterCount] = useState(0);
  const [didWorkout, setDidWorkout] = useState(false);
  const [sleepHours, setSleepHours] = useState("");
  
  const [measurementForm, setMeasurementForm] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: ""
  });
  const [showMeasurementDialog, setShowMeasurementDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, packagesRes, habitsRes, measurementsRes, calcRes] = await Promise.all([
          fetch("/api/orders", { credentials: "include" }),
          fetch("/api/packages"),
          fetch("/api/habits/today", { credentials: "include" }),
          fetch("/api/measurements?limit=10", { credentials: "include" }),
          fetch("/api/calculator/results", { credentials: "include" }),
        ]);
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }
        
        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          const pkgMap: Record<string, PackageInfo> = {};
          (packagesData.packages || []).forEach((p: PackageInfo) => {
            pkgMap[p.id] = p;
          });
          setPackages(pkgMap);
        }

        if (habitsRes.ok) {
          const habitsData = await habitsRes.json();
          if (habitsData.habit) {
            setTodayHabit(habitsData.habit);
            setWaterCount(habitsData.habit.waterGlasses || 0);
            setDidWorkout(habitsData.habit.didWorkout || false);
            setSleepHours(habitsData.habit.sleepHours || "");
          }
          setStreak(habitsData.streak || 0);
        }

        if (measurementsRes.ok) {
          const measurementsData = await measurementsRes.json();
          setMeasurements(measurementsData.measurements || []);
        }

        if (calcRes.ok) {
          const calcData = await calcRes.json();
          setCalculatorResults(calcData.results || []);
        }
      } catch (error) {
        console.error("Veri yüklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const updateHabit = async (updates: { waterGlasses?: number; didWorkout?: boolean; sleepHours?: number }) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setTodayHabit(data.habit);
        setStreak(data.streak);
      }
    } catch (error) {
      console.error("Alışkanlık güncellenemedi:", error);
    }
  };

  const handleWaterChange = (delta: number) => {
    const newCount = Math.max(0, Math.min(20, waterCount + delta));
    setWaterCount(newCount);
    updateHabit({ waterGlasses: newCount });
  };

  const handleWorkoutToggle = () => {
    const newValue = !didWorkout;
    setDidWorkout(newValue);
    updateHabit({ didWorkout: newValue });
  };

  const handleSleepChange = (value: string) => {
    setSleepHours(value);
    const hours = parseFloat(value);
    if (!isNaN(hours) && hours >= 0 && hours <= 24) {
      updateHabit({ sleepHours: hours });
    }
  };

  const handleMeasurementSubmit = async () => {
    try {
      const data: any = {};
      if (measurementForm.weight) data.weight = parseFloat(measurementForm.weight);
      if (measurementForm.chest) data.chest = parseFloat(measurementForm.chest);
      if (measurementForm.waist) data.waist = parseFloat(measurementForm.waist);
      if (measurementForm.hips) data.hips = parseFloat(measurementForm.hips);
      if (measurementForm.arms) data.arms = parseFloat(measurementForm.arms);
      if (measurementForm.thighs) data.thighs = parseFloat(measurementForm.thighs);
      if (measurementForm.notes) data.notes = measurementForm.notes;

      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setMeasurements([result.measurement, ...measurements]);
        setMeasurementForm({ weight: "", chest: "", waist: "", hips: "", arms: "", thighs: "", notes: "" });
        setShowMeasurementDialog(false);
      }
    } catch (error) {
      console.error("Ölçüm kaydedilemedi:", error);
    }
  };

  const activeOrder = orders.find(o => o.status === "active" || o.status === "paid");
  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  
  const weightChange = latestMeasurement?.weight && previousMeasurement?.weight 
    ? (parseFloat(latestMeasurement.weight) - parseFloat(previousMeasurement.weight)).toFixed(1)
    : null;

  const getPackageProgress = () => {
    if (!activeOrder?.startDate || !activeOrder?.endDate) return 0;
    const start = new Date(activeOrder.startDate).getTime();
    const end = new Date(activeOrder.endDate).getTime();
    const now = Date.now();
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const getRemainingWeeks = () => {
    if (!activeOrder?.endDate) return null;
    const end = new Date(activeOrder.endDate).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  };

  const getCalcResultSummary = (type: string) => {
    const result = calculatorResults.find(r => r.calculatorType === type);
    if (!result) return null;
    try {
      return JSON.parse(result.resultData);
    } catch {
      return null;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Kullanıcı Paneli</p>
            <h1 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
              Hoş Geldin, <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            data-testid="button-logout"
          >
            <LogOut size={16} className="mr-2" /> Çıkış Yap
          </Button>
        </div>

        {/* Active Package Banner */}
        {activeOrder && (
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <Badge className="bg-primary text-black mb-1 text-[10px]">Aktif Plan</Badge>
                    <h3 className="text-xl font-heading font-bold uppercase text-white">
                      {packages[activeOrder.packageId]?.name || "Normal Plan"} - {packages[activeOrder.packageId]?.weeks} Hafta
                    </h3>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl font-bold text-primary">{getRemainingWeeks()}</div>
                  <div className="text-xs text-gray-400 uppercase">Hafta Kaldı</div>
                </div>
              </div>
              <Progress value={getPackageProgress()} className="h-2 bg-white/10" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{activeOrder.startDate ? new Date(activeOrder.startDate).toLocaleDateString("tr-TR") : "-"}</span>
                <span>{activeOrder.endDate ? new Date(activeOrder.endDate).toLocaleDateString("tr-TR") : "-"}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Calendar className="w-4 h-4 mr-2" /> Bugün
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" /> İlerleme
            </TabsTrigger>
            <TabsTrigger value="calculators" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Calculator className="w-4 h-4 mr-2" /> Hesaplayıcılar
            </TabsTrigger>
          </TabsList>

          {/* TODAY TAB */}
          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Water Tracker */}
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-medium">Su</span>
                    </div>
                    <span className="text-xs text-gray-600">/ 8 bardak</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleWaterChange(-1)}
                      className="h-10 w-10 border-white/10 hover:bg-white/5"
                      data-testid="button-water-minus"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">{waterCount}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleWaterChange(1)}
                      className="h-10 w-10 border-white/10 hover:bg-white/5"
                      data-testid="button-water-plus"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Progress value={(waterCount / 8) * 100} className="h-1.5 mt-4 bg-white/10" />
                </CardContent>
              </Card>

              {/* Workout Tracker */}
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Antrenman</span>
                  </div>
                  <Button
                    onClick={handleWorkoutToggle}
                    className={`w-full h-14 font-bold uppercase text-lg transition-all ${
                      didWorkout 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                    }`}
                    data-testid="button-workout-toggle"
                  >
                    {didWorkout ? (
                      <><CheckCircle className="w-5 h-5 mr-2" /> Tamamlandı</>
                    ) : (
                      "Bugün Yaptım"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Sleep Tracker */}
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Uyku</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={sleepHours}
                      onChange={(e) => handleSleepChange(e.target.value)}
                      placeholder="0"
                      min="0"
                      max="24"
                      step="0.5"
                      className="h-14 text-2xl font-bold text-center bg-white/5 border-white/10"
                      data-testid="input-sleep"
                    />
                    <span className="text-gray-500 text-sm">saat</span>
                  </div>
                </CardContent>
              </Card>

              {/* Streak */}
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Seri</span>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{streak}</div>
                    <div className="text-xs text-gray-500 uppercase mt-1">Gün üst üste</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile & Orders Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-white">{user?.fullName}</h2>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">Telefon</span>
                      <span className="text-white">{user?.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">Toplam Sipariş</span>
                      <span className="text-white">{orders.length}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Aktif Paket</span>
                      <span className={activeOrder ? "text-green-400" : "text-gray-500"}>
                        {activeOrder ? "Var" : "Yok"}
                      </span>
                    </div>
                  </div>

                  {!activeOrder && (
                    <Link href="/packages">
                      <Button className="w-full mt-6 bg-primary text-black hover:bg-primary/90 font-bold uppercase" data-testid="button-get-package">
                        <Package size={16} className="mr-2" /> Paket Al
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-[#0A0A0A] border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-heading uppercase text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Son Siparişler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Henüz sipariş yok
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => {
                        const pkg = packages[order.packageId];
                        return (
                          <div 
                            key={order.id} 
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                            data-testid={`order-${order.id}`}
                          >
                            <div>
                              <div className="font-medium text-white">{pkg?.name || "Normal Plan"}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                            <Badge className={
                              order.status === "active" ? "bg-green-500/20 text-green-400" :
                              order.status === "paid" ? "bg-blue-500/20 text-blue-400" :
                              order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-gray-500/20 text-gray-400"
                            }>
                              {order.status === "active" ? "Aktif" : 
                               order.status === "paid" ? "Ödendi" : 
                               order.status === "pending" ? "Bekliyor" : order.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold text-white uppercase">Vücut Ölçüleri</h2>
              <Dialog open={showMeasurementDialog} onOpenChange={setShowMeasurementDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-primary/90 font-bold" data-testid="button-add-measurement">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Ölçüm
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white font-heading uppercase">Ölçüm Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Kilo (kg)</Label>
                      <Input
                        type="number"
                        value={measurementForm.weight}
                        onChange={(e) => setMeasurementForm({...measurementForm, weight: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="75.5"
                        data-testid="input-weight"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Göğüs (cm)</Label>
                      <Input
                        type="number"
                        value={measurementForm.chest}
                        onChange={(e) => setMeasurementForm({...measurementForm, chest: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="100"
                        data-testid="input-chest"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Bel (cm)</Label>
                      <Input
                        type="number"
                        value={measurementForm.waist}
                        onChange={(e) => setMeasurementForm({...measurementForm, waist: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="80"
                        data-testid="input-waist"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Kalça (cm)</Label>
                      <Input
                        type="number"
                        value={measurementForm.hips}
                        onChange={(e) => setMeasurementForm({...measurementForm, hips: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="95"
                        data-testid="input-hips"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Kol (cm)</Label>
                      <Input
                        type="number"
                        value={measurementForm.arms}
                        onChange={(e) => setMeasurementForm({...measurementForm, arms: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="35"
                        data-testid="input-arms"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase">Bacak (cm)</Label>
                      <Input
                        type="number"
                        value={measurementForm.thighs}
                        onChange={(e) => setMeasurementForm({...measurementForm, thighs: e.target.value})}
                        className="bg-white/5 border-white/10"
                        placeholder="55"
                        data-testid="input-thighs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label className="text-gray-400 text-xs uppercase">Not</Label>
                    <Input
                      value={measurementForm.notes}
                      onChange={(e) => setMeasurementForm({...measurementForm, notes: e.target.value})}
                      className="bg-white/5 border-white/10"
                      placeholder="Opsiyonel not..."
                      data-testid="input-notes"
                    />
                  </div>
                  <Button 
                    onClick={handleMeasurementSubmit} 
                    className="w-full mt-4 bg-primary text-black hover:bg-primary/90 font-bold"
                    data-testid="button-save-measurement"
                  >
                    Kaydet
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Latest Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-4 text-center">
                  <Scale className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {latestMeasurement?.weight ? `${latestMeasurement.weight} kg` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">Kilo</div>
                  {weightChange && (
                    <div className={`text-xs mt-1 ${parseFloat(weightChange) < 0 ? "text-green-400" : "text-red-400"}`}>
                      {parseFloat(weightChange) > 0 ? "+" : ""}{weightChange} kg
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-4 text-center">
                  <Ruler className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {latestMeasurement?.waist ? `${latestMeasurement.waist} cm` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">Bel</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-4 text-center">
                  <Ruler className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {latestMeasurement?.chest ? `${latestMeasurement.chest} cm` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">Göğüs</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardContent className="p-4 text-center">
                  <Ruler className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {latestMeasurement?.arms ? `${latestMeasurement.arms} cm` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">Kol</div>
                </CardContent>
              </Card>
            </div>

            {/* Measurement History */}
            <Card className="bg-[#0A0A0A] border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-heading uppercase text-lg">Ölçüm Geçmişi</CardTitle>
              </CardHeader>
              <CardContent>
                {measurements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Henüz ölçüm eklenmemiş
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase">
                          <th className="text-left py-3 px-2">Tarih</th>
                          <th className="text-center py-3 px-2">Kilo</th>
                          <th className="text-center py-3 px-2">Bel</th>
                          <th className="text-center py-3 px-2">Göğüs</th>
                          <th className="text-center py-3 px-2">Kol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {measurements.map((m) => (
                          <tr key={m.id} className="border-b border-white/5">
                            <td className="py-3 px-2 text-gray-400">
                              {new Date(m.date).toLocaleDateString("tr-TR")}
                            </td>
                            <td className="py-3 px-2 text-center text-white">{m.weight || "-"}</td>
                            <td className="py-3 px-2 text-center text-white">{m.waist || "-"}</td>
                            <td className="py-3 px-2 text-center text-white">{m.chest || "-"}</td>
                            <td className="py-3 px-2 text-center text-white">{m.arms || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CALCULATORS TAB */}
          <TabsContent value="calculators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: "bmi", name: "VKİ Hesaplayıcı", icon: Scale, color: "blue", path: "/tools/bmi" },
                { type: "calories", name: "Kalori Hesaplayıcı", icon: Flame, color: "orange", path: "/tools/calorie" },
                { type: "tdee", name: "TDEE Hesaplayıcı", icon: TrendingUp, color: "green", path: "/tools/tdee" },
                { type: "macros", name: "Makro Hesaplayıcı", icon: Target, color: "purple", path: "/tools/macro" },
              ].map((calc) => {
                const result = getCalcResultSummary(calc.type);
                const Icon = calc.icon;
                return (
                  <Link key={calc.type} href={calc.path}>
                    <Card className="bg-[#0A0A0A] border-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-${calc.color}-500/20 flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 text-${calc.color}-400`} />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-white uppercase">{calc.name}</h3>
                            {result ? (
                              <p className="text-xs text-gray-500">
                                Son hesaplama: {result.bmi || result.calories || result.tdee || result.protein ? "Mevcut" : "-"}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">Henüz hesaplama yok</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Last Calculator Results */}
            {calculatorResults.length > 0 && (
              <Card className="bg-[#0A0A0A] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-heading uppercase text-lg">Son Hesaplamalar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calculatorResults.slice(0, 5).map((result) => {
                      let data;
                      try {
                        data = JSON.parse(result.resultData);
                      } catch {
                        data = {};
                      }
                      return (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-medium capitalize">
                              {result.calculatorType === "bmi" ? "VKİ" : 
                               result.calculatorType === "calories" ? "Kalori" :
                               result.calculatorType === "tdee" ? "TDEE" : "Makro"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(result.createdAt).toLocaleDateString("tr-TR")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-primary font-bold">
                              {data.bmi ? `${data.bmi} VKİ` : 
                               data.calories ? `${data.calories} kcal` :
                               data.tdee ? `${data.tdee} kcal` :
                               data.protein ? `P: ${data.protein}g` : "-"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
