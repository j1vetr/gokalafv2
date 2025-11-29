import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Database, ArrowLeft, Download, HardDrive, Table2, 
  CheckCircle, Clock, AlertCircle, RefreshCw
} from "lucide-react";

interface TableInfo {
  name: string;
  label: string;
}

interface BackupHistory {
  table: string;
  date: string;
  status: "success" | "pending" | "error";
}

export default function AdminBackup() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingTable, setDownloadingTable] = useState<string | null>(null);
  const [downloadingFull, setDownloadingFull] = useState(false);
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/gokadmin/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, setLocation]);

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/backup/tables", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTables(data.tables || []);
      }
    } catch (error) {
      console.error("Tablolar yüklenemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchTables();
    }
  }, [isAuthenticated, isAdmin]);

  const downloadTableBackup = async (tableName: string) => {
    setDownloadingTable(tableName);
    try {
      const res = await fetch(`/api/admin/backup/${tableName}`, { credentials: "include" });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tableName}_backup_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setBackupHistory(prev => [
          { table: tableName, date: new Date().toISOString(), status: "success" },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (error) {
      console.error("Yedekleme başarısız:", error);
      setBackupHistory(prev => [
        { table: tableName, date: new Date().toISOString(), status: "error" },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setDownloadingTable(null);
    }
  };

  const downloadFullBackup = async () => {
    setDownloadingFull(true);
    try {
      const res = await fetch("/api/admin/backup/full/download", { credentials: "include" });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gokalaf_full_backup_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setBackupHistory(prev => [
          { table: "Tam Yedekleme", date: new Date().toISOString(), status: "success" },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (error) {
      console.error("Tam yedekleme başarısız:", error);
      setBackupHistory(prev => [
        { table: "Tam Yedekleme", date: new Date().toISOString(), status: "error" },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setDownloadingFull(false);
    }
  };

  const getTableIcon = (name: string) => {
    switch (name) {
      case "users": return "👤";
      case "packages": return "📦";
      case "orders": return "🛒";
      case "coupons": return "🎫";
      case "user_progress": return "📈";
      case "daily_habits": return "✅";
      case "body_measurements": return "📏";
      case "calculator_results": return "🧮";
      case "email_logs": return "📧";
      case "system_logs": return "📋";
      default: return "📄";
    }
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
              <h1 className="text-2xl font-heading font-bold uppercase">Veritabanı Yedekleme</h1>
              <p className="text-gray-500 text-sm">Verilerinizi güvenle yedekleyin</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <HardDrive size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold uppercase">Tam Yedekleme</h2>
                    <p className="text-gray-500 text-sm">Tüm tabloları tek dosyada indir</p>
                  </div>
                </div>
                <Button
                  onClick={downloadFullBackup}
                  disabled={downloadingFull}
                  className="bg-primary hover:bg-primary/90 text-black font-bold"
                  data-testid="button-full-backup"
                >
                  {downloadingFull ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      İndiriliyor...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-2" />
                      Tam Yedek Al
                    </>
                  )}
                </Button>
              </div>
              <p className="text-gray-400 text-sm">
                Bu işlem tüm veritabanı tablolarını JSON formatında tek bir dosyaya dışa aktarır.
                Yedekleme dosyası otomatik olarak indirilecektir.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Table2 size={20} className="text-primary" />
                <h2 className="text-lg font-heading font-bold uppercase">Tablo Bazlı Yedekleme</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tables.map((table) => (
                  <div
                    key={table.name}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    data-testid={`table-${table.name}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTableIcon(table.name)}</span>
                      <div>
                        <p className="text-white font-medium">{table.label}</p>
                        <p className="text-gray-500 text-xs font-mono">{table.name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadTableBackup(table.name)}
                      disabled={downloadingTable === table.name}
                      className="text-gray-400 hover:text-primary"
                      data-testid={`button-backup-${table.name}`}
                    >
                      {downloadingTable === table.name ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-primary" />
              <h2 className="text-lg font-heading font-bold uppercase">Son Yedeklemeler</h2>
            </div>

            {backupHistory.length > 0 ? (
              <div className="space-y-3">
                {backupHistory.map((backup, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {backup.status === "success" ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : backup.status === "error" ? (
                        <AlertCircle size={16} className="text-red-400" />
                      ) : (
                        <Clock size={16} className="text-yellow-400" />
                      )}
                      <div>
                        <p className="text-white text-sm">{backup.table}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(backup.date).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        backup.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : backup.status === "error"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {backup.status === "success" ? "Başarılı" : backup.status === "error" ? "Hata" : "Bekliyor"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Henüz yedekleme yapılmadı</p>
                <p className="text-xs mt-1">İlk yedeğinizi alın</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Önemli</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Yedekleme dosyalarını güvenli bir yerde saklayın. 
                    Düzenli yedekleme almayı unutmayın.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
