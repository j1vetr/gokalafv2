import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Users, DollarSign, LogOut, Search, Clock, CheckCircle, XCircle, 
  TrendingUp, TrendingDown, Activity, Eye, Edit, Trash2, BarChart3, 
  Calendar, Phone, Mail, User, ShoppingCart, Calculator, ArrowUpRight,
  ChevronRight, LayoutDashboard, Settings, AlertCircle, RefreshCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface Order {
  id: string;
  userId: string;
  packageId: string;
  totalPrice: string;
  status: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
}

interface PackageInfo {
  id: string;
  name: string;
  weeks: number;
  price: string;
  features: string[];
  isActive: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  newUsersThisMonth: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  orderCount: number;
}

interface Activity {
  type: string;
  message: string;
  date: string;
  userId?: string;
}

interface CalculatorStat {
  type: string;
  count: number;
}

interface UserDetails {
  user: User;
  orders: Order[];
  measurements: any[];
  habits: any[];
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [packageMap, setPackageMap] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [calculatorStats, setCalculatorStats] = useState<CalculatorStat[]>([]);
  
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editUserForm, setEditUserForm] = useState({ fullName: "", email: "", phone: "", role: "user" });
  const [editOrderForm, setEditOrderForm] = useState({ status: "", startDate: "", endDate: "" });
  const [editPackageForm, setEditPackageForm] = useState({ name: "", price: "", isActive: true });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, ordersRes, packagesRes, statsRes, revenueRes, activityRes, calcRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/orders", { credentials: "include" }),
        fetch("/api/admin/packages", { credentials: "include" }),
        fetch("/api/admin/stats", { credentials: "include" }),
        fetch("/api/admin/revenue", { credentials: "include" }),
        fetch("/api/admin/activity?limit=15", { credentials: "include" }),
        fetch("/api/admin/calculator-stats", { credentials: "include" }),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
        const map: Record<string, User> = {};
        (data.users || []).forEach((u: User) => { map[u.id] = u; });
        setUserMap(map);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data.packages || []);
        const map: Record<string, PackageInfo> = {};
        (data.packages || []).forEach((p: PackageInfo) => { map[p.id] = p; });
        setPackageMap(map);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (revenueRes.ok) {
        const data = await revenueRes.json();
        setRevenueData(data.revenue || []);
      }

      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivities(data.activity || []);
      }

      if (calcRes.ok) {
        const data = await calcRes.json();
        setCalculatorStats(data.stats || []);
      }
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAllData();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error("Kullanıcı detayları yüklenemedi:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editUserForm),
      });
      if (res.ok) {
        await fetchAllData();
        setShowUserEditModal(false);
        setShowUserModal(false);
      }
    } catch (error) {
      console.error("Kullanıcı güncellenemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await fetchAllData();
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: editOrderForm.status || undefined,
          startDate: editOrderForm.startDate || undefined,
          endDate: editOrderForm.endDate || undefined,
        }),
      });
      if (res.ok) {
        await fetchAllData();
        setShowOrderModal(false);
      }
    } catch (error) {
      console.error("Sipariş güncellenemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePackage = async () => {
    if (!selectedPackage) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/packages/${selectedPackage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editPackageForm.name || undefined,
          price: editPackageForm.price || undefined,
          isActive: editPackageForm.isActive,
        }),
      });
      if (res.ok) {
        await fetchAllData();
        setShowPackageModal(false);
      }
    } catch (error) {
      console.error("Paket güncellenemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock size={12} className="mr-1" /> Bekliyor</Badge>;
      case "paid":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><CheckCircle size={12} className="mr-1" /> Ödendi</Badge>;
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle size={12} className="mr-1" /> Aktif</Badge>;
      case "completed":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><CheckCircle size={12} className="mr-1" /> Bitti</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle size={12} className="mr-1" /> İptal</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const user = userMap[o.userId];
    const pkg = packageMap[o.packageId];
    return (
      (user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (pkg?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const revenueGrowth = stats ? 
    (stats.lastMonthRevenue > 0 
      ? ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100).toFixed(1)
      : stats.thisMonthRevenue > 0 ? "+100" : "0"
    ) : "0";

  const COLORS = ["#ccff00", "#00ff88", "#00ccff", "#ff00cc", "#ff6600", "#9933ff", "#ff3366", "#33ff99"];
  const calculatorNames: Record<string, string> = {
    bmi: "Vücut Kitle İndeksi",
    calories: "Kalori",
    tdee: "TDEE",
    macros: "Makro",
    idealWeight: "İdeal Kilo",
    bodyFat: "Yağ Oranı",
    oneRepMax: "1RM",
    waterIntake: "Su İhtiyacı"
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, subValue, trend, color = "primary", testId }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
      data-testid={testId}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}/10 transition-all`} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subValue && <p className="text-gray-400 text-sm mt-1">{subValue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center`}>
          <Icon className={`text-${color}`} size={24} />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${parseFloat(trend) >= 0 ? "text-green-400" : "text-red-400"}`}>
          {parseFloat(trend) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}%</span>
          <span className="text-gray-500 ml-1">geçen aya göre</span>
        </div>
      )}
    </motion.div>
  );

  const SidebarItem = ({ id, icon: Icon, label, count }: { id: string, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      data-testid={`nav-${id}`}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold uppercase tracking-wide ${
        activeTab === id 
          ? "bg-primary text-black shadow-lg shadow-primary/20" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === id ? "bg-black/20" : "bg-white/10"}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="bg-gradient-to-b from-[#0A0A0A] to-[#080808] border border-white/10 rounded-2xl p-5 sticky top-28">
              <div className="flex items-center gap-3 px-2 mb-6 pb-5 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-lg">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-white">Admin Panel</h3>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <SidebarItem id="overview" icon={LayoutDashboard} label="Genel Bakış" />
                <SidebarItem id="orders" icon={ShoppingCart} label="Siparişler" count={orders.length} />
                <SidebarItem id="users" icon={Users} label="Kullanıcılar" count={users.length} />
                <SidebarItem id="packages" icon={Package} label="Paketler" count={packages.length} />
                <SidebarItem id="reports" icon={BarChart3} label="Raporlar" />
              </nav>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                <Button 
                  variant="ghost" 
                  onClick={fetchAllData}
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
                  data-testid="button-refresh"
                >
                  <RefreshCw size={16} className="mr-2" /> Yenile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  data-testid="button-logout"
                >
                  <LogOut size={16} className="mr-2" /> Çıkış Yap
                </Button>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-heading font-bold text-white uppercase">Yönetim Paneli</h1>
                      <p className="text-gray-500 text-sm mt-1">Hoş geldin, {user?.fullName?.split(" ")[0]}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Çevrimiçi
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard 
                      icon={DollarSign} 
                      label="Toplam Gelir" 
                      value={`₺${(stats?.totalRevenue || 0).toLocaleString("tr-TR")}`}
                      trend={revenueGrowth}
                      color="green-400"
                      testId="stat-total-revenue"
                    />
                    <StatCard 
                      icon={ShoppingCart} 
                      label="Bu Ay Gelir" 
                      value={`₺${(stats?.thisMonthRevenue || 0).toLocaleString("tr-TR")}`}
                      subValue={`${orders.filter(o => o.status === "active").length} aktif paket`}
                      color="primary"
                      testId="stat-monthly-revenue"
                    />
                    <StatCard 
                      icon={Users} 
                      label="Toplam Kullanıcı" 
                      value={stats?.totalUsers || 0}
                      subValue={`+${stats?.newUsersThisMonth || 0} bu ay`}
                      color="blue-400"
                      testId="stat-total-users"
                    />
                    <StatCard 
                      icon={Package} 
                      label="Bekleyen Sipariş" 
                      value={stats?.pendingOrders || 0}
                      subValue={`${stats?.activeOrders || 0} aktif`}
                      color="yellow-400"
                      testId="stat-pending-orders"
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-bold text-white uppercase">Aylık Gelir</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">{new Date().getFullYear()}</Badge>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="month" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                              labelStyle={{ color: "#fff" }}
                              formatter={(value: number) => [`₺${value.toLocaleString("tr-TR")}`, "Gelir"]}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ccff00" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <h3 className="font-heading font-bold text-white uppercase mb-6">Sipariş Durumu</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Aktif", value: stats?.activeOrders || 0 },
                                { name: "Bekliyor", value: stats?.pendingOrders || 0 },
                                { name: "Tamamlandı", value: stats?.completedOrders || 0 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#22c55e" />
                              <Cell fill="#eab308" />
                              <Cell fill="#6b7280" />
                            </Pie>
                            <Legend 
                              verticalAlign="bottom" 
                              iconType="circle"
                              formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-bold text-white uppercase">Son Aktiviteler</h3>
                        <Activity size={18} className="text-primary" />
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {activities.slice(0, 8).map((activity, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              activity.type === "user" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                            }`}>
                              {activity.type === "user" ? <User size={14} /> : <ShoppingCart size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{activity.message}</p>
                              <p className="text-gray-500 text-xs mt-0.5">
                                {new Date(activity.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                        {activities.length === 0 && (
                          <p className="text-gray-500 text-center py-8">Henüz aktivite yok</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-bold text-white uppercase">Hesaplayıcı Kullanımı</h3>
                        <Calculator size={18} className="text-primary" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={calculatorStats} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                            <XAxis type="number" stroke="#666" fontSize={12} />
                            <YAxis 
                              dataKey="type" 
                              type="category" 
                              stroke="#666" 
                              fontSize={12} 
                              width={80}
                              tickFormatter={(value) => calculatorNames[value] || value}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                              formatter={(value: number) => [value, "Kullanım"]}
                              labelFormatter={(label) => calculatorNames[label] || label}
                            />
                            <Bar dataKey="count" fill="#ccff00" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-heading font-bold uppercase text-white">Siparişler</h2>
                        <p className="text-gray-500 text-sm mt-1">Toplam {orders.length} sipariş</p>
                      </div>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input 
                          placeholder="Sipariş ara..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10"
                          data-testid="input-search-orders"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-primary">Kullanıcı</TableHead>
                            <TableHead className="text-primary">Paket</TableHead>
                            <TableHead className="text-primary">Tutar</TableHead>
                            <TableHead className="text-primary">Durum</TableHead>
                            <TableHead className="text-primary">Tarih</TableHead>
                            <TableHead className="text-primary text-right">İşlem</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order.id} className="border-white/10 hover:bg-white/5" data-testid={`row-order-${order.id}`}>
                              <TableCell>
                                <div>
                                  <p className="text-white font-medium">{userMap[order.userId]?.fullName || "-"}</p>
                                  <p className="text-gray-500 text-xs">{userMap[order.userId]?.email || ""}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  {packageMap[order.packageId]?.name || "-"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white font-medium">₺{parseFloat(order.totalPrice).toLocaleString("tr-TR")}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell className="text-gray-500">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setEditOrderForm({
                                      status: order.status,
                                      startDate: order.startDate ? new Date(order.startDate).toISOString().split("T")[0] : "",
                                      endDate: order.endDate ? new Date(order.endDate).toISOString().split("T")[0] : "",
                                    });
                                    setShowOrderModal(true);
                                  }}
                                  className="text-primary hover:text-primary hover:bg-primary/10"
                                  data-testid={`button-edit-order-${order.id}`}
                                >
                                  <Edit size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredOrders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                {searchTerm ? "Arama sonucu bulunamadı" : "Henüz sipariş bulunmuyor"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-heading font-bold uppercase text-white">Kullanıcılar</h2>
                        <p className="text-gray-500 text-sm mt-1">Toplam {users.length} kullanıcı</p>
                      </div>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input 
                          placeholder="Kullanıcı ara..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10"
                          data-testid="input-search-users"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-primary">Ad Soyad</TableHead>
                            <TableHead className="text-primary">Email</TableHead>
                            <TableHead className="text-primary">Telefon</TableHead>
                            <TableHead className="text-primary">Rol</TableHead>
                            <TableHead className="text-primary">Kayıt</TableHead>
                            <TableHead className="text-primary text-right">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((u) => (
                            <TableRow key={u.id} className="border-white/10 hover:bg-white/5" data-testid={`row-user-${u.id}`}>
                              <TableCell className="text-white font-medium">{u.fullName}</TableCell>
                              <TableCell className="text-gray-400">{u.email}</TableCell>
                              <TableCell className="text-gray-400">{u.phone || "-"}</TableCell>
                              <TableCell>
                                <Badge className={u.role === "admin" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}>
                                  {u.role === "admin" ? "Admin" : "Kullanıcı"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-500">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => fetchUserDetails(u.id)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                    data-testid={`button-view-user-${u.id}`}
                                  >
                                    <Eye size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedUser({ user: u, orders: [], measurements: [], habits: [] });
                                      setEditUserForm({
                                        fullName: u.fullName,
                                        email: u.email,
                                        phone: u.phone || "",
                                        role: u.role,
                                      });
                                      setShowUserEditModal(true);
                                    }}
                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                    data-testid={`button-edit-user-${u.id}`}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  {u.role !== "admin" && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setUserToDelete(u);
                                        setShowDeleteConfirm(true);
                                      }}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      data-testid={`button-delete-user-${u.id}`}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "packages" && (
                <motion.div
                  key="packages"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <h2 className="text-xl font-heading font-bold uppercase text-white">Paketler</h2>
                      <p className="text-gray-500 text-sm mt-1">Koçluk paketlerini yönetin</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-5 rounded-xl border transition-all ${
                            pkg.isActive 
                              ? "bg-gradient-to-br from-primary/10 to-transparent border-primary/30" 
                              : "bg-white/5 border-white/10 opacity-60"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                              <p className="text-gray-500 text-sm">{pkg.weeks} Hafta</p>
                            </div>
                            <Badge className={pkg.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                              {pkg.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-primary mb-4">
                            ₺{parseFloat(pkg.price).toLocaleString("tr-TR")}
                          </p>
                          <div className="space-y-2 mb-4">
                            {pkg.features?.slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle size={14} className="text-primary shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                            {pkg.features?.length > 3 && (
                              <p className="text-xs text-gray-500">+{pkg.features.length - 3} özellik daha</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setEditPackageForm({
                                name: pkg.name,
                                price: pkg.price,
                                isActive: pkg.isActive,
                              });
                              setShowPackageModal(true);
                            }}
                            className="w-full border-white/20 hover:bg-white/10"
                            data-testid={`button-edit-package-${pkg.id}`}
                          >
                            <Edit size={14} className="mr-2" /> Düzenle
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold uppercase text-white mb-6">Yıllık Gelir Analizi</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                          <XAxis dataKey="month" stroke="#666" fontSize={12} />
                          <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                            formatter={(value: number, name: string) => [
                              name === "revenue" ? `₺${value.toLocaleString("tr-TR")}` : value,
                              name === "revenue" ? "Gelir" : "Sipariş"
                            ]}
                          />
                          <Legend formatter={(value) => value === "revenue" ? "Gelir" : "Sipariş Sayısı"} />
                          <Bar dataKey="revenue" fill="#ccff00" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="orderCount" fill="#00ccff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-sm text-gray-500 uppercase mb-2">Ortalama Sipariş Değeri</h3>
                      <p className="text-3xl font-bold text-white">
                        ₺{orders.length > 0 
                          ? (orders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0) / orders.length).toLocaleString("tr-TR", { maximumFractionDigits: 0 })
                          : "0"
                        }
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-sm text-gray-500 uppercase mb-2">Dönüşüm Oranı</h3>
                      <p className="text-3xl font-bold text-white">
                        {users.length > 0 
                          ? ((orders.filter(o => o.status !== "cancelled").length / users.length) * 100).toFixed(1)
                          : "0"
                        }%
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-sm text-gray-500 uppercase mb-2">Tamamlanma Oranı</h3>
                      <p className="text-3xl font-bold text-white">
                        {orders.length > 0 
                          ? ((stats?.completedOrders || 0) / orders.length * 100).toFixed(1)
                          : "0"
                        }%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                    <h3 className="font-heading font-bold text-white uppercase mb-4">Paket Dağılımı</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={packages.map(pkg => ({
                              name: pkg.name,
                              value: orders.filter(o => o.packageId === pkg.id).length
                            })).filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {packages.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                            formatter={(value: number) => [value, "Sipariş"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-user-details">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase">Kullanıcı Detayları</DialogTitle>
            <DialogDescription className="text-gray-500">Kullanıcı bilgileri ve sipariş geçmişi</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedUser.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.user.fullName}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Mail size={14} /> {selectedUser.user.email}
                  </p>
                  {selectedUser.user.phone && (
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Phone size={14} /> {selectedUser.user.phone}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    Kayıt: {new Date(selectedUser.user.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase text-gray-500 mb-3">Siparişler ({selectedUser.orders.length})</h4>
                {selectedUser.orders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.orders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{packageMap[order.packageId]?.name || "Paket"}</p>
                          <p className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold">₺{parseFloat(order.totalPrice).toLocaleString("tr-TR")}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sipariş bulunmuyor</p>
                )}
              </div>

              {selectedUser.measurements.length > 0 && (
                <div>
                  <h4 className="text-sm uppercase text-gray-500 mb-3">Son Ölçümler</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedUser.measurements[0] && (
                      <>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <p className="text-gray-500 text-xs">Kilo</p>
                          <p className="text-white font-bold">{selectedUser.measurements[0].weight || "-"} kg</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <p className="text-gray-500 text-xs">Bel</p>
                          <p className="text-white font-bold">{selectedUser.measurements[0].waist || "-"} cm</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <p className="text-gray-500 text-xs">Göğüs</p>
                          <p className="text-white font-bold">{selectedUser.measurements[0].chest || "-"} cm</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showUserEditModal} onOpenChange={setShowUserEditModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white" data-testid="modal-user-edit">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase">Kullanıcı Düzenle</DialogTitle>
            <DialogDescription className="text-gray-500">Kullanıcı bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Ad Soyad</Label>
              <Input 
                value={editUserForm.fullName}
                onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                className="bg-white/5 border-white/10 mt-1"
                data-testid="input-edit-user-name"
              />
            </div>
            <div>
              <Label className="text-gray-400">Email</Label>
              <Input 
                value={editUserForm.email}
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                className="bg-white/5 border-white/10 mt-1"
                data-testid="input-edit-user-email"
              />
            </div>
            <div>
              <Label className="text-gray-400">Telefon</Label>
              <Input 
                value={editUserForm.phone}
                onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                className="bg-white/5 border-white/10 mt-1"
                data-testid="input-edit-user-phone"
              />
            </div>
            <div>
              <Label className="text-gray-400">Rol</Label>
              <Select value={editUserForm.role} onValueChange={(v) => setEditUserForm({ ...editUserForm, role: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 mt-1" data-testid="select-edit-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10">
                  <SelectItem value="user">Kullanıcı</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowUserEditModal(false)} className="border-white/20">
              İptal
            </Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting} className="bg-primary text-black hover:bg-primary/90" data-testid="button-save-user">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white" data-testid="modal-order-edit">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase">Sipariş Düzenle</DialogTitle>
            <DialogDescription className="text-gray-500">Sipariş durumu ve tarihlerini güncelleyin</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm">Kullanıcı</p>
                <p className="text-white font-medium">{userMap[selectedOrder.userId]?.fullName}</p>
                <p className="text-gray-500 text-xs">{userMap[selectedOrder.userId]?.email}</p>
              </div>
              <div>
                <Label className="text-gray-400">Durum</Label>
                <Select value={editOrderForm.status} onValueChange={(v) => setEditOrderForm({ ...editOrderForm, status: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 mt-1" data-testid="select-order-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10">
                    <SelectItem value="pending">Bekliyor</SelectItem>
                    <SelectItem value="paid">Ödendi</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="cancelled">İptal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400">Başlangıç Tarihi</Label>
                <Input 
                  type="date"
                  value={editOrderForm.startDate}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, startDate: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-order-start-date"
                />
              </div>
              <div>
                <Label className="text-gray-400">Bitiş Tarihi</Label>
                <Input 
                  type="date"
                  value={editOrderForm.endDate}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, endDate: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-order-end-date"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowOrderModal(false)} className="border-white/20">
              İptal
            </Button>
            <Button onClick={handleUpdateOrder} disabled={isSubmitting} className="bg-primary text-black hover:bg-primary/90" data-testid="button-save-order">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white" data-testid="modal-package-edit">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase">Paket Düzenle</DialogTitle>
            <DialogDescription className="text-gray-500">Paket fiyatı ve durumunu güncelleyin</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Paket Adı</Label>
                <Input 
                  value={editPackageForm.name}
                  onChange={(e) => setEditPackageForm({ ...editPackageForm, name: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-package-name"
                />
              </div>
              <div>
                <Label className="text-gray-400">Fiyat (₺)</Label>
                <Input 
                  value={editPackageForm.price}
                  onChange={(e) => setEditPackageForm({ ...editPackageForm, price: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-package-price"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <Label className="text-white">Aktif</Label>
                  <p className="text-gray-500 text-xs">Paket satışa açık olsun mu?</p>
                </div>
                <Switch 
                  checked={editPackageForm.isActive}
                  onCheckedChange={(v) => setEditPackageForm({ ...editPackageForm, isActive: v })}
                  data-testid="switch-package-active"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPackageModal(false)} className="border-white/20">
              İptal
            </Button>
            <Button onClick={handleUpdatePackage} disabled={isSubmitting} className="bg-primary text-black hover:bg-primary/90" data-testid="button-save-package">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white" data-testid="modal-delete-confirm">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase flex items-center gap-2 text-red-400">
              <AlertCircle size={24} /> Kullanıcı Sil
            </DialogTitle>
            <DialogDescription className="text-gray-500">Bu işlem geri alınamaz</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              <span className="text-white font-bold">{userToDelete?.fullName}</span> kullanıcısını silmek istediğinize emin misiniz?
            </p>
            <p className="text-red-400 text-sm mt-2">Bu işlem geri alınamaz. Kullanıcının tüm verileri silinecektir.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-white/20">
              İptal
            </Button>
            <Button onClick={handleDeleteUser} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white" data-testid="button-confirm-delete">
              {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
