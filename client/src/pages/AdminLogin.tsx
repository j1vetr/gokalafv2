import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-500/3 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/30 to-red-600/10 rounded-3xl flex items-center justify-center border border-red-500/30 shadow-2xl shadow-red-500/20">
                <Shield className="w-12 h-12 text-red-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-lg flex items-center justify-center border-2 border-[#050505]">
                <Fingerprint className="w-4 h-4 text-black" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-heading font-bold uppercase text-white mb-2 tracking-tight">
                Yönetim <span className="text-red-400">Paneli</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Yetkili erişim gerektirir
              </p>
            </motion.div>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-sm text-red-300">{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Adresi
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-primary/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-red-400 transition-colors" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gokalaf.com"
                      required
                      className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-red-500/50 focus:ring-red-500/20 transition-all"
                      data-testid="input-admin-email"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Şifre
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-primary/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-red-400 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-red-500/50 focus:ring-red-500/20 transition-all"
                      data-testid="input-admin-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-heading font-bold uppercase text-lg rounded-xl shadow-lg shadow-red-500/25 transition-all hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-admin-login"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Doğrulanıyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Shield className="w-5 h-5" /> Giriş Yap
                  </span>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-gray-500 text-xs">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Güvenli Bağlantı</p>
                  <p>Bu oturum şifreli ve korumalıdır</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-xs uppercase tracking-widest">
              Gokalaf Fitness © {new Date().getFullYear()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
