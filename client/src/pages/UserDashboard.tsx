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
  Target, Award, ChevronRight, Activity, BarChart3, 
  ShoppingBag, Phone, Mail, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

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

type ActiveSection = "habits" | "measurements" | "calculators" | "package";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("habits");
  
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
  const activePackage = activeOrder ? packages[activeOrder.packageId] : null;
  
  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  const weightChange = latestMeasurement?.weight && previousMeasurement?.weight 
    ? (parseFloat(latestMeasurement.weight) - parseFloat(previousMeasurement.weight)).toFixed(1)
    : null;

  const calculateProgress = () => {
    if (!activeOrder?.startDate || !activeOrder?.endDate) return 0;
    const start = new Date(activeOrder.startDate).getTime();
    const end = new Date(activeOrder.endDate).getTime();
    const now = Date.now();
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getDaysRemaining = () => {
    if (!activeOrder?.endDate) return null;
    const end = new Date(activeOrder.endDate).getTime();
    const now = Date.now();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sections = [
    { id: "habits" as const, label: "Günlük Takip", icon: Activity },
    { id: "measurements" as const, label: "Vücut Ölçüleri", icon: BarChart3 },
    { id: "calculators" as const, label: "Hesaplayıcılar", icon: Calculator },
    { id: "package" as const, label: "Paket Durumu", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Profile Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-black font-heading text-3xl md:text-4xl font-bold shadow-lg shadow-primary/20">
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-white" data-testid="text-user-name">
                  {user?.fullName || "Kullanıcı"}
                </h1>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span data-testid="text-user-email">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Phone className="w-4 h-4" />
                      <span data-testid="text-user-phone">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:ml-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5" data-testid="stat-streak">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-500 uppercase">Seri</span>
                </div>
                <div className="text-2xl font-bold text-white" data-testid="text-streak-value">{streak}</div>
                <div className="text-xs text-gray-500">gün</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5" data-testid="stat-water">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-500 uppercase">Su</span>
                </div>
                <div className="text-2xl font-bold text-white" data-testid="text-water-value">{waterCount}</div>
                <div className="text-xs text-gray-500">bardak</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5" data-testid="stat-weight">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-xs text-gray-500 uppercase">Kilo</span>
                </div>
                <div className="text-2xl font-bold text-white" data-testid="text-weight-value">
                  {latestMeasurement?.weight || "-"}
                </div>
                <div className="text-xs text-gray-500">kg</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5" data-testid="stat-package">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-500 uppercase">Paket</span>
                </div>
                <div className="text-lg font-bold text-white truncate" data-testid="text-package-value">
                  {activePackage ? `${activePackage.weeks} Hafta` : "Yok"}
                </div>
                <div className="text-xs text-gray-500">
                  {activeOrder ? (activeOrder.status === "active" ? "Aktif" : "Bekliyor") : "-"}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 md:ml-4"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>

          {/* Active Package Progress */}
          {activeOrder && activePackage && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    {activePackage.name}
                  </Badge>
                  {getDaysRemaining() !== null && (
                    <span className="text-sm text-gray-400">
                      {getDaysRemaining()} gün kaldı
                    </span>
                  )}
                </div>
                <span className="text-sm text-primary font-medium">%{calculateProgress()}</span>
              </div>
              <Progress value={calculateProgress()} className="h-2 bg-white/10" />
            </div>
          )}
        </motion.div>

        {/* Section Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 md:gap-3 mb-8"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-primary text-black shadow-lg shadow-primary/30" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
                data-testid={`button-section-${section.id}`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* HABITS SECTION */}
            {activeSection === "habits" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-white uppercase">Günlük Takip</h2>
                  {streak > 0 && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-lg px-4 py-2">
                      <Flame className="w-5 h-5 mr-2" />
                      {streak} Gün Seri!
                    </Badge>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Water Tracker */}
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Su Takibi</h3>
                          <p className="text-sm text-gray-500">Günlük hedef: 8 bardak</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <Button
                          onClick={() => handleWaterChange(-1)}
                          variant="outline"
                          size="icon"
                          className="w-12 h-12 rounded-full border-white/20"
                          data-testid="button-water-minus"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-blue-400" data-testid="text-water-count">{waterCount}</div>
                          <div className="text-sm text-gray-500 mt-1">bardak</div>
                        </div>
                        <Button
                          onClick={() => handleWaterChange(1)}
                          variant="outline"
                          size="icon"
                          className="w-12 h-12 rounded-full border-white/20"
                          data-testid="button-water-plus"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <Progress value={(waterCount / 8) * 100} className="mt-6 h-2 bg-white/10" />
                    </CardContent>
                  </Card>

                  {/* Workout Tracker */}
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Antrenman</h3>
                          <p className="text-sm text-gray-500">Bugün antrenman yaptın mı?</p>
                        </div>
                      </div>
                      <button
                        onClick={handleWorkoutToggle}
                        className={`w-full py-6 rounded-xl font-bold text-lg transition-all ${
                          didWorkout 
                            ? "bg-primary text-black" 
                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                        }`}
                        data-testid="button-workout-toggle"
                      >
                        {didWorkout ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Tamamlandı!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Dumbbell className="w-6 h-6" />
                            Tamamla
                          </span>
                        )}
                      </button>
                    </CardContent>
                  </Card>

                  {/* Sleep Tracker */}
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Uyku</h3>
                          <p className="text-sm text-gray-500">Hedef: 7-9 saat</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={sleepHours}
                          onChange={(e) => handleSleepChange(e.target.value)}
                          placeholder="Saat girin..."
                          className="bg-white/5 border-white/10 text-center text-2xl h-16"
                          data-testid="input-sleep-hours"
                        />
                        <div className="text-center text-gray-500 text-sm">
                          {sleepHours && parseFloat(sleepHours) >= 7 && parseFloat(sleepHours) <= 9 
                            ? "✓ İdeal uyku süresi" 
                            : sleepHours 
                              ? "Hedef: 7-9 saat" 
                              : "Uyku sürenizi girin"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* MEASUREMENTS SECTION */}
            {activeSection === "measurements" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-white uppercase">Vücut Ölçüleri</h2>
                  <Dialog open={showMeasurementDialog} onOpenChange={setShowMeasurementDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-add-measurement">
                        <Plus className="w-4 h-4 mr-2" />
                        Ölçüm Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0A] border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-white font-heading">Yeni Ölçüm Ekle</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          Vücut ölçülerinizi kaydedin
                        </DialogDescription>
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
                            placeholder="85"
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
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 text-gray-500 font-medium">Tarih</th>
                              <th className="text-center py-3 text-gray-500 font-medium">Kilo</th>
                              <th className="text-center py-3 text-gray-500 font-medium">Göğüs</th>
                              <th className="text-center py-3 text-gray-500 font-medium">Bel</th>
                              <th className="text-center py-3 text-gray-500 font-medium">Kalça</th>
                              <th className="text-center py-3 text-gray-500 font-medium">Kol</th>
                            </tr>
                          </thead>
                          <tbody>
                            {measurements.map((m, index) => (
                              <tr key={m.id} className="border-b border-white/5" data-testid={`row-measurement-${index}`}>
                                <td className="py-3 text-gray-400">
                                  {new Date(m.date).toLocaleDateString("tr-TR")}
                                </td>
                                <td className="text-center py-3 text-white">{m.weight || "-"}</td>
                                <td className="text-center py-3 text-white">{m.chest || "-"}</td>
                                <td className="text-center py-3 text-white">{m.waist || "-"}</td>
                                <td className="text-center py-3 text-white">{m.hips || "-"}</td>
                                <td className="text-center py-3 text-white">{m.arms || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* CALCULATORS SECTION */}
            {activeSection === "calculators" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-white uppercase">Fitness Hesaplayıcıları</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "VKİ Hesapla", desc: "Vücut Kitle İndeksi", path: "/tools/bmi", icon: Scale, color: "from-blue-500 to-blue-600" },
                    { title: "Kalori Hesapla", desc: "Günlük Kalori İhtiyacı", path: "/tools/calories", icon: Flame, color: "from-orange-500 to-red-500" },
                    { title: "TDEE Hesapla", desc: "Toplam Enerji Harcaması", path: "/tools/tdee", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                    { title: "Makro Hesapla", desc: "Protein, Karb, Yağ", path: "/tools/macros", icon: Target, color: "from-purple-500 to-pink-500" },
                  ].map((calc) => {
                    const Icon = calc.icon;
                    const calcId = calc.path.split('/').pop();
                    return (
                      <Link key={calc.path} href={calc.path} data-testid={`link-calculator-${calcId}`}>
                        <Card className="bg-[#0A0A0A] border-white/10 hover:border-primary/50 transition-all cursor-pointer group h-full">
                          <CardContent className="p-6">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{calc.title}</h3>
                            <p className="text-sm text-gray-500">{calc.desc}</p>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary mt-4 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Recent Calculator Results */}
                {calculatorResults.length > 0 && (
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white font-heading uppercase text-lg">Son Hesaplamalar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {calculatorResults.slice(0, 5).map((result) => {
                          let parsed: any = {};
                          try {
                            parsed = JSON.parse(result.resultData);
                          } catch {}
                          
                          const typeLabels: Record<string, string> = {
                            bmi: "VKİ",
                            calorie: "Kalori",
                            tdee: "TDEE",
                            macro: "Makro"
                          };
                          
                          return (
                            <div key={result.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                  <Calculator className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <span className="text-white font-medium">
                                    {typeLabels[result.calculatorType] || result.calculatorType}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {new Date(result.createdAt).toLocaleDateString("tr-TR")}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {parsed.bmi && <span className="text-primary font-bold">{parsed.bmi}</span>}
                                {parsed.calories && <span className="text-primary font-bold">{parsed.calories} kcal</span>}
                                {parsed.tdee && <span className="text-primary font-bold">{parsed.tdee} kcal</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* PACKAGE SECTION */}
            {activeSection === "package" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-white uppercase">Paket Durumu</h2>

                {activeOrder && activePackage ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border-primary/30">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                              {activeOrder.status === "active" ? "Aktif" : "Onay Bekliyor"}
                            </Badge>
                            <h3 className="text-xl font-bold text-white">{activePackage.name}</h3>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Süre</span>
                            <span className="text-white font-medium">{activePackage.weeks} Hafta</span>
                          </div>
                          {activeOrder.startDate && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Başlangıç</span>
                              <span className="text-white font-medium">
                                {new Date(activeOrder.startDate).toLocaleDateString("tr-TR")}
                              </span>
                            </div>
                          )}
                          {activeOrder.endDate && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Bitiş</span>
                              <span className="text-white font-medium">
                                {new Date(activeOrder.endDate).toLocaleDateString("tr-TR")}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Ödenen Tutar</span>
                            <span className="text-primary font-bold">₺{parseFloat(activeOrder.totalPrice).toLocaleString("tr-TR")}</span>
                          </div>
                        </div>

                        {activeOrder.startDate && activeOrder.endDate && (
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-500">İlerleme</span>
                              <span className="text-primary font-medium">%{calculateProgress()}</span>
                            </div>
                            <Progress value={calculateProgress()} className="h-3 bg-white/10" />
                            {getDaysRemaining() !== null && getDaysRemaining()! > 0 && (
                              <p className="text-center text-gray-400 text-sm mt-3">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {getDaysRemaining()} gün kaldı
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white font-heading uppercase text-lg flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          WhatsApp ile İletişim
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 mb-6">
                          Koçunuzla doğrudan iletişime geçmek için WhatsApp'ı kullanabilirsiniz. 
                          Sorularınız, programınız veya ilerlemeniz hakkında her zaman yazabilirsiniz.
                        </p>
                        <a 
                          href="https://wa.me/905550000000" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp'ta Yaz
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Aktif Paketiniz Yok</h3>
                      <p className="text-gray-500 mb-6">
                        Fitness yolculuğunuza başlamak için bir koçluk paketi satın alın
                      </p>
                      <Link href="/packages">
                        <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-8">
                          Paketleri İncele
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Order History */}
                {orders.length > 0 && (
                  <Card className="bg-[#0A0A0A] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white font-heading uppercase text-lg">Sipariş Geçmişi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {orders.map((order) => {
                          const pkg = packages[order.packageId];
                          return (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  order.status === "active" ? "bg-green-500/20" : 
                                  order.status === "paid" ? "bg-blue-500/20" : 
                                  order.status === "completed" ? "bg-gray-500/20" : "bg-yellow-500/20"
                                }`}>
                                  <Package className={`w-5 h-5 ${
                                    order.status === "active" ? "text-green-400" : 
                                    order.status === "paid" ? "text-blue-400" : 
                                    order.status === "completed" ? "text-gray-400" : "text-yellow-400"
                                  }`} />
                                </div>
                                <div>
                                  <span className="text-white font-medium">{pkg?.name || "Paket"}</span>
                                  <p className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={`${
                                  order.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : 
                                  order.status === "paid" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                                  order.status === "completed" ? "bg-gray-500/20 text-gray-400 border-gray-500/30" : 
                                  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }`}>
                                  {order.status === "active" ? "Aktif" : 
                                   order.status === "paid" ? "Ödendi" : 
                                   order.status === "completed" ? "Tamamlandı" : 
                                   order.status === "pending" ? "Bekliyor" : order.status}
                                </Badge>
                                <p className="text-primary font-bold mt-1">
                                  ₺{parseFloat(order.totalPrice).toLocaleString("tr-TR")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
