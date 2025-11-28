import { Link } from "wouter";
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <img 
              src="https://www.gokalaf.com/wp-content/uploads/2023/02/ALAFCOACHING-FINAL-8-scaled.png" 
              alt="Gokalaf Logo" 
              className="h-12 mb-6 object-contain opacity-90"
            />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Bilimsel verilerle desteklenen, kişiye özel antrenman ve beslenme programlarıyla hedefine ulaş. 
              Disiplin ve performans odaklı online koçluk.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-primary">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Anasayfa</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Hakkımda</Link></li>
              <li><Link href="/tools" className="text-muted-foreground hover:text-primary transition-colors">Ücretsiz Araçlar</Link></li>
              <li><Link href="/packages" className="text-muted-foreground hover:text-primary transition-colors">Paketler</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-primary">Yasal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Mesafeli Satış Sözleşmesi</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">İptal ve İade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-primary">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span>info@gokalaf.com</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <span>+90 555 000 00 00</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gokalaf. Tüm hakları saklıdır. Replit Design tarafından tasarlanmıştır.</p>
        </div>
      </div>
    </footer>
  );
}
