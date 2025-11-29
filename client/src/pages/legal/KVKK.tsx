import { motion } from "framer-motion";
import { Shield, User, Database, Send, CheckCircle, AlertCircle, ChevronRight, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function KVKK() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">KVKK Aydınlatma Metni</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase tracking-tight">
                KVKK Aydınlatma Metni
              </h1>
              <p className="text-gray-400 mt-1">6698 Sayılı Kişisel Verilerin Korunması Kanunu</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
                <p className="text-blue-300 text-sm leading-relaxed m-0">
                  7 Nisan 2016 tarihinde Resmî Gazete'de yayımlanarak Kişisel Verilerin Korunması Kanunu (KVKK) yürürlüğe girmiştir. Bu kanun kapsamında kişisel verilerinizin güvenliğine ve mahremiyetine oldukça önem veriyor ve bu verilerinizi işlemek ve muhafaza etmek için mümkün olan en üst seviyede güvenlik tedbirlerini almaya çalışıyoruz.
                </p>
              </div>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Veri Sorumlusu Kimliği</h2>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-gray-500 text-sm block">Ad Soyad</span>
                            <span className="text-white font-medium">SEFA GÖKTUĞ ALAF</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-gray-500 text-sm block">Adres</span>
                            <span className="text-white font-medium">Acıbadem Mah Betül Sokak 6G Kadıköy / İstanbul</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-gray-500 text-sm block">E-posta</span>
                            <a href="mailto:alafcoaching@gmail.com" className="text-primary hover:underline">alafcoaching@gmail.com</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Database className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Tanımlar</h2>
                    <div className="space-y-4">
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-primary font-semibold mb-1">Kişisel Veri</h3>
                        <p className="text-gray-300 text-sm m-0">Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi ifade eder.</p>
                      </div>
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-primary font-semibold mb-1">Veri İşleyen</h3>
                        <p className="text-gray-300 text-sm m-0">Veri sorumlusunun verdiği yetkiye dayanarak onun adına Kişisel Verileri işleyen gerçek veya tüzel kişiyi ifade eder.</p>
                      </div>
                      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                        <h3 className="text-primary font-semibold mb-1">Veri Sorumlusu</h3>
                        <p className="text-gray-300 text-sm m-0">Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi ifade eder.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Database className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Kişisel Verilerin Toplanma Yöntemi</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Kişisel verileriniz, websitemiz ile aranızdaki ilişkiye bağlı olarak değişkenlik gösterebilmekle birlikte; otomatik ya da otomatik olmayan yöntemlerle, Websitemiz ve bağlı birimleri, internet sitesi, sosyal medya mecraları, telefon, e-posta ve benzeri vasıtalarla sözlü, yazılı ya da elektronik olarak toplanmaktadır.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      KVKK'nın 5. ve 6. Maddesinde belirtilen amaç ve şartlar dahilinde, siz site üyelerimize ve ziyaretçilerimize sizlerin amacına daha uygun hizmet vermek amacıyla işlenmektedir.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Send className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Verilerin Aktarılması</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Toplanan kişisel verileriniz, KVKK'da öngörülen temel ilkelere uygun olarak ve KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar dahilinde websitemiz tarafından yukarıda yer alan amaçlar doğrultusunda aşağıdaki taraflara aktarılabilecektir:
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Proje ortaklarımıza</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Websitemize hizmet veren aracı kuruluşlar ile tedarikçilerimize</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Kanunen yetkili kamu kurumlarına</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-300">Yasal takip süreçleriyle ilgili zorunlu kişi ve kurumlara</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Haklarınız (KVKK Madde 11)</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      KVKK'nın 11. Maddesi gereği bize şahsen, kimliğinizi ispat etmeniz kaydıyla, kişisel verileriniz ile ilgili aşağıdaki haklara sahipsiniz:
                    </p>
                    <div className="grid gap-3">
                      {[
                        "Websitemizin hakkınızda kişisel veri işleyip işlemediğini öğrenme",
                        "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
                        "Kişisel verilerin yurtiçi veya yurtdışına aktarılıp aktarılmadığı ve kimlere aktarıldığını öğrenme",
                        "Yanlış ve eksik kişisel verilerinizin düzeltilmesini talep etme",
                        "KVKK'nın 7. Maddesinde öngörülen şartlar çerçevesinde verilerinizin silinmesini talep etme",
                        "Münhasıran otomatik sistem kullanılarak oluşturulmuş analizlere itiraz etme",
                        "Kanuna aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme"
                      ].map((right, index) => (
                        <div key={index} className="flex items-start gap-3 bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{right}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white uppercase mb-3">Başvuru Süreci</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Başvurunuzda yer alan talepleriniz, talebin niteliğine göre en geç otuz gün içinde ücretsiz olarak sonuçlandırılacaktır. Ancak, işlemin websitemiz için ayrıca bir maliyeti gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
                    </p>
                    <p className="text-gray-300 leading-relaxed mt-4">
                      Kişisel verilerinizin işlenmesi ile ilgili hususlarda başvurunuzu yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da bize daha önce bildirdiğiniz ve kayıtlarımızda yer alan elektronik posta adresinizi kullanmak suretiyle veri sorumlumuza teslim etmeniz gerekmektedir.
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
            <Link href="/iptal-iade" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              İptal ve İade Politikası
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
