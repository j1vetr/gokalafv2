import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Hakkımda", href: "/hakkimizda" },
    { name: "Araçlar", href: "/araclar" },
    { name: "Yazılar", href: "/yazilar" },
    { name: "Egzersiz Akademisi", href: "/egzersiz-akademisi" },
    { name: "Paketler", href: "/paketler" },
  ];

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
      >
        Ana içeriğe atla
      </a>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
          isScrolled ? "bg-[#050505]/90 backdrop-blur-xl border-white/5 py-2" : "bg-transparent py-6"
        )}
        aria-label="Ana navigasyon"
      >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50 relative group">
            <img 
              src="/images/logo.webp" 
              alt="Gokalaf Logo" 
              loading="eager"
              className="h-16 md:h-24 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group py-2",
                location === link.href ? "text-primary" : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(204,255,0,0.8)]",
                location === link.href ? "w-full" : ""
              )} />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/panel">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-primary hover:bg-white/5 font-medium tracking-wide uppercase text-xs" data-testid="button-dashboard">
                  <User className="w-4 h-4 mr-2" />
                  {user?.fullName?.split(" ")[0] || "Panel"}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-white/50 hover:text-red-400 hover:bg-red-500/10 font-medium tracking-wide uppercase text-xs"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/giris">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-primary hover:bg-white/5 font-medium tracking-wide uppercase text-xs" data-testid="button-login">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/paketler">
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase tracking-widest px-6 h-10 text-sm shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] transition-all transform hover:-translate-y-1" data-testid="button-apply">
                  Hemen Başla
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:text-primary" aria-label="Menüyü aç">
              <Menu className="h-8 w-8" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#050505]/95 backdrop-blur-2xl border-l-white/10 w-full sm:w-[350px] p-0 overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex flex-col gap-4 p-6 pt-16">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-xl font-heading font-bold uppercase text-white hover:text-primary transition-colors tracking-wide border-b border-white/5 pb-3"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3 p-6 pt-4 mt-auto pb-8">
                {isAuthenticated ? (
                  <>
                    <Link href="/panel" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start h-12 text-base border-white/10 text-white hover:bg-white/5 hover:text-primary uppercase font-bold">
                        <User className="w-5 h-5 mr-3" /> Panelim
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full justify-start h-12 text-base border-red-500/30 text-red-400 hover:bg-red-500/10 uppercase font-bold"
                    >
                      <LogOut className="w-5 h-5 mr-3" /> Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/kayit" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start h-12 text-base border-white/10 text-white hover:bg-white/5 hover:text-primary uppercase font-bold">
                        <User className="w-5 h-5 mr-3" /> Kayıt Ol
                      </Button>
                    </Link>
                    <Link href="/giris" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start h-12 text-base border-white/10 text-white hover:bg-white/5 hover:text-primary uppercase font-bold">
                        <User className="w-5 h-5 mr-3" /> Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/paketler" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary text-black hover:bg-primary/90 font-heading font-bold uppercase h-12 text-lg shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                        Hemen Başla
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </nav>
    </>
  );
}
