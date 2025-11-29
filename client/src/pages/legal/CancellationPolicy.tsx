import { motion } from "framer-motion";
import { RotateCcw, Package, Clock, AlertTriangle, CreditCard, Truck, CheckCircle, XCircle, ChevronRight, Mail, MapPin, User } from "lucide-react";
import { Link } from "wouter";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">İptal ve İade Politikası</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase tracking-tight">
                İptal ve İade Politikası
              </h1>
              <p className="text-gray-400 mt-1">Tüketici Hakları ve Cayma Koşulları</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Genel Bilgiler</h2>
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        Kullanmakta olduğunuz web sitesi üzerinden elektronik ortamda sipariş verdiğiniz takdirde, size sunulan ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul etmiş sayılırsınız.
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        Alıcılar, satın aldıkları ürünün satış ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri ile yürürlükteki diğer yasalara tabidir.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Truck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Teslimat Koşulları</h2>
                    <div className="grid gap-4">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-semibold">30 Günlük Yasal Süre</span>
                        </div>
                        <p className="text-gray-400 text-sm m-0">
                          Satın alınan her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile alıcının gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir.
                        </p>
                      </div>
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white font-semibold">Eksiksiz Teslimat</span>
                        </div>
                        <p className="text-gray-400 text-sm m-0">
                          Satın alınan ürün, eksiksiz ve siparişte belirtilen niteliklere uygun ve varsa garanti belgesi, kullanım klavuzu gibi belgelerle teslim edilmek zorundadır.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <RotateCcw className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Cayma Hakkı</h2>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-4">
                      <p className="text-green-300 m-0">
                        <strong>ÖNEMLİ:</strong> ALICI, satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren <strong>14 (on dört) gün</strong> içerisinde cayma hakkını kullanabilir.
                      </p>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Cayma hakkı, SATICI'ya aşağıdaki iletişim bilgileri üzerinden bildirmek şartıyla, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin kullanılabilir.
                    </p>
                    
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mt-4">
                      <h3 className="text-white font-semibold mb-4">Cayma Bildirimi İletişim Bilgileri</h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-primary" />
                          <span className="text-gray-300">SEFA GÖKTUĞ ALAF</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="text-gray-300">Acıbadem Mah Betül Sokak 6G Kadıköy / İstanbul</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-primary" />
                          <a href="mailto:alafcoaching@gmail.com" className="text-primary hover:underline">alafcoaching@gmail.com</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Cayma Hakkı Süresi (Hizmetler)</h2>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                      <p className="text-purple-300 m-0">
                        Alıcı, satın aldığı eğer bir <strong>hizmet</strong> ise, bu <strong>3 günlük süre</strong> sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CreditCard className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">İade Koşulları</h2>
                    <div className="space-y-4">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <p className="text-gray-300 m-0">
                          SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç <strong className="text-primary">10 günlük süre</strong> içerisinde toplam bedeli ve ALICI'yı borç altına sokan belgeleri ALICI'ya iade etmek ve <strong className="text-primary">20 günlük süre</strong> içerisinde malı iade almakla yükümlüdür.
                        </p>
                      </div>
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <p className="text-gray-300 m-0">
                          SATICI, internet üzerinden göndermek üzere hazırladığı eğitimi eğer ALICI'ya göndermediyse ALICI ücretini ödemiş olduğu programın iptalini isteyebilir ama <strong className="text-orange-400">SATICI'nın hazırlayıp ALICI'ya göndermiş olduğu eğitim programının ücretinin iadesi olamaz.</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Cayma Hakkı Kullanılamayacak Durumlar</h2>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-4">
                      <p className="text-red-300 text-sm m-0">
                        Aşağıdaki durumlarda cayma hakkı kullanılamaz:
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "ALICI'nın isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan ve geri gönderilmeye müsait olmayan ürünler",
                        "İnternet üzerinden gönderilen eğitim programları",
                        "Çabuk bozulma tehlikesi olan veya son kullanma tarihi geçme ihtimali olan mallar",
                        "Ambalajı açıldığı takdirde iade edilmesi sağlık ve hijyen açısından uygun olmayan ürünler",
                        "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallar",
                        "Ses veya görüntü kayıtları, dijital içerik, yazılım programlarının ambalajı açılmış olması halinde"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Temerrüt Hali</h2>
                    <p className="text-gray-300 leading-relaxed">
                      ALICI, ödeme işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI'dan talep edebilir.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/gizlilik" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              Gizlilik Sözleşmesi
            </Link>
            <Link href="/kvkk" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/mesafeli-satis" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
