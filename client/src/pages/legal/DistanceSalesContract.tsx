import { motion } from "framer-motion";
import { FileText, Users, ShoppingBag, AlertCircle, Scroll, Scale, CheckCircle, ChevronRight, Mail, MapPin, User, Phone, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function DistanceSalesContract() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Mesafeli Satış Sözleşmesi</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Scroll className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase tracking-tight">
                Mesafeli Satış Sözleşmesi
              </h1>
              <p className="text-gray-400 mt-1">6502 Sayılı Kanun Kapsamında</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">1. Taraflar</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5">
                        <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5" />
                          SATICI
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">SEFA GÖKTUĞ ALAF</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-gray-300">Acıbadem Mah Betül Sokak 6G Kadıköy / İstanbul</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a href="mailto:alafcoaching@gmail.com" className="text-primary hover:underline">alafcoaching@gmail.com</a>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5">
                        <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          ALICI
                        </h3>
                        <p className="text-gray-400 text-sm m-0">
                          Sipariş esnasında bilgileri girilecek olan kişidir. İşbu sözleşmeyi kabul etmekle ALICI, sözleşme konusu siparişi onayladığı takdirde sipariş konusu bedeli ve varsa ek ücretleri ödeme yükümlülüğü altına gireceğini kabul eder.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">2. Tanımlar</h2>
                    <div className="grid gap-3">
                      {[
                        { term: "BAKAN", def: "Gümrük ve Ticaret Bakanı" },
                        { term: "KANUN", def: "6502 sayılı Tüketicinin Korunması Hakkında Kanun" },
                        { term: "YÖNETMELİK", def: "Mesafeli Sözleşmeler Yönetmeliği (RG:27.11.2014/29188)" },
                        { term: "HİZMET", def: "Bir ücret veya menfaat karşılığında yapılan ya da yapılması taahhüt edilen mal sağlama dışındaki her türlü tüketici işleminin konusu" },
                        { term: "SATICI", def: "Ticari veya mesleki faaliyetleri kapsamında tüketiciye mal sunan şirket" },
                        { term: "ALICI", def: "Bir mal veya hizmeti ticari veya mesleki olmayan amaçlarla edinen, kullanan veya yararlanan gerçek ya da tüzel kişi" }
                      ].map((item, index) => (
                        <div key={index} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3 flex items-start gap-3">
                          <span className="text-primary font-semibold text-sm min-w-[100px]">{item.term}</span>
                          <span className="text-gray-400 text-sm">{item.def}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Scale className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">3. Konu</h2>
                    <p className="text-gray-300 leading-relaxed">
                      İşbu Sözleşme, ALICI'nın, SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                      <p className="text-green-300 text-sm m-0">
                        Listelenen ve sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Genel Hükümler</h2>
                    <div className="space-y-4">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">9.1 Ön Bilgilendirme</h3>
                        <p className="text-gray-400 text-sm m-0">
                          ALICI, SATICI'ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul eder.
                        </p>
                      </div>
                      
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">9.2 Teslimat Süresi</h3>
                        <p className="text-gray-400 text-sm m-0">
                          Sözleşme konusu her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI'nın yerleşim yeri uzaklığına bağlı olarak ALICI veya ALICI'nın gösterdiği adresteki kişiye teslim edilir.
                        </p>
                      </div>

                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">9.3 Satıcının Yükümlülükleri</h3>
                        <p className="text-gray-400 text-sm m-0">
                          SATICI, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ile teslim etmeyi, her türlü ayıptan arî olarak yasal mevzuat gereklerine göre sağlam, standartlara uygun bir şekilde işi doğruluk ve dürüstlük esasları dâhilinde ifa etmeyi taahhüt eder.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Özel Koşullar</h2>
                    <div className="space-y-4">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                        <h3 className="text-orange-300 font-semibold mb-2">9.7 Sözleşme Feshi</h3>
                        <p className="text-orange-200 text-sm m-0">
                          SATICI, ALICININ programa aykırı davrandığının tespiti üzerine sözleşmeyi feshetme hakkına sahiptir. 6 hafta boyunca WhatsApp ya da başka bir iletişim kanalı ile ALICININ, SATICIYLA herhangi bir şekilde iletişime geçmemesi halinde SATICININ derhal fesih hakkı saklıdır.
                        </p>
                      </div>
                      
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">9.8 Program Paylaşımı</h3>
                        <p className="text-gray-400 text-sm m-0">
                          SATICI, ALICININ satın aldığı programı kendisinden habersiz olarak bir başka 3. kişiyle ya da umuma açık bir şekilde paylaşması halinde sözleşmeyi derhal feshetme hakkına sahiptir.
                        </p>
                      </div>

                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">9.9 Başarı Yüzdesi</h3>
                        <p className="text-gray-400 text-sm m-0">
                          ALICI'nın, programa uyumunu gösteren aylık başarı yüzdesinin %20'nin altında kalması durumunda hizmet iptal edilebilir, söz konusu bu durum tarafların karşılıklı anlaşması neticesinde gerçekleşecektir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Sorumluluk Reddi</h2>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                      <p className="text-red-300 text-sm leading-relaxed m-0">
                        SATICI tarafından hazırlanan beslenme programının, antrenman programının, ergojenik takviye kullanım çizelgesinin, performans arttırıcı ilaç kullanım takviminin yanlışsız olduğunun garantisi bulunmamaktadır. SATICI tarafından sağlanan tıbbi bilgi, en iyi durumda bile, yalnızca genel nitelikli olup bir tıp profesyonelinin tavsiyesi yerine geçmez. Danışmanın gerçekleşen bu satış sözleşmesi kapsamında tıp doktoru sıfatı bulunmamaktadır.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Ödeme ve İade</h2>
                    <p className="text-gray-300 leading-relaxed">
                      ALICI tarafından siparişin iptal edilmesi halinde ALICI'nın nakit ile yaptığı ödemelerde, ürün tutarı 14 gün içinde kendisine nakden ve defaten ödenir. ALICI'nın kredi kartı ile yaptığı ödemelerde ise, ürün tutarı, siparişin ALICI tarafından iptal edilmesinden sonra 14 gün içerisinde ilgili bankaya iade edilir.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                      <p className="text-blue-300 text-sm m-0">
                        <strong>Not:</strong> SATICI tarafından kredi kartına iade edilen tutarın banka tarafından ALICI hesabına yansıtılmasına ilişkin ortalama süreç 2 ile 3 haftayı bulabilir.
                      </p>
                    </div>
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
            <Link href="/iptal-iade" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              İptal ve İade Politikası
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
