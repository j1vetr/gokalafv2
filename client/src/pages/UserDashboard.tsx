import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  User, 
  LogOut, 
  TrendingUp,
  Trophy,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("summary");
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    setLocation("/");
  };

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
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center font-bold text-xl">
            GA
          </div>
          <div>
            <h3 className="font-bold font-heading text-lg">Gokalaf Danışan</h3>
            <p className="text-xs text-muted-foreground uppercase">Aktif Üye</p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem id="summary" icon={LayoutDashboard} label="Özet" />
          <SidebarItem id="program" icon={Dumbbell} label="Programım" />
          <SidebarItem id="packages" icon={Calendar} label="Paketlerim" />
          <SidebarItem id="payments" icon={CreditCard} label="Ödemelerim" />
          <SidebarItem id="profile" icon={User} label="Profilim" />
          
          <div className="pt-8 border-t border-white/10 mt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-bold uppercase tracking-wide text-destructive hover:bg-destructive/10"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[600px]">
        {activeTab === "summary" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-heading font-bold uppercase mb-6">Hoş Geldin, Şampiyon.</h1>
            
            {/* Active Package Card */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-primary text-primary-foreground mb-2">Aktif Plan</Badge>
                    <CardTitle className="text-2xl font-heading uppercase">Değişim Paketi (12 Hafta)</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground uppercase">Bitiş Tarihi</div>
                    <div className="font-bold text-lg">28 Haziran 2025</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold uppercase">
                    <span>İlerleme</span>
                    <span>%45</span>
                  </div>
                  <Progress value={45} className="h-3 bg-white/10" />
                  <p className="text-xs text-muted-foreground mt-2">4. Hafta / 12 Hafta - Harika gidiyorsun!</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-white/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Dumbbell />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Tamamlanan Antrenman</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-white/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <TrendingUp />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">-2.4 kg</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Kilo Değişimi</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-white/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                    <Clock />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4 Gün</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">Sıradaki Check-in</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "program" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-heading font-bold uppercase mb-6">Haftalık Program</h1>
            
            <div className="grid gap-4">
              {["Pazartesi: Göğüs & Arka Kol", "Salı: Sırt & Ön Kol", "Çarşamba: Dinlenme", "Perşembe: Omuz & Bacak", "Cuma: Tüm Vücut", "Cumartesi: Kardiyo", "Pazar: Dinlenme"].map((day, i) => (
                <Card key={i} className="bg-card border-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${day.includes("Dinlenme") ? 'bg-white/5 text-muted-foreground' : 'bg-primary/20 text-primary'}`}>
                        {i + 1}
                      </div>
                      <span className="font-bold text-lg uppercase">{day}</span>
                    </div>
                    <Button variant="ghost" size="sm"><Trophy className="w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab !== "summary" && activeTab !== "program") && (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground animate-in fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <SettingsIcon tab={activeTab} />
            </div>
            <p>Bu bölüm yapım aşamasındadır.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SettingsIcon({ tab }: { tab: string }) {
  if (tab === "packages") return <Calendar size={32} />;
  if (tab === "payments") return <CreditCard size={32} />;
  if (tab === "profile") return <User size={32} />;
  return <LayoutDashboard size={32} />;
}
