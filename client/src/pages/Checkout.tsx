import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft, CreditCard, Shield, Check, Tag, X, Loader2,
  CheckCircle, User, Mail, Phone, MapPin, Lock, Eye, EyeOff,
  ChevronRight, Zap,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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

function InputField({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  testId,
  rightElement,
  error,
}: {
  icon: React.ElementType;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  testId?: string;
  rightElement?: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 uppercase tracking-[0.15em] mb-1.5 font-medium">
        {label}{required && <span className="text-[#ccff00] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testId}
          className={`w-full bg-white/[0.03] border rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-700 text-[13px] focus:outline-none transition-all ${
            error
              ? "border-red-500/50 focus:border-red-400"
              : "border-white/[0.08] focus:border-[#ccff00]/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#ccff00]/10"
          } ${rightElement ? "pr-12" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Package state
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoadingPkg, setIsLoadingPkg] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Load packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();
        const pkgList = data.packages || [];
        setPackages(pkgList);

        const urlParams = new URLSearchParams(window.location.search);
        const packageId = urlParams.get("packageId");
        const weeks = urlParams.get("weeks");
        let pkg: Package | undefined;
        if (packageId) {
          pkg = pkgList.find((p: Package) => p.id === packageId);
        }
        if (!pkg && weeks) {
          pkg = pkgList.find((p: Package) => p.weeks === parseInt(weeks) && !p.name.includes("Team Alaf"));
        }
        if (pkg) setSelectedPackage(pkg);
      } catch {
        /* silent */
      } finally {
        setIsLoadingPkg(false);
      }
    };
    fetchPackages();
  }, []);

  // Reset coupon when package changes
  useEffect(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, [selectedPackage?.id]);

  const isTeamAlaf = selectedPackage?.name.includes("Team Alaf");
  const accentColor = isTeamAlaf ? "#d4a017" : "#ccff00";

  const getDisplayPrice = () => {
    if (!selectedPackage) return 0;
    return appliedCoupon ? appliedCoupon.finalPrice : parseFloat(selectedPackage.price);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !selectedPackage) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          orderAmount: parseFloat(selectedPackage.price),
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
      }
    } catch {
      setCouponError("Kupon doğrulanamadı");
    } finally {
      setCouponLoading(false);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!isAuthenticated) {
      if (!fullName.trim() || fullName.trim().length < 2) errors.fullName = "Ad soyad en az 2 karakter olmalı";
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Geçerli bir e-posta girin";
      if (!phone.trim() || phone.trim().length < 7) errors.phone = "Geçerli bir telefon numarası girin";
      if (createAccount && password.length < 6) errors.password = "Şifre en az 6 karakter olmalı";
    }
    if (!selectedPackage) errors.package = "Lütfen bir paket seçin";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate() || !acceptedPolicy || !selectedPackage) return;

    const finalPrice = getDisplayPrice();
    trackInitiateCheckout([selectedPackage.id], finalPrice, 1);

    setIsProcessing(true);
    setFormError("");

    try {
      // Step 1: Create order (guest or authenticated)
      const endpoint = isAuthenticated ? "/api/orders" : "/api/orders/guest";
      const body = isAuthenticated
        ? {
            packageId: selectedPackage.id,
            couponCode: appliedCoupon?.code,
            orderSource: getTrafficSource(),
          }
        : {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            address: address.trim() || undefined,
            packageId: selectedPackage.id,
            couponCode: appliedCoupon?.code,
            orderSource: getTrafficSource(),
            createAccount,
            password: createAccount ? password : undefined,
          };

      const orderRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setFormError(err.error || "Sipariş oluşturulamadı");
        return;
      }

      const { order } = await orderRes.json();

      // Step 2: Initiate Shopier payment
      const paymentRes = await fetch("/api/shopier/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId: order.id }),
      });

      if (paymentRes.ok) {
        const paymentHTML = await paymentRes.text();
        document.open();
        document.write(paymentHTML);
        document.close();
      } else {
        setFormError("Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      }
    } catch {
      setFormError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isLoadingPkg) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#ccff00]" />
      </div>
    );
  }

  const displayPrice = getDisplayPrice();
  const originalPrice = selectedPackage ? parseFloat(selectedPackage.price) : 0;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ccff00]/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">

        {/* Back link */}
        <Link href="/paketler" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-white text-[13px] transition-colors mb-8">
          <ArrowLeft size={14} />
          Paketlere dön
        </Link>

        {/* Step header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ccff00] flex items-center justify-center">
                <span className="text-black text-[10px] font-bold">1</span>
              </div>
              <span className="text-[#ccff00] text-[12px] font-semibold uppercase tracking-wider">Bilgiler</span>
            </div>
            <div className="flex-1 max-w-[60px] h-px bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <span className="text-gray-600 text-[10px] font-bold">2</span>
              </div>
              <span className="text-gray-600 text-[12px] font-medium uppercase tracking-wider">Ödeme</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mt-3">
            Siparişini <span className="text-[#ccff00]">tamamla</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">

          {/* ── Right panel (shown first on mobile): Contact form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="h-px bg-gradient-to-r from-transparent via-[#ccff00]/30 to-transparent" />
              <div className="p-6">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-5">
                  Sipariş bilgileri
                </h2>

                {isAuthenticated && user ? (
                  /* Logged-in user card */
                  <div className="flex items-center gap-3 bg-[#ccff00]/[0.05] border border-[#ccff00]/15 rounded-xl p-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center shrink-0">
                      <User size={16} className="text-[#ccff00]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[13px] font-semibold truncate">{user.fullName}</p>
                      <p className="text-gray-500 text-[12px] truncate">{user.email}</p>
                    </div>
                    <CheckCircle size={16} className="text-[#ccff00] shrink-0 ml-auto" />
                  </div>
                ) : (
                  /* Guest form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        icon={User}
                        label="Ad soyad"
                        value={fullName}
                        onChange={setFullName}
                        placeholder="Ahmet Yılmaz"
                        required
                        testId="input-fullname"
                        error={fieldErrors.fullName}
                      />
                      <InputField
                        icon={Phone}
                        label="Telefon"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="0532 000 00 00"
                        required
                        testId="input-phone"
                        error={fieldErrors.phone}
                      />
                    </div>
                    <InputField
                      icon={Mail}
                      label="E-posta"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="ornek@mail.com"
                      required
                      testId="input-email"
                      error={fieldErrors.email}
                    />
                    <InputField
                      icon={MapPin}
                      label="Şehir / Adres (opsiyonel)"
                      value={address}
                      onChange={setAddress}
                      placeholder="İstanbul"
                      testId="input-address"
                    />

                    {/* Optional account creation */}
                    <div className="pt-1">
                      <label
                        className="flex items-center gap-3 cursor-pointer group"
                        data-testid="checkbox-create-account"
                      >
                        <div
                          onClick={() => setCreateAccount(!createAccount)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                            createAccount
                              ? "bg-[#ccff00] border-[#ccff00]"
                              : "bg-white/[0.04] border-white/[0.12] group-hover:border-white/25"
                          }`}
                        >
                          {createAccount && <Check size={11} className="text-black" />}
                        </div>
                        <span className="text-gray-400 text-[13px] leading-snug group-hover:text-gray-300 transition-colors">
                          Üyelik oluşturmak istiyorum{" "}
                          <span className="text-gray-600 text-[11px]">(opsiyonel)</span>
                        </span>
                      </label>
                      <AnimatePresence>
                        {createAccount && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3"
                          >
                            <InputField
                              icon={Lock}
                              label="Şifre"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={setPassword}
                              placeholder="En az 6 karakter"
                              required
                              testId="input-password"
                              error={fieldErrors.password}
                              rightElement={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                              }
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Policy */}
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <label className="flex items-start gap-3 cursor-pointer group" data-testid="checkbox-policy">
                    <div
                      onClick={() => setAcceptedPolicy(!acceptedPolicy)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        acceptedPolicy
                          ? "bg-[#ccff00] border-[#ccff00]"
                          : "bg-white/[0.04] border-white/[0.12] group-hover:border-white/25"
                      }`}
                    >
                      {acceptedPolicy && <Check size={11} className="text-black" />}
                    </div>
                    <span className="text-gray-500 text-[12px] leading-relaxed group-hover:text-gray-400 transition-colors">
                      Kişiye özel koçluk hizmeti kapsamında cayma hakkımın bulunmadığını kabul ediyorum.{" "}
                      <Link href="/iptal-iade" className="text-[#ccff00]/60 hover:text-[#ccff00] underline transition-colors" target="_blank">
                        İade politikası
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 flex items-start gap-2.5"
                    >
                      <X size={14} className="text-red-400 mt-0.5 shrink-0" />
                      <p className="text-red-400 text-[12px]">{formError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !acceptedPolicy || !selectedPackage}
                  data-testid="button-checkout"
                  className="mt-5 w-full h-13 py-3.5 rounded-xl bg-[#ccff00] text-black font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-[#ccff00]/90 hover:shadow-[0_0_24px_rgba(204,255,0,0.25)] transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Shopier ile öde
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-gray-700 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Shield size={12} />
                    SSL korumalı
                  </span>
                  <span className="w-px h-3 bg-white/[0.07]" />
                  <span className="flex items-center gap-1">
                    <Zap size={12} />
                    Shopier güvencesi
                  </span>
                  <span className="w-px h-3 bg-white/[0.07]" />
                  <span className="flex items-center gap-1">
                    <Lock size={12} />
                    256-bit şifreli
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Left panel: Package summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl overflow-hidden sticky top-24">
              <div className={`h-px bg-gradient-to-r from-transparent ${isTeamAlaf ? "via-[#d4a017]/50" : "via-[#ccff00]/40"} to-transparent`} />
              <div className="p-5">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-white mb-4">
                  Sipariş özeti
                </h2>

                {/* Package selector — grouped */}
                {(() => {
                  const naturalPkgs = packages.filter((p) => !p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);
                  const teamAlafPkgs = packages.filter((p) => p.name.includes("Team Alaf")).sort((a, b) => a.weeks - b.weeks);

                  const PackageRow = ({ pkg }: { pkg: Package }) => {
                    const isTA = pkg.name.includes("Team Alaf");
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        data-testid={`package-option-${pkg.id}`}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? isTA
                              ? "border-[#d4a017]/40 bg-[#d4a017]/[0.07]"
                              : "border-[#ccff00]/30 bg-[#ccff00]/[0.06]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                        }`}
                      >
                        <p className={`text-[13px] font-semibold ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {pkg.weeks} haftalık program
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[13px] font-bold ${isTA ? "text-[#d4a017]" : "text-[#ccff00]"}`}>
                            ₺{parseFloat(pkg.price).toLocaleString("tr-TR")}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? isTA ? "bg-[#d4a017] border-[#d4a017]" : "bg-[#ccff00] border-[#ccff00]"
                              : "border-white/20 bg-transparent"
                          }`}>
                            {isSelected && <Check size={9} className="text-black" />}
                          </div>
                        </div>
                      </button>
                    );
                  };

                  return (
                    <div className="space-y-4 mb-5">
                      {/* Natural Paket grubu */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ccff00]/70">Natural Paket</span>
                          <div className="flex-1 h-px bg-[#ccff00]/10" />
                        </div>
                        <div className="space-y-1.5">
                          {naturalPkgs.map((pkg) => <PackageRow key={pkg.id} pkg={pkg} />)}
                        </div>
                      </div>

                      {/* Team Alaf Paketi grubu */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4a017]/70">Team Alaf Paketi</span>
                          <div className="flex-1 h-px bg-[#d4a017]/10" />
                        </div>
                        <div className="space-y-1.5">
                          {teamAlafPkgs.map((pkg) => <PackageRow key={pkg.id} pkg={pkg} />)}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {fieldErrors.package && (
                  <p className="text-red-400 text-[11px] mb-3">{fieldErrors.package}</p>
                )}

                {/* Coupon */}
                <div className="mb-5">
                  <label className="block text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-1.5">
                    İndirim kodu
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#ccff00]/[0.08] border border-[#ccff00]/20 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-[#ccff00]" />
                        <span className="text-[#ccff00] font-semibold text-[12px]">{appliedCoupon.code}</span>
                        <span className="text-[#ccff00]/60 text-[11px]">
                          {appliedCoupon.discountType === "percentage"
                            ? `%${parseFloat(appliedCoupon.discountValue)} indirim`
                            : `₺${parseFloat(appliedCoupon.discountValue).toLocaleString("tr-TR")} indirim`}
                        </span>
                      </div>
                      <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-gray-600 hover:text-white transition-colors" data-testid="button-remove-coupon">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            placeholder="Kupon kodun varsa gir"
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-gray-700 text-[12px] focus:outline-none focus:border-white/20 transition-all uppercase tracking-wider"
                            data-testid="input-coupon-code"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || couponLoading}
                          className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] text-white text-[12px] font-medium rounded-xl hover:bg-white/10 transition-all disabled:opacity-40"
                          data-testid="button-apply-coupon"
                        >
                          {couponLoading ? <Loader2 size={13} className="animate-spin" /> : "Uygula"}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-red-400 text-[11px] mt-1.5" data-testid="text-coupon-error">{couponError}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Price breakdown */}
                {selectedPackage && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPackage.id + (appliedCoupon?.code || "")}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/[0.06] pt-4 space-y-2"
                    >
                      <div className="flex justify-between text-[12px]">
                        <span className="text-gray-500">Paket ücreti</span>
                        <span className={`${appliedCoupon ? "line-through text-gray-600" : "text-white"}`}>
                          ₺{originalPrice.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-[12px]">
                          <span className="text-[#ccff00]/70 flex items-center gap-1">
                            <Tag size={11} />
                            İndirim
                          </span>
                          <span className="text-[#ccff00]/80">-₺{appliedCoupon.discountAmount.toLocaleString("tr-TR")}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.06]">
                        <span className="text-gray-400 text-[13px] font-medium">Toplam</span>
                        <span className={`text-[28px] font-bold tracking-tight ${isTeamAlaf ? "text-[#d4a017]" : "text-[#ccff00]"}`}>
                          ₺{displayPrice.toLocaleString("tr-TR")}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
