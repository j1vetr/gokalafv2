import { Link } from "wouter";
import { Instagram, Youtube, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <img 
              src="https://www.gokalaf.com/wp-content/uploads/2023/02/ALAFCOACHING-FINAL-8-scaled.png" 
              alt="Gokalaf Logo" 
              className="h-16 mb-5 object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Online fitness ve vücut geliştirme koçluğu. Kişiye özel antrenman ve beslenme programlarıyla hedeflerine ulaş.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/alaboratovar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com/@alaboratovar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase mb-5 text-primary tracking-wider">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Anasayfa</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">Hakkımda</Link></li>
              <li><Link href="/tools" className="text-gray-400 hover:text-primary transition-colors text-sm">Ücretsiz Araçlar</Link></li>
              <li><Link href="/packages" className="text-gray-400 hover:text-primary transition-colors text-sm">Paketler</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase mb-5 text-primary tracking-wider">Yasal</h4>
            <ul className="space-y-3">
              <li><Link href="/gizlilik" className="text-gray-400 hover:text-primary transition-colors text-sm">Gizlilik Sözleşmesi</Link></li>
              <li><Link href="/kvkk" className="text-gray-400 hover:text-primary transition-colors text-sm">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/mesafeli-satis" className="text-gray-400 hover:text-primary transition-colors text-sm">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/iptal-iade" className="text-gray-400 hover:text-primary transition-colors text-sm">İptal ve İade Politikası</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase mb-5 text-primary tracking-wider">İletişim</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/905312822402" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-sm">0531 282 24 02</span>
                </a>
              </li>
              <li>
                <a href="mailto:alafcoaching@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">alafcoaching@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Alaf Coaching. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
