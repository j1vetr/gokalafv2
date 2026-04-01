import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, CreditCard, Shield, Check, ArrowLeft, ExternalLink, Tag, X, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { getTrafficSource } from "@/hooks/useTrafficSource";

interface Package {
  id: string;
  name: string;
  weeks: number;
  price: string;
  features: string[];
}

interface AppliedCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string;
  discountAmount: number;
  finalPrice: number;
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/kayit?redirect=checkout");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();
        setPackages(data.packages || []);
        
        const urlParams = new URLSearchParams(window.location.search);
        const packageId = urlParams.get("packageId");
        const weeks = urlParams.get("weeks");
        if (data.packages) {
          let pkg: Package | undefined;
          if (packageId) {
            pkg = data.packages.find((p: Package) => p.id === packageId);
          }
          if (!pkg && weeks) {
            // For Natural packages: match by weeks excluding Team Alaf
            pkg = data.packages.find((p: Package) => p.weeks === parseInt(weeks) && !p.name.includes("Team Alaf"));
          }
          if (pkg) setSelectedPackage(pkg);
        }
      } catch (error) {
        console.error("Paketler yüklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
    }
  }, [selectedPackage?.id]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !selectedPackage) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          code: couponCode.trim().toUpperCase(), 
          orderAmount: parseFloat(selectedPackage.price) 
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Kupon doğrulanamadı");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          id: data.coupon.id,
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discountAmount,
          finalPrice: data.finalAmount,
        });
        setCouponError("");
      }
    } catch {
      setCouponError("Kupon doğrulanamadı");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const getDisplayPrice = () => {
    if (!selectedPackage) return 0;
    return appliedCoupon ? appliedCoupon.finalPrice : parseFloat(selectedPackage.price);
  };

  const handleCheckout = async () => {
    if (!selectedPackage) return;
    
    const finalPrice = getDisplayPrice();
    trackInitiateCheckout(
      [selectedPackage.id],
      finalPrice,
      1
    );
    
    setIsProcessing(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          packageId: selectedPackage.id,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          orderSource: getTrafficSource(),
        }),
      });
      
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        const orderId = orderData.order.id;
        
        const paymentRes = await fetch("/api/shopier/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId }),
        });
        
        if (paymentRes.ok) {
          const paymentHTML = await paymentRes.text();
          document.open();
          document.write(paymentHTML);
          document.close();
        } else {
          console.error("Ödeme başlatılamadı");
        }
      }
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
    } finally {
      setIsProcessing(false);
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
    <div className="min-h-screen pt-28 pb-12 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/paketler" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Paketlere Dön
        </Link>

        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            <ShoppingCart size={12} className="mr-1" /> Ödeme
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-2 text-white">
            Siparişini <span className="text-primary">Tamamla</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold uppercase text-white mb-4">Paket Seç</h2>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
                data-testid={`package-option-${pkg.weeks}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading font-bold text-white uppercase">{pkg.weeks} Hafta</h3>
                    <p className="text-gray-400 text-sm">Normal Plan</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">₺{parseFloat(pkg.price).toLocaleString("tr-TR")}</div>
                  </div>
                </div>
                {selectedPackage?.id === pkg.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-heading font-bold uppercase text-white mb-6">Sipariş Özeti</h2>
              
              {selectedPackage ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Paket</span>
                      <span className="text-white font-medium">Normal Plan - {selectedPackage.weeks} Hafta</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Kullanıcı</span>
                      <span className="text-white font-medium">{user?.fullName}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400">Paket Ücreti</span>
                      <span className={`text-white font-medium ${appliedCoupon ? "line-through text-gray-500" : ""}`}>
                        ₺{parseFloat(selectedPackage.price).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-green-400 flex items-center gap-1.5">
                          <Tag size={14} />
                          İndirim ({appliedCoupon.code})
                        </span>
                        <span className="text-green-400 font-medium">
                          -₺{appliedCoupon.discountAmount.toLocaleString("tr-TR")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-lg">Toplam</span>
                      <span className="text-3xl font-bold text-primary">₺{getDisplayPrice().toLocaleString("tr-TR")}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-2 block">İndirim Kodu</label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 font-medium">{appliedCoupon.code}</span>
                          <span className="text-green-400/70 text-sm">
                            ({appliedCoupon.discountType === "percentage" 
                              ? `%${parseFloat(appliedCoupon.discountValue)} indirim` 
                              : `₺${parseFloat(appliedCoupon.discountValue).toLocaleString("tr-TR")} indirim`})
                          </span>
                        </div>
                        <button 
                          onClick={removeCoupon} 
                          className="text-gray-400 hover:text-white transition-colors"
                          data-testid="button-remove-coupon"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            placeholder="Kupon kodunu gir"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all uppercase tracking-wider text-sm"
                            data-testid="input-coupon-code"
                          />
                        </div>
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || couponLoading}
                          className="bg-white/10 border border-white/10 text-white hover:bg-white/20 px-5 rounded-xl disabled:opacity-40"
                          data-testid="button-apply-coupon"
                        >
                          {couponLoading ? <Loader2 size={16} className="animate-spin" /> : "Uygula"}
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-red-400 text-sm mt-2" data-testid="text-coupon-error">{couponError}</p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptedPolicy}
                      onChange={(e) => setAcceptedPolicy(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                      data-testid="checkbox-policy"
                    />
                    <span className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      Kişiye özel hazırlanan koçluk hizmeti kapsamında cayma hakkımın bulunmadığını ve hizmete hemen başlanacağını kabul ediyorum. 
                      <Link href="/iptal-iade" className="text-primary hover:underline ml-1" target="_blank">
                        İade Politikası
                      </Link>
                    </span>
                  </label>

                  <Button 
                    onClick={handleCheckout}
                    disabled={isProcessing || !acceptedPolicy}
                    className="w-full h-14 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-checkout"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        İşleniyor...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CreditCard size={20} /> Shopier ile Öde
                        <ExternalLink size={16} />
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <Shield size={14} />
                    <span>Shopier güvencesiyle güvenli ödeme</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Lütfen bir paket seçin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
