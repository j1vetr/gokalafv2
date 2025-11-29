import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Ticket, Plus, Edit, Trash2, ArrowLeft, Calendar, Percent, 
  DollarSign, Users, CheckCircle, XCircle, Copy, Clock
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string;
  minOrderAmount: string | null;
  maxUsageCount: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCoupons() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUsageCount: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error("Kuponlar yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCoupons();
    }
  }, [isAuthenticated, isAdmin]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, code });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = selectedCoupon 
        ? `/api/admin/coupons/${selectedCoupon.id}` 
        : "/api/admin/coupons";
      const method = selectedCoupon ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: form.code,
          discountType: form.discountType,
          discountValue: form.discountValue,
          minOrderAmount: form.minOrderAmount || null,
          maxUsageCount: form.maxUsageCount ? parseInt(form.maxUsageCount) : null,
          validFrom: form.validFrom,
          validUntil: form.validUntil,
          isActive: form.isActive,
        }),
      });

      if (res.ok) {
        fetchCoupons();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Kupon kaydedilemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${selectedCoupon.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchCoupons();
        setShowDeleteConfirm(false);
        setSelectedCoupon(null);
      }
    } catch (error) {
      console.error("Kupon silinemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxUsageCount: "",
      validFrom: "",
      validUntil: "",
      isActive: true,
    });
    setSelectedCoupon(null);
  };

  const openEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || "",
      maxUsageCount: coupon.maxUsageCount?.toString() || "",
      validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
      validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const isExpired = (date: string) => new Date(date) < new Date();
  const isNotStarted = (date: string) => new Date(date) > new Date();

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <Badge className="bg-gray-500/20 text-gray-400">Pasif</Badge>;
    }
    if (isExpired(coupon.validUntil)) {
      return <Badge className="bg-red-500/20 text-red-400">Süresi Dolmuş</Badge>;
    }
    if (isNotStarted(coupon.validFrom)) {
      return <Badge className="bg-yellow-500/20 text-yellow-400">Beklemede</Badge>;
    }
    if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
      return <Badge className="bg-orange-500/20 text-orange-400">Limit Doldu</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400">Aktif</Badge>;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/gokadmin")}
              className="text-gray-400 hover:text-white"
              data-testid="button-back"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold uppercase">Kupon Yönetimi</h1>
              <p className="text-gray-500 text-sm">İndirim kuponlarını yönetin</p>
            </div>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary/90 text-black font-bold"
            data-testid="button-add-coupon"
          >
            <Plus size={18} className="mr-2" /> Yeni Kupon
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Kupon Kodu</TableHead>
                <TableHead className="text-gray-400">İndirim</TableHead>
                <TableHead className="text-gray-400">Kullanım</TableHead>
                <TableHead className="text-gray-400">Geçerlilik</TableHead>
                <TableHead className="text-gray-400">Durum</TableHead>
                <TableHead className="text-gray-400 text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} className="border-white/10 hover:bg-white/5" data-testid={`row-coupon-${coupon.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-primary" />
                      <span className="font-mono font-bold text-primary">{coupon.code}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-white"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {coupon.discountType === "percentage" ? (
                        <>
                          <Percent size={14} className="text-green-400" />
                          <span className="font-bold">%{coupon.discountValue}</span>
                        </>
                      ) : (
                        <>
                          <DollarSign size={14} className="text-green-400" />
                          <span className="font-bold">₺{parseFloat(coupon.discountValue).toLocaleString("tr-TR")}</span>
                        </>
                      )}
                    </div>
                    {coupon.minOrderAmount && (
                      <p className="text-xs text-gray-500">Min: ₺{parseFloat(coupon.minOrderAmount).toLocaleString("tr-TR")}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-gray-400" />
                      <span>{coupon.usedCount}</span>
                      {coupon.maxUsageCount && (
                        <span className="text-gray-500">/ {coupon.maxUsageCount}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar size={12} />
                        {new Date(coupon.validFrom).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        {new Date(coupon.validUntil).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(coupon)}
                        className="text-gray-400 hover:text-primary"
                        data-testid={`button-edit-coupon-${coupon.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-gray-400 hover:text-red-400"
                        data-testid={`button-delete-coupon-${coupon.id}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {coupons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <Ticket size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Henüz kupon oluşturulmamış</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-lg" data-testid="modal-coupon">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase">
              {selectedCoupon ? "Kuponu Düzenle" : "Yeni Kupon Oluştur"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              İndirim kuponu bilgilerini girin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Kupon Kodu</Label>
              <div className="flex gap-2">
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="INDIRIM2024"
                  className="bg-white/5 border-white/10 text-white font-mono uppercase"
                  data-testid="input-coupon-code"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  className="border-white/20 hover:bg-white/10"
                >
                  Oluştur
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">İndirim Tipi</Label>
                <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-discount-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10">
                    <SelectItem value="percentage" className="text-white">Yüzde (%)</SelectItem>
                    <SelectItem value="fixed" className="text-white">Sabit Tutar (₺)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400">İndirim Değeri</Label>
                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "percentage" ? "15" : "500"}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-discount-value"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Min. Sipariş Tutarı (Opsiyonel)</Label>
                <Input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="5000"
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-min-order"
                />
              </div>
              <div>
                <Label className="text-gray-400">Max Kullanım (Opsiyonel)</Label>
                <Input
                  type="number"
                  value={form.maxUsageCount}
                  onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value })}
                  placeholder="100"
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-max-usage"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Başlangıç Tarihi</Label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-valid-from"
                />
              </div>
              <div>
                <Label className="text-gray-400">Bitiş Tarihi</Label>
                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-valid-until"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <Label className="text-gray-400">Kupon Aktif</Label>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                data-testid="switch-is-active"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="border-white/20 hover:bg-white/10"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.code || !form.discountValue || !form.validFrom || !form.validUntil}
              className="bg-primary hover:bg-primary/90 text-black font-bold"
              data-testid="button-save-coupon"
            >
              {isSubmitting ? "Kaydediliyor..." : selectedCoupon ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md" data-testid="modal-delete-confirm">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading uppercase text-red-400">Kuponu Sil</DialogTitle>
            <DialogDescription className="text-gray-400">
              <span className="font-mono font-bold text-primary">{selectedCoupon?.code}</span> kodlu kuponu silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="border-white/20 hover:bg-white/10"
            >
              İptal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
              data-testid="button-confirm-delete"
            >
              {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
