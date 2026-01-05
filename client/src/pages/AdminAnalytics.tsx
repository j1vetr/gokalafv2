import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Calculator, Activity, TrendingUp, ArrowLeft,
  Droplets, Dumbbell, Scale, Apple, Calendar, Clock, LogIn, 
  PieChart as PieChartIcon, Target, Zap, Heart, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalCalculations: number;
    totalHabitDays: number;
    totalMeasurements: number;
    totalNutritionLogs: number;
    avgLoginFrequency: number;
  };
  calculatorUsage: Array<{ type: string; count: number; uniqueUsers: number }>;
  userActivity: Array<{ date: string; logins: number; calculations: number; habits: number }>;
  habitStats: {
    avgWaterGlasses: number;
    workoutDays: number;
    avgSleepHours: number;
    totalHabitEntries: number;
  };
  trafficSources: Array<{ source: string; count: number }>;
  userEngagement: Array<{ userId: string; email: string; fullName: string; calculations: number; habits: number; measurements: number; lastActive: string }>;
  weeklyTrends: Array<{ week: string; newUsers: number; calculations: number; habitEntries: number }>;
}

const COLORS = ['#ccff00', '#00ff88', '#00ccff', '#ff6600', '#ff0066', '#9933ff', '#ffcc00'];

const calculatorLabels: Record<string, string> = {
  bmi: "VKİ",
  calories: "Kalori",
  tdee: "TDEE",
  macros: "Makro",
  idealWeight: "İdeal Kilo",
  bodyFat: "Vücut Yağı",
  oneRepMax: "1RM",
  water: "Su Tüketimi",
  heartRate: "Kalp Hızı",
  protein: "Protein",
};

