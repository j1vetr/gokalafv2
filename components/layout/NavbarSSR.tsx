'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function NavbarSSR() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Anasayfa', href: '/' },
    { name: 'Hakkımda', href: '/hakkimizda' },
    { name: 'Araçlar', href: '/araclar' },
    { name: 'Paketler', href: '/paketler' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent',
        isScrolled ? 'bg-[#050505]/90 backdrop-blur-xl border-white/5 py-2' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50 relative group">
          <img
            src="/images/logo.webp"
            alt="Gokalaf Logo"
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
                'text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group py-2',
                pathname === link.href ? 'text-primary' : 'text-white/80 hover:text-white'
              )}
            >
              {link.name}
              <span
                className={cn(
                  'absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(204,255,0,0.8)]',
                  pathname === link.href ? 'w-full' : ''
                )}
              />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/giris">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-primary hover:bg-white/5 font-medium tracking-wide uppercase text-xs"
              data-testid="button-login"
            >
              Giriş Yap
            </Button>
          </Link>
          <Link href="/paketler">
            <Button
              size="sm"
              className="bg-primary text-black hover:bg-primary/90 font-bold tracking-wide uppercase text-xs shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all"
              data-testid="button-start"
            >
              Hemen Başla
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0a0a0a] border-white/10 w-[300px]">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg font-bold uppercase tracking-wider transition-colors',
                    pathname === link.href ? 'text-primary' : 'text-white/80 hover:text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                <Link href="/giris" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/paketler" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
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
