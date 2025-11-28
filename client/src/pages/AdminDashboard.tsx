import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { Package, Users, DollarSign, LogOut, Search, Clock, CheckCircle, XCircle } from "lucide-react";

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
  createdAt: string;
}

interface PackageInfo {
  id: string;
  name: string;
  weeks: number;
  price: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("orders");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [packageMap, setPackageMap] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, packagesRes] = await Promise.all([
          fetch("/api/admin/users", { credentials: "include" }),
          fetch("/api/admin/orders", { credentials: "include" }),
          fetch("/api/admin/packages", { credentials: "include" }),
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
      } catch (error) {
        console.error("Veri yüklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock size={12} className="mr-1" /> Bekliyor</Badge>;
      case "paid":
        return <Badge className="bg-blue-500/20 text-blue-400"><CheckCircle size={12} className="mr-1" /> Ödendi</Badge>;
      case "active":
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle size={12} className="mr-1" /> Aktif</Badge>;
      case "completed":
        return <Badge className="bg-gray-500/20 text-gray-400"><CheckCircle size={12} className="mr-1" /> Bitti</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400"><XCircle size={12} className="mr-1" /> İptal</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label, count }: { id: string, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-bold uppercase tracking-wide ${
        activeTab === id 
          ? "bg-primary text-black" 
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </span>
      {count !== undefined && (
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
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 sticky top-28">
              <div className="flex items-center gap-3 px-2 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Admin Panel</h3>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <SidebarItem id="orders" icon={DollarSign} label="Siparişler" count={orders.length} />
                <SidebarItem id="users" icon={Users} label="Kullanıcılar" count={users.length} />
                <SidebarItem id="packages" icon={Package} label="Paketler" count={packages.length} />
              </nav>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut size={16} className="mr-2" /> Çıkış Yap
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Toplam Gelir</p>
                    <p className="text-xl font-bold text-white">₺{totalRevenue.toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Kullanıcılar</p>
                    <p className="text-xl font-bold text-white">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Package className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Aktif Siparişler</p>
                    <p className="text-xl font-bold text-white">{orders.filter(o => o.status === "active").length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-heading font-bold uppercase text-white">Siparişler</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-primary">Kullanıcı</TableHead>
                      <TableHead className="text-primary">Paket</TableHead>
                      <TableHead className="text-primary">Tutar</TableHead>
                      <TableHead className="text-primary">Durum</TableHead>
                      <TableHead className="text-primary">Tarih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">{userMap[order.userId]?.fullName || "-"}</TableCell>
                        <TableCell className="text-gray-400">{packageMap[order.packageId]?.name || "-"}</TableCell>
                        <TableCell className="text-white font-medium">₺{parseFloat(order.totalPrice).toLocaleString("tr-TR")}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-gray-500">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Henüz sipariş bulunmuyor
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-heading font-bold uppercase text-white">Kullanıcılar</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input 
                      placeholder="Ara..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-primary">Ad Soyad</TableHead>
                      <TableHead className="text-primary">Email</TableHead>
                      <TableHead className="text-primary">Telefon</TableHead>
                      <TableHead className="text-primary">Rol</TableHead>
                      <TableHead className="text-primary">Kayıt Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{u.fullName}</TableCell>
                        <TableCell className="text-gray-400">{u.email}</TableCell>
                        <TableCell className="text-gray-400">{u.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge className={u.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}>
                            {u.role === "admin" ? "Admin" : "Kullanıcı"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{new Date(u.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-heading font-bold uppercase text-white">Paketler</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-primary">Paket Adı</TableHead>
                      <TableHead className="text-primary">Süre</TableHead>
                      <TableHead className="text-primary">Fiyat</TableHead>
                      <TableHead className="text-primary">Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{pkg.name}</TableCell>
                        <TableCell className="text-gray-400">{pkg.weeks} Hafta</TableCell>
                        <TableCell className="text-white">₺{parseFloat(pkg.price).toLocaleString("tr-TR")}</TableCell>
                        <TableCell>
                          <Badge className={pkg.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                            {pkg.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
