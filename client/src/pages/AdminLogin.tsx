import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.user?.role === "admin") {
          window.location.href = "/gokadmin";
          return;
        } else {
          setError("Bu sayfa sadece yöneticiler içindir");
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        }
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch (err) {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-heading font-bold uppercase text-white mb-2">
            Admin <span className="text-red-400">Girişi</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-red-500/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gokalaf.com"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-admin-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-admin-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-red-500 text-white hover:bg-red-600 font-heading font-bold uppercase"
              data-testid="button-admin-login"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş Yapılıyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} /> Yönetici Girişi
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
