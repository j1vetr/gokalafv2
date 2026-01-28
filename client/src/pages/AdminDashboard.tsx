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
  ChevronRight, LayoutDashboard, Settings, AlertCircle, RefreshCw,
  Ticket, FileText, Database, Wrench, Send, Filter, Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
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
  trafficSource?: string;
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
  isPopular: boolean;
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
  const [editPackageForm, setEditPackageForm] = useState({ name: "", price: "", isActive: true, isPopular: false });
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignForm, setAssignForm] = useState({ packageId: "", startDate: "", endDate: "" });
  
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [selectedAnalyticsUser, setSelectedAnalyticsUser] = useState<string>("");
  const [userAnalyticsDetails, setUserAnalyticsDetails] = useState<any>(null);
  const [analyticsUserSearch, setAnalyticsUserSearch] = useState("");

  // Email Marketing state
  const { toast } = useToast();
  const [emailFilter, setEmailFilter] = useState<string>("all");
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [emailUsers, setEmailUsers] = useState<{ id: string; email: string; fullName: string }[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<any[]>([]);
  const [emailUsersLoading, setEmailUsersLoading] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showSingleEmailDialog, setShowSingleEmailDialog] = useState(false);
  const [selectedEmailUser, setSelectedEmailUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const monthOptions = (() => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
      options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
  })();

  const getMonthlyStats = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const prevMonthStart = new Date(year, month - 2, 1);
    const prevMonthEnd = new Date(year, month - 1, 0, 23, 59, 59);
    const prevMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= prevMonthStart && orderDate <= prevMonthEnd;
    });

    const totalRevenue = monthOrders
      .filter(o => o.status === "paid" || o.status === "active" || o.status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);
    
    const prevRevenue = prevMonthOrders
      .filter(o => o.status === "paid" || o.status === "active" || o.status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

    const totalOrders = monthOrders.length;
    const prevTotalOrders = prevMonthOrders.length;

    const paidOrders = monthOrders.filter(o => o.status === "paid" || o.status === "active" || o.status === "completed").length;
    const pendingOrders = monthOrders.filter(o => o.status === "pending").length;
    const cancelledOrders = monthOrders.filter(o => o.status === "cancelled").length;
    const activeOrders = monthOrders.filter(o => o.status === "active").length;

    const packageSales = packages.map(pkg => {
      const pkgOrders = monthOrders.filter(o => o.packageId === pkg.id);
      const paidPkgOrders = pkgOrders.filter(o => o.status === "paid" || o.status === "active" || o.status === "completed");
      const pkgRevenue = paidPkgOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);
      return {
        id: pkg.id,
        name: pkg.name,
        weeks: pkg.weeks,
        unitsSold: paidPkgOrders.length,
        revenue: pkgRevenue,
        price: parseFloat(pkg.price)
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const newUsers = users.filter(u => {
      const userDate = new Date(u.createdAt);
      return userDate >= startDate && userDate <= endDate;
    }).length;

    const prevNewUsers = users.filter(u => {
      const userDate = new Date(u.createdAt);
      return userDate >= prevMonthStart && userDate <= prevMonthEnd;
    }).length;

    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const orderChange = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0;
    const userChange = prevNewUsers > 0 ? ((newUsers - prevNewUsers) / prevNewUsers) * 100 : 0;

    return {
      totalRevenue,
      prevRevenue,
      totalOrders,
      prevTotalOrders,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      activeOrders,
      packageSales,
      newUsers,
      prevNewUsers,
      revenueChange,
      orderChange,
      userChange
    };
  };

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

      const maintenanceRes = await fetch("/api/maintenance", { credentials: "include" });
      if (maintenanceRes.ok) {
        const data = await maintenanceRes.json();
        setMaintenanceMode(data.maintenanceMode || false);
      }
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics?days=30", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Analytics yüklenemedi:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchUserAnalyticsDetails = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserAnalyticsDetails(data);
      }
    } catch (error) {
      console.error("Kullanıcı detayları yüklenemedi:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics" && !analyticsData) {
      fetchAnalyticsData();
    }
  }, [activeTab]);

  // Fetch email users when tab or filter changes
  useEffect(() => {
    if (activeTab === "email-marketing") {
      fetchEmailData();
    }
  }, [activeTab, emailFilter]);

  const fetchEmailData = async () => {
    setEmailUsersLoading(true);
    try {
      const [usersRes, campaignsRes] = await Promise.all([
        fetch(`/api/admin/email/users?filter=${emailFilter}`),
        fetch("/api/admin/email/campaigns")
      ]);
      
      if (usersRes.ok) {
        const data = await usersRes.json();
        setEmailUsers(data.users || []);
      }
      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setEmailCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Email data fetch error:", error);
    } finally {
      setEmailUsersLoading(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({ title: "Hata", description: "Konu ve içerik gerekli", variant: "destructive" });
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/admin/email/send-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: emailFilter,
          subject: emailSubject,
          content: emailContent,
          campaignName: campaignName || `Kampanya - ${new Date().toLocaleDateString('tr-TR')}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Başarılı", description: data.message });
        setShowComposeDialog(false);
        setCampaignName("");
        setEmailSubject("");
        setEmailContent("");
        fetchEmailData();
      } else {
        toast({ title: "Hata", description: data.error, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendSingleEmail = async () => {
    if (!selectedEmailUser || !emailSubject.trim() || !emailContent.trim()) {
      toast({ title: "Hata", description: "Tüm alanlar gerekli", variant: "destructive" });
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/admin/email/send-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedEmailUser.email,
          subject: emailSubject,
          content: emailContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Başarılı", description: "Email gönderildi" });
        setShowSingleEmailDialog(false);
        setSelectedEmailUser(null);
        setEmailSubject("");
        setEmailContent("");
      } else {
        toast({ title: "Hata", description: data.error, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getEmailFilterLabel = (f: string) => {
    switch (f) {
      case "has_package": return "Paket Alanlar";
      case "no_package": return "Paket Almayanlar";
      default: return "Tüm Kullanıcılar";
    }
  };

  const filteredEmailUsers = emailUsers.filter(u => 
    u.fullName.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(emailSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedAnalyticsUser) {
      fetchUserAnalyticsDetails(selectedAnalyticsUser);
    } else {
      setUserAnalyticsDetails(null);
    }
  }, [selectedAnalyticsUser]);

  const toggleMaintenanceMode = async () => {
    setIsTogglingMaintenance(true);
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ enabled: !maintenanceMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.maintenanceMode);
      }
    } catch (error) {
      console.error("Bakım modu değiştirilemedi:", error);
    } finally {
      setIsTogglingMaintenance(false);
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
          isPopular: editPackageForm.isPopular,
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

  const handleAssignPackage = async () => {
    if (!assignUserId || !assignForm.packageId || !assignForm.startDate || !assignForm.endDate) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/assign-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: assignUserId,
          packageId: assignForm.packageId,
          startDate: assignForm.startDate,
          endDate: assignForm.endDate,
        }),
      });
      if (res.ok) {
        await fetchAllData();
        setShowAssignModal(false);
        setAssignUserId("");
        setAssignForm({ packageId: "", startDate: "", endDate: "" });
      } else {
        const data = await res.json();
        alert(data.error || "Paket atanamadı");
      }
    } catch (error) {
      console.error("Paket atanamadı:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = (userId: string) => {
    setAssignUserId(userId);
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    setAssignForm({ packageId: "", startDate, endDate: "" });
    setShowAssignModal(true);
  };

  const calculateEndDate = (startDate: string, weeks: number) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + weeks * 7);
    return start.toISOString().split("T")[0];
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
                <SidebarItem id="analytics" icon={Activity} label="Analytics" />
              </nav>

              <p className="text-xs text-gray-600 uppercase tracking-wider px-4 mt-6 mb-2">Yönetim</p>
              <nav className="space-y-2">
                <button
                  onClick={() => setLocation("/gokadmin/kuponlar")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-bold uppercase tracking-wide"
                  data-testid="nav-coupons"
                >
                  <Ticket size={18} /> Kuponlar
                </button>
                <button
                  onClick={() => setLocation("/gokadmin/loglar")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-bold uppercase tracking-wide"
                  data-testid="nav-logs"
                >
                  <FileText size={18} /> Sistem Logları
                </button>
                <button
                  onClick={() => setLocation("/gokadmin/yedekleme")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-bold uppercase tracking-wide"
                  data-testid="nav-backup"
                >
                  <Database size={18} /> Yedekleme
                </button>
                </nav>

              <p className="text-xs text-gray-600 uppercase tracking-wider px-4 mt-6 mb-2">Pazarlama</p>
              <nav className="space-y-2">
                <SidebarItem id="email-marketing" icon={Mail} label="E-mail Pazarlama" />
              </nav>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${maintenanceMode ? "bg-orange-500/20 border-orange-500/30" : "bg-white/5 border-white/10"}`}
                  data-testid="maintenance-toggle-container"
                >
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className={maintenanceMode ? "text-orange-400" : "text-gray-400"} />
                    <span className={`text-sm font-medium ${maintenanceMode ? "text-orange-400" : "text-gray-400"}`}>
                      Bakım Modu
                    </span>
                  </div>
                  <Switch 
                    checked={maintenanceMode}
                    onCheckedChange={toggleMaintenanceMode}
                    disabled={isTogglingMaintenance}
                    data-testid="switch-maintenance"
                  />
                </div>
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
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2" data-testid="activity-list">
                        {activities.slice(0, 8).map((activity, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" data-testid={`activity-item-${i}`}>
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
                            <TableHead className="text-primary">Kaynak</TableHead>
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
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 capitalize">
                                  {u.trafficSource || "direct"}
                                </Badge>
                              </TableCell>
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
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => openAssignModal(u.id)}
                                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                        data-testid={`button-assign-package-${u.id}`}
                                        title="Paket Ata"
                                      >
                                        <Package size={16} />
                                      </Button>
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
                                    </>
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
                          data-testid={`card-package-${pkg.id}`}
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
                                isPopular: pkg.isPopular || false,
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

              {activeTab === "reports" && (() => {
                const monthStats = getMonthlyStats(reportMonth);
                const selectedMonthLabel = monthOptions.find(m => m.value === reportMonth)?.label || "";
                
                return (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                      <div>
                        <h1 className="text-2xl font-heading font-bold text-white uppercase">Detaylı Raporlar</h1>
                        <p className="text-gray-500 text-sm mt-1">Satış ve performans analizleri</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-primary" />
                        <Select value={reportMonth} onValueChange={setReportMonth}>
                          <SelectTrigger className="w-[200px] bg-[#0A0A0A] border-white/10 text-white" data-testid="select-report-month">
                            <SelectValue placeholder="Ay seçin" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A0A0A] border-white/10">
                            {monthOptions.map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <BarChart3 size={20} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-bold text-white uppercase">{selectedMonthLabel} Özeti</h2>
                          <p className="text-gray-500 text-xs">Seçili ay için detaylı istatistikler</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 uppercase">Toplam Gelir</p>
                            {monthStats.revenueChange !== 0 && (
                              <Badge className={`text-xs ${monthStats.revenueChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {monthStats.revenueChange > 0 ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                                {Math.abs(monthStats.revenueChange).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary" data-testid="stat-monthly-total-revenue">
                            ₺{monthStats.totalRevenue.toLocaleString("tr-TR")}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Önceki ay: ₺{monthStats.prevRevenue.toLocaleString("tr-TR")}</p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 uppercase">Toplam Sipariş</p>
                            {monthStats.orderChange !== 0 && (
                              <Badge className={`text-xs ${monthStats.orderChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {monthStats.orderChange > 0 ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                                {Math.abs(monthStats.orderChange).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-white" data-testid="stat-monthly-total-orders">
                            {monthStats.totalOrders}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Önceki ay: {monthStats.prevTotalOrders}</p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 uppercase">Yeni Üye</p>
                            {monthStats.userChange !== 0 && (
                              <Badge className={`text-xs ${monthStats.userChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {monthStats.userChange > 0 ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                                {Math.abs(monthStats.userChange).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-blue-400" data-testid="stat-monthly-new-users">
                            {monthStats.newUsers}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Önceki ay: {monthStats.prevNewUsers}</p>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase mb-2">Sipariş Durumu</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-400">Ödendi/Aktif</span>
                              <span className="text-sm font-bold text-white">{monthStats.paidOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-yellow-400">Bekliyor</span>
                              <span className="text-sm font-bold text-white">{monthStats.pendingOrders}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-red-400">İptal</span>
                              <span className="text-sm font-bold text-white">{monthStats.cancelledOrders}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-bold text-white uppercase">Paket Satışları - {selectedMonthLabel}</h3>
                        <Badge className="bg-white/10 text-gray-300">{monthStats.packageSales.reduce((sum, p) => sum + p.unitsSold, 0)} toplam satış</Badge>
                      </div>
                      
                      {monthStats.packageSales.some(p => p.unitsSold > 0) ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/10">
                                <TableHead className="text-gray-400">Paket Adı</TableHead>
                                <TableHead className="text-gray-400 text-center">Süre</TableHead>
                                <TableHead className="text-gray-400 text-center">Birim Fiyat</TableHead>
                                <TableHead className="text-gray-400 text-center">Satış Adedi</TableHead>
                                <TableHead className="text-gray-400 text-right">Toplam Gelir</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {monthStats.packageSales.map((pkg, idx) => (
                                <TableRow key={pkg.id} className="border-white/10 hover:bg-white/5" data-testid={`row-package-sales-${idx}`}>
                                  <TableCell className="font-medium text-white">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                      {pkg.name}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center text-gray-400">{pkg.weeks} Hafta</TableCell>
                                  <TableCell className="text-center text-gray-400">₺{pkg.price.toLocaleString("tr-TR")}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge className={pkg.unitsSold > 0 ? "bg-primary/20 text-primary" : "bg-gray-500/20 text-gray-400"}>
                                      {pkg.unitsSold} adet
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-primary">
                                    ₺{pkg.revenue.toLocaleString("tr-TR")}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="border-white/10 bg-primary/10">
                                <TableCell colSpan={3} className="font-bold text-white uppercase">Toplam</TableCell>
                                <TableCell className="text-center">
                                  <Badge className="bg-primary/30 text-primary font-bold">
                                    {monthStats.packageSales.reduce((sum, p) => sum + p.unitsSold, 0)} adet
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold text-primary text-lg">
                                  ₺{monthStats.totalRevenue.toLocaleString("tr-TR")}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                          <p>Bu ay henüz satış yapılmamış</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-6">Aylık Paket Dağılımı</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={monthStats.packageSales.filter(p => p.unitsSold > 0).map(p => ({
                                  name: p.name,
                                  value: p.unitsSold
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                labelLine={false}
                              >
                                {monthStats.packageSales.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                formatter={(value: number) => [`${value} adet`, "Satış"]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-6">Gelir Dağılımı</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthStats.packageSales.filter(p => p.revenue > 0)} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                              <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}k`} />
                              <YAxis type="category" dataKey="name" stroke="#666" fontSize={11} width={100} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                formatter={(value: number) => [`₺${value.toLocaleString("tr-TR")}`, "Gelir"]}
                              />
                              <Bar dataKey="revenue" fill="#ccff00" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

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
                        <p className="text-xs text-gray-500 mt-2">Tüm zamanlar</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm text-gray-500 uppercase mb-2">Dönüşüm Oranı</h3>
                        <p className="text-3xl font-bold text-white">
                          {users.length > 0 
                            ? ((orders.filter(o => o.status !== "cancelled").length / users.length) * 100).toFixed(1)
                            : "0"
                          }%
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Kullanıcı → Müşteri</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm text-gray-500 uppercase mb-2">Tamamlanma Oranı</h3>
                        <p className="text-3xl font-bold text-white">
                          {orders.length > 0 
                            ? ((stats?.completedOrders || 0) / orders.length * 100).toFixed(1)
                            : "0"
                          }%
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Tamamlanan paketler</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-bold uppercase text-white mb-6">Trafik Kaynakları - {selectedMonthLabel}</h2>
                      {(() => {
                        const [year, month] = reportMonth.split("-").map(Number);
                        const startDate = new Date(year, month - 1, 1);
                        const endDate = new Date(year, month, 0, 23, 59, 59);
                        const monthUsers = users.filter(u => {
                          const userDate = new Date(u.createdAt);
                          return userDate >= startDate && userDate <= endDate;
                        });
                        
                        if (monthUsers.length === 0) {
                          return (
                            <div className="text-center py-12 text-gray-500">
                              <Users size={48} className="mx-auto mb-4 opacity-30" />
                              <p>Bu ay henüz yeni kayıt yok</p>
                            </div>
                          );
                        }
                        
                        const sourceCounts: Record<string, number> = {};
                        monthUsers.forEach(u => {
                          const source = u.trafficSource || "direct";
                          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
                        });
                        const sourceData = Object.entries(sourceCounts)
                          .map(([name, value]) => ({ name, value }))
                          .sort((a, b) => b.value - a.value);
                        
                        return (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                  >
                                    {sourceData.map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                    formatter={(value: number) => [`${value} kullanıcı`, "Kayıt"]}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-3">
                              {sourceData.map(({ name: source, value: count }, idx) => (
                                <div key={source} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-white capitalize font-medium">{source}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge className="bg-primary/20 text-primary">{count} kullanıcı</Badge>
                                    <span className="text-gray-500 text-sm">{((count / monthUsers.length) * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                );
              })()}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-bold uppercase text-white flex items-center gap-3">
                      <Activity className="text-primary" /> Kullanıcı Analytics
                    </h2>
                    <Button 
                      onClick={fetchAnalyticsData} 
                      variant="outline" 
                      size="sm" 
                      className="border-white/20"
                      disabled={analyticsLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} /> Yenile
                    </Button>
                  </div>

                  {analyticsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : analyticsData ? (
                    <>
                      {/* Overview Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-4 text-center">
                          <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.totalUsers || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Toplam Kullanıcı</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-4 text-center">
                          <Activity className="w-5 h-5 mx-auto mb-1 text-green-400" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.activeUsers || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Aktif Kullanıcı</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-4 text-center">
                          <Calculator className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.totalCalculations || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Hesaplama</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-4 text-center">
                          <Calendar className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.totalHabitDays || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Alışkanlık Günü</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-xl p-4 text-center">
                          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.totalMeasurements || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Ölçüm</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-xl p-4 text-center">
                          <Clock className="w-5 h-5 mx-auto mb-1 text-red-400" />
                          <div className="text-xl font-bold text-white">{analyticsData.overview?.totalNutritionLogs || 0}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Beslenme Kaydı</div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-4 text-center">
                          <Eye className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                          <div className="text-xl font-bold text-white">{(analyticsData.overview?.avgLoginFrequency || 0).toFixed(1)}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Ort. Giriş/Hafta</div>
                        </div>
                      </div>

                      {/* Active Measurement Users */}
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-orange-400" /> Vücut Ölçümü Kullananlar
                        </h3>
                        {analyticsData.userEngagement?.filter((u: any) => u.measurements > 0).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {analyticsData.userEngagement
                              .filter((u: any) => u.measurements > 0)
                              .sort((a: any, b: any) => b.measurements - a.measurements)
                              .slice(0, 9)
                              .map((u: any) => (
                                <div 
                                  key={u.userId} 
                                  className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors"
                                  onClick={() => setSelectedAnalyticsUser(u.userId)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                                      {u.fullName?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white font-medium truncate">{u.fullName}</p>
                                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                    </div>
                                    <Badge className="bg-orange-500/20 text-orange-400 shrink-0">{u.measurements} ölçüm</Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">Henüz vücut ölçümü kaydeden kullanıcı yok</p>
                        )}
                      </div>

                      {/* User Selection */}
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" /> Kullanıcı Detayları
                        </h3>
                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                          <div className="relative flex-1 md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              placeholder="Kullanıcı ara..."
                              value={analyticsUserSearch}
                              onChange={(e) => setAnalyticsUserSearch(e.target.value)}
                              className="pl-9 bg-white/5 border-white/10"
                            />
                          </div>
                          <Select value={selectedAnalyticsUser} onValueChange={setSelectedAnalyticsUser}>
                            <SelectTrigger className="w-full md:w-80 bg-white/5 border-white/10">
                              <SelectValue placeholder="Kullanıcı seçin..." />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                .filter(u => 
                                  analyticsUserSearch === "" ||
                                  u.fullName.toLowerCase().includes(analyticsUserSearch.toLowerCase()) ||
                                  u.email.toLowerCase().includes(analyticsUserSearch.toLowerCase())
                                )
                                .map(u => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.fullName} ({u.email})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {userAnalyticsDetails && (
                          <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                                {userAnalyticsDetails.user?.fullName?.charAt(0) || "?"}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-white">{userAnalyticsDetails.user?.fullName}</h4>
                                <p className="text-gray-400 text-sm">{userAnalyticsDetails.user?.email}</p>
                                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                  <span>Kayıt: {new Date(userAnalyticsDetails.user?.createdAt).toLocaleDateString("tr-TR")}</span>
                                  {userAnalyticsDetails.user?.phone && <span>Tel: {userAnalyticsDetails.user.phone}</span>}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={userAnalyticsDetails.user?.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"}>
                                  {userAnalyticsDetails.user?.role === "admin" ? "Admin" : "Kullanıcı"}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white/5 rounded-xl p-4">
                                <h5 className="text-xs uppercase text-gray-500 mb-2">Siparişler</h5>
                                <p className="text-2xl font-bold text-white">{userAnalyticsDetails.orders?.length || 0}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-4">
                                <h5 className="text-xs uppercase text-gray-500 mb-2">Vücut Ölçümleri</h5>
                                <p className="text-2xl font-bold text-white">{userAnalyticsDetails.measurements?.length || 0}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-4">
                                <h5 className="text-xs uppercase text-gray-500 mb-2">Günlük Takip</h5>
                                <p className="text-2xl font-bold text-white">{userAnalyticsDetails.habits?.length || 0}</p>
                              </div>
                            </div>

                            {userAnalyticsDetails.measurements?.length > 0 && (
                              <div className="bg-white/5 rounded-xl p-4">
                                <h5 className="text-xs uppercase text-gray-500 mb-3">Son Vücut Ölçümleri</h5>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-white/10">
                                        <th className="text-left py-2 px-2 text-gray-400">Tarih</th>
                                        <th className="text-right py-2 px-2 text-gray-400">Kilo</th>
                                        <th className="text-right py-2 px-2 text-gray-400">Göğüs</th>
                                        <th className="text-right py-2 px-2 text-gray-400">Bel</th>
                                        <th className="text-right py-2 px-2 text-gray-400">Kalça</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {userAnalyticsDetails.measurements.slice(0, 5).map((m: any, idx: number) => (
                                        <tr key={idx} className="border-b border-white/5">
                                          <td className="py-2 px-2 text-white">{new Date(m.createdAt).toLocaleDateString("tr-TR")}</td>
                                          <td className="py-2 px-2 text-right text-primary font-bold">{m.weight ? `${m.weight} kg` : "-"}</td>
                                          <td className="py-2 px-2 text-right text-gray-400">{m.chest ? `${m.chest} cm` : "-"}</td>
                                          <td className="py-2 px-2 text-right text-gray-400">{m.waist ? `${m.waist} cm` : "-"}</td>
                                          <td className="py-2 px-2 text-right text-gray-400">{m.hips ? `${m.hips} cm` : "-"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {userAnalyticsDetails.habits?.length > 0 && (
                              <div className="bg-white/5 rounded-xl p-4">
                                <h5 className="text-xs uppercase text-gray-500 mb-3">Son Günlük Takip</h5>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-white/10">
                                        <th className="text-left py-2 px-2 text-gray-400">Tarih</th>
                                        <th className="text-center py-2 px-2 text-gray-400">Su (bardak)</th>
                                        <th className="text-center py-2 px-2 text-gray-400">Uyku (saat)</th>
                                        <th className="text-center py-2 px-2 text-gray-400">Antrenman</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {userAnalyticsDetails.habits.slice(0, 5).map((h: any, idx: number) => (
                                        <tr key={idx} className="border-b border-white/5">
                                          <td className="py-2 px-2 text-white">{new Date(h.date).toLocaleDateString("tr-TR")}</td>
                                          <td className="py-2 px-2 text-center text-blue-400">{h.waterGlasses || 0}</td>
                                          <td className="py-2 px-2 text-center text-purple-400">{h.sleepHours || "-"}</td>
                                          <td className="py-2 px-2 text-center">
                                            {h.didWorkout ? (
                                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                                            ) : (
                                              <XCircle className="w-4 h-4 text-gray-500 mx-auto" />
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Top Engaged Users Table */}
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" /> En Aktif Kullanıcılar
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
                              {analyticsData.userEngagement?.slice(0, 15).map((u: any, idx: number) => (
                                <tr 
                                  key={u.userId} 
                                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                                  onClick={() => setSelectedAnalyticsUser(u.userId)}
                                >
                                  <td className="py-2 px-3">
                                    <div className="font-medium text-white">{u.fullName}</div>
                                    <div className="text-xs text-gray-500">{u.email}</div>
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <Badge className={u.calculations > 5 ? "bg-primary/20 text-primary" : "bg-gray-500/20 text-gray-400"}>
                                      {u.calculations}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-3 text-right">
                                    <Badge className={u.habits > 10 ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                                      {u.habits}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-3 text-right text-gray-400">{u.measurements}</td>
                                  <td className="py-2 px-3 text-right text-gray-400 text-xs">
                                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString("tr-TR") : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Calculator Usage */}
                      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-primary" /> Hesaplayıcı Kullanımı
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {analyticsData.calculatorUsage?.map((calc: any) => (
                            <div key={calc.type} className="bg-white/5 rounded-xl p-3 text-center">
                              <div className="text-lg font-bold text-primary">{calc.count}</div>
                              <div className="text-xs text-gray-400 uppercase">{calc.type}</div>
                              <div className="text-[10px] text-gray-500 mt-1">{calc.uniqueUsers} kullanıcı</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">Veri yüklenemedi</div>
                  )}
                </motion.div>
              )}

              {activeTab === "email-marketing" && (
                <motion.div
                  key="email-marketing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-heading font-bold text-white uppercase">E-mail Pazarlama</h1>
                      <p className="text-gray-500 text-sm mt-1">Kullanıcılara toplu veya tekli email gönderin</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Users size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase">Toplam Kullanıcı</p>
                          <p className="text-2xl font-bold text-white">{emailUsers.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Filter size={20} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase">Filtrelenen</p>
                          <p className="text-2xl font-bold text-white">{filteredEmailUsers.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Mail size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase">Kampanyalar</p>
                          <p className="text-2xl font-bold text-white">{emailCampaigns.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="İsim veya email ara..."
                            value={emailSearchQuery}
                            onChange={(e) => setEmailSearchQuery(e.target.value)}
                            className="pl-10 bg-black/40 border-white/10"
                            data-testid="input-email-search"
                          />
                        </div>
                      </div>
                      
                      <Select value={emailFilter} onValueChange={setEmailFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-black/40 border-white/10" data-testid="select-email-filter">
                          <Filter size={16} className="mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                          <SelectItem value="has_package">Paket Alanlar</SelectItem>
                          <SelectItem value="no_package">Paket Almayanlar</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() => setShowComposeDialog(true)}
                        className="bg-primary text-black hover:bg-primary/90"
                        disabled={filteredEmailUsers.length === 0}
                        data-testid="button-compose-bulk"
                      >
                        <Send size={16} className="mr-2" /> Toplu Email Gönder
                      </Button>
                    </div>

                    {emailUsersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : filteredEmailUsers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
                        <p>Kullanıcı bulunamadı</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10">
                              <TableHead className="text-gray-400">Kullanıcı</TableHead>
                              <TableHead className="text-gray-400">Email</TableHead>
                              <TableHead className="text-gray-400 text-right">İşlem</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEmailUsers.map((u) => (
                              <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                      <User size={14} className="text-primary" />
                                    </div>
                                    <span className="text-white font-medium">{u.fullName}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-400">{u.email}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedEmailUser(u);
                                      setEmailSubject("");
                                      setEmailContent("");
                                      setShowSingleEmailDialog(true);
                                    }}
                                    className="text-gray-400 hover:text-primary"
                                    data-testid={`button-send-single-${u.id}`}
                                  >
                                    <Mail size={14} className="mr-1" /> Gönder
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Kampanya Geçmişi</h2>
                    
                    {emailCampaigns.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Mail size={40} className="mx-auto mb-3 opacity-50" />
                        <p>Henüz kampanya yok</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10">
                              <TableHead className="text-gray-400">Kampanya</TableHead>
                              <TableHead className="text-gray-400">Filtre</TableHead>
                              <TableHead className="text-gray-400">Durum</TableHead>
                              <TableHead className="text-gray-400">İlerleme</TableHead>
                              <TableHead className="text-gray-400">Tarih</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {emailCampaigns.map((c) => (
                              <TableRow key={c.id} className="border-white/10">
                                <TableCell>
                                  <div>
                                    <p className="text-white font-medium">{c.name}</p>
                                    <p className="text-gray-500 text-xs">{c.subject}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-white/20 text-gray-400">
                                    {getEmailFilterLabel(c.filter)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {c.status === "completed" ? (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle size={12} className="mr-1" />Tamamlandı</Badge>
                                  ) : c.status === "sending" ? (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 size={12} className="mr-1 animate-spin" />Gönderiliyor</Badge>
                                  ) : c.status === "failed" ? (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle size={12} className="mr-1" />Başarısız</Badge>
                                  ) : (
                                    <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><Clock size={12} className="mr-1" />Bekliyor</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${c.totalRecipients > 0 ? (c.sentCount / c.totalRecipients) * 100 : 0}%` }}
                                      />
                                    </div>
                                    <span className="text-gray-400 text-xs">{c.sentCount}/{c.totalRecipients}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm">
                                  {new Date(c.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Email Marketing Dialogs */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Toplu Email Gönder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="text-primary font-medium">
                {getEmailFilterLabel(emailFilter)} - {filteredEmailUsers.length} kişiye gönderilecek
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Emailler 10 saniye arayla tek tek gönderilecek
              </p>
            </div>
            
            <div>
              <Label className="text-gray-400">Kampanya Adı (opsiyonel)</Label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Örn: Yeni Yıl Kampanyası"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-campaign-name"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">Konu *</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email konusu"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-email-subject"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">İçerik * (HTML desteklenir)</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Email içeriği... {{fullName}} ile kişinin adını ekleyebilirsiniz"
                className="bg-black/40 border-white/10 mt-1 min-h-[200px] font-mono text-sm"
                data-testid="textarea-email-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowComposeDialog(false)}>İptal</Button>
            <Button
              onClick={handleSendBulkEmail}
              disabled={isSendingEmail || !emailSubject.trim() || !emailContent.trim()}
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-send-bulk-confirm"
            >
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSingleEmailDialog} onOpenChange={setShowSingleEmailDialog}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Email Gönder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedEmailUser && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedEmailUser.fullName}</p>
                  <p className="text-gray-400 text-sm">{selectedEmailUser.email}</p>
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-gray-400">Konu *</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email konusu"
                className="bg-black/40 border-white/10 mt-1"
                data-testid="input-single-email-subject"
              />
            </div>
            
            <div>
              <Label className="text-gray-400">İçerik * (HTML desteklenir)</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Email içeriği..."
                className="bg-black/40 border-white/10 mt-1 min-h-[200px] font-mono text-sm"
                data-testid="textarea-single-email-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSingleEmailDialog(false)}>İptal</Button>
            <Button
              onClick={handleSendSingleEmail}
              disabled={isSendingEmail || !emailSubject.trim() || !emailContent.trim()}
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-send-single-confirm"
            >
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              Gönder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="outline" onClick={() => setShowUserEditModal(false)} className="border-white/20" data-testid="button-cancel-user-edit">
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
            <Button variant="outline" onClick={() => setShowOrderModal(false)} className="border-white/20" data-testid="button-cancel-order-edit">
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
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div>
                  <Label className="text-primary font-bold">En Popüler</Label>
                  <p className="text-gray-500 text-xs">Paketler sayfasında öne çıksın mı?</p>
                </div>
                <Switch 
                  checked={editPackageForm.isPopular}
                  onCheckedChange={(v) => setEditPackageForm({ ...editPackageForm, isPopular: v })}
                  data-testid="switch-package-popular"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPackageModal(false)} className="border-white/20" data-testid="button-cancel-package-edit">
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
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-white/20" data-testid="button-cancel-delete">
              İptal
            </Button>
            <Button onClick={handleDeleteUser} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white" data-testid="button-confirm-delete">
              {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md" data-testid="modal-assign-package">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase flex items-center gap-2">
              <Package size={24} className="text-primary" /> Paket Ata
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {userMap[assignUserId]?.fullName} kullanıcısına paket atayın
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-400">Paket Seçin</Label>
              <Select 
                value={assignForm.packageId} 
                onValueChange={(v) => {
                  const pkg = packages.find(p => p.id === v);
                  setAssignForm({ 
                    ...assignForm, 
                    packageId: v,
                    endDate: pkg && assignForm.startDate ? calculateEndDate(assignForm.startDate, pkg.weeks) : ""
                  });
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 mt-1" data-testid="select-assign-package">
                  <SelectValue placeholder="Paket seçin..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10">
                  {packages.filter(p => p.isActive).map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id} className="text-white hover:bg-white/10">
                      {pkg.name} - {pkg.weeks} Hafta - ₺{parseFloat(pkg.price).toLocaleString("tr-TR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Başlangıç Tarihi</Label>
                <Input 
                  type="date"
                  value={assignForm.startDate}
                  onChange={(e) => {
                    const pkg = packages.find(p => p.id === assignForm.packageId);
                    setAssignForm({ 
                      ...assignForm, 
                      startDate: e.target.value,
                      endDate: pkg ? calculateEndDate(e.target.value, pkg.weeks) : ""
                    });
                  }}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-assign-start-date"
                />
              </div>
              <div>
                <Label className="text-gray-400">Bitiş Tarihi</Label>
                <Input 
                  type="date"
                  value={assignForm.endDate}
                  onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  data-testid="input-assign-end-date"
                />
              </div>
            </div>
            {assignForm.packageId && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Package size={16} />
                  <span className="font-bold">{packages.find(p => p.id === assignForm.packageId)?.name}</span>
                </div>
                <p className="text-sm text-gray-400">
                  Bu paket kullanıcıya <strong className="text-white">ücretsiz</strong> olarak atanacak ve otomatik olarak <strong className="text-green-400">aktif</strong> duruma geçecektir.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAssignModal(false)} 
              className="border-white/20"
              data-testid="button-cancel-assign"
            >
              İptal
            </Button>
            <Button 
              onClick={handleAssignPackage} 
              disabled={isSubmitting || !assignForm.packageId || !assignForm.startDate || !assignForm.endDate} 
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-confirm-assign"
            >
              {isSubmitting ? "Atanıyor..." : "Paketi Ata"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
