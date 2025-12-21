import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, Package, LogOut, Clock, CheckCircle, 
  Droplets, Dumbbell, Moon, Flame, Calculator, 
  Plus, Minus, Scale, Ruler, TrendingUp, Calendar,
  Target, Award, ChevronRight, Activity, BarChart3, 
  ShoppingBag, Phone, Mail, Zap, Home, LineChart as LineChartIcon,
  Utensils, Settings, ArrowRight, ArrowUp, ArrowDown,
  Heart, Play, Pause, Timer, Crown, Star, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

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
  bodyFatPercentage: string | null;
  chest: string | null;
  waist: string | null;
  hips: string | null;
  arms: string | null;
  thighs: string | null;
  notes: string | null;
}

interface DailyNutrition {
  id: string;
  date: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string | null;
  notes: string | null;
}

interface NutritionSummary {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysTracked: number;
}

interface CalculatorResult {
  id: string;
  calculatorType: string;
  resultData: string;
  createdAt: string;
}

type ActivePage = "overview" | "progress" | "measurements" | "nutrition" | "workouts" | "settings";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>("overview");
  
  const [todayHabit, setTodayHabit] = useState<DailyHabit | null>(null);
  const [streak, setStreak] = useState(0);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  
  const [waterCount, setWaterCount] = useState(0);
  const [didWorkout, setDidWorkout] = useState(false);
  const [sleepHours, setSleepHours] = useState("");
  
  const [measurementForm, setMeasurementForm] = useState({
    weight: "",
    bodyFatPercentage: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: ""
  });
  const [showMeasurementDialog, setShowMeasurementDialog] = useState(false);
  
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition | null>(null);
  const [nutritionHistory, setNutritionHistory] = useState<DailyNutrition[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [nutritionForm, setNutritionForm] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
  });
  const [showNutritionDialog, setShowNutritionDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: ""
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/giris");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, packagesRes, habitsRes, measurementsRes, calcRes, allHabitsRes, nutritionTodayRes, nutritionHistoryRes] = await Promise.all([
          fetch("/api/orders", { credentials: "include" }),
          fetch("/api/packages"),
          fetch("/api/habits/today", { credentials: "include" }),
          fetch("/api/measurements?limit=30", { credentials: "include" }),
          fetch("/api/calculator/results", { credentials: "include" }),
          fetch("/api/habits?limit=30", { credentials: "include" }),
          fetch("/api/nutrition/today", { credentials: "include" }),
          fetch("/api/nutrition?limit=30", { credentials: "include" }),
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

        if (allHabitsRes.ok) {
          const allHabitsData = await allHabitsRes.json();
          setHabits(allHabitsData.habits || []);
        }

        if (nutritionTodayRes.ok) {
          const nutritionData = await nutritionTodayRes.json();
          setTodayNutrition(nutritionData.nutrition);
          setNutritionSummary(nutritionData.summary);
          if (nutritionData.nutrition) {
            setNutritionForm({
              calories: nutritionData.nutrition.calories?.toString() || "",
              protein: nutritionData.nutrition.protein || "",
              carbs: nutritionData.nutrition.carbs || "",
              fat: nutritionData.nutrition.fat || "",
              fiber: nutritionData.nutrition.fiber || "",
            });
          }
        }

        if (nutritionHistoryRes.ok) {
          const historyData = await nutritionHistoryRes.json();
          setNutritionHistory(historyData.nutrition || []);
        }
      } catch (error) {
        console.error("Veri yüklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
      if (user) {
        setProfileForm({
          fullName: user.fullName || "",
          phone: user.phone || ""
        });
      }
    }
  }, [isAuthenticated, user]);

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
    if (value === "") return;
    const hours = parseFloat(value);
    if (!isNaN(hours) && hours >= 0 && hours <= 24) {
      updateHabit({ sleepHours: hours });
    }
  };

  const handleMeasurementSubmit = async () => {
    try {
      const data: any = {};
      if (measurementForm.weight) data.weight = parseFloat(measurementForm.weight);
      if (measurementForm.bodyFatPercentage) data.bodyFatPercentage = parseFloat(measurementForm.bodyFatPercentage);
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
        setMeasurementForm({ weight: "", bodyFatPercentage: "", chest: "", waist: "", hips: "", arms: "", thighs: "", notes: "" });
        setShowMeasurementDialog(false);
      }
    } catch (error) {
      console.error("Ölçüm kaydedilemedi:", error);
    }
  };

  const handleNutritionSubmit = async () => {
    try {
      const data: any = {};
      if (nutritionForm.calories) data.calories = parseInt(nutritionForm.calories);
      if (nutritionForm.protein) data.protein = parseFloat(nutritionForm.protein);
      if (nutritionForm.carbs) data.carbs = parseFloat(nutritionForm.carbs);
      if (nutritionForm.fat) data.fat = parseFloat(nutritionForm.fat);
      if (nutritionForm.fiber) data.fiber = parseFloat(nutritionForm.fiber);

      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setTodayNutrition(result.nutrition);
        setNutritionSummary(result.summary);
        setShowNutritionDialog(false);
      }
    } catch (error) {
      console.error("Beslenme kaydedilemedi:", error);
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

  const getCurrentWeek = () => {
    if (!activeOrder?.startDate) return 0;
    const start = new Date(activeOrder.startDate).getTime();
    const now = Date.now();
    const weeksPassed = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.max(1, weeksPassed);
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

  const weightChartData = measurements.length > 0 
    ? measurements.slice(0, 10).reverse().map(m => ({
        date: new Date(m.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
        weight: m.weight ? parseFloat(m.weight) : null
      })).filter(d => d.weight !== null)
    : [];

  const bodyFatChartData = measurements.length > 0
    ? measurements.slice(0, 10).reverse().map(m => ({
        date: new Date(m.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
        bodyFat: m.bodyFatPercentage ? parseFloat(m.bodyFatPercentage) : null
      })).filter(d => d.bodyFat !== null)
    : [];

  const nutritionChartData = nutritionHistory.length > 0
    ? nutritionHistory.slice(0, 14).reverse().map(n => ({
        date: new Date(n.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
        calories: n.calories,
        protein: parseFloat(n.protein || "0"),
        carbs: parseFloat(n.carbs || "0"),
        fat: parseFloat(n.fat || "0"),
      }))
    : [];

  const weeklyWorkouts = habits.reduce((acc, h) => acc + (h.didWorkout ? 1 : 0), 0);
  const avgWater = habits.length > 0 
    ? (habits.reduce((acc, h) => acc + h.waterGlasses, 0) / habits.length).toFixed(1) 
    : "0";
  const avgSleep = habits.filter(h => h.sleepHours).length > 0
    ? (habits.filter(h => h.sleepHours).reduce((acc, h) => acc + parseFloat(h.sleepHours || "0"), 0) / habits.filter(h => h.sleepHours).length).toFixed(1)
    : "0";

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "overview" as const, label: "Genel Bakış", icon: Home },
    { id: "progress" as const, label: "İlerleme", icon: LineChartIcon },
    { id: "measurements" as const, label: "Ölçümler", icon: Ruler },
    { id: "nutrition" as const, label: "Beslenme", icon: Utensils },
    { id: "workouts" as const, label: "Antrenman", icon: Dumbbell },
    { id: "settings" as const, label: "Ayarlar", icon: Settings },
  ];

  const calculatorNames: Record<string, string> = {
    bmi: "VKİ",
    calories: "Kalori",
    tdee: "TDEE",
    macros: "Makro",
    idealWeight: "İdeal Kilo",
    bodyFat: "Yağ Oranı",
    oneRepMax: "1RM",
    waterIntake: "Su",
    heartRate: "Kalp Hızı",
    protein: "Protein"
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="flex min-h-screen pt-36">
        {/* Sidebar Navigation */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl fixed left-0 top-36 bottom-0 z-40"
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-black font-heading text-2xl font-bold shadow-lg shadow-primary/20">
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white truncate" data-testid="text-sidebar-name">
                  {user?.fullName || "Kullanıcı"}
                </h2>
                <div className="flex items-center gap-2">
                  {activePackage ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      {activePackage.weeks} Hafta
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                      Paket Yok
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-black shadow-lg shadow-primary/20" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            {streak > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{streak}</div>
                    <div className="text-xs text-gray-400">Gün Seri</div>
                  </div>
                </div>
              </div>
            )}
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </motion.aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 z-50 safe-area-bottom">
          <nav className="flex justify-around py-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive 
                      ? "text-primary" 
                      : "text-gray-500"
                  }`}
                  data-testid={`nav-mobile-${item.id}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 pb-24 lg:pb-8 lg:ml-[304px]">
          <div className="w-full px-4 lg:pl-8 lg:pr-8 py-8 lg:py-10 max-w-[1200px]">
            <AnimatePresence mode="wait">
              {/* OVERVIEW PAGE */}
              {activePage === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Welcome Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white" data-testid="text-welcome">
                        Merhaba, {user?.fullName?.split(" ")[0] || "Sporcu"}! 👋
                      </h1>
                      <p className="text-gray-400 mt-1">
                        {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                    </div>
                    {!activePackage && (
                      <Link href="/paketler">
                        <Button className="bg-primary text-black hover:bg-primary/90 font-bold" data-testid="button-buy-package">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Paket Satın Al
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Active Package Card */}
                  {activeOrder && activePackage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-3xl p-6 md:p-8 relative overflow-hidden"
                      data-testid="card-active-package"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                      <div className="relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center">
                              <Crown className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                                <CheckCircle className="w-3 h-3 mr-1" /> Aktif Paket
                              </Badge>
                              <h2 className="text-2xl font-bold text-white">{activePackage.name}</h2>
                              <p className="text-gray-400">Hafta {getCurrentWeek()} / {activePackage.weeks}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/30 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-primary">{calculateProgress()}%</div>
                              <div className="text-xs text-gray-400">Tamamlandı</div>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold text-white">{getDaysRemaining()}</div>
                              <div className="text-xs text-gray-400">Gün Kaldı</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Progress value={calculateProgress()} className="h-3 bg-black/30" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl p-5"
                      data-testid="stat-water"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-400">Su</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{waterCount}<span className="text-lg text-gray-400">/8</span></div>
                      <div className="text-xs text-gray-500 mt-1">bardak bugün</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-5"
                      data-testid="stat-workout"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-gray-400">Antrenman</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{weeklyWorkouts}</div>
                      <div className="text-xs text-gray-500 mt-1">bu ay</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl p-5"
                      data-testid="stat-sleep"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                          <Moon className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-400">Uyku</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{avgSleep}<span className="text-lg text-gray-400">h</span></div>
                      <div className="text-xs text-gray-500 mt-1">ortalama</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-2xl p-5"
                      data-testid="stat-weight"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/30 flex items-center justify-center">
                          <Scale className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-sm text-gray-400">Kilo</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold text-white">{latestMeasurement?.weight || "-"}</div>
                        {weightChange && parseFloat(weightChange) !== 0 && (
                          <div className={`flex items-center text-sm ${parseFloat(weightChange) < 0 ? "text-green-400" : "text-red-400"}`}>
                            {parseFloat(weightChange) < 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                            {Math.abs(parseFloat(weightChange))} kg
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">son ölçüm</div>
                    </motion.div>
                  </div>

                  {/* Today's Tracking */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-heading font-bold text-white uppercase">Bugünün Takibi</h2>
                      {streak > 0 && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <Flame className="w-4 h-4 mr-1" />
                          {streak} Gün Seri
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Water */}
                      <div className="bg-white/5 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Droplets className="w-6 h-6 text-blue-400" />
                          <span className="font-medium text-white">Su Takibi</span>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            onClick={() => handleWaterChange(-1)}
                            variant="outline"
                            size="icon"
                            className="w-10 h-10 rounded-full border-white/20"
                            data-testid="button-water-minus"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-400">{waterCount}</div>
                            <div className="text-xs text-gray-500">/ 8 bardak</div>
                          </div>
                          <Button
                            onClick={() => handleWaterChange(1)}
                            variant="outline"
                            size="icon"
                            className="w-10 h-10 rounded-full border-white/20"
                            data-testid="button-water-plus"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Progress value={(waterCount / 8) * 100} className="mt-4 h-2 bg-white/10" />
                      </div>

                      {/* Workout */}
                      <div className="bg-white/5 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Dumbbell className="w-6 h-6 text-primary" />
                          <span className="font-medium text-white">Antrenman</span>
                        </div>
                        <button
                          onClick={handleWorkoutToggle}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                            didWorkout 
                              ? "bg-primary text-black" 
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                          }`}
                          data-testid="button-workout-toggle"
                        >
                          {didWorkout ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Tamamlandı!
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Dumbbell className="w-5 h-5" />
                              Tamamla
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Sleep */}
                      <div className="bg-white/5 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Moon className="w-6 h-6 text-purple-400" />
                          <span className="font-medium text-white">Uyku</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={sleepHours}
                          onChange={(e) => handleSleepChange(e.target.value)}
                          placeholder="Saat..."
                          className="bg-white/5 border-white/10 text-center text-xl h-14"
                          data-testid="input-sleep-hours"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/araclar">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
                        data-testid="card-calculators"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                              <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white">Hesaplayıcılar</h3>
                              <p className="text-sm text-gray-400">BMI, Kalori, TDEE ve daha fazlası</p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    </Link>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => setActivePage("measurements")}
                      className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
                      data-testid="card-add-measurement"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <Scale className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">Ölçüm Ekle</h3>
                            <p className="text-sm text-gray-400">Vücut ölçülerini kaydet</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* PROGRESS PAGE */}
              {activePage === "progress" && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-white uppercase">İlerleme Takibi</h1>
                  </div>

                  {/* Charts Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Weight Chart */}
                    {weightChartData.length > 1 && (
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-heading font-bold text-white mb-6">Kilo Grafiği</h2>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightChartData}>
                              <defs>
                                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                              <XAxis dataKey="date" stroke="#666" fontSize={12} />
                              <YAxis stroke="#666" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                formatter={(value: number) => [`${value} kg`, "Kilo"]}
                              />
                              <Area type="monotone" dataKey="weight" stroke="#ccff00" fill="url(#weightGradient)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Body Fat Chart */}
                    {bodyFatChartData.length > 1 && (
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-heading font-bold text-white mb-6">Vücut Yağ Oranı</h2>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={bodyFatChartData}>
                              <defs>
                                <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                              <XAxis dataKey="date" stroke="#666" fontSize={12} />
                              <YAxis stroke="#666" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                formatter={(value: number) => [`%${value}`, "Yağ Oranı"]}
                              />
                              <Area type="monotone" dataKey="bodyFat" stroke="#ec4899" fill="url(#bodyFatGradient)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Current Stats Summary */}
                  {latestMeasurement && (
                    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-4">Güncel Durum</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-black/30 rounded-xl">
                          <div className="text-3xl font-bold text-primary">{latestMeasurement.weight || "-"}</div>
                          <div className="text-sm text-gray-400 mt-1">kg</div>
                          {weightChange && (
                            <div className={`text-xs mt-2 flex items-center justify-center gap-1 ${parseFloat(weightChange) < 0 ? "text-green-400" : parseFloat(weightChange) > 0 ? "text-red-400" : "text-gray-400"}`}>
                              {parseFloat(weightChange) < 0 ? <ArrowDown className="w-3 h-3" /> : parseFloat(weightChange) > 0 ? <ArrowUp className="w-3 h-3" /> : null}
                              {weightChange} kg
                            </div>
                          )}
                        </div>
                        <div className="text-center p-4 bg-black/30 rounded-xl">
                          <div className="text-3xl font-bold text-pink-400">{latestMeasurement.bodyFatPercentage || "-"}</div>
                          <div className="text-sm text-gray-400 mt-1">% yağ</div>
                        </div>
                        <div className="text-center p-4 bg-black/30 rounded-xl">
                          <div className="text-3xl font-bold text-blue-400">{latestMeasurement.waist || "-"}</div>
                          <div className="text-sm text-gray-400 mt-1">cm bel</div>
                        </div>
                        <div className="text-center p-4 bg-black/30 rounded-xl">
                          <div className="text-3xl font-bold text-purple-400">{latestMeasurement.chest || "-"}</div>
                          <div className="text-sm text-gray-400 mt-1">cm göğüs</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Monthly Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-gray-400">Toplam Antrenman</span>
                      </div>
                      <div className="text-4xl font-bold text-white">{weeklyWorkouts}</div>
                      <div className="text-sm text-gray-500 mt-1">son 30 gün</div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-gray-400">Günlük Su Ort.</span>
                      </div>
                      <div className="text-4xl font-bold text-white">{avgWater}</div>
                      <div className="text-sm text-gray-500 mt-1">bardak/gün</div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Moon className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-gray-400">Uyku Ortalaması</span>
                      </div>
                      <div className="text-4xl font-bold text-white">{avgSleep}</div>
                      <div className="text-sm text-gray-500 mt-1">saat/gün</div>
                    </div>
                  </div>

                  {/* Saved Calculator Results */}
                  {calculatorResults.length > 0 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-6">Kayıtlı Hesaplamalar</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {calculatorResults.slice(0, 6).map((result) => {
                          const data = JSON.parse(result.resultData);
                          return (
                            <div key={result.id} className="bg-white/5 rounded-xl p-4" data-testid={`card-calc-result-${result.id}`}>
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  {calculatorNames[result.calculatorType] || result.calculatorType}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(result.createdAt).toLocaleDateString("tr-TR")}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {data.value || data.bmi || data.calories || data.tdee || "-"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* MEASUREMENTS PAGE */}
              {activePage === "measurements" && (
                <motion.div
                  key="measurements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-white uppercase">Vücut Ölçüleri</h1>
                    <Dialog open={showMeasurementDialog} onOpenChange={setShowMeasurementDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-black hover:bg-primary/90 w-full sm:w-auto" data-testid="button-add-measurement">
                          <Plus className="w-4 h-4 mr-2" /> Yeni Ölçüm
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-lg" data-testid="modal-add-measurement">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-heading uppercase">Ölçüm Ekle</DialogTitle>
                          <DialogDescription className="text-gray-500">
                            Güncel vücut ölçülerinizi girin
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <Label className="text-gray-400">Kilo (kg)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.weight}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, weight: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-weight"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Yağ Oranı (%)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              min="1"
                              max="60"
                              value={measurementForm.bodyFatPercentage}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, bodyFatPercentage: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-bodyfat"
                              placeholder="Örn: 18.5"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Göğüs (cm)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.chest}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, chest: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-chest"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Bel (cm)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.waist}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, waist: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-waist"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Kalça (cm)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.hips}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, hips: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-hips"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Kol (cm)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.arms}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, arms: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-arms"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Bacak (cm)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              value={measurementForm.thighs}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, thighs: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              data-testid="input-measurement-thighs"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-gray-400">Not</Label>
                            <Textarea
                              value={measurementForm.notes}
                              onChange={(e) => setMeasurementForm({ ...measurementForm, notes: e.target.value })}
                              className="bg-white/5 border-white/10 mt-1"
                              placeholder="İsteğe bağlı not..."
                              data-testid="input-measurement-notes"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowMeasurementDialog(false)} className="border-white/20" data-testid="button-cancel-measurement">
                            İptal
                          </Button>
                          <Button onClick={handleMeasurementSubmit} className="bg-primary text-black hover:bg-primary/90" data-testid="button-save-measurement">
                            Kaydet
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Latest Measurement Cards */}
                  {latestMeasurement && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: "Kilo", value: latestMeasurement.weight, unit: "kg", icon: Scale, color: "primary" },
                        { label: "Göğüs", value: latestMeasurement.chest, unit: "cm", icon: Ruler, color: "blue-500" },
                        { label: "Bel", value: latestMeasurement.waist, unit: "cm", icon: Ruler, color: "purple-500" },
                        { label: "Kalça", value: latestMeasurement.hips, unit: "cm", icon: Ruler, color: "pink-500" },
                        { label: "Kol", value: latestMeasurement.arms, unit: "cm", icon: Ruler, color: "orange-500" },
                        { label: "Bacak", value: latestMeasurement.thighs, unit: "cm", icon: Ruler, color: "green-500" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4"
                        >
                          <div className="text-xs text-gray-500 mb-2">{item.label}</div>
                          <div className="text-2xl font-bold text-white">
                            {item.value || "-"}{item.value && <span className="text-sm text-gray-400 ml-1">{item.unit}</span>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Measurement History */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-white/10">
                      <h2 className="text-lg md:text-xl font-heading font-bold text-white">Ölçüm Geçmişi</h2>
                    </div>
                    
                    {/* Mobile Card View */}
                    <div className="md:hidden p-4 space-y-4">
                      {measurements.slice(0, 10).map((m) => (
                        <div key={m.id} className="bg-white/5 rounded-xl p-4 space-y-3" data-testid={`card-measurement-${m.id}`}>
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-primary font-medium">{new Date(m.date).toLocaleDateString("tr-TR")}</span>
                            {m.weight && <span className="text-white font-bold">{m.weight} kg</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center">
                              <div className="text-gray-500 text-xs">Göğüs</div>
                              <div className="text-white">{m.chest || "-"}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500 text-xs">Bel</div>
                              <div className="text-white">{m.waist || "-"}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500 text-xs">Kalça</div>
                              <div className="text-white">{m.hips || "-"}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500 text-xs">Kol</div>
                              <div className="text-white">{m.arms || "-"}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500 text-xs">Bacak</div>
                              <div className="text-white">{m.thighs || "-"}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {measurements.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          Henüz ölçüm kaydı yok. İlk ölçümünüzü ekleyin!
                        </div>
                      )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-xs text-gray-500 uppercase p-4">Tarih</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Kilo</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Göğüs</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Bel</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Kalça</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Kol</th>
                            <th className="text-center text-xs text-gray-500 uppercase p-4">Bacak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {measurements.slice(0, 10).map((m, i) => (
                            <tr key={m.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`row-measurement-${m.id}`}>
                              <td className="p-4 text-gray-400">
                                {new Date(m.date).toLocaleDateString("tr-TR")}
                              </td>
                              <td className="p-4 text-center text-white font-medium">{m.weight || "-"}</td>
                              <td className="p-4 text-center text-white">{m.chest || "-"}</td>
                              <td className="p-4 text-center text-white">{m.waist || "-"}</td>
                              <td className="p-4 text-center text-white">{m.hips || "-"}</td>
                              <td className="p-4 text-center text-white">{m.arms || "-"}</td>
                              <td className="p-4 text-center text-white">{m.thighs || "-"}</td>
                            </tr>
                          ))}
                          {measurements.length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-gray-500">
                                Henüz ölçüm kaydı yok. İlk ölçümünüzü ekleyin!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* NUTRITION PAGE */}
              {activePage === "nutrition" && (
                <motion.div
                  key="nutrition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-white uppercase">Beslenme</h1>
                    <Dialog open={showNutritionDialog} onOpenChange={setShowNutritionDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-add-nutrition">
                          <Plus className="w-4 h-4 mr-2" />
                          Bugünü Kaydet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white font-heading">Günlük Beslenme</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Bugünkü kalori ve makro değerlerini girin
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-400">Kalori (kcal)</Label>
                              <Input
                                type="number"
                                placeholder="2000"
                                value={nutritionForm.calories}
                                onChange={(e) => setNutritionForm(prev => ({ ...prev, calories: e.target.value }))}
                                className="bg-white/5 border-white/10"
                                data-testid="input-calories"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-400">Protein (g)</Label>
                              <Input
                                type="number"
                                placeholder="150"
                                value={nutritionForm.protein}
                                onChange={(e) => setNutritionForm(prev => ({ ...prev, protein: e.target.value }))}
                                className="bg-white/5 border-white/10"
                                data-testid="input-protein"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-400">Karbonhidrat (g)</Label>
                              <Input
                                type="number"
                                placeholder="200"
                                value={nutritionForm.carbs}
                                onChange={(e) => setNutritionForm(prev => ({ ...prev, carbs: e.target.value }))}
                                className="bg-white/5 border-white/10"
                                data-testid="input-carbs"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-400">Yağ (g)</Label>
                              <Input
                                type="number"
                                placeholder="70"
                                value={nutritionForm.fat}
                                onChange={(e) => setNutritionForm(prev => ({ ...prev, fat: e.target.value }))}
                                className="bg-white/5 border-white/10"
                                data-testid="input-fat"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleNutritionSubmit} className="w-full bg-primary text-black hover:bg-primary/90" data-testid="button-save-nutrition">
                            Kaydet
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Today's Nutrition Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center">
                          <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-sm text-gray-400">Kalori</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{todayNutrition?.calories || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">kcal bugün</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/30 flex items-center justify-center">
                          <Target className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-sm text-gray-400">Protein</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{todayNutrition?.protein || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">gram bugün</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-gray-400">Karbonhidrat</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{todayNutrition?.carbs || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">gram bugün</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-400">Yağ</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{todayNutrition?.fat || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">gram bugün</div>
                    </motion.div>
                  </div>

                  {/* Weekly Average */}
                  {nutritionSummary && nutritionSummary.daysTracked > 0 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-4">Haftalık Ortalama</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-orange-400">{nutritionSummary.avgCalories}</div>
                          <div className="text-xs text-gray-500">kcal/gün</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-red-400">{nutritionSummary.avgProtein}g</div>
                          <div className="text-xs text-gray-500">protein/gün</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-primary">{nutritionSummary.avgCarbs}g</div>
                          <div className="text-xs text-gray-500">karb/gün</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-purple-400">{nutritionSummary.avgFat}g</div>
                          <div className="text-xs text-gray-500">yağ/gün</div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500 mt-4">
                        Son {nutritionSummary.daysTracked} günün ortalaması
                      </div>
                    </div>
                  )}

                  {/* Calorie Chart */}
                  {nutritionChartData.length > 1 && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-6">Kalori Grafiği</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={nutritionChartData}>
                            <defs>
                              <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="date" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                              formatter={(value: number) => [`${value} kcal`, "Kalori"]}
                            />
                            <Area type="monotone" dataKey="calories" stroke="#f97316" fill="url(#calorieGradient)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Quick Calculators */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-6">Beslenme Hesaplayıcıları</h2>
                      <div className="flex flex-col gap-3">
                        <Link href="/araclar/kalori" className="block">
                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group" data-testid="link-calories-calc">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors shrink-0">
                              <Flame className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white">Kalori Hesaplama</h3>
                              <p className="text-sm text-gray-400">Günlük kalori ihtiyacını hesapla</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </Link>
                        <Link href="/araclar/makro" className="block">
                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group" data-testid="link-macros-calc">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors shrink-0">
                              <Scale className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white">Makro Hesaplama</h3>
                              <p className="text-sm text-gray-400">Protein, karbonhidrat, yağ</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </Link>
                        <Link href="/araclar/tdee" className="block">
                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group" data-testid="link-tdee-calc">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors shrink-0">
                              <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white">TDEE Hesaplama</h3>
                              <p className="text-sm text-gray-400">Günlük enerji harcaması</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Water Tracking */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold text-white mb-6">Su Takibi</h2>
                      <div className="flex flex-col items-center py-6">
                        <div className="relative w-40 h-40 mb-6">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#222" strokeWidth="12" fill="none" />
                            <circle 
                              cx="80" cy="80" r="70" 
                              stroke="#3b82f6" strokeWidth="12" fill="none"
                              strokeDasharray={`${(waterCount / 8) * 440} 440`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Droplets className="w-8 h-8 text-blue-400 mb-1" />
                            <span className="text-4xl font-bold text-white">{waterCount}</span>
                            <span className="text-sm text-gray-400">/ 8 bardak</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Button
                            onClick={() => handleWaterChange(-1)}
                            variant="outline"
                            size="lg"
                            className="w-14 h-14 rounded-full border-white/20"
                            data-testid="button-water-minus-nutrition"
                          >
                            <Minus className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={() => handleWaterChange(1)}
                            size="lg"
                            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600"
                            data-testid="button-water-plus-nutrition"
                          >
                            <Plus className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* WORKOUTS PAGE */}
              {activePage === "workouts" && (
                <motion.div
                  key="workouts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-white uppercase">Antrenman</h1>
                  </div>

                  {/* Today's Workout Status */}
                  <div className={`rounded-2xl p-8 ${didWorkout ? "bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20" : "bg-[#0A0A0A] border border-white/10"}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${didWorkout ? "bg-green-500/30" : "bg-white/5"}`}>
                          {didWorkout ? (
                            <CheckCircle className="w-10 h-10 text-green-400" />
                          ) : (
                            <Dumbbell className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {didWorkout ? "Bugün Tamamlandı!" : "Bugünkü Antrenman"}
                          </h2>
                          <p className="text-gray-400">
                            {didWorkout ? "Harika iş çıkardın, devam et!" : "Antrenmanını tamamlamayı unutma"}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleWorkoutToggle}
                        size="lg"
                        className={`px-8 ${didWorkout ? "bg-green-500 hover:bg-green-600" : "bg-primary text-black hover:bg-primary/90"}`}
                        data-testid="button-workout-toggle-page"
                      >
                        {didWorkout ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Tamamlandı
                          </>
                        ) : (
                          <>
                            <Dumbbell className="w-5 h-5 mr-2" />
                            Tamamla
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Workout Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Flame className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-gray-400">Bu Ay</span>
                      </div>
                      <div className="text-4xl font-bold text-white">{weeklyWorkouts}</div>
                      <div className="text-sm text-gray-500 mt-1">antrenman</div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-gray-400">Seri</span>
                      </div>
                      <div className="text-4xl font-bold text-white">{streak}</div>
                      <div className="text-sm text-gray-500 mt-1">gün</div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-gray-400">Haftalık Hedef</span>
                      </div>
                      <div className="text-4xl font-bold text-white">4-5</div>
                      <div className="text-sm text-gray-500 mt-1">antrenman</div>
                    </div>
                  </div>

                  {/* Quick Calculators */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6">Antrenman Hesaplayıcıları</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href="/araclar/bir-tekrar-max">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group" data-testid="link-1rm-calc">
                          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                            <Dumbbell className="w-6 h-6 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white">1RM Hesaplama</h3>
                            <p className="text-sm text-gray-400">Maksimum kaldırma kapasiteni hesapla</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                      <Link href="/araclar/vucut-yagi">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group" data-testid="link-bodyfat-calc">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <Activity className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white">Yağ Oranı</h3>
                            <p className="text-sm text-gray-400">Vücut yağ yüzdeni hesapla</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS PAGE */}
              {activePage === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-white uppercase">Ayarlar</h1>
                  </div>

                  {/* Profile Section */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6">Profil Bilgileri</h2>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-black font-heading text-3xl font-bold">
                        {user?.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{user?.fullName}</h3>
                        <p className="text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400">Ad Soyad</Label>
                        <Input 
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="bg-white/5 border-white/10 mt-1"
                          data-testid="input-profile-name"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-400">Telefon</Label>
                        <Input 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="bg-white/5 border-white/10 mt-1"
                          data-testid="input-profile-phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6">Paket Bilgisi</h2>
                    {activePackage ? (
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Crown className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{activePackage.name}</h3>
                          <p className="text-gray-400">{activePackage.weeks} Haftalık Program</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-500">
                              Başlangıç: {activeOrder?.startDate ? new Date(activeOrder.startDate).toLocaleDateString("tr-TR") : "-"}
                            </span>
                            <span className="text-gray-500">
                              Bitiş: {activeOrder?.endDate ? new Date(activeOrder.endDate).toLocaleDateString("tr-TR") : "-"}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-4 h-4 mr-1" /> Aktif
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Henüz aktif paketiniz yok</p>
                        <Link href="/paketler">
                          <Button className="bg-primary text-black hover:bg-primary/90" data-testid="button-buy-package-settings">
                            Paketleri İncele
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6">Hesap</h2>
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      data-testid="button-logout-settings"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
