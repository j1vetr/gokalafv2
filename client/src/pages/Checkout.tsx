import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, CreditCard, Shield, Check, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface Package {
  id: string;
  name: string;
  weeks: number;
  price: string;
  features: string[];
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
        const weeks = urlParams.get("weeks");
        if (weeks && data.packages) {
          const pkg = data.packages.find((p: Package) => p.weeks === parseInt(weeks));
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

  const handleCheckout = async () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageId: selectedPackage.id }),
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
          const { formData, paymentUrl } = await paymentRes.json();
          
          const form = document.createElement("form");
          form.method = "POST";
          form.action = paymentUrl;
          
          Object.entries(formData).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
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
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-lg">Toplam</span>
                      <span className="text-3xl font-bold text-primary">₺{parseFloat(selectedPackage.price).toLocaleString("tr-TR")}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full h-14 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase text-lg mb-4"
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
