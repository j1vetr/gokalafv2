import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  FileText, ArrowLeft, Search, User, Calendar, Monitor, 
  Globe, ChevronLeft, ChevronRight, RefreshCw
} from "lucide-react";

interface SystemLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  login: { label: "Giriş", color: "bg-green-500/20 text-green-400" },
  logout: { label: "Çıkış", color: "bg-gray-500/20 text-gray-400" },
  create_coupon: { label: "Kupon Oluşturma", color: "bg-blue-500/20 text-blue-400" },
  update_coupon: { label: "Kupon Güncelleme", color: "bg-yellow-500/20 text-yellow-400" },
  delete_coupon: { label: "Kupon Silme", color: "bg-red-500/20 text-red-400" },
  create_order: { label: "Sipariş Oluşturma", color: "bg-green-500/20 text-green-400" },
  update_order: { label: "Sipariş Güncelleme", color: "bg-yellow-500/20 text-yellow-400" },
  assign_package: { label: "Paket Atama", color: "bg-purple-500/20 text-purple-400" },
  update_user: { label: "Kullanıcı Güncelleme", color: "bg-yellow-500/20 text-yellow-400" },
  delete_user: { label: "Kullanıcı Silme", color: "bg-red-500/20 text-red-400" },
  backup_table: { label: "Tablo Yedekleme", color: "bg-cyan-500/20 text-cyan-400" },
  backup_full: { label: "Tam Yedekleme", color: "bg-cyan-500/20 text-cyan-400" },
};

export default function AdminSystemLogs() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/system-logs?limit=${limit}&offset=${page * limit}`;
      if (actionFilter !== "all") {
        url += `&action=${actionFilter}`;
      }
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Loglar yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchLogs();
    }
  }, [isAuthenticated, isAdmin, page, actionFilter]);

  const getActionBadge = (action: string) => {
    const config = actionLabels[action] || { label: action, color: "bg-gray-500/20 text-gray-400" };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const parseDetails = (details: string | null) => {
    if (!details) return null;
    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  };

  const formatUserAgent = (ua: string | null) => {
    if (!ua) return "-";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Tarayıcı";
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const details = parseDetails(log.details);
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.entityType?.toLowerCase().includes(searchLower) ||
      log.entityId?.toLowerCase().includes(searchLower) ||
      (details && JSON.stringify(details).toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(total / limit);

  if (authLoading) {
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
              <h1 className="text-2xl font-heading font-bold uppercase">Sistem Logları</h1>
              <p className="text-gray-500 text-sm">Tüm admin işlemlerinin kaydı</p>
            </div>
          </div>
          <Button
            onClick={fetchLogs}
            variant="outline"
            className="border-white/20 hover:bg-white/10"
            data-testid="button-refresh"
          >
            <RefreshCw size={16} className="mr-2" /> Yenile
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Log ara..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              data-testid="input-search-logs"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white" data-testid="select-action-filter">
              <SelectValue placeholder="İşlem Filtresi" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-white/10">
              <SelectItem value="all" className="text-white">Tüm İşlemler</SelectItem>
              <SelectItem value="login" className="text-white">Giriş</SelectItem>
              <SelectItem value="create_coupon" className="text-white">Kupon Oluşturma</SelectItem>
              <SelectItem value="update_coupon" className="text-white">Kupon Güncelleme</SelectItem>
              <SelectItem value="delete_coupon" className="text-white">Kupon Silme</SelectItem>
              <SelectItem value="update_order" className="text-white">Sipariş Güncelleme</SelectItem>
              <SelectItem value="assign_package" className="text-white">Paket Atama</SelectItem>
              <SelectItem value="backup_table" className="text-white">Yedekleme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Tarih</TableHead>
                  <TableHead className="text-gray-400">İşlem</TableHead>
                  <TableHead className="text-gray-400">Varlık</TableHead>
                  <TableHead className="text-gray-400">Detaylar</TableHead>
                  <TableHead className="text-gray-400">IP / Tarayıcı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const details = parseDetails(log.details);
                  return (
                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5" data-testid={`row-log-${log.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-gray-500" />
                          <div>
                            <p className="text-white">
                              {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(log.createdAt).toLocaleTimeString("tr-TR")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        {log.entityType && (
                          <div className="text-sm">
                            <p className="text-gray-400 capitalize">{log.entityType}</p>
                            {log.entityId && (
                              <p className="text-gray-500 text-xs font-mono truncate max-w-32">
                                {log.entityId}
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {details && (
                          <div className="text-xs text-gray-400 max-w-64">
                            {typeof details === "object" ? (
                              <div className="space-y-0.5">
                                {Object.entries(details).slice(0, 3).map(([key, value]) => (
                                  <p key={key} className="truncate">
                                    <span className="text-gray-500">{key}:</span>{" "}
                                    <span className="text-white">{String(value)}</span>
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="truncate">{details}</p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {log.ipAddress && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Globe size={12} />
                              <span>{log.ipAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-500">
                            <Monitor size={12} />
                            <span>{formatUserAgent(log.userAgent)}</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-30" />
                      <p>Log kaydı bulunamadı</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-500 text-sm">
              Toplam {total} kayıt
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="border-white/20 hover:bg-white/10"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-gray-400 text-sm px-3">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="border-white/20 hover:bg-white/10"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
