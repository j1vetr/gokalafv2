import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { User, Package, ShoppingBag, LogOut, Clock, CheckCircle, XCircle, AlertCircle, Dumbbell, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Record<string, PackageInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, packagesRes] = await Promise.all([
          fetch("/api/orders", { credentials: "include" }),
          fetch("/api/packages"),
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock size={12} className="mr-1" /> Ödeme Bekleniyor</Badge>;
      case "paid":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><CheckCircle size={12} className="mr-1" /> Ödeme Alındı</Badge>;
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle size={12} className="mr-1" /> Aktif</Badge>;
      case "completed":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><CheckCircle size={12} className="mr-1" /> Tamamlandı</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle size={12} className="mr-1" /> İptal</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const activeOrder = orders.find(o => o.status === "active");

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
              <User size={12} className="mr-1" /> Kullanıcı Paneli
            </Badge>
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
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge className="bg-primary text-black mb-2">Aktif Plan</Badge>
                  <h3 className="text-xl font-heading font-bold uppercase text-white">
                    {packages[activeOrder.packageId]?.name || "Normal Plan"}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 uppercase">Bitiş</div>
                  <div className="font-bold text-white">
                    {activeOrder.endDate ? new Date(activeOrder.endDate).toLocaleDateString("tr-TR") : "-"}
                  </div>
                </div>
              </div>
              <Progress value={45} className="h-3 bg-white/10" />
              <p className="text-xs text-gray-400 mt-2">Harika gidiyorsun!</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-lg">{user?.fullName}</h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-gray-500 text-sm">Telefon</span>
                  <span className="text-white text-sm">{user?.phone || "-"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-gray-500 text-sm">Toplam Sipariş</span>
                  <span className="text-white text-sm">{orders.length}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500 text-sm">Aktif Paket</span>
                  <span className="text-primary text-sm font-medium">
                    {activeOrder ? "Var" : "Yok"}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <Dumbbell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-[10px] text-gray-500 uppercase">Antrenman</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">-</div>
                  <div className="text-[10px] text-gray-500 uppercase">Kilo Değişimi</div>
                </div>
              </div>

              <Link href="/packages">
                <Button className="w-full mt-6 bg-primary text-black hover:bg-primary/90 font-bold uppercase" data-testid="button-new-package">
                  <Package size={16} className="mr-2" /> Yeni Paket Al
                </Button>
              </Link>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-heading font-bold text-white text-xl uppercase">Siparişlerim</h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-500 mb-4">Henüz siparişin bulunmuyor</p>
                  <Link href="/packages">
                    <Button className="bg-primary text-black hover:bg-primary/90 font-bold uppercase">
                      İlk Paketini Al
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const pkg = packages[order.packageId];
                    return (
                      <div 
                        key={order.id} 
                        className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
                        data-testid={`order-${order.id}`}
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-heading font-bold text-white uppercase mb-1">
                              {pkg?.name || "Normal Plan"} - {pkg?.weeks || "?"} Hafta
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {new Date(order.createdAt).toLocaleDateString("tr-TR", { 
                                day: "numeric", month: "long", year: "numeric" 
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2">
                            {getStatusBadge(order.status)}
                            <span className="text-xl font-bold text-white">
                              ₺{parseFloat(order.totalPrice).toLocaleString("tr-TR")}
                            </span>
                          </div>
                        </div>
                        
                        {order.status === "pending" && (
                          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-yellow-400 text-sm">
                            <AlertCircle size={16} />
                            <span>Ödemenizi Shopier üzerinden tamamlayın</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
