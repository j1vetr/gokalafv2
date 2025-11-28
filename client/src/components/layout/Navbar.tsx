import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Dumbbell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Hakkımda", href: "/about" },
    { name: "Araçlar", href: "/tools" },
    { name: "Paketler", href: "/packages" },
    { name: "İletişim", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50 relative">
            <img 
              src="https://www.gokalaf.com/wp-content/uploads/2023/02/ALAFCOACHING-FINAL-8-scaled.png" 
              alt="Gokalaf Logo" 
              className="h-10 md:h-12 object-contain"
            />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors relative group",
                location === link.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                location === link.href ? "w-full" : ""
              )} />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-primary hover:bg-primary/10">
              <User className="w-4 h-4 mr-2" />
              Giriş Yap
            </Button>
          </Link>
          <Link href="/packages">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wide">
              Başlayalım
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l-border w-full sm:w-[300px]">
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-heading font-bold uppercase hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" /> Üye Girişi
                  </Button>
                </Link>
                <Link href="/packages" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground font-bold uppercase">
                    Hemen Başla
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
