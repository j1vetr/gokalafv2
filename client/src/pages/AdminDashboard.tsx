import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  DollarSign, 
  FileText,
  Plus,
  Search,
  MoreHorizontal
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("packages");

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-bold uppercase tracking-wide ${
        activeTab === id 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 flex flex-col md:flex-row container mx-auto gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="flex items-center gap-4 px-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-destructive/20 border border-destructive text-destructive flex items-center justify-center font-bold text-xl">
            AD
          </div>
          <div>
            <h3 className="font-bold font-heading text-lg">Yönetim Paneli</h3>
            <p className="text-xs text-muted-foreground uppercase">Admin</p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem id="packages" icon={Package} label="Paketler" />
          <SidebarItem id="users" icon={Users} label="Kullanıcılar" />
          <SidebarItem id="sales" icon={DollarSign} label="Satışlar" />
          <SidebarItem id="content" icon={FileText} label="İçerik / S.S.S" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[600px] bg-card/30 rounded-xl border border-white/5 p-6">
        
        {activeTab === "packages" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold uppercase">Paket Yönetimi</h2>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase font-bold">
                <Plus className="w-4 h-4 mr-2" /> Yeni Paket Ekle
              </Button>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-primary font-bold uppercase">Paket Adı</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Süre</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Fiyat</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Durum</TableHead>
                    <TableHead className="text-right text-primary font-bold uppercase">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Başlangıç Paketi", duration: "4 Hafta", price: "3.500 ₺", status: "Aktif" },
                    { name: "Değişim Paketi", duration: "12 Hafta", price: "9.000 ₺", status: "Aktif" },
                    { name: "VIP Koçluk", duration: "24 Hafta", price: "16.000 ₺", status: "Aktif" },
                    { name: "Yaz Kampı", duration: "8 Hafta", price: "7.000 ₺", status: "Pasif" },
                  ].map((pkg, i) => (
                    <TableRow key={i} className="hover:bg-white/5 border-white/10">
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.duration}</TableCell>
                      <TableCell>{pkg.price}</TableCell>
                      <TableCell>
                        <Badge variant={pkg.status === "Aktif" ? "default" : "secondary"} className={pkg.status === "Aktif" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}>
                          {pkg.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold uppercase">Danışanlar</h2>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Danışan Ara..." className="pl-8 bg-background/50 border-white/10" />
              </div>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-primary font-bold uppercase">Ad Soyad</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Aktif Paket</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Başlangıç</TableHead>
                    <TableHead className="text-primary font-bold uppercase">Durum</TableHead>
                    <TableHead className="text-right text-primary font-bold uppercase">Detay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Ahmet Yılmaz", plan: "Değişim Paketi", start: "10.05.2025", status: "Aktif" },
                    { name: "Ayşe Demir", plan: "Başlangıç Paketi", start: "12.05.2025", status: "Aktif" },
                    { name: "Mehmet Kaya", plan: "VIP Koçluk", start: "01.04.2025", status: "Aktif" },
                    { name: "Zeynep Çelik", plan: "-", start: "-", status: "Pasif" },
                  ].map((user, i) => (
                    <TableRow key={i} className="hover:bg-white/5 border-white/10">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.plan}</TableCell>
                      <TableCell>{user.start}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.status === "Aktif" ? "border-green-500 text-green-500" : "border-muted text-muted-foreground"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8">Görüntüle</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {(activeTab !== "packages" && activeTab !== "users") && (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <p>Bu panel tasarımı hazırlanmaktadır.</p>
          </div>
        )}
      </main>
    </div>
  );
}