export default function AdminAnalytics() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAdmin, setLocation]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${period}`, { credentials: "include" });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin, period]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="bg-black/60 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/gokadmin">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-heading font-bold uppercase flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Analytics
                </h1>
                <p className="text-xs text-gray-500">Kullanıcı değer metrikleri</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Son 7 gün</SelectItem>
                  <SelectItem value="30">Son 30 gün</SelectItem>
                  <SelectItem value="90">Son 90 gün</SelectItem>
                  <SelectItem value="365">Son 1 yıl</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchAnalytics} variant="outline" size="sm" className="border-white/20">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Yenile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              <StatCard icon={Users} label="Toplam Kullanıcı" value={data.overview.totalUsers} color="primary" />
              <StatCard icon={Activity} label="Aktif Kullanıcı" value={data.overview.activeUsers} color="green" />
              <StatCard icon={Calculator} label="Hesaplama" value={data.overview.totalCalculations} color="blue" />
              <StatCard icon={Calendar} label="Alışkanlık Günü" value={data.overview.totalHabitDays} color="purple" />
              <StatCard icon={Scale} label="Ölçüm" value={data.overview.totalMeasurements} color="orange" />
              <StatCard icon={Apple} label="Beslenme Kaydı" value={data.overview.totalNutritionLogs} color="red" />
              <StatCard icon={LogIn} label="Ort. Login/Hafta" value={data.overview.avgLoginFrequency.toFixed(1)} color="cyan" />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <PieChartIcon className="w-4 h-4 mr-2" /> Genel Bakış
                </TabsTrigger>
                <TabsTrigger value="calculators" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <Calculator className="w-4 h-4 mr-2" /> Hesaplayıcılar
                </TabsTrigger>
                <TabsTrigger value="habits" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <Target className="w-4 h-4 mr-2" /> Alışkanlıklar
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                  <Users className="w-4 h-4 mr-2" /> Kullanıcı Detay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" /> Haftalık Trendler
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={data.weeklyTrends}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCalc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ccff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00ccff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="week" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Area type="monotone" dataKey="newUsers" name="Yeni Kullanıcı" stroke="#ccff00" fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="calculations" name="Hesaplama" stroke="#00ccff" fill="url(#colorCalc)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> Trafik Kaynakları
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data.trafficSources}
                          dataKey="count"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {data.trafficSources.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Günlük Aktivite
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.userActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                      <Legend />
                      <Line type="monotone" dataKey="logins" name="Giriş" stroke="#ccff00" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="calculations" name="Hesaplama" stroke="#00ccff" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="habits" name="Alışkanlık" stroke="#ff6600" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="calculators" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-primary" /> Hesaplayıcı Kullanımı
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.calculatorUsage} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" stroke="#666" fontSize={10} />
                        <YAxis 
                          type="category" 
                          dataKey="type" 
                          stroke="#666" 
                          fontSize={10} 
                          width={80}
                          tickFormatter={(val) => calculatorLabels[val] || val}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                          formatter={(value, name) => [value, name === 'count' ? 'Toplam' : 'Kullanıcı']}
                        />
                        <Bar dataKey="count" name="Toplam Kullanım" fill="#ccff00" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Benzersiz Kullanıcı / Hesaplayıcı
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.calculatorUsage} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" stroke="#666" fontSize={10} />
                        <YAxis 
                          type="category" 
                          dataKey="type" 
                          stroke="#666" 
                          fontSize={10} 
                          width={80}
                          tickFormatter={(val) => calculatorLabels[val] || val}
                        />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Bar dataKey="uniqueUsers" name="Benzersiz Kullanıcı" fill="#00ccff" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Hesaplayıcı Detay Tablosu</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-gray-400">Hesaplayıcı</th>
                          <th className="text-right py-2 px-3 text-gray-400">Toplam Kullanım</th>
                          <th className="text-right py-2 px-3 text-gray-400">Benzersiz Kullanıcı</th>
                          <th className="text-right py-2 px-3 text-gray-400">Ort. Kullanım/Kişi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.calculatorUsage.map((calc, i) => (
                          <tr key={calc.type} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2 px-3 font-medium">{calculatorLabels[calc.type] || calc.type}</td>
                            <td className="py-2 px-3 text-right text-primary font-bold">{calc.count}</td>
                            <td className="py-2 px-3 text-right">{calc.uniqueUsers}</td>
                            <td className="py-2 px-3 text-right text-gray-400">
                              {calc.uniqueUsers > 0 ? (calc.count / calc.uniqueUsers).toFixed(1) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="habits" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-4 text-center">
                    <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{data.habitStats.avgWaterGlasses.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Ort. Su (bardak/gün)</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-4 text-center">
                    <Dumbbell className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{data.habitStats.workoutDays}</div>
                    <div className="text-xs text-gray-400">Antrenman Günü</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{data.habitStats.avgSleepHours.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Ort. Uyku (saat)</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{data.habitStats.totalHabitEntries}</div>
                    <div className="text-xs text-gray-400">Toplam Kayıt</div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Alışkanlık Bilgileri</h3>
                  <p className="text-gray-500 text-sm">
                    Kullanıcılar ortalama günde <span className="text-blue-400 font-bold">{data.habitStats.avgWaterGlasses.toFixed(1)} bardak</span> su içiyor, 
                    <span className="text-purple-400 font-bold"> {data.habitStats.avgSleepHours.toFixed(1)} saat</span> uyuyor ve 
                    toplam <span className="text-green-400 font-bold">{data.habitStats.workoutDays}</span> gün antrenman yapılmış.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> En Aktif Kullanıcılar
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-gray-400">Kullanıcı</th>
                          <th className="text-right py-2 px-3 text-gray-400">Hesaplama</th>
                          <th className="text-right py-2 px-3 text-gray-400">Alışkanlık</th>
                          <th className="text-right py-2 px-3 text-gray-400">Ölçüm</th>
                          <th className="text-right py-2 px-3 text-gray-400">Son Aktivite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.userEngagement.slice(0, 20).map((u, i) => (
                          <tr key={u.userId} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2 px-3">
                              <div className="font-medium">{u.fullName}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <Badge variant={u.calculations > 5 ? "default" : "secondary"} className={u.calculations > 5 ? "bg-primary text-black" : ""}>
                                {u.calculations}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <Badge variant={u.habits > 10 ? "default" : "secondary"} className={u.habits > 10 ? "bg-green-500 text-black" : ""}>
                                {u.habits}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-right">{u.measurements}</td>
                            <td className="py-2 px-3 text-right text-gray-400 text-xs">
                              {u.lastActive ? new Date(u.lastActive).toLocaleDateString('tr-TR') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Veri yüklenemedi</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "from-primary/20 to-primary/5 border-primary/30 text-primary",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-3 text-center`}
    >
      <Icon className="w-5 h-5 mx-auto mb-1" />
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-gray-400 uppercase">{label}</div>
    </motion.div>
  );
}
