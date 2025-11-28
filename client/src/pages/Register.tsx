import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import generatedVideo from '@assets/generated_videos/professional_gym_rack_with_dumbbells_close_up.mp4';

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
    });

    if (result.success) {
      setLocation("/dashboard");
    } else {
      setError(result.error || "Kayıt başarısız");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-12 bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
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
            Aramıza Katıl
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white">
            Kayıt <span className="text-primary">Ol</span>
          </h1>
        </div>

        <div className="bg-[#0A0A0A]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Ad Soyad</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-fullname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Telefon (Opsiyonel)</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0555 555 55 55"
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 uppercase tracking-wider text-xs font-bold">Şifre Tekrar</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                  data-testid="input-confirm-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase"
              data-testid="button-register"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Kayıt Yapılıyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={18} /> Kayıt Ol
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
