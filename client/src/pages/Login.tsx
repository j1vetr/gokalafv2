import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import generatedVideo from '@assets/generated_videos/professional_gym_rack_with_dumbbells_close_up.mp4';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setLocation("/panel");
      } else {
        setError(result.error || "Giriş başarısız");
      }
    } catch (err) {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        setForgotSuccess(true);
      } else {
        const data = await res.json();
        setForgotError(data.error || "Bir hata oluştu");
      }
    } catch {
      setForgotError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
    setForgotLoading(false);
  };

  const resetForgotState = () => {
    setShowForgot(false);
    setForgotEmail("");
    setForgotSuccess(false);
    setForgotError("");
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen grayscale-[50%]"
        >
          <source src={generatedVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/60"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase tracking-wider px-3 py-1 text-xs">
            {showForgot ? "Şifre Sıfırlama" : "Hoş Geldin"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white">
            {showForgot ? (
              <>Şifremi <span className="text-primary">Unuttum</span></>
            ) : (
              <>Giriş <span className="text-primary">Yap</span></>
            )}
          </h1>
        </div>

        <div className="bg-[#0A0A0A]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {showForgot ? (
            forgotSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-white text-lg font-heading font-bold mb-2">Şifreniz Gönderildi</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Yeni şifreniz <span className="text-white font-medium">{forgotEmail}</span> adresine gönderildi. Lütfen e-postanızı kontrol edin.
                </p>
                <Button
                  onClick={resetForgotState}
                  className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase"
                  data-testid="button-back-to-login"
                >
                  <span className="flex items-center gap-2">
                    <LogIn size={18} /> Giriş Sayfasına Dön
                  </span>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  E-posta adresinizi girin, size yeni şifrenizi gönderelim.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {forgotError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400">
                      <AlertCircle size={20} />
                      <span className="text-sm">{forgotError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <Input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                        data-testid="input-forgot-email"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={forgotLoading}
                    className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase"
                    data-testid="button-forgot-submit"
                  >
                    {forgotLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Gönderiliyor...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail size={18} /> Yeni Şifre Gönder
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={resetForgotState}
                    className="text-gray-400 hover:text-primary text-sm flex items-center gap-1.5 mx-auto transition-colors"
                    data-testid="button-back-login"
                  >
                    <ArrowLeft size={14} />
                    Giriş sayfasına dön
                  </button>
                </div>
              </>
            )
          ) : (
            <>
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
                      placeholder="ornek@email.com"
                      required
                      className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                      data-testid="input-email"
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
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase"
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Giriş Yapılıyor...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn size={18} /> Giriş Yap
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                  data-testid="link-forgot-password"
                >
                  Şifremi Unuttum
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  Hesabın yok mu?{" "}
                  <Link href="/kayit" className="text-primary hover:underline font-medium" data-testid="link-register">
                    Kayıt Ol
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
